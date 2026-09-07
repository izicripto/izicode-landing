import { useMemo, useRef, useState, useEffect } from "react"
import { Send, Loader2, Bot, User as UserIcon, ShieldCheck, AlertCircle, RotateCcw, Eye } from "lucide-react"
import { useAdmin } from "@/components/dashboard/admin-layout"
import { askAI, getStoredApiKey, type ChatTurn } from "@/lib/ai"
import { montarResumo } from "@/lib/resumo-plataforma"
import { PageHeader } from "@/components/dashboard/page-header"
import { Markdown } from "@/components/dashboard/markdown"
import { Button } from "@/components/ui/button"

const SUGESTOES = [
  "Qual é a situação geral da plataforma hoje?",
  "Onde está o maior gargalo de conversão?",
  "Quantas escolas seguem em demonstração e o que fazer com elas?",
  "O plano gratuito está convertendo para PRO?",
]

export function AdminCopilotoPage() {
  const admin = useAdmin()
  const [mensagens, setMensagens] = useState<ChatTurn[]>([])
  const [entrada, setEntrada] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [verResumo, setVerResumo] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const resumo = useMemo(
    () =>
      montarResumo({
        users: admin.users,
        schools: admin.schools,
        leads: admin.leads,
        classes: admin.classes,
      }),
    [admin.users, admin.schools, admin.leads, admin.classes]
  )

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [mensagens.length, enviando])

  async function enviar(texto: string) {
    const pergunta = texto.trim()
    if (!pergunta || enviando) return

    setErro(null)
    setEntrada("")
    const historico = [...mensagens, { role: "user" as const, text: pergunta }]
    setMensagens(historico)
    setEnviando(true)

    try {
      // O resumo vai junto da primeira pergunta de cada turno: assim a IA
      // sempre responde sobre o estado atual, mesmo que os dados tenham
      // sido atualizados no meio da conversa.
      const comContexto = `${resumo}\n\nPERGUNTA: ${pergunta}`
      const resposta = await askAI({
        // A conta dona da plataforma é sempre tratada como PRO aqui: o
        // copiloto é ferramenta interna, não recurso de plano.
        isPro: true,
        apiKey: getStoredApiKey(),
        history: mensagens.slice(-6),
        message: comContexto,
        persona: "gestao",
      })
      setMensagens([...historico, { role: "ai", text: resposta }])
    } catch (err) {
      setErro(err instanceof Error ? err.message : String(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Copiloto de gestão"
        subtitle="Pergunte sobre os números da plataforma e receba leitura e sugestões."
        action={
          mensagens.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => setMensagens([])}>
              <RotateCcw className="h-4 w-4" />
              Nova conversa
            </Button>
          )
        }
      />

      {/* Transparência sobre o que sai daqui: quem administra precisa saber
          exatamente o que é enviado para um serviço de IA de terceiro. */}
      <div className="mb-5 rounded-2xl border bg-muted/40 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            Só um resumo agregado e anônimo é enviado à IA — nomes, e-mails e identificadores nunca
            saem da plataforma.
          </p>
          <Button variant="ghost" size="sm" onClick={() => setVerResumo((v) => !v)}>
            <Eye className="h-4 w-4" />
            {verResumo ? "Ocultar" : "Ver o que é enviado"}
          </Button>
        </div>
        {verResumo && (
          <pre className="mt-3 max-h-72 overflow-auto rounded-xl bg-background p-4 text-xs leading-relaxed">
            {resumo}
          </pre>
        )}
      </div>

      <section className="flex h-[min(65vh,600px)] flex-col overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
          {mensagens.length === 0 ? (
            <div className="mx-auto max-w-2xl">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white">
                  <Bot className="h-4.5 w-4.5" />
                </div>
                <div className="rounded-2xl rounded-tl-sm border bg-background p-5">
                  <p className="font-medium">Pronto para analisar a plataforma.</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tenho o resumo com {admin.users.length} usuários, {admin.schools.length} escolas e{" "}
                    {admin.leads.length} leads. Pergunte o que quiser sobre esses números.
                  </p>
                  <div className="mt-4 grid gap-2">
                    {SUGESTOES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => enviar(s)}
                        className="rounded-xl border p-3 text-left text-sm transition-colors hover:border-primary hover:bg-primary/5"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            mensagens.map((msg, i) => (
              <div
                key={i}
                className={`mx-auto flex max-w-2xl items-start gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white ${
                    msg.role === "user" ? "bg-slate-500" : "bg-gradient-to-br from-slate-700 to-slate-900"
                  }`}
                >
                  {msg.role === "user" ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div
                  className={`max-w-[calc(100%-3rem)] rounded-2xl border p-4 text-sm ${
                    msg.role === "user" ? "rounded-tr-sm bg-primary/10" : "rounded-tl-sm bg-background"
                  }`}
                >
                  {msg.role === "ai" ? (
                    <Markdown content={msg.text} />
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>
              </div>
            ))
          )}

          {enviando && (
            <div className="mx-auto flex max-w-2xl items-center gap-3 text-sm text-muted-foreground">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white">
                <Bot className="h-4 w-4" />
              </div>
              <span className="flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Analisando os números...
              </span>
            </div>
          )}
        </div>

        {erro && (
          <div className="flex items-start gap-2.5 border-t border-destructive/20 bg-destructive/5 px-5 py-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{erro}</p>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            enviar(entrada)
          }}
          className="flex items-end gap-2 border-t bg-background p-3"
        >
          <textarea
            value={entrada}
            onChange={(e) => setEntrada(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                enviar(entrada)
              }
            }}
            rows={1}
            disabled={enviando}
            placeholder="Ex: quantos usuários gratuitos já usaram as 3 gerações de IA?"
            className="max-h-32 min-h-[44px] flex-1 resize-y rounded-xl border bg-muted/40 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/15 disabled:opacity-60"
          />
          <Button type="submit" size="icon" disabled={enviando || !entrada.trim()} aria-label="Enviar">
            {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </section>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        As respostas saem dos números acima. Confirme no painel antes de agir sobre qualquer
        recomendação.
      </p>
    </>
  )
}
