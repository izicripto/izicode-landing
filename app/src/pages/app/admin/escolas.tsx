import { useState } from "react"
import { School, Check, Loader2 } from "lucide-react"
import { useAdmin } from "@/components/dashboard/admin-layout"
import { PageHeader, EmptyState } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"

export function AdminEscolasPage() {
  const admin = useAdmin()
  const [salvando, setSalvando] = useState<string | null>(null)

  return (
    <>
      <PageHeader title="Escolas" subtitle="Contratações, demonstrações e tamanho de cada instituição." />

      {admin.schools.length === 0 ? (
        <EmptyState
          icon={<School className="h-6 w-6" />}
          title="Nenhuma escola cadastrada"
          description="As escolas aparecem aqui assim que a primeira instituição for criada."
        />
      ) : (
        <div className="grid gap-3">
          {admin.schools.map((s) => {
            const ativa = s.plan === "active"
            const membros = admin.users.filter((u) => u.schoolId === s.id)
            const turmas = admin.classes.filter((c) => c.schoolId === s.id)
            return (
              <div key={s.id} className="rounded-2xl border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 font-semibold">
                      {s.name || "Escola sem nome"}
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider ${
                          ativa ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {ativa ? "Plano ativo" : "Demonstração"}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {membros.filter((u) => u.role === "student").length} alunos ·{" "}
                      {membros.filter((u) => u.role === "teacher" || u.role === "school_admin").length} professores ·{" "}
                      {turmas.length} turmas
                      {s.studentCode && ` · código aluno ${s.studentCode}`}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant={ativa ? "outline" : "default"}
                    disabled={salvando === s.id}
                    onClick={async () => {
                      setSalvando(s.id)
                      try {
                        await admin.setSchoolPlan(s.id, ativa ? "demo" : "active")
                      } catch (err) {
                        console.error("Não foi possível mudar o plano da escola:", err)
                      } finally {
                        setSalvando(null)
                      }
                    }}
                  >
                    {salvando === s.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : ativa ? (
                      "Voltar para demonstração"
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Ativar contratação
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Ativar a contratação libera a gestão de turmas para a escola. O bloqueio do modo demonstração
        é aplicado pela regra do Firestore, não só pela interface.
      </p>
    </>
  )
}
