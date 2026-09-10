/**
 * Gera as páginas de Termos de Uso e Política de Privacidade.
 *
 * Mesmo desenho dos guias (public/css/guias.css) e mesma ideia do
 * scripts/gerar-guias.mjs: o texto mora aqui em markdown, o HTML é
 * derivado. Documento jurídico que precisa ser editado em dois arquivos
 * HTML acaba divergindo.
 *
 * POR QUE ESTES DOCUMENTOS EXISTEM
 *
 * Não é formalidade. A plataforma cobra, trata dado pessoal e vai tratar
 * dado de criança quando as turmas forem usadas de verdade. Sem estes
 * documentos:
 *
 *   - a LGPD é descumprida desde o primeiro cadastro;
 *   - o Google Ads reprova anúncio cuja página de destino coleta dado sem
 *     política de privacidade, então a campanha nem chega a rodar;
 *   - a escola que compra pede o contrato de operador antes de assinar.
 *
 * O QUE AINDA PRECISA DE UM HUMANO
 *
 * Os campos marcados com [PREENCHER] só quem opera a empresa sabe:
 * razão social, CNPJ e endereço. E o texto inteiro deve passar por
 * advogado antes de valer como compromisso — aqui ele está correto quanto
 * aos FATOS do sistema (que dado é coletado, para onde vai, quem acessa),
 * que costuma ser a parte que o jurídico não tem como levantar sozinho.
 */

import { writeFileSync, mkdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..")
const require = createRequire(join(raiz, "functions/"))
const { marked } = require("marked")

const DOMINIO = "https://izicode.com.br"
const DESTINO = join(raiz, "public")
const ATUALIZADO = "10 de setembro de 2026"

const MEDICAO = `<script src="/js/consentimento.js"></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-17924419542"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-17924419542');
</script>`

const escapar = (t) =>
  String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

function pagina({ titulo, descricao, slug, conteudo }) {
  const url = `${DOMINIO}/${slug}/`
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapar(titulo)} — Izicode Edu</title>
<meta name="description" content="${escapar(descricao)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:title" content="${escapar(titulo)} — Izicode Edu">
<meta property="og:description" content="${escapar(descricao)}">
<meta property="og:url" content="${url}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/guias.css">
${MEDICAO}
</head>
<body>

<header class="gz-topo">
  <a class="gz-marca" href="/"><img src="/images/logo.png" alt="Izicode Edu" width="36" height="36"><span>Izicode Edu</span></a>
  <nav class="gz-nav">
    <a href="/guias/">Guias</a>
    <a href="/planos">Planos</a>
    <a class="gz-botao" href="/login.html">Começar grátis</a>
  </nav>
</header>

<main class="gz-pagina">
<article class="gz-artigo">
${marked.parse(conteudo)}
</article>

<p class="gz-relacionados">
  <a class="gz-link" href="/termos/">Termos de Uso</a> ·
  <a class="gz-link" href="/privacidade/">Política de Privacidade</a> ·
  <a class="gz-link" href="/contato">Falar com a gente</a>
</p>
</main>

<footer class="gz-rodape">
  <p>© Izicode Edu — plataforma e consultoria em robótica educacional.</p>
  <p><a href="/contato">Fale com a gente</a> · <a href="/planos">Planos</a> · <a href="/">Início</a></p>
  <p><a href="/termos/">Termos de Uso</a> · <a href="/privacidade/">Política de Privacidade</a> · <a href="#" onclick="izicodeAbrirCookies();return false">Preferências de cookies</a></p>
</footer>

</body>
</html>
`
}

function publicar({ slug, ...resto }) {
  const pasta = join(DESTINO, slug)
  mkdirSync(pasta, { recursive: true })
  writeFileSync(join(pasta, "index.html"), pagina({ slug, ...resto }), "utf8")
  console.log(`  /${slug}/`)
}

console.log("Gerando páginas legais:")
// o require acima aponta para functions/ (e de la que vem o marked), entao
// caminho relativo resolveria no lugar errado — os textos entram por
// caminho absoluto
for (const doc of [
  require(join(raiz, "scripts/legais/termos.cjs")),
  require(join(raiz, "scripts/legais/privacidade.cjs")),
]) {
  publicar({ ...doc, atualizado: ATUALIZADO })
}
console.log("\nLembrete: os campos [PREENCHER] precisam da razão social, do")
console.log("CNPJ e do endereço, e o texto deve passar por advogado.")
