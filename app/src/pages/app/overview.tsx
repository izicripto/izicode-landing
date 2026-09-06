import { Link } from "react-router-dom"
import {
  FolderKanban,
  ShieldCheck,
  CalendarDays,
  Sparkles,
  GraduationCap,
  Cpu,
  Users,
  Library,
  ArrowRight,
  Plus,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { isProUser } from "@/lib/roles"
import { useProjects } from "@/lib/use-projects"
import { PageHeader, StatCard, EmptyState } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"

const TOOLS = [
  {
    to: "/app/estudio",
    title: "Estúdio IA",
    desc: "Planos de aula, criação de conteúdo e o Assistente IA — tudo num lugar só.",
    cta: "Abrir estúdio",
    icon: Sparkles,
    color: "bg-sky-500",
  },
  {
    to: "/app/projetos",
    title: "Meus Projetos",
    desc: "Acesse e organize todos os roteiros criados pela IA ou salvos por você.",
    cta: "Gerenciar",
    icon: FolderKanban,
    color: "bg-indigo-500",
  },
  {
    to: "/app/academia",
    title: "Academia do Professor",
    desc: "Trilhas práticas de Arduino, Scratch e mais — primeiro módulo grátis.",
    cta: "Aprender",
    icon: GraduationCap,
    color: "bg-violet-600",
  },
  {
    to: "/app/arduino",
    title: "Arduino Hub",
    desc: "Projetos avançados de robótica com roteiros completos e passo a passo.",
    cta: "Explorar hub",
    icon: Cpu,
    color: "bg-amber-600",
  },
  {
    to: "/app/biblioteca",
    title: "Biblioteca",
    desc: "Projetos prontos da comunidade Izicode para adaptar às suas turmas.",
    cta: "Explorar",
    icon: Library,
    color: "bg-emerald-600",
  },
  {
    to: "/app/networking",
    title: "Networking",
    desc: "Comunidade de professores makers para trocar experiências e materiais.",
    cta: "Participar",
    icon: Users,
    color: "bg-rose-500",
  },
]

export function OverviewPage() {
  const { user, userData } = useAuth()
  const { projects, loading } = useProjects()
  const pro = isProUser(userData)

  const firstName = (userData?.displayName || user?.displayName || "Professor").split(" ")[0]
  const memberSince = userData?.createdAt?.toDate
    ? userData.createdAt.toDate().toLocaleDateString("pt-BR", { month: "short", year: "numeric" })
    : "—"

  return (
    <>
      <PageHeader
        title={
          <>
            Bem-vindo, <span className="text-primary">{firstName}</span>
          </>
        }
        subtitle="Suas ferramentas e projetos, num só lugar."
        action={
          <Button asChild>
            <Link to="/app/estudio">
              <Plus className="h-4 w-4" />
              Novo projeto com IA
            </Link>
          </Button>
        }
      />

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Projetos criados"
          value={loading ? "—" : projects.length}
          icon={<FolderKanban className="h-5 w-5" />}
        />
        <StatCard
          label="Plano atual"
          value={pro ? "PRO" : "Gratuito"}
          icon={<ShieldCheck className="h-5 w-5" />}
          tone="amber"
        />
        <StatCard
          label="Membro desde"
          value={memberSince}
          icon={<CalendarDays className="h-5 w-5" />}
          tone="emerald"
        />
      </div>

      <section className="mb-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Arsenal de Ferramentas</h2>
          <span
            className={`rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider ${
              pro ? "bg-amber-100 text-amber-800" : "bg-muted text-muted-foreground"
            }`}
          >
            {pro ? "Plano PRO" : "Plano Gratuito"}
          </span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.to}
                to={tool.to}
                className="group flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm ${tool.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-bold">{tool.title}</h3>
                <p className="mt-1 mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {tool.desc}
                </p>
                <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-extrabold uppercase tracking-wider text-primary transition-all group-hover:gap-2.5">
                  {tool.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Planejamentos recentes</h2>
          {projects.length > 0 && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/app/projetos">Ver todos</Link>
            </Button>
          )}
        </div>

        {loading ? (
          <div className="grid gap-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl border bg-muted/40" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={<Sparkles className="h-6 w-6" />}
            title="Seu arsenal está vazio"
            description="Crie planos de aula alinhados à BNCC e roteiros Arduino com o Estúdio IA."
            action={
              <Button asChild>
                <Link to="/app/estudio">Criar meu primeiro projeto</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-3">
            {projects.slice(0, 4).map((project) => (
              <Link
                key={project.id}
                to={`/app/projetos?id=${project.id}`}
                className="flex items-center justify-between gap-4 rounded-2xl border bg-card p-4 transition-colors hover:border-primary/40"
              >
                <div className="flex min-w-0 items-center gap-3">
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
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
