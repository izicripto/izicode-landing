import { useMemo } from "react"

/**
 * Renderizador de markdown enxuto, suficiente para os conteúdos da
 * Academia, do Arduino Hub e dos planos gerados pela IA.
 *
 * O HTML é escapado ANTES de qualquer transformação: parte do conteúdo
 * vem do Firestore (planos gerados pela IA), então nada que chega aqui
 * pode ser tratado como marcação confiável.
 */
function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function unescapeHtml(text: string) {
  return text.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&")
}

/** Texto puro de um trecho markdown (cru ou já escapado): sem
 *  marcadores inline, para gerar slugs e rótulos do índice. */
function plainText(text: string) {
  return unescapeHtml(text)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, "$1$2")
    .trim()
}

/** Slug estável para âncoras (PT-BR: remove acentos). */
function slugify(text: string) {
  const base =
    plainText(text)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "secao"
  return base
}

/** Gera ids únicos na ordem do documento (h1–h3). */
function nextId(seen: Map<string, number>, text: string) {
  const base = slugify(text)
  const count = seen.get(base) ?? 0
  seen.set(base, count + 1)
  return count === 0 ? base : `${base}-${count + 1}`
}

export interface DocHeading {
  level: number
  text: string
  id: string
}

/** Índice do documento: títulos h1–h3 na ordem em que aparecem,
 *  com os mesmos ids que o renderizador coloca nos <h>.
 *  Ignora linhas dentro de blocos cercados (código), igual ao render. */
export function extractHeadings(markdown: string): DocHeading[] {
  const seen = new Map<string, number>()
  const out: DocHeading[] = []
  let inFence = false
  for (const line of (markdown || "").split("\n")) {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const m = /^(#{1,3})\s+(.*)$/.exec(line)
    if (!m) continue
    const text = plainText(m[2])
    if (!text) continue
    out.push({ level: m[1].length, text, id: nextId(seen, m[2]) })
  }
  return out
}

function inline(text: string) {
  return text
    .replace(/`([^`]+)`/g, '<code class="rounded bg-muted px-1.5 py-0.5 text-[0.85em]">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, "$1<em>$2</em>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noreferrer" class="text-primary underline underline-offset-2">$1</a>'
    )
}

/** Divide uma linha de tabela | a | b | em células aparadas. */
function splitRow(line: string) {
  return line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim())
}

function toHtml(markdown: string): string {
  const source = escapeHtml(markdown)
  const out: string[] = []
  const lines = source.split("\n")

  let i = 0
  let listBuffer: string[] = []
  let listOrdered = false
  const headingIds = new Map<string, number>()

  const flushList = () => {
    if (listBuffer.length === 0) return
    const tag = listOrdered ? "ol" : "ul"
    const cls = listOrdered ? "list-decimal" : "list-disc"
    out.push(`<${tag} class="${cls} space-y-1 pl-6 mb-4">${listBuffer.join("")}</${tag}>`)
    listBuffer = []
  }

  const isTableSeparator = (line: string) => {
    const cells = splitRow(line)
    return (
      cells.length > 0 && cells.every((c) => /^:?-+:?$/.test(c))
    )
  }

  const renderTable = (rows: string[][]) => {
    const aligns = rows[1].map((c) => {
      if (/^:-+:$/.test(c)) return "center"
      if (/^-+:$/.test(c)) return "right"
      return "left"
    })
    const th = rows[0]
      .map(
        (cell, c) =>
          `<th class="bg-muted px-3 py-2 text-left font-semibold" style="text-align:${aligns[c] ?? "left"}">${inline(cell)}</th>`
      )
      .join("")
    const tb = rows
      .slice(2)
      .map(
        (row) =>
          `<tr class="border-t">${row
            .map(
              (cell, c) =>
                `<td class="px-3 py-2 align-top" style="text-align:${aligns[c] ?? "left"}">${inline(cell)}</td>`
            )
            .join("")}</tr>`
      )
      .join("")
    out.push(
      `<div class="md-table-wrap mb-4 overflow-x-auto rounded-xl border"><table class="md-table w-full text-sm"><thead><tr>${th}</tr></thead><tbody>${tb}</tbody></table></div>`
    )
  }

  while (i < lines.length) {
    const line = lines[i]

    // Bloco de código cercado por ```
    if (line.trimStart().startsWith("```")) {
      flushList()
      const code: string[] = []
      i += 1
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        code.push(lines[i])
        i += 1
      }
      i += 1
      out.push(
        `<pre class="md-code mb-4 overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-slate-100"><code>${code.join("\n")}</code></pre>`
      )
      continue
    }

    // Tabela estilo GitHub: linhas | a | b | com separador | --- | --- |
    if (line.trimStart().startsWith("|")) {
      const rows: string[][] = []
      let j = i
      while (j < lines.length && lines[j].trimStart().startsWith("|")) {
        rows.push(splitRow(lines[j]))
        j += 1
      }
      if (rows.length >= 2 && isTableSeparator(rows[1].join("|"))) {
        flushList()
        renderTable(rows)
        i = j
        continue
      }
      // Não é tabela de verdade: cai no fluxo normal de parágrafos.
    }

    const heading = /^(#{1,4})\s+(.*)$/.exec(line)
    if (heading) {
      flushList()
      const level = heading[1].length
      const sizes = ["text-2xl", "text-xl", "text-lg", "text-base"]
      const anchor =
        level <= 3 ? ` id="${nextId(headingIds, heading[2])}"` : ""
      out.push(
        `<h${level}${anchor} class="md-h font-display font-bold ${sizes[level - 1]} mt-7 mb-3 scroll-mt-24 first:mt-0">${inline(heading[2])}</h${level}>`
      )
      i += 1
      continue
    }

    const bullet = /^\s*[-*]\s+(.*)$/.exec(line)
    if (bullet) {
      if (listOrdered) flushList()
      listOrdered = false
      listBuffer.push(`<li>${inline(bullet[1])}</li>`)
      i += 1
      continue
    }

    const numbered = /^\s*\d+\.\s+(.*)$/.exec(line)
    if (numbered) {
      if (!listOrdered) flushList()
      listOrdered = true
      listBuffer.push(`<li>${inline(numbered[1])}</li>`)
      i += 1
      continue
    }

    if (/^\s*(---|\*\*\*)\s*$/.test(line)) {
      flushList()
      out.push('<hr class="my-6 border-border" />')
      i += 1
      continue
    }

    if (line.trim() === "") {
      flushList()
      i += 1
      continue
    }

    // Parágrafo: junta linhas seguidas até a próxima linha em branco.
    flushList()
    const paragraph: string[] = [line]
    i += 1
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{1,4}\s|\s*[-*]\s|\s*\d+\.\s)/.test(lines[i]) &&
      !lines[i].trimStart().startsWith("```")
    ) {
      paragraph.push(lines[i])
      i += 1
    }
    out.push(`<p class="mb-4 leading-relaxed">${inline(paragraph.join(" "))}</p>`)
  }

  flushList()
  return out.join("\n")
}

export function Markdown({ content, className = "" }: { content: string; className?: string }) {
  const html = useMemo(() => toHtml(content || ""), [content])
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
