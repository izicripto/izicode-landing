import { useEffect } from "react"

/**
 * Metadados por rota.
 *
 * O site é uma SPA: o servidor entrega o mesmo `index.html` para `/`,
 * `/planos` e `/contato`. Sem isto, as três páginas chegam ao Google com o
 * mesmo título e a mesma descrição, e ele trata como conteúdo duplicado —
 * o que desperdiça justamente as páginas que deveriam ranquear para
 * "planos de robótica educacional" ou "consultoria para escolas".
 *
 * O canonical resolve um segundo problema: o mesmo conteúdo responde em
 * izicode.com.br e em izicodeedu-532ac.web.app. Sem apontar qual é o
 * endereço oficial, o Google escolhe sozinho — e já escolheu o web.app.
 */

const DOMINIO = "https://izicode.com.br"

interface DadosSeo {
  titulo: string
  descricao: string
  /** Caminho absoluto, começando com "/". */
  caminho: string
  /** Imagem de compartilhamento; usa a padrão do site se omitida. */
  imagem?: string
}

/** Cria ou atualiza uma <meta>, sem duplicar a tag a cada navegação. */
function definirMeta(chave: "name" | "property", valor: string, conteudo: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${chave}="${valor}"]`)
  if (!tag) {
    tag = document.createElement("meta")
    tag.setAttribute(chave, valor)
    document.head.appendChild(tag)
  }
  tag.setAttribute("content", conteudo)
}

export function useSeo({ titulo, descricao, caminho, imagem }: DadosSeo) {
  useEffect(() => {
    const url = DOMINIO + caminho
    const capa = imagem ? DOMINIO + imagem : `${DOMINIO}/hero-lab.jpg`

    document.title = titulo

    definirMeta("name", "description", descricao)

    // Endereço oficial desta página. Sem ele, izicode.com.br e o domínio
    // web.app competem entre si pelo mesmo conteúdo.
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement("link")
      canonical.rel = "canonical"
      document.head.appendChild(canonical)
    }
    canonical.href = url

    // Open Graph e Twitter: é o que aparece quando alguém compartilha o
    // link no WhatsApp, que para este público é o canal principal.
    definirMeta("property", "og:type", "website")
    definirMeta("property", "og:site_name", "Izicode Edu")
    definirMeta("property", "og:locale", "pt_BR")
    definirMeta("property", "og:title", titulo)
    definirMeta("property", "og:description", descricao)
    definirMeta("property", "og:url", url)
    definirMeta("property", "og:image", capa)
    definirMeta("name", "twitter:card", "summary_large_image")
    definirMeta("name", "twitter:title", titulo)
    definirMeta("name", "twitter:description", descricao)
    definirMeta("name", "twitter:image", capa)
  }, [titulo, descricao, caminho, imagem])
}

/**
 * Textos de cada página pública, num lugar só.
 *
 * Título até ~60 caracteres e descrição até ~155: além disso o Google
 * corta no meio da frase no resultado da busca. Cada um usa as palavras
 * que a pessoa realmente digita — "plano de aula robótica", "laboratório
 * maker", "aula de robótica online" — em vez de linguagem interna.
 */
export const SEO_PAGINAS = {
  home: {
    titulo: "Izicode Edu — Plataforma e Consultoria em Robótica Educacional",
    descricao:
      "Planeje aulas de robótica com IA, alinhadas à BNCC, e comece de graça. " +
      "Para escolas, também montamos o laboratório maker e formamos a equipe docente.",
    caminho: "/",
  },
  planos: {
    titulo: "Planos e preços — Izicode Edu",
    descricao:
      "Plano gratuito para sempre, PRO com IA ilimitada a partir de R$ 39,90/mês, " +
      "pacote Escola por professores e alunos, e aulas de robótica online para famílias.",
    caminho: "/planos",
  },
  contato: {
    titulo: "Fale com a Izicode Edu — demonstração e consultoria",
    descricao:
      "Peça uma demonstração da plataforma para a sua escola, fale sobre consultoria em " +
      "laboratório maker ou tire dúvidas sobre os planos. Respondemos rápido.",
    caminho: "/contato",
  },
  onboarding: {
    titulo: "Comece a usar a Izicode Edu",
    descricao: "Configure sua conta e comece a planejar aulas de robótica em poucos minutos.",
    caminho: "/onboarding",
  },
} as const
