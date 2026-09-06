import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { httpsCallable } from "firebase/functions"
import { Sparkles, Bot, FileText, Loader2, Lock, AlertCircle } from "lucide-react"
import { functions } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { isProUser } from "@/lib/roles"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"

/** Limite do plano gratuito, espelhando a checagem da Cloud Function. */
const FREE_LIMIT = 3

export function EstudioPage() {
  const { userData } = useAuth()
  const navigate = useNavigate()
  const pro = isProUser(userData)

  const [target, setTarget] = useState("")
  const [subject, setSubject] = useState("")
  const [objective, setObjective] = useState("")
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    if (!target.trim() || !subject.trim() || !objective.trim()) {
      setError("Preencha os três campos para a IA ter contexto suficiente.")
      return
    }

    setGenerating(true)
    try {
      const generate = httpsCallable<
        { target: string; subject: string; objective: string },
        { success: boolean; projectId: string }
      >(functions, "generateAIProject")
      const result = await generate({ target, subject, objective })
      if (result.data?.success) {
        navigate(`/app/projetos?id=${result.data.projectId}`)
      } else {
        setError("A IA não retornou um plano. Tente novamente.")
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      // A function responde 'resource-exhausted' quando o plano gratuito
      // estoura o limite — vale mostrar isso como upgrade, não como erro.
      setError(
        message.includes("resource-exhausted") || message.includes("Limite")
          ? `Você atingiu o limite de ${FREE_LIMIT} gerações do plano gratuito. Faça upgrade para o PRO e gere sem limite.`
          : "Não foi possível gerar o plano agora. Tente novamente em instantes."
      )
    } finally {
      setGenerating(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Estúdio IA"
        subtitle="Planos de aula, conteúdos e assistente pedagógico — escolha por onde começar."
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500 text-white">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold">Planejamento de Aulas</h2>
              <p className="text-sm text-muted-foreground">
                Gere um plano alinhado à BNCC a partir de um objetivo pedagógico.
              </p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Público alvo</span>
                <input
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="Ex: 5º ano do Fundamental I"
                  className="w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Matéria / tema</span>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex: Sustentabilidade com Arduino"
                  className="w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Objetivo pedagógico</span>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                rows={4}
                placeholder="O que os alunos precisam ser capazes de fazer ao final da aula?"
                className="w-full resize-y rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
              />
            </label>

            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={generating}>
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Gerando plano...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Gerar plano de aula
                  </>
                )}
              </Button>
              {!pro && (
                <span className="text-xs text-muted-foreground">
                  Plano gratuito: até {FREE_LIMIT} gerações.
                </span>
              )}
            </div>
          </form>
        </section>

        <aside className="space-y-4">
          <a
            href="/ia-assistant.html"
            className="group flex gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-bold">Assistente IA</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Converse livremente para tirar dúvidas pedagógicas ou técnicas.
              </p>
            </div>
          </a>

          <a
            href="/create-project.html"
            className="group flex gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500 text-white">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-bold">Criação de Conteúdo</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Editor completo com modo manual, BNCC detalhada e exportação em PDF.
              </p>
            </div>
          </a>

          {!pro && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <div className="mb-2 flex items-center gap-2 text-amber-800">
                <Lock className="h-4 w-4" />
                <strong className="text-sm font-bold">Plano Gratuito</strong>
              </div>
              <p className="text-sm text-amber-900/80">
                No PRO você gera planos sem limite, com a chave de IA da Izicode inclusa — sem
                precisar configurar chave própria.
              </p>
              <Button variant="outline" size="sm" className="mt-3 bg-white" asChild>
                <a href="/pricing.html">Ver planos</a>
              </Button>
            </div>
          )}
        </aside>
      </div>
    </>
  )
}
