import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react"

type Tom = "sucesso" | "erro" | "aviso" | "info"

interface Aviso {
  id: number
  tom: Tom
  titulo: string
  descricao?: string
}

interface ToastAPI {
  sucesso: (titulo: string, descricao?: string) => void
  erro: (titulo: string, descricao?: string) => void
  aviso: (titulo: string, descricao?: string) => void
  info: (titulo: string, descricao?: string) => void
}

const ToastContext = createContext<ToastAPI | null>(null)

/**
 * Avisos da aplicação.
 *
 * Substitui o alert() do navegador, que trava a página, não combina com o
 * design e não distingue sucesso de erro. Aqui o aviso aparece no canto,
 * some sozinho e some mais devagar quando é erro — porque erro precisa
 * ser lido, e sucesso só precisa ser percebido.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastAPI {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    // Não derruba a tela por causa de um aviso: sem provider, cai no
    // console em vez de lançar erro no meio de uma ação do usuário.
    return {
      sucesso: (t, d) => console.info("[toast]", t, d ?? ""),
      erro: (t, d) => console.error("[toast]", t, d ?? ""),
      aviso: (t, d) => console.warn("[toast]", t, d ?? ""),
      info: (t, d) => console.info("[toast]", t, d ?? ""),
    }
  }
  return ctx
}

const ESTILOS: Record<Tom, { icone: typeof CheckCircle2; classe: string; cor: string }> = {
  sucesso: { icone: CheckCircle2, classe: "border-emerald-200 bg-emerald-50", cor: "text-emerald-600" },
  erro: { icone: AlertCircle, classe: "border-destructive/30 bg-destructive/5", cor: "text-destructive" },
  aviso: { icone: AlertTriangle, classe: "border-amber-200 bg-amber-50", cor: "text-amber-600" },
  info: { icone: Info, classe: "border-sky-200 bg-sky-50", cor: "text-sky-600" },
}

function Item({ aviso, aoFechar }: { aviso: Aviso; aoFechar: () => void }) {
  const { icone: Icone, classe, cor } = ESTILOS[aviso.tom]
  const [saindo, setSaindo] = useState(false)

  // Erro fica mais tempo na tela: o usuário precisa ler o que deu errado,
  // enquanto um "salvo" só precisa ser notado de canto de olho.
  const duracao = aviso.tom === "erro" ? 7000 : 4000

  useEffect(() => {
    const fim = setTimeout(() => setSaindo(true), duracao)
    const remove = setTimeout(aoFechar, duracao + 200)
    return () => {
      clearTimeout(fim)
      clearTimeout(remove)
    }
  }, [duracao, aoFechar])

  return (
    <div
      role="status"
      aria-live={aviso.tom === "erro" ? "assertive" : "polite"}
      className={`pointer-events-auto flex w-full items-start gap-3 rounded-2xl border p-4 shadow-lg backdrop-blur transition-all duration-200 ${classe} ${
        saindo ? "translate-x-2 opacity-0" : "translate-x-0 opacity-100"
      }`}
    >
      <Icone className={`mt-0.5 h-5 w-5 shrink-0 ${cor}`} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{aviso.titulo}</p>
        {aviso.descricao && <p className="mt-0.5 text-sm text-muted-foreground">{aviso.descricao}</p>}
      </div>
      <button
        type="button"
        onClick={() => {
          setSaindo(true)
          setTimeout(aoFechar, 200)
        }}
        aria-label="Fechar aviso"
        className="shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [avisos, setAvisos] = useState<Aviso[]>([])

  const adicionar = useCallback((tom: Tom, titulo: string, descricao?: string) => {
    // Um id por instante basta; se dois avisos caírem no mesmo
    // milissegundo, o random evita colisão de key no React.
    const id = Date.now() + Math.random()
    setAvisos((atuais) => [...atuais.slice(-2), { id, tom, titulo, descricao }])
  }, [])

  const api: ToastAPI = {
    sucesso: (t, d) => adicionar("sucesso", t, d),
    erro: (t, d) => adicionar("erro", t, d),
    aviso: (t, d) => adicionar("aviso", t, d),
    info: (t, d) => adicionar("info", t, d),
  }

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(calc(100vw-2rem),380px)] flex-col gap-2">
        {avisos.map((a) => (
          <Item key={a.id} aviso={a} aoFechar={() => setAvisos((x) => x.filter((y) => y.id !== a.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
