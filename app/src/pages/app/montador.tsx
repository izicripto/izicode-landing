import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { Cpu, Wrench, Cable, Code2, ListChecks, Loader2, Save } from "lucide-react"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"
import {
  HARDWARE_OPTIONS,
  OBJECTIVE_OPTIONS,
  findSolution,
  availableObjectives,
  type HardwareId,
  type ObjectiveId,
} from "@/lib/solucoes-data"

/**
 * Montador de Soluções.
 *
 * Diferente do Estúdio IA (que chama a Cloud Function generateAIProject e
 * consome o limite de gerações), esta ferramenta cruza hardware + objetivo
 * numa matriz local (solucoes-data.ts) e devolve a combinação na hora, sem
 * custo de IA e sem limite de uso — pensada para o momento em que o
 * professor já sabe o que tem em mãos e quer montar algo prático rápido.
 *
 * O resultado pode ser salvo em "Meus Projetos" (mesma subcoleção
 * users/{uid}/projects que o Estúdio IA usa), então aparece junto com o
 * resto do que o professor já criou.
 */
export function MontadorPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [hardware, setHardware] = useState<HardwareId | null>(null)
  const [objective, setObjective] = useState<ObjectiveId | null>(null)
  const [saving, setSaving] = useState(false)

  const objetivosDisponiveis = useMemo(
    () => (hardware ? new Set(availableObjectives(hardware)) : null),
    [hardware]
  )

  const solution = hardware && objective ? findSolution(hardware, objective) : null

  function escolherHardware(id: HardwareId) {
    setHardware(id)
    // Objetivo escolhido antes pode não existir para o novo hardware.
    if (objective && !availableObjectives(id).includes(objective)) {
      setObjective(null)
    }
  }

  async function salvarComoProjeto() {
    if (!user || !solution) return
    setSaving(true)
    try {
      const conteudo =
        `## Ferramentas\n${solution.software.map((s) => `- ${s}`).join("\n")}\n\n` +
        `## Materiais\n${solution.materials.map((m) => `- ${m}`).join("\n")}\n\n` +
        `## Esquema de ligação\n${solution.wiring}\n\n` +
        `## Código inicial\n\`\`\`\n${solution.code}\n\`\`\`\n\n` +
        `## Passo a passo\n${solution.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`

      const doc = await addDoc(collection(db, "users", user.uid, "projects"), {
        title: solution.title,
        content: conteudo,
        type: "montador",
        target: HARDWARE_OPTIONS.find((h) => h.id === hardware)?.label ?? "",
        objective: OBJECTIVE_OPTIONS.find((o) => o.id === objective)?.label ?? "",
        createdAt: serverTimestamp(),
      })

      toast.sucesso("Solução salva em Meus Projetos", "Você pode revisar e adaptar antes de aplicar em aula.")
      navigate(`/app/projetos?id=${doc.id}`)
    } catch {
      toast.erro("Não foi possível salvar agora", "Tente novamente em instantes.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Montador de Soluções"
        subtitle="Escolha o hardware disponível e o objetivo — a combinação de ferramentas, materiais e código sai na hora."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr] lg:items-start">
        <section className="space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-white">
                <Cpu className="h-5 w-5" />
              </div>
              <h2 className="font-display text-lg font-bold">1. Que hardware você tem?</h2>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {HARDWARE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => escolherHardware(opt.id)}
                  className={`rounded-xl border p-3.5 text-left transition-all ${
                    hardware === opt.id
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "hover:border-primary/40 hover:bg-muted/40"
                  }`}
                >
                  <p className="text-sm font-semibold">{opt.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{opt.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className={`rounded-2xl border bg-card p-6 shadow-sm ${!hardware ? "opacity-50" : ""}`}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500 text-white">
                <Wrench className="h-5 w-5" />
              </div>
              <h2 className="font-display text-lg font-bold">2. Qual o objetivo?</h2>
            </div>
            <div className="grid gap-2.5">
              {OBJECTIVE_OPTIONS.map((opt) => {
                const disponivel = !objetivosDisponiveis || objetivosDisponiveis.has(opt.id)
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={!hardware || !disponivel}
                    onClick={() => setObjective(opt.id)}
                    className={`rounded-xl border p-3.5 text-left text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
                      objective === opt.id
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "hover:border-primary/40 hover:bg-muted/40"
                    }`}
                  >
                    {opt.label}
                    {hardware && !disponivel && (
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        (sem combinação pronta para este hardware ainda)
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        <section className="lg:sticky lg:top-6">
          {!solution ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card/50 px-6 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold">Escolha hardware e objetivo</h3>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                A combinação de ferramentas, materiais, esquema de ligação e código aparece aqui.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold">{solution.title}</h2>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {solution.software.map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-sky-50 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-sky-700"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-5">
                <div className="mb-1.5 flex items-center gap-2 text-sm font-bold">
                  <ListChecks className="h-4 w-4 text-muted-foreground" />
                  Materiais
                </div>
                <ul className="list-disc space-y-1 pl-6 text-sm">
                  {solution.materials.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-5">
                <div className="mb-1.5 flex items-center gap-2 text-sm font-bold">
                  <Cable className="h-4 w-4 text-muted-foreground" />
                  Esquema de ligação
                </div>
                <p className="whitespace-pre-line text-sm text-muted-foreground">{solution.wiring}</p>
              </div>

              <div className="mt-5">
                <div className="mb-1.5 flex items-center gap-2 text-sm font-bold">
                  <Code2 className="h-4 w-4 text-muted-foreground" />
                  Código inicial
                </div>
                <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
                  <code>{solution.code}</code>
                </pre>
              </div>

              <div className="mt-5">
                <div className="mb-1.5 flex items-center gap-2 text-sm font-bold">
                  <ListChecks className="h-4 w-4 text-muted-foreground" />
                  Passo a passo
                </div>
                <ol className="list-decimal space-y-1.5 pl-6 text-sm">
                  {solution.steps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </div>

              <Button className="mt-6 w-full" onClick={salvarComoProjeto} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvar em Meus Projetos
                  </>
                )}
              </Button>
            </div>
          )}
        </section>
      </div>
    </>
  )
}
