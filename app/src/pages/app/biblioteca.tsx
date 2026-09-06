import { useEffect, useMemo, useState } from "react"
import { Library, Search } from "lucide-react"
import { loadProjects, type LegacyProject } from "@/lib/legacy-data"
import { PageHeader, EmptyState } from "@/components/dashboard/page-header"

export function BibliotecaPage() {
  const [projects, setProjects] = useState<LegacyProject[]>([])
  const [loading, setLoading] = useState(true)
  const [term, setTerm] = useState("")
  const [tool, setTool] = useState("Todas")

  useEffect(() => {
    loadProjects().then((all) => {
      setProjects(all)
      setLoading(false)
    })
  }, [])

  const tools = useMemo(
    () => ["Todas", ...new Set(projects.flatMap((p) => p.tools ?? []))],
    [projects]
  )

  const visible = useMemo(() => {
    const q = term.trim().toLowerCase()
    return projects.filter((p) => {
      const matchesTool = tool === "Todas" || p.tools?.includes(tool)
      const matchesTerm =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q)
      return matchesTool && matchesTerm
    })
  }, [projects, term, tool])

  return (
    <>
      <PageHeader
        title="Biblioteca de Projetos"
        subtitle="Projetos prontos para adaptar às suas turmas, de Scratch a Arduino."
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Buscar por título ou tema..."
            className="w-full rounded-xl border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
          />
        </div>
        <select
          value={tool}
          onChange={(e) => setTool(e.target.value)}
          className="rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
        >
          {tools.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl border bg-muted/40" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<Library className="h-6 w-6" />}
          title="Nada encontrado"
          description="Tente outro termo de busca ou remova o filtro de ferramenta."
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            {visible.length} {visible.length === 1 ? "projeto" : "projetos"}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((project) => (
              <a
                key={project.id}
                href={`/project-view.html?id=${project.id}`}
                className="group flex flex-col rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {project.tools?.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-sky-50 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-sky-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="font-display font-bold group-hover:text-primary">{project.title}</h3>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
                {project.difficulty && (
                  <p className="mt-3 border-t pt-3 text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
                    {project.difficulty}
                  </p>
                )}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  )
}
