import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { Sparkles, Save, Loader2, AlertCircle, PenLine, Wand2 } from "lucide-react"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { isProUser, remainingFreeGenerations, FREE_AI_GENERATIONS } from "@/lib/roles"
import { askAI, getStoredApiKey } from "@/lib/ai"
import { PageHeader } from "@/components/dashboard/page-header"
import { Markdown } from "@/components/dashboard/markdown"
import { Button } from "@/components/ui/button"

const TOOL_OPTIONS = ["Scratch", "Arduino", "Micro:bit", "Tinkercad", "Python", "Desplugado"]

const GRADES = [
  "Educação Infantil",
  "1º ao 3º ano (Fund. I)",
  "4º e 5º ano (Fund. I)",
  "6º e 7º ano (Fund. II)",
  "8º e 9º ano (Fund. II)",
  "Ensino Médio",
]

export function ConteudoPage() {
  const { user, userData } = useAuth()
  const navigate = useNavigate()
  const pro = isProUser(userData)

  // O limite do plano gratuito é de GERAÇÕES de IA (o que de fato tem
  // custo) e quem aplica é a Cloud Function. Escrever e salvar no modo
  // manual não consome nada, então não é limitado — antes o limite era
  // por projetos salvos, o que só existia no navegador, dava para burlar
  // apagando um projeto e ainda atrapalhava quem escrevia à mão.
  const restantes = remainingFreeGenerations(userData)
  const semSaldoIA = !pro && restantes === 0

  const [mode, setMode] = useState<"ai" | "manual">("ai")
  const [title, setTitle] = useState("")
  const [grade, setGrade] = useState("")
  const [bncc, setBncc] = useState("")
  const [duration, setDuration] = useState("2 a 4 aulas")
  const [objectives, setObjectives] = useState("")
  const [tools, setTools] = useState<string[]>([])
  const [materials, setMaterials] = useState("")
  const [extra, setExtra] = useState("")
  const [manualContent, setManualContent] = useState("")

  const [result, setResult] = useState("")
  const [busy, setBusy] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleTool(tool: string) {
    setTools((prev) => (prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]))
  }

  async function generate() {
    setError(null)
    if (!title.trim() || !grade) {
      setError("Informe pelo menos o título e a série para a IA ter contexto.")
      return
    }

    if (semSaldoIA) {
      setError(
        `Você usou as ${FREE_AI_GENERATIONS} gerações de IA do plano gratuito. ` +
        "Faça upgrade para o PRO, ou escreva no modo manual (sem limite)."
      )
      return
    }

    setBusy(true)
    try {
      const prompt = [
        `Crie um plano de aula completo em MARKDOWN sobre: ${title}.`,
        `Série/ano: ${grade}.`,
        duration && `Duração prevista: ${duration}.`,
        objectives && `Competências e objetivos: ${objectives}.`,
        tools.length > 0 && `Ferramentas a usar: ${tools.join(", ")}.`,
        materials && `Materiais disponíveis: ${materials}.`,
        bncc && `Habilidades BNCC a contemplar: ${bncc}.`,
        extra && `Instruções adicionais: ${extra}.`,
        "",
        "Estruture com: Objetivos de aprendizagem, Materiais, Passo a passo da aula (com tempo por etapa), Adaptações para turmas maiores ou sem equipamento, e Critérios de avaliação.",
        "Não use blocos de código markdown envolvendo o texto inteiro.",
      ]
        .filter(Boolean)
        .join("\n")

      const text = await askAI({ isPro: pro, apiKey: getStoredApiKey(), message: prompt })
      setResult(text)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  async function save() {
    if (!user) return
    const content = mode === "ai" ? result : manualContent
    if (!title.trim() || !content.trim()) {
      setError("Dê um título e gere (ou escreva) o conteúdo antes de salvar.")
      return
    }
    setSaving(true)
    setError(null)
    try {
      const ref = await addDoc(collection(db, "users", user.uid, "projects"), {
        title: title.trim(),
        content,
        grade,
        bncc,
        duration,
        tools,
        type: mode === "ai" ? "ai-lesson-plan" : "manual-lesson-plan",
        createdAt: serverTimestamp(),
      })
      navigate(`/app/projetos?id=${ref.id}`)
    } catch (err) {
      console.error("Erro ao salvar projeto:", err)
      setError("Não foi possível salvar agora. Tente novamente em instantes.")
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    "w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"

  return (
    <>
      <PageHeader
        title="Criação de Conteúdo"
        subtitle="Monte planos de aula e materiais — com a IA ou escrevendo você mesmo."
        action={
          <div className="flex rounded-xl border bg-muted/50 p-1">
            <button
              type="button"
              onClick={() => setMode("ai")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-semibold transition ${
                mode === "ai" ? "bg-background shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Wand2 className="h-3.5 w-3.5" />
              Com IA
            </button>
            <button
              type="button"
              onClick={() => setMode("manual")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-semibold transition ${
                mode === "manual" ? "bg-background shadow-sm" : "text-muted-foreground"
              }`}
            >
              <PenLine className="h-3.5 w-3.5" />
              Manual
            </button>
          </div>
        }
      />

      {!pro && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <span>
            {semSaldoIA
              ? "Você usou todas as gerações de IA do plano gratuito. O modo manual continua liberado, sem limite."
              : `Plano gratuito: ${restantes} de ${FREE_AI_GENERATIONS} gerações de IA restantes. O modo manual é ilimitado.`}
          </span>
          <Button size="sm" variant="outline" className="bg-white" asChild>
            <a href="/pricing.html">Ver planos</a>
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Título do planejamento *</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Introdução à Robótica com Sucata"
                className={inputClass}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Série / ano *</span>
                <select value={grade} onChange={(e) => setGrade(e.target.value)} className={inputClass}>
                  <option value="">Selecione...</option>
                  {GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Duração</span>
                <input
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className={inputClass}
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Habilidades BNCC</span>
              <input
                value={bncc}
                onChange={(e) => setBncc(e.target.value)}
                placeholder="Ex: EF05CI01, EF04CI03"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Competências e objetivos</span>
              <textarea
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                rows={3}
                placeholder="O que os alunos devem ser capazes de fazer ao final?"
                className={inputClass}
              />
            </label>

            <div>
              <span className="mb-2 block text-sm font-semibold">Ferramentas</span>
              <div className="flex flex-wrap gap-2">
                {TOOL_OPTIONS.map((tool) => (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => toggleTool(tool)}
                    className={`rounded-xl border px-3 py-1.5 text-sm font-medium transition ${
                      tools.includes(tool)
                        ? "border-primary bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Materiais disponíveis</span>
              <textarea
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                rows={2}
                placeholder="Ex: 5 kits Arduino, sucata, 1 projetor"
                className={inputClass}
              />
            </label>

            {mode === "ai" ? (
              <>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">
                    Instruções extras para a IA
                  </span>
                  <textarea
                    value={extra}
                    onChange={(e) => setExtra(e.target.value)}
                    rows={2}
                    placeholder="Ex: turma agitada, priorizar atividade em duplas"
                    className={inputClass}
                  />
                </label>

                <Button onClick={generate} disabled={busy || semSaldoIA} className="w-full">
                  {busy ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Gerando conteúdo...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Gerar com IA
                    </>
                  )}
                </Button>
              </>
            ) : (
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Conteúdo (markdown)</span>
                <textarea
                  value={manualContent}
                  onChange={(e) => setManualContent(e.target.value)}
                  rows={12}
                  placeholder={"## Objetivos\n\n- ...\n\n## Passo a passo\n\n1. ..."}
                  className={`${inputClass} font-mono text-xs`}
                />
              </label>
            )}

            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-6 shadow-sm lg:sticky lg:top-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display font-bold">Pré-visualização</h2>
            {(result || manualContent) && (
              <Button size="sm" onClick={save} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvar
                  </>
                )}
              </Button>
            )}
          </div>

          {mode === "ai" && !result ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
              <Sparkles className="mb-3 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Preencha o formulário e clique em <strong>Gerar com IA</strong>.
              </p>
            </div>
          ) : mode === "manual" && !manualContent ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
              <PenLine className="mb-3 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                O que você escrever aparece formatado aqui.
              </p>
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto pr-1">
              <Markdown content={mode === "ai" ? result : manualContent} />
            </div>
          )}
        </section>
      </div>
    </>
  )
}
