import { useEffect, useRef, useState } from "react"
import {
  Send,
  Loader2,
  Bot,
  User as UserIcon,
  Plus,
  Trash2,
  KeyRound,
  AlertCircle,
  MessageSquare,
  Sparkles,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { isProUser } from "@/lib/roles"
import { useChat } from "@/lib/use-chat"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"

const PRESETS = [
  {
    title: "Plano de Aula BNCC",
    hint: "Lógica para 6º ano com Scratch",
    prompt:
      "Crie um plano de aula sobre Lógica de Programação para o 6º ano, usando Scratch e alinhado à BNCC.",
  },
  {
    title: "Projetos Maker",
    hint: "Energia sustentável com recicláveis",
    prompt:
      "Sugira 3 projetos maker com materiais recicláveis para ensinar energia sustentável (ODS 7).",
  },
  {
    title: "Corretor de Código",
    hint: "Analisar um sketch de Arduino",
    prompt:
      "Analise este código Arduino e aponte erros:\n\nvoid setup() {\n  pinMode(13, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(1000);\n}",
  },
  {
    title: "Didática Desplugada",
    hint: "Explicar loops sem computador",
    prompt:
      "Como explicar o conceito de laço de repetição para crianças de 8 anos sem usar computador?",
  },
]

/** Formata a resposta da IA: parágrafos, listas e trechos de código. */
function MessageBody({ text }: { text: string }) {
  const blocks = text.split(/```/)
  return (
    <>
      {blocks.map((block, i) =>
        i % 2 === 1 ? (
          <pre
            key={i}
            className="my-2 overflow-x-auto rounded-xl bg-slate-900 p-3.5 text-xs leading-relaxed text-slate-100"
          >
            <code>{block.replace(/^[a-zA-Z]*\n/, "")}</code>
          </pre>
        ) : (
          block
            .split(/\n{2,}/)
            .filter((p) => p.trim())
            .map((paragraph, j) => (
              <p key={`${i}-${j}`} className="mb-2 last:mb-0 whitespace-pre-wrap">
                {paragraph.split(/(\*\*[^*]+\*\*)/).map((part, k) =>
                  part.startsWith("**") && part.endsWith("**") ? (
                    <strong key={k}>{part.slice(2, -2)}</strong>
                  ) : (
                    part
                  )
                )}
              </p>
            ))
        )
      )}
    </>
  )
}

export function AssistentePage() {
  const { userData } = useAuth()
  const pro = isProUser(userData)
  const chat = useChat(pro)
  const [input, setInput] = useState("")
  const [showKeyForm, setShowKeyForm] = useState(false)
  const [keyDraft, setKeyDraft] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const messages = chat.current?.messages ?? []

  // Mantém a conversa colada no fim conforme as mensagens chegam.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages.length, chat.sending])

  function submit(text: string) {
    chat.send(text)
    setInput("")
  }

  const needsKey = !pro && !chat.apiKey

  return (
    <>
      <PageHeader
        title="Assistente IA"
        subtitle="Tire dúvidas pedagógicas e técnicas, sem sair do painel."
        action={
          <div className="flex gap-2">
            {!pro && (
              <Button variant="outline" size="sm" onClick={() => setShowKeyForm((v) => !v)}>
                <KeyRound className="h-4 w-4" />
                {chat.apiKey ? "Trocar chave" : "Configurar chave"}
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={chat.newChat}>
              <Plus className="h-4 w-4" />
              Nova conversa
            </Button>
          </div>
        }
      />

      {showKeyForm && !pro && (
        <div className="mb-5 rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="font-display font-bold">Sua chave do Google Gemini</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            No plano gratuito a conversa usa sua própria chave, guardada apenas neste navegador —
            ela nunca é enviada aos nossos servidores. No plano PRO, a chave da Izicode já vem
            inclusa.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <input
              type="password"
              value={keyDraft}
              onChange={(e) => setKeyDraft(e.target.value)}
              placeholder={chat.apiKey ? "•••••••••• (já configurada)" : "Cole sua chave aqui"}
              className="min-w-[240px] flex-1 rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
            <Button
              onClick={() => {
                chat.setApiKey(keyDraft)
                setKeyDraft("")
                setShowKeyForm(false)
                chat.setError(null)
              }}
            >
              Salvar
            </Button>
          </div>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-xs font-semibold text-primary hover:underline"
          >
            Gerar uma chave gratuita ↗
          </a>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[260px_1fr] lg:items-start">
        <aside className="order-2 rounded-2xl border bg-card p-3 shadow-sm lg:order-1">
          <p className="px-2 pb-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            Conversas
          </p>
          {chat.sessions.length === 0 ? (
            <p className="px-2 py-3 text-sm text-muted-foreground">Nenhuma conversa ainda.</p>
          ) : (
            <div className="space-y-1">
              {chat.sessions.map((session) => (
                <div
                  key={session.id}
                  className={`group flex items-center gap-1 rounded-xl transition-colors ${
                    session.id === chat.currentId ? "bg-primary/10" : "hover:bg-muted"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => chat.setCurrentId(session.id)}
                    className="flex min-w-0 flex-1 items-center gap-2 px-2.5 py-2 text-left"
                  >
                    <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate text-sm">{session.title}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => chat.deleteSession(session.id)}
                    aria-label={`Excluir conversa ${session.title}`}
                    className="mr-1 shrink-0 rounded-lg p-1.5 text-muted-foreground opacity-0 transition hover:bg-destructive/10 hover:text-destructive focus:opacity-100 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </aside>

        <section className="order-1 flex h-[min(70vh,640px)] flex-col overflow-hidden rounded-2xl border bg-card shadow-sm lg:order-2">
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.length === 0 ? (
              <div className="mx-auto max-w-2xl">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-sky-600 text-white">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm border bg-background p-4">
                    <p className="font-medium">Olá! Sou seu assistente pedagógico.</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Posso ajudar a planejar aulas, revisar código e adaptar projetos maker. Por
                      onde começamos?
                    </p>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {PRESETS.map((preset) => (
                        <button
                          key={preset.title}
                          type="button"
                          onClick={() => submit(preset.prompt)}
                          disabled={needsKey}
                          className="rounded-xl border p-3 text-left transition-colors hover:border-primary hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <span className="block text-sm font-semibold">{preset.title}</span>
                          <span className="text-xs text-muted-foreground">{preset.hint}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message, i) => (
                <div
                  key={i}
                  className={`mx-auto flex max-w-2xl items-start gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white ${
                      message.role === "user"
                        ? "bg-slate-600"
                        : "bg-gradient-to-br from-teal-500 to-sky-600"
                    }`}
                  >
                    {message.role === "user" ? (
                      <UserIcon className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`max-w-[calc(100%-3rem)] rounded-2xl border p-4 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "rounded-tr-sm bg-primary/10"
                        : "rounded-tl-sm bg-background"
                    }`}
                  >
                    <MessageBody text={message.text} />
                  </div>
                </div>
              ))
            )}

            {chat.sending && (
              <div className="mx-auto flex max-w-2xl items-center gap-3 text-sm text-muted-foreground">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-sky-600 text-white">
                  <Bot className="h-4 w-4" />
                </div>
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Pensando...
                </span>
              </div>
            )}
          </div>

          {chat.error && (
            <div className="flex items-start gap-2.5 border-t border-destructive/20 bg-destructive/5 px-5 py-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{chat.error}</p>
            </div>
          )}

          {needsKey && !chat.error && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-amber-50 px-5 py-3 text-sm text-amber-900">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                No PRO a chave da Izicode já vem inclusa — sem configurar nada.
              </span>
              <Button size="sm" variant="outline" className="bg-white" asChild>
                <a href="/pricing.html">Ver planos</a>
              </Button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault()
              submit(input)
            }}
            className="flex items-end gap-2 border-t bg-background p-3"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                // Enter envia; Shift+Enter quebra linha — como num chat comum.
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  submit(input)
                }
              }}
              rows={1}
              disabled={chat.sending}
              placeholder={
                needsKey
                  ? "Configure sua chave do Gemini para começar"
                  : "Digite sua dúvida... (Shift+Enter para quebrar linha)"
              }
              className="max-h-32 min-h-[44px] flex-1 resize-y rounded-xl border bg-muted/40 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/15 disabled:opacity-60"
            />
            <Button type="submit" size="icon" disabled={chat.sending || !input.trim()} aria-label="Enviar">
              {chat.sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </section>
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        A IA pode cometer erros. Confira informações importantes antes de levar para a sala.
      </p>
    </>
  )
}
