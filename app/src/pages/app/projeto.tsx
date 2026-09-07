import { useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Clock, GraduationCap, Target, Loader2, ExternalLink, Printer } from "lucide-react"
import { loadProjects, type LegacyProject } from "@/lib/legacy-data"
import { Markdown } from "@/components/dashboard/markdown"
import { Button } from "@/components/ui/button"

interface FullProject extends LegacyProject {
  content?: string
  grade?: string
  ods?: string
  bncc?: string[]
  hacksterLink?: string
  teacherGuide?: {
    objective?: string
    skills?: string[]
    assessment?: string
  }
}

export function ProjetoPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<FullProject | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects().then((all) => {
      setProject((all.find((p) => p.id === projectId) as FullProject) ?? null)
      setLoading(false)
    })
  }, [projectId])

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Carregando projeto...
      </div>
    )
  }

  if (!project) {
    return (
      <div className="rounded-2xl border border-dashed bg-card/50 p-10 text-center">
        <h2 className="font-display text-lg font-bold">Projeto não encontrado</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Esse roteiro pode ter sido renomeado ou removido da biblioteca.
        </p>
        <Button className="mt-5" asChild>
          <Link to="/app/biblioteca">Ver a biblioteca</Link>
        </Button>
      </div>
    )
  }

  const guide = project.teacherGuide

  return (
    <>
      <Button variant="ghost" size="sm" className="-ml-2 mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>

      <header className="mb-7">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {project.tools?.map((tool) => (
            <span
              key={tool}
              className="rounded-md bg-sky-50 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-sky-700"
            >
              {tool}
            </span>
          ))}
          {project.difficulty && (
            <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-amber-700">
              {project.difficulty}
            </span>
          )}
        </div>

        <h1 className="font-display text-3xl font-extrabold tracking-tight text-balance">
          {project.title}
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {project.duration && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {project.duration}
            </span>
          )}
          {project.grade && (
            <span className="flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4" />
              {project.grade}
            </span>
          )}
          {project.ods && (
            <span className="flex items-center gap-1.5">
              <Target className="h-4 w-4" />
              {project.ods}
            </span>
          )}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
        <article className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <Markdown content={project.content ?? ""} />

          <div className="mt-8 flex flex-wrap gap-2 border-t pt-6">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              Imprimir roteiro
            </Button>
            {project.hacksterLink && (
              <Button variant="outline" asChild>
                <a href={project.hacksterLink} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Referência externa
                </a>
              </Button>
            )}
          </div>
        </article>

        <aside className="space-y-4 lg:sticky lg:top-6">
          {guide && (
            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <h2 className="font-display font-bold">Guia do professor</h2>
              {guide.objective && (
                <div className="mt-3">
                  <p className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
                    Objetivo
                  </p>
                  <p className="mt-1 text-sm">{guide.objective}</p>
                </div>
              )}
              {guide.skills && guide.skills.length > 0 && (
                <div className="mt-4">
                  <p className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
                    Competências
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {guide.skills.map((skill) => (
                      <span key={skill} className="rounded-md bg-muted px-2 py-0.5 text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {guide.assessment && (
                <div className="mt-4">
                  <p className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
                    Avaliação
                  </p>
                  <p className="mt-1 text-sm">{guide.assessment}</p>
                </div>
              )}
            </div>
          )}

          {project.bncc && project.bncc.length > 0 && (
            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <h2 className="font-display font-bold">Habilidades BNCC</h2>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {project.bncc.map((code) => (
                  <span
                    key={code}
                    className="rounded-md bg-emerald-50 px-2 py-1 font-mono text-xs font-semibold text-emerald-800"
                  >
                    {code}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </>
  )
}
