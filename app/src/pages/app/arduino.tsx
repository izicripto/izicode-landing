import { useEffect, useMemo, useState } from "react"
import { Cpu, Clock, ExternalLink } from "lucide-react"
import { loadProjects, type LegacyProject } from "@/lib/legacy-data"
import { PageHeader, EmptyState } from "@/components/dashboard/page-header"

const DIFFICULTY_TONE: Record<string, string> = {
  "Básico": "bg-emerald-100 text-emerald-800",
  "Intermediário": "bg-amber-100 text-amber-800",
  "Avançado": "bg-rose-100 text-rose-800",
}

export function ArduinoPage() {
  const [projects, setProjects] = useState<LegacyProject[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("Todos")

  useEffect(() => {
    loadProjects().then((all) => {
      setProjects(
        all.filter(
          (p) =>
            p.tools?.includes("Arduino") ||
            p.tools?.includes("IoT Cloud") ||
            p.id.includes("arduino")
        )
      )
      setLoading(false)
    })
  }, [])

  const levels = useMemo(
    () => ["Todos", ...new Set(projects.map((p) => p.difficulty).filter(Boolean) as string[])],
    [projects]
  )

  const visible = filter === "Todos" ? projects : projects.filter((p) => p.difficulty === filter)

  return (
    <>
      <PageHeader
        title="Arduino Hub"
        subtitle="Roteiros técnicos completos: do protótipo à nuvem, passo a passo."
      />

      {levels.length > 2 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {levels.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setFilter(level)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                filter === level
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl border bg-muted/40" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<Cpu className="h-6 w-6" />}
          title="Nenhum projeto nesse nível"
          description="Escolha outro nível de dificuldade para ver os roteiros disponíveis."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <a
              key={project.id}
              href={`/project-view.html?id=${project.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              <div className="relative flex h-40 items-center justify-center overflow-hidden bg-muted">
                {project.image ? (
                  <img
                    src={project.image.startsWith("http") ? project.image : `/images/${project.image.replace(/^\/?images\//, "")}`}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      // Alguns roteiros ainda não têm foto própria: cai no
                      // ícone do Arduino em vez de mostrar imagem quebrada.
                      e.currentTarget.style.display = "none"
                    }}
                  />
                ) : (
                  <Cpu className="h-10 w-10 text-muted-foreground/40" />
                )}
                {project.difficulty && (
                  <span
                    className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider ${
                      DIFFICULTY_TONE[project.difficulty] ?? "bg-muted text-muted-foreground"
                    }`}
                  >
                    {project.difficulty}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-bold group-hover:text-primary">
                  {project.title}
                </h3>
                <p className="mt-1 mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>

                <div className="flex items-center justify-between border-t pt-3">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tools?.slice(0, 2).map((tool) => (
                      <span
                        key={tool}
                        className="rounded-md bg-sky-50 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-sky-700"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    {project.duration ? (
                      <>
                        <Clock className="h-3.5 w-3.5" />
                        {project.duration}
                      </>
                    ) : (
                      <ExternalLink className="h-3.5 w-3.5" />
                    )}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </>
  )
}
