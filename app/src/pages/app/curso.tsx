import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Lock,
  Clock,
  Loader2,
  ChevronRight,
  AlertCircle,
} from "lucide-react"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { isProUser } from "@/lib/roles"
import { loadCourses, type Course } from "@/lib/legacy-data"
import { Markdown } from "@/components/dashboard/markdown"
import { Button } from "@/components/ui/button"

export function CursoPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { user, userData } = useAuth()
  const pro = isProUser(userData)

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [moduleIndex, setModuleIndex] = useState(0)
  const [completed, setCompleted] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    loadCourses().then((all) => {
      setCourse(all.find((c) => c.id === courseId) ?? null)
      setLoading(false)
    })
  }, [courseId])

  useEffect(() => {
    if (!user || !courseId) return
    getDoc(doc(db, "users", user.uid, "courseProgress", courseId))
      .then((snap) => {
        if (snap.exists()) setCompleted((snap.data().completedModules as string[]) ?? [])
      })
      .catch((error) => console.error("Erro ao carregar progresso:", error))
  }, [user, courseId])

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Carregando curso...
      </div>
    )
  }

  if (!course) {
    return (
      <div className="rounded-2xl border border-dashed bg-card/50 p-10 text-center">
        <h2 className="font-display text-lg font-bold">Curso não encontrado</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Esse curso pode ter sido renomeado ou ainda não está publicado.
        </p>
        <Button className="mt-5" asChild>
          <Link to="/app/academia">Voltar para a Academia</Link>
        </Button>
      </div>
    )
  }

  const modules = course.modules ?? []
  const active = modules[moduleIndex]
  const canAccess = (m: typeof active) => Boolean(m?.free) || pro
  const isDone = active ? completed.includes(active.id) : false
  const progressPct = modules.length ? Math.round((completed.length / modules.length) * 100) : 0

  async function markComplete() {
    if (!user || !active || !courseId) return
    setSaving(true)
    setSaveError(null)
    const next = completed.includes(active.id) ? completed : [...completed, active.id]
    try {
      await setDoc(
        doc(db, "users", user.uid, "courseProgress", courseId),
        { completedModules: next, lastAccessedAt: serverTimestamp() },
        { merge: true }
      )
      setCompleted(next)
      if (moduleIndex < modules.length - 1 && canAccess(modules[moduleIndex + 1])) {
        setModuleIndex(moduleIndex + 1)
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    } catch (error) {
      console.error("Erro ao salvar progresso:", error)
      setSaveError("Não foi possível salvar seu progresso agora. Tente novamente.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="-ml-2 mb-3" asChild>
          <Link to="/app/academia">
            <ArrowLeft className="h-4 w-4" />
            Academia do Professor
          </Link>
        </Button>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-balance">
              {course.title}
            </h1>
            <p className="mt-1 text-muted-foreground">{course.description}</p>
          </div>
          {completed.length > 0 && (
            <div className="min-w-[180px]">
              <div className="mb-1 flex justify-between text-xs font-semibold">
                <span className="text-emerald-700">
                  {completed.length}/{modules.length} módulos
                </span>
                <span className="text-muted-foreground">{progressPct}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-[width]"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
        <aside className="rounded-2xl border bg-card p-3 shadow-sm lg:sticky lg:top-6">
          <p className="px-2 pb-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            Módulos
          </p>
          <div className="space-y-1">
            {modules.map((m, i) => {
              const locked = !canAccess(m)
              const done = completed.includes(m.id)
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => !locked && setModuleIndex(i)}
                  disabled={locked}
                  className={`flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2.5 text-left text-sm transition-colors ${
                    i === moduleIndex
                      ? "bg-primary/10 font-semibold"
                      : locked
                        ? "cursor-not-allowed opacity-55"
                        : "hover:bg-muted"
                  }`}
                >
                  {locked ? (
                    <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : done ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className="min-w-0">
                    <span className="block leading-snug">{m.title}</span>
                    {m.duration && (
                      <span className="mt-0.5 flex items-center gap-1 text-[0.7rem] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {m.duration}
                      </span>
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        </aside>

        <section>
          {!active ? (
            <p className="text-muted-foreground">Este curso ainda não tem módulos publicados.</p>
          ) : !canAccess(active) ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="font-display text-xl font-bold text-amber-900">Módulo exclusivo PRO</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-amber-900/80">
                O primeiro módulo de cada trilha é gratuito. Com o plano PRO você libera todos os
                módulos de todas as trilhas da Academia.
              </p>
              <Button className="mt-5" asChild>
                <a href="/pricing.html">Ver planos</a>
              </Button>
            </div>
          ) : (
            <article className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
              <div className="mb-5 border-b pb-4">
                <p className="text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground">
                  Módulo {moduleIndex + 1} de {modules.length}
                </p>
                <h2 className="font-display text-2xl font-bold">{active.title}</h2>
              </div>

              <Markdown content={(active as { content?: string }).content ?? ""} />

              {saveError && (
                <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{saveError}</p>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-3 border-t pt-6">
                <Button onClick={markComplete} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : isDone ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Concluído — avançar
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Marcar como concluído
                    </>
                  )}
                </Button>

                {moduleIndex < modules.length - 1 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (canAccess(modules[moduleIndex + 1])) {
                        setModuleIndex(moduleIndex + 1)
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                    }}
                    disabled={!canAccess(modules[moduleIndex + 1])}
                  >
                    Próximo módulo
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </article>
          )}
        </section>
      </div>
    </>
  )
}
