import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { School, Users, GraduationCap, Sparkles, AlertTriangle, ArrowRight } from "lucide-react"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { PageHeader, StatCard } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"

interface SchoolDoc {
  name?: string
  plan?: string
  studentCode?: string
  teacherCode?: string
}

export function EscolaPage() {
  const { user, userData } = useAuth()
  const [school, setSchool] = useState<SchoolDoc | null>(null)
  const [counts, setCounts] = useState({ teachers: 0, students: 0, classes: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const schoolId = userData?.schoolId
      if (!user || !schoolId) {
        setLoading(false)
        return
      }

      try {
        const [schoolSnap, usersSnap, classesSnap] = await Promise.all([
          getDoc(doc(db, "schools", schoolId)),
          getDocs(query(collection(db, "users"), where("schoolId", "==", schoolId))),
          getDocs(query(collection(db, "classes"), where("schoolId", "==", schoolId))),
        ])

        if (schoolSnap.exists()) setSchool(schoolSnap.data() as SchoolDoc)

        let teachers = 0
        let students = 0
        usersSnap.forEach((d) => {
          const r = d.data().role
          if (r === "student") students += 1
          else if (r === "teacher" || r === "school_admin") teachers += 1
        })
        setCounts({ teachers, students, classes: classesSnap.size })
      } catch (error) {
        console.error("Erro ao carregar dados da escola:", error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user, userData])

  const isDemo = school?.plan !== "active"

  if (!loading && !userData?.schoolId) {
    return (
      <>
        <PageHeader title="Painel da Escola" subtitle="Gestão de turmas, professores e alunos." />
        <div className="rounded-2xl border border-dashed bg-card/50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <School className="h-6 w-6" />
          </div>
          <h2 className="font-display text-lg font-bold">Nenhuma escola vinculada</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Sua conta ainda não está ligada a uma instituição. Use o código fornecido pela escola no
            onboarding, ou fale com a gente para criar o acesso institucional.
          </p>
          <Button className="mt-5" asChild>
            <a href="/contact.html">Falar com a equipe</a>
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title={school?.name ? `Escola ${school.name}` : "Painel da Escola"}
        subtitle="Gestão de turmas, professores e alunos."
        action={
          isDemo && !loading ? (
            <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-amber-800">
              <AlertTriangle className="h-3.5 w-3.5" />
              Modo demonstração
            </span>
          ) : (
            <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-emerald-800">
              Plano ativo
            </span>
          )
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Professores"
          value={loading ? "—" : counts.teachers}
          icon={<GraduationCap className="h-5 w-5" />}
        />
        <StatCard
          label="Alunos"
          value={loading ? "—" : counts.students}
          icon={<Users className="h-5 w-5" />}
          tone="emerald"
        />
        <StatCard
          label="Turmas"
          value={loading ? "—" : counts.classes}
          icon={<School className="h-5 w-5" />}
          tone="violet"
        />
      </div>

      {isDemo && !loading && (
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="mb-2 flex items-center gap-2 text-amber-900">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="font-display text-lg font-bold">Acesso de demonstração</h2>
          </div>
          <p className="text-sm text-amber-900/80">
            Nesse modo você navega por todas as ferramentas, mas a criação e edição de turmas fica
            bloqueada. Ao contratar o pacote Escola (cobrado por professores + alunos), o
            gerenciamento de turmas é liberado automaticamente.
          </p>
          <Button className="mt-4" asChild>
            <a href="/contact.html">Contratar plano Escola</a>
          </Button>
        </div>
      )}

      <section>
        <h2 className="mb-4 font-display text-xl font-bold">Ferramentas da escola</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="/school-management.html"
            className="group flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 text-white">
              <School className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold">Gestão Escolar</h3>
            <p className="mt-1 mb-4 flex-1 text-sm text-muted-foreground">
              Turmas, códigos de acesso e vínculo de professores e alunos.
            </p>
            <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-extrabold uppercase tracking-wider text-primary group-hover:gap-2.5">
              Abrir <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </a>

          <Link
            to="/app/estudio"
            className="group flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold">Estúdio IA</h3>
            <p className="mt-1 mb-4 flex-1 text-sm text-muted-foreground">
              Planos de aula alinhados à BNCC para toda a equipe docente.
            </p>
            <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-extrabold uppercase tracking-wider text-primary group-hover:gap-2.5">
              Abrir <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>

          <Link
            to="/app/academia"
            className="group flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-600 text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold">Academia do Professor</h3>
            <p className="mt-1 mb-4 flex-1 text-sm text-muted-foreground">
              Formação continuada da equipe em Arduino, Scratch e cultura maker.
            </p>
            <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-extrabold uppercase tracking-wider text-primary group-hover:gap-2.5">
              Abrir <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </section>
    </>
  )
}
