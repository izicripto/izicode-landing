/**
 * Sobe localmente o site como ele fica publicado.
 *
 * POR QUE ISTO EXISTE
 *
 * O emulador do Firebase (porta 5000) serve `public/` do jeito que esta no
 * disco. Só que o app React nunca e construido para dentro de `public/` na
 * maquina de ninguem: quem faz isso e o deploy, com
 *
 *     cp -r app/dist/. public/
 *
 * dentro do runner do CI, e esse resultado nao volta para o repositorio
 * (public/app-build/ inclusive esta no .gitignore). Resultado: no emulador,
 * "/" entrega a landing ANTIGA de public/index.html, com 1042 linhas, e nao
 * a home do React. As paginas estaticas — login, guias, portal — batem,
 * porque sao arquivos versionados. O que diverge e tudo que vem do app.
 *
 * Rodar aquele `cp` na mao resolve por um minuto e cobra caro depois: ele
 * SOBRESCREVE public/index.html com o build, e a landing antiga vai junto.
 * Ja aconteceu duas vezes neste projeto.
 *
 * Aqui a mistura acontece numa pasta descartavel. `public/` nao e tocado.
 *
 * Uso:
 *     node scripts/previa-local.mjs            # constroi e serve em :4200
 *     node scripts/previa-local.mjs --porta=8080
 *     node scripts/previa-local.mjs --sem-build # reaproveita app/dist
 */

import { createServer } from "node:http"
import { execFileSync } from "node:child_process"
import { readFileSync, existsSync, rmSync, mkdirSync, cpSync, statSync } from "node:fs"
import { join, dirname, extname, normalize } from "node:path"
import { fileURLToPath } from "node:url"

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..")
const DESTINO = join(raiz, ".previa")

const args = process.argv.slice(2)
const porta = Number((args.find((a) => a.startsWith("--porta=")) || "").split("=")[1] || 4200)
const semBuild = args.includes("--sem-build")

/* ------------------------------------------------------------ montagem */

if (!semBuild) {
  console.log("construindo o app...")
  // shell: true porque no Windows o npm e um .cmd, e execFileSync sem shell
  // falha com EINVAL nas versoes recentes do Node
  execFileSync("npm", ["run", "build"], {
    cwd: join(raiz, "app"),
    stdio: "inherit",
    shell: true,
  })
}

const dist = join(raiz, "app", "dist")
if (!existsSync(dist)) {
  console.error("app/dist nao existe. Rode sem --sem-build.")
  process.exit(1)
}

console.log("montando a previa em .previa/ ...")
rmSync(DESTINO, { recursive: true, force: true })
mkdirSync(DESTINO, { recursive: true })
// mesma ordem do deploy: primeiro o estatico, depois o build por cima
cpSync(join(raiz, "public"), DESTINO, { recursive: true })
cpSync(dist, DESTINO, { recursive: true })

/* -------------------------------------------------------------- rotas */

/**
 * As mesmas reescritas de firebase.json. Sem elas, /planos e /app/... caem
 * em 404 aqui e funcionam em producao — que e justamente o tipo de
 * diferenca que esta previa existe para eliminar.
 */
const REESCRITAS = [/^\/onboarding\/?$/, /^\/contato\/?$/, /^\/planos\/?$/, /^\/app(\/.*)?$/]

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
}

function arquivo(caminho) {
  // impede sair da pasta da previa por "../"
  const alvo = join(DESTINO, normalize(caminho).replace(/^(\.\.[/\\])+/, ""))
  if (!alvo.startsWith(DESTINO)) return null
  try {
    if (statSync(alvo).isDirectory()) {
      const indice = join(alvo, "index.html")
      return existsSync(indice) ? indice : null
    }
    return alvo
  } catch {
    return null
  }
}

createServer((req, res) => {
  const caminho = decodeURIComponent(new URL(req.url, "http://x").pathname)

  let alvo = arquivo(caminho)
  if (!alvo && REESCRITAS.some((r) => r.test(caminho))) alvo = join(DESTINO, "index.html")
  if (!alvo) alvo = join(DESTINO, "404.html")

  if (!existsSync(alvo)) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" })
    res.end("nao encontrado")
    return
  }

  const codigo = alvo.endsWith("404.html") ? 404 : 200
  res.writeHead(codigo, {
    "content-type": TIPOS[extname(alvo).toLowerCase()] || "application/octet-stream",
    "cache-control": "no-store",
  })
  res.end(readFileSync(alvo))
}).listen(porta, "127.0.0.1", () => {
  console.log(`\nprevia em http://localhost:${porta}`)
  console.log("  serve public/ com o build do React por cima, como o deploy faz")
  console.log("  public/ nao foi tocado")
})
