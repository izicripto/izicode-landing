/**
 * Impressão de roteiros — também é o caminho do PDF.
 *
 * "Imprimir → Salvar como PDF" usa `document.title` como nome sugerido do
 * arquivo. Sem trocar o título, todo PDF baixado se chamava "Izicode Edu…",
 * e o professor perdia o roteiro entre vários arquivos iguais. Aqui o título
 * vira o nome do roteiro só durante a impressão e volta logo depois.
 */
export function imprimirRoteiro(tituloRoteiro: string) {
  const anterior = document.title
  const nome = tituloRoteiro
    .replace(/[\\/:*?"<>|]+/g, " ") // caracteres que o Windows não aceita em nome de arquivo
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 90)

  document.title = nome ? `${nome} — Izicode Edu` : anterior
  const restaurar = () => {
    document.title = anterior
    window.removeEventListener("afterprint", restaurar)
  }
  window.addEventListener("afterprint", restaurar)
  window.print()
}
