import { useEffect, useRef, useState } from "react"
import { Send, Loader2, Bot, Sparkles, KeyRound, AlertCircle, RotateCcw, ShieldCheck } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { isProUser } from "@/lib/roles"
import { useChat } from "@/lib/use-chat"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"

const PRESETS = [
  { emoji: "🧠", label: "O que é uma variável?", prompt: "Me explique o que é uma variável como se eu tivesse 10 anos." },
  { emoji: "🎮", label: "Fazer o personagem pular", prompt: "Como faço um personagem pular no Scratch?" },
  { emoji: "💡", label: "Piscar um LED", prompt: "Escreva um código simples para piscar um LED no Arduino e me explique cada linha." },
  { emoji: "🐛", label: "Meu código não funciona", prompt: "Meu código não está funcionando. Como eu descubro onde está o erro?" },
]

export function TutorPage() {
  const { userData } = useAuth()
  // O tutor herda o plano da conta responsável/aluno: quando é PRO, usa a
  // chave da Izicode; senão, a chave pessoal configurada no dispositivo.
  const pro = isProUser(userData)
  const chat = useChat(pro, "aluno")
  const [input, setInput] = useState("")
  const [showKeyForm, setShowKeyForm] = useState(false)
  const [keyDraft, setKeyDraft] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const messages = chat.current?.messages ?? []
  const needsKey = !pro && !chat.apiKey

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages.length, chat.sending])

  function submit(text: string) {
    chat.send(text)
    setInput("")
  }

  return (
    <>
      <PageHeader
        title="Tutor IA"
        subtitle="Seu ajudante para dúvidas de código, robótica e lógica."
        action={
          <div className="flex gap-2">
            {!pro && (
              <Button variant="outline" size="sm" onClick={() => setShowKeyForm((v) => !v)}>
                <KeyRound className="h-4 w-4" />
                Chave
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={chat.newChat}>
              <RotateCcw className="h-4 w-4" />
              Nova conversa
            </Button>
          </div>
        }
      />

      {showKeyForm && !pro && (
        <div className="mb-5 rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="font-display font-bold">Chave do Gemini</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            No plano gratuito o tutor usa uma chave própria, guardada só neste navegador. Se você é
            responsável por esta conta, configure aqui.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <input
              type="password"
              value={keyDraft}
              onChange={(e) => setKeyDraft(e.target.value)}
              placeholder={chat.apiKey ? "•••••••••• (já configurada)" : "Cole a chave aqui"}
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
        </div>
      )}

      <section className="flex h-[min(70vh,620px)] flex-col overflow-hidden rounded-3xl border-2 border-sky-100 bg-card shadow-sm">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 ? (
            <div className="mx-auto max-w-2xl">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-violet-500 text-white">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="rounded-3xl rounded-tl-md border-2 border-sky-100 bg-sky-50/60 p-5">
                  <p className="font-display text-lg font-bold">Oi! Eu sou o Tutor Izicode 🚀</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Posso te ajudar com código, robôs e lógica. Escolha uma pergunta ou escreva a sua!
                  </p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => submit(preset.prompt)}
                        disabled={needsKey}
                        className="flex items-center gap-2.5 rounded-2xl border-2 bg-background p-3 text-left text-sm font-medium transition-colors hover:border-sky-400 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span className="text-lg">{preset.emoji}</span>
                        {preset.label}
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
                className={`mx-auto flex max-w-2xl items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white ${
                    message.role === "user" ? "bg-slate-500" : "bg-gradient-to-br from-sky-400 to-violet-500"
                  }`}
                >
                  {message.role === "user" ? <Sparkles className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>
                <div
                  className={`max-w-[calc(100%-3.5rem)] whitespace-pre-wrap rounded-3xl border-2 p-4 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "rounded-tr-md border-slate-200 bg-slate-50"
                      : "rounded-tl-md border-sky-100 bg-sky-50/60"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))
          )}

          {chat.sending && (
            <div className="mx-auto flex max-w-2xl items-center gap-3 text-sm text-muted-foreground">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-violet-500 text-white">
                <Bot className="h-5 w-5" />
              </div>
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Pensando...
              </span>
            </div>
          )}
        </div>

        {chat.error && (
          <div className="flex items-start gap-2.5 border-t-2 border-destructive/20 bg-destructive/5 px-5 py-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{chat.error}</p>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit(input)
          }}
          className="flex items-center gap-2 border-t-2 border-sky-100 bg-background p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={chat.sending || needsKey}
            placeholder={needsKey ? "Peça a um responsável para configurar a chave" : "Pergunte sobre código ou robôs..."}
            className="flex-1 rounded-full border-2 border-sky-100 bg-sky-50/60 px-5 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-background disabled:opacity-60"
          />
          <Button type="submit" size="icon" className="h-11 w-11 rounded-full" disabled={chat.sending || !input.trim()} aria-label="Enviar">
            {chat.sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </section>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" />
        O tutor só conversa sobre programação, robótica, lógica, matemática e ciências.
      </p>
    </>
  )
}
