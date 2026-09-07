import { useState } from "react"
import {
  School,
  Users,
  GraduationCap,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Copy,
  Check,
  KeyRound,
} from "lucide-react"
import { useSchool } from "@/lib/use-school"
import { PageHeader, StatCard, EmptyState } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"

function CodeBox({ label, code }: { label: string; code?: string }) {
  const [copied, setCopied] = useState(false)

  if (!code) return null

  return (
    <div className="rounded-2xl border bg-card p-4">
      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-center gap-2">
        <code className="flex-1 rounded-lg bg-muted px-3 py-2 font-mono text-lg font-bold tracking-[0.2em]">
          {code}
        </code>
        <Button
          variant="outline"
          size="icon"
          aria-label={`Copiar ${label}`}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code)
              setCopied(true)
              setTimeout(() => setCopied(false), 1800)
            } catch {
              // Clipboard bloqueado (contexto sem permissão): o código
              // continua visível para digitação manual.
            }
          }}
        >
          {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}

export function TurmasPage() {
  const school = useSchool()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [grade, setGrade] = useState("")
  const [teacherId, setTeacherId] = useState("")
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  const inputClass =
    "w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    if (!name.trim() || !grade.trim()) {
      setFormError("Informe o nome e a série da turma.")
      return
    }
    setSaving(true)
    try {
      await school.createClass({ name, grade, teacherId })
      setName("")
      setGrade("")
      setTeacherId("")
      setShowForm(false)
    } catch (err) {
      console.error("Erro ao criar turma:", err)
      setFormError(
        err instanceof Error && err.message.includes("permission")
          ? "Seu plano atual não permite criar turmas. Contrate o plano Escola para liberar."
          : "Não foi possível criar a turma agora. Tente novamente."
      )
    } finally {
      setSaving(false)
    }
  }

  if (!school.loading && !school.schoolId) {
    return (
      <>
        <PageHeader title="Turmas" subtitle="Gestão de turmas, professores e alunos." />
        <EmptyState
          icon={<School className="h-6 w-6" />}
          title="Nenhuma escola vinculada"
          description="Sua conta ainda não está ligada a uma instituição. Use o código da escola no onboarding ou fale com a equipe para criar o acesso institucional."
          action={
            <Button asChild>
              <a href="/contato">Falar com a equipe</a>
            </Button>
          }
        />
      </>
    )
  }

  return (
    <>
      <PageHeader
        title={school.school?.name ? `Turmas — ${school.school.name}` : "Turmas"}
        subtitle="Gestão de turmas, professores e alunos."
        action={
          school.canManageClasses ? (
            <Button onClick={() => setShowForm((v) => !v)}>
              <Plus className="h-4 w-4" />
              Nova turma
            </Button>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-amber-800">
              <AlertTriangle className="h-3.5 w-3.5" />
              Modo demonstração
            </span>
          )
        }
      />

      {school.error && (
        <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{school.error}</p>
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Turmas" value={school.loading ? "—" : school.classes.length} icon={<School className="h-5 w-5" />} />
        <StatCard label="Professores" value={school.loading ? "—" : school.teachers.length} icon={<GraduationCap className="h-5 w-5" />} tone="violet" />
        <StatCard label="Alunos" value={school.loading ? "—" : school.students.length} icon={<Users className="h-5 w-5" />} tone="emerald" />
      </div>

      {!school.loading && !school.canManageClasses && (
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="mb-2 flex items-center gap-2 text-amber-900">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="font-display text-lg font-bold">Acesso de demonstração</h2>
          </div>
          <p className="text-sm text-amber-900/80">
            Você pode navegar por tudo, mas criar e editar turmas fica bloqueado até a contratação do
            pacote Escola (cobrado por professores + alunos). O bloqueio vale também no servidor.
          </p>
          <Button className="mt-4" asChild>
            <a href="/contato">Contratar plano Escola</a>
          </Button>
        </div>
      )}

      {(school.school?.studentCode || school.school?.teacherCode) && (
        <section className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
            <KeyRound className="h-4 w-4 text-muted-foreground" />
            Códigos de acesso
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Professores e alunos usam estes códigos no cadastro para entrar já vinculados à escola.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <CodeBox label="Código do aluno" code={school.school?.studentCode} />
            <CodeBox label="Código do professor" code={school.school?.teacherCode} />
          </div>
        </section>
      )}

      {showForm && school.canManageClasses && (
        <form onSubmit={submit} className="mb-6 rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-display text-lg font-bold">Nova turma</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Nome *</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Turma A" className={inputClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Série *</span>
              <input value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="Ex: 6º ano" className={inputClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Professor</span>
              <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)} className={inputClass}>
                <option value="">A definir</option>
                {school.teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.displayName || t.name || t.email}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {formError && (
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{formError}</p>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar turma"
              )}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      )}

      <section>
        <h2 className="mb-4 font-display text-lg font-bold">Turmas cadastradas</h2>

        {school.loading ? (
          <div className="grid gap-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl border bg-muted/40" />
            ))}
          </div>
        ) : school.classes.length === 0 ? (
          <EmptyState
            icon={<School className="h-6 w-6" />}
            title="Nenhuma turma ainda"
            description={
              school.canManageClasses
                ? "Crie a primeira turma para vincular professores e alunos."
                : "As turmas aparecem aqui depois da contratação do plano Escola."
            }
          />
        ) : (
          <div className="grid gap-3">
            {school.classes.map((turma) => {
              const teacher = school.teachers.find((t) => t.id === turma.teacherId)
              return (
                <div
                  key={turma.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border bg-card p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                      <School className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {turma.name}
                        {turma.gradeName && (
                          <span className="ml-2 text-sm font-normal text-muted-foreground">
                            {turma.gradeName}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {teacher ? `Prof. ${teacher.displayName || teacher.name || teacher.email}` : "Sem professor definido"}
                        {" · "}
                        {(turma.studentIds ?? []).length} aluno(s)
                      </p>
                    </div>
                  </div>

                  {school.canManageClasses &&
                    (pendingDelete === turma.id ? (
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="hidden text-xs text-muted-foreground sm:inline">Excluir?</span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={async () => {
                            await school.removeClass(turma.id)
                            setPendingDelete(null)
                          }}
                        >
                          Sim
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setPendingDelete(null)}>
                          Não
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => setPendingDelete(turma.id)}
                        aria-label={`Excluir turma ${turma.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ))}
                </div>
              )
            })}
          </div>
        )}
      </section>

      {!school.loading && school.members.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-lg font-bold">Pessoas na escola</h2>
          <div className="overflow-x-auto rounded-2xl border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-2.5 text-left font-semibold">Nome</th>
                  <th className="px-4 py-2.5 text-left font-semibold">E-mail</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Papel</th>
                  <th className="px-4 py-2.5 text-right font-semibold">XP</th>
                </tr>
              </thead>
              <tbody>
                {school.members.map((m) => (
                  <tr key={m.id} className="border-t">
                    <td className="px-4 py-2.5">{m.displayName || m.name || "—"}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{m.email || "—"}</td>
                    <td className="px-4 py-2.5">
                      <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold">
                        {m.role === "student" ? "Aluno" : m.role === "teacher" ? "Professor" : m.role === "school_admin" ? "Gestor" : m.role}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{(m.xp ?? 0).toLocaleString("pt-BR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  )
}
