import { useEffect, useMemo, useState } from "react"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  School,
  Users,
  Sparkles,
  Mail,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
} from "lucide-react"
import { db } from "@/lib/firebase"
import { NOMES_PLANO } from "@/lib/planos"
import { Button } from "@/components/ui/button"

/** Mesmos valores gravados pelo formulário antigo: o painel de suporte e
 *  qualquer relatório já existente continuam entendendo os leads novos. */
const PERFIS = [
  { valor: "teacher", rotulo: "Sou professor(a)", icone: GraduationCap },
  { valor: "school", rotulo: "Represento uma escola", icone: School },
  { valor: "parent", rotulo: "Sou pai, mãe ou responsável", icone: Users },
  { valor: "other", rotulo: "Outro", icone: MessageSquare },
]

const OBJETIVOS = [
  { valor: "demo", rotulo: "Conhecer a plataforma" },
  { valor: "price", rotulo: "Falar sobre planos e preços" },
  { valor: "support", rotulo: "Preciso de suporte" },
  { valor: "other", rotulo: "Outro assunto" },
]

const inputClass =
  "w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"

export function ContatoPage() {
  const [passo, setPasso] = useState(1)
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [perfil, setPerfil] = useState("")
  const [objetivo, setObjetivo] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  // Plano que a pessoa veio olhando na página de planos.
  const planoId = useMemo(() => new URLSearchParams(window.location.search).get("plano"), [])
  const planoNome = planoId ? (NOMES_PLANO[planoId] ?? planoId) : null

  // Chegando de um plano, o objetivo já é conhecido: falar sobre contratar.
  useEffect(() => {
    if (planoId) {
      setObjetivo("price")
      if (planoId === "escola") setPerfil("school")
    }
  }, [planoId])

  const podeAvancar = passo === 1 ? nome.trim().length > 1 && email.includes("@") : true

  async function enviar() {
    setErro(null)
    setEnviando(true)
    try {
      await addDoc(collection(db, "leads"), {
        name: nome.trim(),
        email: email.trim(),
        role: perfil || "unknown",
        goal: objetivo || "general",
        message: mensagem.trim(),
        // Registra o plano de origem sem inventar campo novo: entra na
        // própria mensagem e na origem, que é o que o painel já exibe.
        plano: planoId ?? null,
        source: planoId ? `planos:${planoId}` : "contact_form_v2",
        status: "new",
        createdAt: serverTimestamp(),
      })
      setEnviado(true)
    } catch (e) {
      console.error("Erro ao enviar lead:", e)
      setErro(
        "Não foi possível enviar agora. Tente novamente em instantes ou escreva para contato@izicode.com.br."
      )
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-4 py-20">
        <div className="w-full max-w-lg rounded-3xl border bg-card p-10 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="font-display text-2xl font-bold">Mensagem recebida!</h1>
          <p className="mt-3 text-muted-foreground">
            Respondemos em <strong>{email}</strong>, normalmente em até um dia útil.
            {planoNome && ` Já sabemos que seu interesse é no ${planoNome}.`}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <a href="/login.html">Criar conta grátis</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/planos">Ver os planos</a>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="border-b bg-muted/30 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <Mail className="h-3.5 w-3.5" />
            Fale com a gente
          </span>
          <h1 className="mt-6 text-balance font-display text-4xl font-extrabold tracking-tight lg:text-5xl">
            {planoNome ? `Vamos falar sobre o ${planoNome}` : "Como podemos ajudar?"}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {planoNome
              ? "Conte um pouco do seu contexto e a gente responde com a melhor forma de começar."
              : "Responda três perguntas rápidas e a nossa equipe volta para você."}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          {/* Progresso */}
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <span>Passo {passo} de 3</span>
              <span>{Math.round((passo / 3) * 100)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{ width: `${(passo / 3) * 100}%` }}
              />
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-7 shadow-sm sm:p-9">
            {passo === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display text-xl font-bold">Primeiro, quem é você?</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Só precisamos do essencial para conseguir responder.
                  </p>
                </div>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">Seu nome *</span>
                  <input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Como podemos te chamar?"
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">Seu e-mail *</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="onde respondemos você"
                    className={inputClass}
                  />
                </label>

                <Button className="w-full" disabled={!podeAvancar} onClick={() => setPasso(2)}>
                  Continuar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {passo === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-xl font-bold">Como você chega até nós?</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Isso muda bastante o que a gente vai te sugerir.
                  </p>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  {PERFIS.map((p) => {
                    const Icon = p.icone
                    const ativo = perfil === p.valor
                    return (
                      <button
                        key={p.valor}
                        type="button"
                        onClick={() => setPerfil(p.valor)}
                        className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left text-sm font-medium transition ${
                          ativo ? "border-primary bg-primary/5" : "hover:border-primary/40"
                        }`}
                      >
                        <Icon className={`h-5 w-5 shrink-0 ${ativo ? "text-primary" : "text-muted-foreground"}`} />
                        {p.rotulo}
                      </button>
                    )
                  })}
                </div>

                <div>
                  <p className="mb-2.5 text-sm font-semibold">O que você procura?</p>
                  <div className="flex flex-wrap gap-2">
                    {OBJETIVOS.map((o) => (
                      <button
                        key={o.valor}
                        type="button"
                        onClick={() => setObjetivo(o.valor)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          objetivo === o.valor
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/70"
                        }`}
                      >
                        {o.rotulo}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setPasso(1)}>
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                  </Button>
                  <Button className="flex-1" onClick={() => setPasso(3)}>
                    Continuar
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {passo === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display text-xl font-bold">Quer contar mais alguma coisa?</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Opcional — mas ajuda a gente a chegar com uma resposta útil de primeira.
                  </p>
                </div>

                {planoNome && (
                  <div className="flex items-start gap-2.5 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <p>
                      Vamos registrar que seu interesse é no <strong>{planoNome}</strong>.
                    </p>
                  </div>
                )}

                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">Sua mensagem</span>
                  <textarea
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    rows={5}
                    placeholder="Ex: temos 4 professores e queremos começar com uma turma piloto no 6º ano."
                    className={inputClass}
                  />
                </label>

                {erro && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{erro}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setPasso(2)} disabled={enviando}>
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                  </Button>
                  <Button className="flex-1" onClick={enviar} disabled={enviando}>
                    {enviando ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Enviar mensagem
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Prefere e-mail direto?{" "}
            <a href="mailto:contato@izicode.com.br" className="font-semibold text-primary hover:underline">
              contato@izicode.com.br
            </a>
          </p>
        </div>
      </section>
    </>
  )
}
