import { Link } from "react-router-dom"
import { Trophy, Flame, Award, Gamepad2, Library, Bot, Cpu, Users } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useChildren } from "@/lib/use-children"
import { PageHeader, StatCard } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"

const LEVELS = [
  { level: 1, name: "Explorador Iniciante", minXP: 0 },
  { level: 2, name: "Explorador Digital", minXP: 100 },
  { level: 3, name: "Programador Júnior", minXP: 300 },
  { level: 4, name: "Construtor Maker", minXP: 600 },
  { level: 5, name: "Mestre da Robótica", minXP: 1000 },
]

function levelFor(xp: number) {
  const current = [...LEVELS].reverse().find((l) => xp >= l.minXP) ?? LEVELS[0]
  const next = LEVELS[LEVELS.indexOf(current) + 1]
  const span = next ? next.minXP - current.minXP : 1
  const progress = next ? Math.round(((xp - current.minXP) / span) * 100) : 100
  return { current, next, progress }
}

const QUICK_LINKS = [
  { href: "/app/quiz", label: "Quiz Arena", icon: Gamepad2, color: "bg-violet-600" },
  { href: "/app/tutor", label: "Tutor IA", icon: Bot, color: "bg-teal-600" },
  { href: "/app/ranking", label: "Ranking", icon: Trophy, color: "bg-amber-500" },
  { href: "/app/biblioteca", label: "Biblioteca", icon: Library, color: "bg-sky-500" },
  { href: "/app/arduino", label: "Projetos", icon: Cpu, color: "bg-orange-600" },
]

export function AlunoPage() {
  const { user, userData } = useAuth()
  const kids = useChildren()

  // Conta de responsável: o progresso não fica no doc do titular, e sim
  // no perfil da criança escolhida como ativa (LGPD — o responsável é o
  // titular, a criança não tem login próprio). Antes o painel mostrava
  // sempre o primeiro filho, então quem tinha dois ficava preso no
  // primeiro sem nenhuma forma de trocar.
  const child = kids.isParent ? kids.activeChild : null

  const stats = child
    ? {
        xp: child.xp ?? 0,
        badges: (child.badges ?? []).length,
        challenges: child.challengesCompleted ?? 0,
      }
    : {
        xp: userData?.xp ?? 0,
        badges: (userData?.badges ?? []).length,
        challenges: userData?.challengesCompleted ?? 0,
      }

  const { current, next, progress } = levelFor(stats.xp)
  const displayName = child?.name || userData?.displayName || user?.displayName || "Explorador"

  return (
    <>
      <PageHeader
        title={`Olá, ${displayName.split(" ")[0]}!`}
        subtitle="Sua jornada de aprendizado continua."
        action={
          kids.isParent ? (
            <Button variant="outline" size="sm" asChild>
              <Link to="/app/filhos">
                <Users className="h-4 w-4" />
                Perfis
              </Link>
            </Button>
          ) : undefined
        }
      />

      {kids.isParent && kids.children.length > 1 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Perfil
          </span>
          {kids.children.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => kids.selectChild(c.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                c.id === kids.activeId
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      <section className="mb-8 rounded-3xl bg-gradient-to-br from-sky-500 via-violet-600 to-fuchsia-600 p-7 text-white shadow-lg">
        <p className="text-sm text-white/75">Nível {current.level}</p>
        <h2 className="font-display text-3xl font-extrabold">{current.name}</h2>

        <div className="mt-5">
          <div className="mb-2 flex justify-between text-sm">
            <span>{stats.xp} XP</span>
            <span>{progress}% para o próximo nível</span>
          </div>
          <div className="h-3.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-100 transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-white/70">
            {next ? `Faltam ${next.minXP - stats.xp} XP para ${next.name}` : "Nível máximo alcançado!"}
          </p>
        </div>
      </section>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Desafios completos" value={stats.challenges} icon={<Trophy className="h-5 w-5" />} />
        <StatCard label="Badges conquistados" value={stats.badges} icon={<Award className="h-5 w-5" />} tone="amber" />
        <StatCard label="XP total" value={stats.xp} icon={<Flame className="h-5 w-5" />} tone="violet" />
      </div>

      <section>
        <h2 className="mb-4 font-display text-xl font-bold">Acesso rápido</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                to={link.href}
                className="group flex flex-col items-center gap-3 rounded-2xl border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white ${link.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <strong className="text-sm">{link.label}</strong>
              </Link>
            )
          })}
        </div>
      </section>
    </>
  )
}
