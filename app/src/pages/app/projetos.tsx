import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  FolderKanban,
  Trash2,
  ArrowLeft,
  Printer,
  Sparkles,
  AlertCircle,
  Users,
  Shapes,
  Target,
  ListTree,
} from "lucide-react"
import { useProjects, type Project } from "@/lib/use-projects"
import { PageHeader, EmptyState } from "@/components/dashboard/page-header"
import { Markdown, extractHeadings } from "@/components/dashboard/markdown"
import { Button } from "@/components/ui/button"

function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  const headings = useMemo(() => extractHeadings(project.content ?? ""), [project.content])
  const savedAt = project.createdAt?.toDate?.().toLocaleDateString("pt-BR")

  return (
    <>
      {/* Barra de ações da tela — fora da impressão. */}
      <div className="mb-5 flex items-center justify-between gap-2 print:hidden">
        <Button variant="ghost" size="sm" className="-ml-2" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          Imprimir roteiro
        </Button>
      </div>

      {/* Capa da impressão: só aparece no papel. */}
      <div className="mb-6 hidden print:block">
        <p className="text-xs font-bold uppercase tracking-[0.18em]">
          Izicode Edu — Roteiro de aula
        </p>
        <h1 className="mt-2 text-3xl font-extrabold">{project.title}</h1>
        <p className="mt-1 text-sm">
          {[project.target, savedAt ? `Salvo em ${savedAt}` : null]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>

      {/* Cabeçalho do roteiro (tela). */}
      <header className="mb-6 print:hidden">
        {project.type && (
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-sky-800">
            <Shapes className="h-3.5 w-3.5" />
            {project.type}
          </span>
        )}
        <h1 className="font-display max-w-4xl text-3xl font-extrabold tracking-tight text-balance">
          {project.title}
        </h1>
        {savedAt && <p className="mt-1.5 text-sm text-muted-foreground">Salvo em {savedAt}</p>}
      </header>

      {/* Ficha do planejamento: o contexto que a IA recebeu (tela + papel). */}
      {(project.target || project.objective) && (
        <section aria-label="Ficha do planejamento" className="mb-6 grid gap-3 sm:grid-cols-2">
          {project.target && (
            <div className="flex items-start gap-3 rounded-2xl border bg-card p-4 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <Users className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
                  Público-alvo
                </p>
                <p className="mt-0.5 text-sm font-medium">{project.target}</p>
              </div>
            </div>
          )}
          {project.objective && (
            <div className="flex items-start gap-3 rounded-2xl border bg-card p-4 shadow-sm sm:col-span-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Target className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
                  Objetivo pedagógico
                </p>
                <p className="mt-0.5 text-sm leading-relaxed">{project.objective}</p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Índice colapsável no mobile (o fixo fica na lateral no desktop). */}
      {headings.length > 1 && (
        <details className="mb-5 rounded-2xl border bg-card px-4 py-3 shadow-sm lg:hidden print:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold">
            <ListTree className="h-4 w-4 text-muted-foreground" />
            Neste roteiro ({headings.length} seções)
          </summary>
          <nav aria-label="Índice do roteiro" className="mt-2 space-y-0.5 pb-1">
            {headings.map((h) => (
              <a
                key={h.id}
                href={`#${h.id}`}
                className="block rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                style={{ paddingLeft: `${0.5 + (h.level - 1) * 0.9}rem` }}
              >
                {h.text}
              </a>
            ))}
          </nav>
        </details>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <article className="print-area min-w-0 rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <Markdown content={project.content ?? ""} />
        </article>

        <aside className="hidden lg:block print:hidden">
          <div className="sticky top-6 space-y-4">
            {headings.length > 1 && (
              <nav
                aria-label="Índice do roteiro"
                className="rounded-2xl border bg-card p-5 shadow-sm"
              >
                <p className="flex items-center gap-2 font-display text-sm font-bold">
                  <ListTree className="h-4 w-4 text-muted-foreground" />
                  Neste roteiro
                </p>
                <div className="mt-3 space-y-0.5">
                  {headings.map((h) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      className="block rounded-lg px-2 py-1.5 text-[0.83rem] leading-snug text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      style={{ paddingLeft: `${0.5 + (h.level - 1) * 0.75}rem` }}
                    >
                      {h.text}
                    </a>
                  ))}
                </div>
              </nav>
            )}

            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <p className="font-display text-sm font-bold">Levar para a sala</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                A impressão sai limpa: sem menus nem botões, com tabelas e códigos
                formatados para papel.
              </p>
              <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => window.print()}>
                <Printer className="h-4 w-4" />
                Imprimir roteiro
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}

export function ProjetosPage() {
  const { projects, loading, error, removeProject } = useProjects()
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedId = searchParams.get("id")
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  const selected = projects.find((p) => p.id === selectedId)

  // Se o projeto aberto for excluído (ou o id da URL não existir mais),
  // volta para a lista em vez de deixar a tela vazia sem explicação.
  useEffect(() => {
    if (selectedId && !loading && !selected) {
      setSearchParams({}, { replace: true })
    }
  }, [selectedId, selected, loading, setSearchParams])

  if (selected) {
    return <ProjectDetail project={selected} onBack={() => setSearchParams({})} />
  }

  return (
    <>
      <PageHeader
        title="Meus Projetos"
        subtitle="Planejamentos e conteúdos que você criou ou salvou."
        action={
          <Button asChild>
            <Link to="/app/estudio">
              <Sparkles className="h-4 w-4" />
              Novo com IA
            </Link>
          </Button>
        }
      />

      {error && (
        <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl border bg-muted/40" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="h-6 w-6" />}
          title="Nenhum projeto ainda"
          description="Use o Estúdio IA para gerar seu primeiro plano de aula alinhado à BNCC."
          action={
            <Button asChild>
              <Link to="/app/estudio">Criar meu primeiro projeto</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between gap-4 rounded-2xl border bg-card p-4 transition-colors hover:border-primary/40"
            >
              <Link
                to={`/app/projetos?id=${project.id}`}
                className="flex min-w-0 flex-1 items-center gap-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                  <FolderKanban className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{project.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {project.createdAt?.toDate
                      ? `Salvo em ${project.createdAt.toDate().toLocaleDateString("pt-BR")}`
                      : "Recentemente"}
                  </p>
                </div>
              </Link>

              {pendingDelete === project.id ? (
                <div className="flex shrink-0 items-center gap-2">
                  <span className="hidden text-xs text-muted-foreground sm:inline">Excluir?</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => {
                      await removeProject(project.id)
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
                  onClick={() => setPendingDelete(project.id)}
                  aria-label={`Excluir ${project.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
