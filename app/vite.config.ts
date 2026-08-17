import path from "node:path"
import http from "node:http"
import { defineConfig, type Plugin, type Connect } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// O site institucional ainda-não-migrado (contact.html, login.html,
// pricing.html, olimpiadas.html, dashboards/, js/, images/ etc.) roda à
// parte no emulador do Firebase Hosting (public/, ver README da raiz do
// repo). Localmente ele fica em outra porta — sem isso, qualquer link
// para essas páginas dentro do app React cai no shell vazio do SPA em
// vez do site de verdade. Em produção isso não é necessário: os dois
// vão ser publicados sob o mesmo domínio.
//
// Implementado como middleware manual (em vez de `server.proxy`/
// `preview.proxy`) porque o fallback de SPA do Vite intercepta rotas
// terminadas em ".html" antes do proxy nativo rodar — registrando o
// middleware direto em `configureServer`/`configurePreviewServer` (sem
// devolver uma função), ele roda ANTES do fallback interno.
// IMPORTANTE: "/assets/" também é onde o próprio Vite publica os bundles
// JS/CSS do app React (build.assetsDir abaixo) — mesma pasta que o site
// legado usa para fotos (public/assets/consultants|investors|...). Como
// as duas coisas dividem o prefixo, o padrão abaixo só casa extensão de
// imagem dentro de "/assets/", nunca .js/.css, pra não sequestrar o
// próprio bundle do app novo.
const LEGACY_SITE_ORIGIN = "localhost:5000"
const LEGACY_PATTERNS = [
  /^\/[^/]+\.html($|\?)/,
  /^\/images\//,
  /^\/assets\/.*\.(jpe?g|png|svg|webp|avif|gif)($|\?)/i,
  /^\/css\//,
  /^\/js\//,
  /^\/docs\//,
  /^\/kits\//,
  /^\/admin\//,
  /^\/dashboards\//,
  /^\/sitemap\.xml$/,
  /^\/robots\.txt$/,
  /^\/manifest\.json$/,
  /^\/sw\.js$/,
]

function legacySiteProxy(): Plugin {
  const handler: Connect.NextHandleFunction = (req, res, next) => {
    const url = req.url || ""
    if (url === "/index.html" || !LEGACY_PATTERNS.some((re) => re.test(url))) {
      next()
      return
    }

    const proxyReq = http.request(
      { host: "localhost", port: 5000, path: url, method: req.method, headers: req.headers },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
        proxyRes.pipe(res, { end: true })
      }
    )
    proxyReq.on("error", () => {
      res.writeHead(502, { "Content-Type": "text/plain" })
      res.end(`Site legado (${LEGACY_SITE_ORIGIN}) não está respondendo. Rode o emulador do Firebase Hosting.`)
    })
    req.pipe(proxyReq, { end: true })
  }

  return {
    name: "legacy-site-proxy",
    configureServer(server) {
      server.middlewares.use(handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), legacySiteProxy()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  // Longe de "/assets/" de propósito — evita colidir com public/assets/
  // do site legado (ver legacySiteProxy acima), mesmo que os padrões de
  // proxy mudem no futuro.
  build: {
    assetsDir: "app-build",
  },
})
