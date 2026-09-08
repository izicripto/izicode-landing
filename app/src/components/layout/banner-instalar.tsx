import { useEffect, useState } from "react"
import { Download, Share, Plus, X } from "lucide-react"
import {
  assinar,
  ehIOS,
  iniciarInstalacao,
  instalar,
  rodandoInstalado,
  temConvitePendente,
} from "@/lib/instalacao"

/**
 * Convite para instalar a plataforma como aplicativo.
 *
 * Fica no topo, acima do cabeçalho, e empurra a página para baixo em vez
 * de cobrir conteúdo — banner flutuante sobre o texto é o padrão que as
 * pessoas aprenderam a fechar sem ler.
 *
 * Só aparece quando há algo real a oferecer:
 *
 *  - já está aberto como aplicativo instalado -> não aparece;
 *  - foi dispensado antes -> não aparece por trinta dias;
 *  - Chrome/Android sem `beforeinstallprompt` (já instalado, navegador sem
 *    suporte, ou requisito não cumprido) -> não aparece, porque o botão
 *    não teria o que fazer;
 *  - iPhone -> aparece com o caminho manual, que é a única instalação
 *    possível lá.
 *
 * O prazo de trinta dias é deliberado: quem disse não uma vez não deve ser
 * perguntado de novo na próxima visita, e quem só ignorou pode reconsiderar
 * depois de conhecer a plataforma.
 */

const CHAVE = "izicode:banner-instalar-dispensado"
const TRINTA_DIAS = 30 * 24 * 60 * 60 * 1000

function foiDispensado(): boolean {
  try {
    const quando = window.localStorage.getItem(CHAVE)
    if (!quando) return false
    return Date.now() - Number(quando) < TRINTA_DIAS
  } catch {
    // Navegador com armazenamento bloqueado: melhor mostrar o banner do
    // que quebrar a página por causa dele.
    return false
  }
}

function marcarDispensado() {
  try {
    window.localStorage.setItem(CHAVE, String(Date.now()))
  } catch {
    /* sem armazenamento, o banner volta na próxima visita — aceitável */
  }
}

export function BannerInstalar() {
  const [convite, setConvite] = useState(false)
  const [dispensado, setDispensado] = useState(true)
  const [ios, setIos] = useState(false)
  const [instalado, setInstalado] = useState(true)
  const [ensinandoIOS, setEnsinandoIOS] = useState(false)

  useEffect(() => {
    iniciarInstalacao()
    setInstalado(rodandoInstalado())
    setIos(ehIOS())
    setDispensado(foiDispensado())
    setConvite(temConvitePendente())
    return assinar(() => setConvite(temConvitePendente()))
  }, [])

  const podeMostrar = !instalado && !dispensado && (convite || ios)
  if (!podeMostrar) return null

  function dispensar() {
    marcarDispensado()
    setDispensado(true)
  }

  async function aoClicar() {
    if (ios) {
      setEnsinandoIOS((v) => !v)
      return
    }
    const escolha = await instalar()
    // Recusou o diálogo do navegador: não insistir na próxima visita.
    if (escolha === "dismissed") dispensar()
  }

  return (
    <div className="border-b border-sky-500/20 bg-gradient-to-r from-sky-600 to-indigo-600 text-white">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 sm:gap-4">
        <Download className="hidden h-5 w-5 shrink-0 sm:block" aria-hidden="true" />

        <p className="min-w-0 flex-1 text-sm leading-snug">
          <span className="font-semibold">Instale a Izicode no seu aparelho</span>
          <span className="hidden text-white/80 sm:inline">
            {" "}
            — abre direto da tela inicial e funciona sem internet.
          </span>
        </p>

        <button
          type="button"
          onClick={aoClicar}
          aria-expanded={ios ? ensinandoIOS : undefined}
          className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-sky-700 transition-colors hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-sm"
        >
          {ios ? "Como instalar" : "Instalar"}
        </button>

        <button
          type="button"
          onClick={dispensar}
          aria-label="Dispensar o convite para instalar"
          className="shrink-0 rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {ios && ensinandoIOS && (
        <div className="border-t border-white/15 bg-black/10">
          <ol className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 text-sm text-white/90 sm:flex-row sm:items-center sm:gap-6">
            <li className="flex items-center gap-2">
              <Share className="h-4 w-4 shrink-0" aria-hidden="true" />
              1. Toque em <strong className="font-semibold">Compartilhar</strong>
            </li>
            <li className="flex items-center gap-2">
              <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
              2. Escolha{" "}
              <strong className="font-semibold">Adicionar à Tela de Início</strong>
            </li>
            <li>3. Confirme em <strong className="font-semibold">Adicionar</strong></li>
          </ol>
        </div>
      )}
    </div>
  )
}
