import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { FolderKanban, Trash2, ArrowLeft, Printer, Sparkles, AlertCircle } from "lucide-react"
import { useProjects, type Project } from "@/lib/use-projects"
import { PageHeader, EmptyState } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"

/**
 * Markdown mínimo (títulos, listas, negrito, código) suficiente para os
 * planos que a IA devolve. Evita puxar uma lib inteira só para isso e
 * escapa o HTML antes de qualquer coisa, já que o conteúdo vem de fora.
 */
function renderMarkdown(md: string): string {
  const escaped = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

  return escaped
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^[-*] (.*)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>)(?!\s*<li>)/g, "<ul>$1</ul>")
    .split(/\n{2,}/)
    .map((block) => (block.trim().startsWith("<") ? block : `<p>${block.replace(/\n/g, "<br/>")}</p>`))
    .join("\n")
}

function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  const html = useMemo(() => renderMarkdown(project.content || ""), [project.content])

  return (
    <>
      <PageHeader
        title={project.title}
        subtitle={
          project.createdAt?.toDate
            ? `Salvo em ${project.createdAt.toDate().toLocaleDateString("pt-BR")}`
            : undefined
        }
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
          </div>
        }
      />
      <article
        className="prose-izicode rounded-2xl border bg-card p-6 shadow-sm sm:p-8"
        dangerouslySetInnerHTML={{ __html: html }}
      />
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
