import { useEffect, useState } from "react"
import { BookOpen, Lock, CheckCircle2 } from "lucide-react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { isProUser } from "@/lib/roles"
import { loadCourses, type Course } from "@/lib/legacy-data"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"

export function AcademiaPage() {
  const { user, userData } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [progress, setProgress] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)
  const pro = isProUser(userData)

  useEffect(() => {
    loadCourses().then((data) => {
      setCourses(data)
      setLoading(false)
    })
  }, [])

  // Histórico de progresso: users/{uid}/courseProgress/{courseId}
  useEffect(() => {
    if (!user) return
    getDocs(collection(db, "users", user.uid, "courseProgress"))
      .then((snap) => {
        const map: Record<string, string[]> = {}
        snap.forEach((d) => {
          map[d.id] = (d.data().completedModules as string[]) ?? []
        })
        setProgress(map)
      })
      .catch((error) => console.error("Erro ao carregar progresso dos cursos:", error))
  }, [user])

  return (
    <>
      <PageHeader
        title="Academia do Professor"
        subtitle="Trilhas práticas, escritas para quem vai dar aula com a ferramenta amanhã."
        action={
          <span
            className={`rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider ${
              pro ? "bg-amber-100 text-amber-800" : "bg-muted text-muted-foreground"
            }`}
          >
            {pro ? "Todos os módulos liberados" : "1º módulo grátis"}
          </span>
        }
      />

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-56 animate-pulse rounded-2xl border bg-muted/40" />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const done = progress[course.id]?.length ?? 0
            const total = course.modules?.length ?? 0
            const freeCount = course.modules?.filter((m) => m.free).length ?? 0
            const pct = total > 0 ? Math.round((done / total) * 100) : 0

            if (course.comingSoon) {
              return (
                <div
                  key={course.id}
                  className="flex flex-col rounded-2xl border border-dashed bg-muted/30 p-6 opacity-70"
                >
                  <div className="mb-4 flex items-center justify-between">
                    {course.logo && (
                      <img src={`/${course.logo}`} alt="" className="h-10 w-10 object-contain grayscale" />
                    )}
                    <span className="rounded-full bg-muted px-3 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground">
                      Em breve
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-muted-foreground">{course.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{course.description}</p>
                </div>
              )
            }

            return (
              <a
                key={course.id}
                href={`/curso.html?id=${course.id}`}
                className="group flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="mb-4 flex items-center justify-between">
                  {course.logo && (
                    <img src={`/${course.logo}`} alt={course.tool ?? ""} className="h-10 w-10 object-contain" />
                  )}
                  <span className="rounded-full bg-sky-50 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-sky-700">
                    {course.level}
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold group-hover:text-primary">{course.title}</h3>
                <p className="mt-1 mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {course.description}
                </p>

                {done > 0 && (
                  <div className="mb-3">
                    <div className="mb-1 flex items-center justify-between text-xs font-semibold">
                      <span className="flex items-center gap-1 text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {done} de {total} módulos
                      </span>
                      <span className="text-muted-foreground">{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between border-t pt-3 text-[0.7rem] font-bold uppercase tracking-wide text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" />
                    {total} módulos
                  </span>
                  <span className={pro ? "text-emerald-600" : "flex items-center gap-1 text-amber-600"}>
                    {pro ? "Completo" : (
                      <>
                        <Lock className="h-3 w-3" />
                        {freeCount} grátis
                      </>
                    )}
                  </span>
                </div>
              </a>
            )
          })}
        </div>
      )}

      {!pro && !loading && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-primary px-7 py-6 text-primary-foreground">
          <div>
            <h2 className="font-display text-xl font-bold">Quer todas as trilhas completas?</h2>
            <p className="mt-1 text-sm text-primary-foreground/80">
              O plano PRO libera todos os módulos de todas as trilhas da Academia.
            </p>
          </div>
          <Button variant="secondary" asChild>
            <a href="/pricing.html">Ver planos</a>
          </Button>
        </div>
      )}
    </>
  )
}
