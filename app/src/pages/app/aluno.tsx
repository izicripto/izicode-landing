import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { Trophy, Flame, Award, Gamepad2, Library, Bot, Cpu } from "lucide-react"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { PageHeader, StatCard } from "@/components/dashboard/page-header"

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
  { href: "/quiz-arena.html", label: "Quiz Arena", icon: Gamepad2, color: "bg-violet-600" },
  { href: "/app/biblioteca", label: "Biblioteca", icon: Library, color: "bg-sky-500" },
  { href: "/student-ai.html", label: "Tutor IA", icon: Bot, color: "bg-teal-600" },
  { href: "/app/arduino", label: "Projetos", icon: Cpu, color: "bg-amber-600" },
]

export function AlunoPage() {
  const { user, userData, role } = useAuth()
  const [childName, setChildName] = useState<string | null>(null)
  const [stats, setStats] = useState({ xp: 0, badges: 0, challenges: 0 })

  useEffect(() => {
    async function load() {
      if (!user) return

      // Conta de responsável: o progresso não fica no doc do titular, e
      // sim no perfil da criança vinculado (LGPD — o responsável é o
      // titular dos dados, a criança não tem login próprio).
      if (role === "parent") {
        const snap = await getDocs(collection(db, "users", user.uid, "children"))
        if (!snap.empty) {
          const child = snap.docs[0].data()
          setChildName((child.name as string) ?? null)
          setStats({
            xp: (child.xp as number) ?? 0,
            badges: ((child.badges as string[]) ?? []).length,
            challenges: (child.challengesCompleted as number) ?? 0,
          })
          return
        }
      }

      setStats({
        xp: userData?.xp ?? 0,
        badges: (userData?.badges ?? []).length,
        challenges: userData?.challengesCompleted ?? 0,
      })
    }
    load().catch((error) => console.error("Erro ao carregar progresso:", error))
  }, [user, userData, role])

  const { current, next, progress } = levelFor(stats.xp)
  const displayName = childName || userData?.displayName || user?.displayName || "Explorador"

  return (
    <>
      <PageHeader
        title={`Olá, ${displayName.split(" ")[0]}!`}
        subtitle="Sua jornada de aprendizado continua."
      />

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
              <a
                key={link.href}
                href={link.href}
                className="group flex flex-col items-center gap-3 rounded-2xl border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white ${link.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <strong className="text-sm">{link.label}</strong>
              </a>
            )
          })}
        </div>
      </section>
    </>
  )
}
