import { useEffect, useState } from "react"
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore"
import { Trophy, School, Loader2, AlertCircle, Medal } from "lucide-react"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { PageHeader, EmptyState } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"

interface RankedUser {
  uid?: string
  displayName?: string
  name?: string
  email?: string
  xp?: number
  photoURL?: string
}

const MEDAL_STYLES = [
  "bg-gradient-to-br from-amber-100 to-amber-50 border-amber-300",
  "bg-gradient-to-br from-slate-100 to-slate-50 border-slate-300",
  "bg-gradient-to-br from-orange-100 to-orange-50 border-orange-300",
]
const MEDAL_TEXT = ["text-amber-700", "text-slate-600", "text-orange-700"]

export function RankingPage() {
  const { user, userData } = useAuth()
  const [students, setStudents] = useState<RankedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const schoolId = userData?.schoolId

  useEffect(() => {
    async function load() {
      if (!user) return
      if (!schoolId) {
        setLoading(false)
        return
      }
      try {
        // As regras do Firestore só liberam leitura de outros usuários da
        // mesma escola — por isso o filtro por schoolId é obrigatório aqui,
        // não é só um recorte de produto.
        const snap = await getDocs(
          query(
            collection(db, "users"),
            where("schoolId", "==", schoolId),
            orderBy("xp", "desc"),
            limit(50)
          )
        )
        setStudents(snap.docs.map((d) => ({ uid: d.id, ...(d.data() as RankedUser) })))
      } catch (err) {
        console.error("Erro ao carregar ranking:", err)
        setError("Não foi possível carregar o ranking agora.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user, schoolId])

  const myIndex = students.findIndex((s) => s.uid === user?.uid)

  if (!loading && !schoolId) {
    return (
      <>
        <PageHeader title="Ranking" subtitle="Veja como está sua turma." />
        <EmptyState
          icon={<School className="h-6 w-6" />}
          title="Ranking disponível para turmas"
          description="O ranking compara o XP entre colegas da mesma escola. Assim que sua conta estiver vinculada a uma turma, ele aparece aqui."
          action={
            <Button variant="outline" asChild>
              <a href="/onboarding.html">Usar código da escola</a>
            </Button>
          }
        />
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Ranking da Turma"
        subtitle="Top 50 por XP entre os colegas da sua escola."
        action={
          myIndex >= 0 ? (
            <span className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
              Você está em {myIndex + 1}º
            </span>
          ) : undefined
        }
      />

      {error && (
        <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Carregando ranking...
        </div>
      ) : students.length === 0 ? (
        <EmptyState
          icon={<Trophy className="h-6 w-6" />}
          title="Ainda sem pontuação"
          description="Assim que a turma começar a completar desafios e quizzes, o ranking aparece aqui."
        />
      ) : (
        <div className="space-y-2">
          {students.map((student, i) => {
            const isMe = student.uid === user?.uid
            const name = student.displayName || student.name || "Explorador"
            const xp = student.xp ?? 0
            const level = Math.floor(xp / 1000) + 1

            return (
              <div
                key={student.uid ?? i}
                className={`flex items-center gap-4 rounded-2xl border p-4 transition-colors ${
                  i < 3 ? MEDAL_STYLES[i] : "bg-card"
                } ${isMe ? "ring-2 ring-primary ring-offset-2" : ""}`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-lg font-extrabold ${
                    i < 3 ? MEDAL_TEXT[i] : "text-muted-foreground"
                  }`}
                >
                  {i < 3 ? <Medal className="h-6 w-6" /> : i + 1}
                </div>

                {student.photoURL ? (
                  <img src={student.photoURL} alt="" className="h-10 w-10 shrink-0 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-sm font-bold text-muted-foreground">
                    {name.slice(0, 2).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">
                    {name}
                    {isMe && <span className="ml-2 text-xs font-bold text-primary">você</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">Nível {level}</p>
                </div>

                <span className="shrink-0 font-display font-bold tabular-nums text-primary">
                  {xp.toLocaleString("pt-BR")} XP
                </span>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
