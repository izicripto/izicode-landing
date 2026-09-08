/**
 * Gera uma página estática para cada guia em public/docs/*.md.
 *
 * Por que isto existe
 * -------------------
 * Os guias já eram bom conteúdo — cerca de 1.300 palavras cada, sobre
 * assuntos que professor procura no Google. Mas eram servidos por
 * `guia.html?doc=05-GUIA-BNCC-TECNOLOGIA`, que baixava o Markdown por
 * JavaScript e montava a página no navegador. Isso junta três coisas que
 * atrapalham a busca orgânica ao mesmo tempo:
 *
 *   1. URL com parâmetro de query, que ranqueia pior que um caminho limpo;
 *   2. conteúdo que só existe depois que o JavaScript roda — o Google até
 *      executa, mas indexa mais devagar e com menos confiança;
 *   3. título e descrição definidos por script, ou seja, todas as sete
 *      páginas nasciam com o mesmo <head> antes de carregar.
 *
 * A saída daqui resolve os três: HTML pronto no primeiro byte, uma URL por
 * guia, e <head> próprio com canonical e Open Graph.
 *
 * Rode depois de editar qualquer .md:
 *   node scripts/gerar-guias.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { createRequire } from "module"

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..")
const require = createRequire(join(raiz, "functions/"))
const { marked } = require("marked")

const DOMINIO = "https://izicode.com.br"
const ORIGEM = join(raiz, "public/docs")
const DESTINO = join(raiz, "public/guias")

/**
 * Nome do arquivo → caminho na URL.
 *
 * Os slugs não repetem a palavra "guia", que já está no diretório, e usam
 * os termos que a pessoa digita na busca — "bncc-tecnologia" e não
 * "05-guia-bncc-tecnologia". O prefixo numérico servia para ordenar
 * arquivos, não para ser lido por ninguém.
 */
const GUIAS = {
  "01-GUIA-HACKATHON-ESCOLAR": {
    slug: "hackathon-escolar",
    titulo: "Como organizar um hackathon escolar: guia completo",
    descricao:
      "Passo a passo para planejar e realizar um hackathon na escola: formato, cronograma, " +
      "desafios, avaliação e o que preparar antes do dia.",
  },
  "02-GUIA-OLIMPIADAS-COMPETICOES": {
    slug: "olimpiadas-e-competicoes",
    titulo: "Olimpíadas e competições de tecnologia para escolas",
    descricao:
      "Quais competições de robótica e programação existem no Brasil, quando acontecem e " +
      "como preparar os alunos para participar.",
  },
  "03-GUIA-PRATICAS-RESTAURATIVAS": {
    slug: "praticas-restaurativas",
    titulo: "Práticas restaurativas na educação tecnológica",
    descricao:
      "Como usar práticas restaurativas em turmas de tecnologia para resolver conflitos e " +
      "construir colaboração real entre os alunos.",
  },
  "04-GUIA-PROJETOS-ODS": {
    slug: "projetos-ods",
    titulo: "Projetos de tecnologia alinhados aos ODS da ONU",
    descricao:
      "Como conectar projetos maker e de robótica aos Objetivos de Desenvolvimento " +
      "Sustentável, com ideias prontas por objetivo.",
  },
  "05-GUIA-BNCC-TECNOLOGIA": {
    slug: "bncc-tecnologia",
    titulo: "Tecnologia educacional alinhada à BNCC: guia para professores",
    descricao:
      "Como implementar tecnologia na escola dentro da Competência Geral 5 (Cultura Digital) " +
      "da BNCC, com desdobramentos práticos por etapa de ensino.",
  },
  "06-GUIA-ECOLOGIA-SUSTENTABILIDADE": {
    slug: "ecologia-e-sustentabilidade",
    titulo: "Tecnologia para ecologia e sustentabilidade na escola",
    descricao:
      "Projetos de robótica e maker voltados a meio ambiente: sensores, monitoramento e " +
      "ideias que usam materiais acessíveis.",
  },
  "07-MANUAL-IMPLEMENTACAO": {
    slug: "manual-de-implementacao",
    titulo: "Manual de implementação de tecnologia educacional na escola",
    descricao:
      "Da decisão à primeira aula: diagnóstico, orçamento, formação da equipe e cronograma " +
      "para implantar tecnologia educacional na escola.",
  },
}

/** Remove emoji do título, que fica estranho na aba do navegador e na busca. */
function semEmoji(texto) {
  return texto.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, "").trim()
}

function escapar(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

function pagina({ titulo, descricao, slug, conteudo, outros }) {
  const url = `${DOMINIO}/guias/${slug}/`
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapar(titulo)} — Izicode Edu</title>
<meta name="description" content="${escapar(descricao)}">
<link rel="canonical" href="${url}">
<link rel="icon" type="image/png" href="/images/logo.png">

<meta property="og:type" content="article">
<meta property="og:site_name" content="Izicode Edu">
<meta property="og:locale" content="pt_BR">
<meta property="og:title" content="${escapar(titulo)}">
<meta property="og:description" content="${escapar(descricao)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${DOMINIO}/hero-lab.jpg">
<meta name="twitter:card" content="summary_large_image">

<!--
  Dados estruturados. É o que permite ao Google entender que a página é um
  artigo educacional com autor e data, em vez de texto solto — e é o que
  habilita os resultados enriquecidos na busca.
-->
<script type="application/ld+json">
${JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: titulo,
    description: descricao,
    inLanguage: "pt-BR",
    author: { "@type": "Organization", name: "Izicode Edu", url: DOMINIO },
    publisher: {
      "@type": "Organization",
      name: "Izicode Edu",
      logo: { "@type": "ImageObject", url: `${DOMINIO}/images/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  },
  null,
  2
)}
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/guias.css">
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
  <nav class="gz-trilha" aria-label="Você está aqui">
    <a href="/">Início</a> <span aria-hidden="true">›</span>
    <a href="/guias/">Guias</a> <span aria-hidden="true">›</span>
    <span>${escapar(semEmoji(titulo).split(":")[0])}</span>
  </nav>

  <article class="gz-artigo">
${conteudo}
  </article>

  <aside class="gz-cta">
    <h2>Leve isso para a sua sala de aula</h2>
    <p>A plataforma da Izicode gera planos de aula com IA, alinhados à BNCC, e traz 37 roteiros
       de projeto prontos. O plano gratuito não expira e não pede cartão.</p>
    <p class="gz-acoes">
      <a class="gz-botao" href="/login.html">Criar conta grátis</a>
      <a class="gz-link" href="/planos">Ver planos e preços</a>
    </p>
  </aside>

  <section class="gz-relacionados">
    <h2>Outros guias</h2>
    <ul>
${outros.map((o) => `      <li><a href="/guias/${o.slug}/">${escapar(semEmoji(o.titulo))}</a></li>`).join("\n")}
    </ul>
  </section>
</main>

<footer class="gz-rodape">
  <p>© Izicode Edu — plataforma e consultoria em robótica educacional.</p>
  <p><a href="/contato">Fale com a gente</a> · <a href="/planos">Planos</a> · <a href="/">Início</a></p>
</footer>

</body>
</html>
`
}

function indice(lista) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Guias para professores — robótica, BNCC e cultura maker | Izicode Edu</title>
<meta name="description" content="Guias gratuitos para professores e escolas: BNCC e cultura digital, hackathon escolar, olimpíadas de tecnologia, projetos ODS e implantação de laboratório maker.">
<link rel="canonical" href="${DOMINIO}/guias/">
<link rel="icon" type="image/png" href="/images/logo.png">
<meta property="og:type" content="website">
<meta property="og:title" content="Guias para professores — Izicode Edu">
<meta property="og:description" content="Material gratuito sobre robótica educacional, BNCC e cultura maker.">
<meta property="og:url" content="${DOMINIO}/guias/">
<meta property="og:image" content="${DOMINIO}/hero-lab.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/guias.css">
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
  <header class="gz-capa">
    <h1>Guias para professores</h1>
    <p>Material aberto sobre robótica educacional, BNCC e cultura maker. Sem cadastro,
       sem cobrança — feito para ser usado na segunda-feira de manhã.</p>
  </header>

  <ul class="gz-lista">
${lista
  .map(
    (g) => `    <li>
      <a href="/guias/${g.slug}/">
        <h2>${escapar(semEmoji(g.titulo))}</h2>
        <p>${escapar(g.descricao)}</p>
      </a>
    </li>`
  )
  .join("\n")}
  </ul>

  <aside class="gz-cta">
    <h2>Da leitura para a prática</h2>
    <p>A plataforma gera planos de aula com IA e traz roteiros de projeto prontos.
       Comece de graça, sem cartão.</p>
    <p class="gz-acoes">
      <a class="gz-botao" href="/login.html">Criar conta grátis</a>
      <a class="gz-link" href="/planos">Ver planos</a>
    </p>
  </aside>
</main>

<footer class="gz-rodape">
  <p>© Izicode Edu — plataforma e consultoria em robótica educacional.</p>
  <p><a href="/contato">Fale com a gente</a> · <a href="/planos">Planos</a> · <a href="/">Início</a></p>
</footer>

</body>
</html>
`
}

/* ------------------------------------------------------------------ */

mkdirSync(DESTINO, { recursive: true })

const arquivos = readdirSync(ORIGEM).filter((f) => f.endsWith(".md") && f !== "README.md")
const lista = []

for (const arquivo of arquivos) {
  const chave = arquivo.replace(/\.md$/, "")
  const meta = GUIAS[chave]
  if (!meta) {
    console.warn(`  ignorado (sem slug definido): ${arquivo}`)
    continue
  }
  lista.push({ ...meta, chave })
}

for (const g of lista) {
  const md = readFileSync(join(ORIGEM, `${g.chave}.md`), "utf8")

  // O H1 do Markdown sai fora: a página usa o título otimizado para busca,
  // e dois H1 na mesma página confundem tanto leitor de tela quanto robô.
  const semTitulo = md.replace(/^#\s+.*\n/, "")
  const corpo = marked.parse(semTitulo)

  const conteudo = `    <h1>${escapar(semEmoji(g.titulo))}</h1>\n${corpo
    .split("\n")
    .map((l) => (l ? "    " + l : l))
    .join("\n")}`

  const outros = lista.filter((o) => o.slug !== g.slug).slice(0, 4)

  // Um diretório por guia, com index.html dentro.
  //
  // Assim /guias/bncc-tecnologia funciona sem ligar o cleanUrls do
  // Firebase — que é global e passaria a redirecionar TODAS as páginas
  // .html do site, inclusive as legadas que já estão indexadas.
  const pasta = join(DESTINO, g.slug)
  mkdirSync(pasta, { recursive: true })
  writeFileSync(join(pasta, "index.html"), pagina({ ...g, conteudo, outros }), "utf8")
  console.log(`  /guias/${g.slug}/`)
}

writeFileSync(join(DESTINO, "index.html"), indice(lista), "utf8")
console.log(`  /guias/ (índice com ${lista.length} guias)`)
