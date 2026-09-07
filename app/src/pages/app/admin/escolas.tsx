import { useState } from "react"
import { School, Check, Loader2, Wallet } from "lucide-react"
import { useAdmin } from "@/components/dashboard/admin-layout"
import { PageHeader, EmptyState } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

/**
 * Estados de uma escola.
 *
 * 'paid_pending_activation' é o que o pagamento gera: a escola já pagou,
 * mas a gestão de turmas continua fechada até alguém da equipe validar a
 * instituição. Essa espera é intencional — contrato com escola envolve
 * nota fiscal, dados de crianças e a quantidade de assentos combinada — e
 * é exatamente por isso que ela precisa aparecer em destaque aqui: uma
 * escola que pagou e ficou esquecida na fila é o pior resultado possível.
 */
const ESTADOS: Record<string, { rotulo: string; classe: string }> = {
  active: { rotulo: "Plano ativo", classe: "bg-emerald-100 text-emerald-800" },
  paid_pending_activation: { rotulo: "Pago — validar", classe: "bg-amber-100 text-amber-900" },
  demo: { rotulo: "Demonstração", classe: "bg-slate-100 text-slate-700" },
}

export function AdminEscolasPage() {
  const admin = useAdmin()
  const toast = useToast()
  const [salvando, setSalvando] = useState<string | null>(null)

  // Quem pagou e espera validação vem primeiro: é a única fila desta tela
  // com um prazo prometido ao cliente ("até um dia útil").
  const escolas = [...admin.schools].sort((a, b) => {
    const peso = (s: { plan?: string }) => (s.plan === "paid_pending_activation" ? 0 : 1)
    return peso(a) - peso(b)
  })
  const aguardando = escolas.filter((s) => s.plan === "paid_pending_activation").length

  async function mudarPlano(id: string, nome: string, destino: "demo" | "active") {
    setSalvando(id)
    try {
      await admin.setSchoolPlan(id, destino)
      if (destino === "active") {
        toast.sucesso("Contratação ativada", `${nome} já pode criar e editar turmas.`)
      } else {
        toast.sucesso("Escola voltou para demonstração", `${nome} perdeu o acesso à gestão de turmas.`)
      }
    } catch (err) {
      console.error("Não foi possível mudar o plano da escola:", err)
      toast.erro("Não foi possível mudar o plano", "Tente novamente em instantes.")
    } finally {
      setSalvando(null)
    }
  }

  return (
    <>
      <PageHeader title="Escolas" subtitle="Contratações, demonstrações e tamanho de cada instituição." />

      {aguardando > 0 && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4">
          <Wallet className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
          <p className="text-sm">
            <strong>
              {aguardando} {aguardando === 1 ? "escola pagou" : "escolas pagaram"} e{" "}
              {aguardando === 1 ? "aguarda" : "aguardam"} validação.
            </strong>{" "}
            <span className="text-muted-foreground">
              A gestão de turmas segue bloqueada até a ativação. Prometemos contato em até um dia útil.
            </span>
          </p>
        </div>
      )}

      {escolas.length === 0 ? (
        <EmptyState
          icon={<School className="h-6 w-6" />}
          title="Nenhuma escola cadastrada"
          description="As escolas aparecem aqui assim que a primeira instituição for criada."
        />
      ) : (
        <div className="grid gap-3">
          {escolas.map((s) => {
            const plano = s.plan ?? "demo"
            const ativa = plano === "active"
            const pagouEsperando = plano === "paid_pending_activation"
            const estado = ESTADOS[plano] ?? ESTADOS.demo
            const membros = admin.users.filter((u) => u.schoolId === s.id)
            const turmas = admin.classes.filter((c) => c.schoolId === s.id)
            const assentos = (s as { contractedSeats?: { professores: number; alunos: number } })
              .contractedSeats

            return (
              <div
                key={s.id}
                className={`rounded-2xl border bg-card p-5 ${
                  pagouEsperando ? "border-amber-300 ring-2 ring-amber-200" : ""
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 font-semibold">
                      {s.name || "Escola sem nome"}
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider ${estado.classe}`}
                      >
                        {estado.rotulo}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {membros.filter((u) => u.role === "student").length} alunos ·{" "}
                      {membros.filter((u) => u.role === "teacher" || u.role === "school_admin").length}{" "}
                      professores · {turmas.length} turmas
                      {s.studentCode && ` · código aluno ${s.studentCode}`}
                    </p>

                    {/* O que foi contratado e pago: sem isso, quem valida não
                        sabe por quantos assentos a escola pagou. */}
                    {assentos && (
                      <p className="mt-1.5 text-xs">
                        <span className="rounded-md bg-muted px-2 py-0.5 font-medium">
                          contratado: {assentos.professores} professores · {assentos.alunos} alunos
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    {!ativa && (
                      <Button
                        size="sm"
                        disabled={salvando === s.id}
                        onClick={() => mudarPlano(s.id, s.name ?? "A escola", "active")}
                      >
                        {salvando === s.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="h-4 w-4" />
                            {pagouEsperando ? "Validar e liberar" : "Ativar contratação"}
                          </>
                        )}
                      </Button>
                    )}
                    {ativa && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={salvando === s.id}
                        onClick={() => mudarPlano(s.id, s.name ?? "A escola", "demo")}
                      >
                        {salvando === s.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Voltar para demonstração"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Ativar a contratação libera a gestão de turmas para a escola. O bloqueio vale tanto na
        demonstração quanto no estado "pago — validar", e é aplicado pela regra do Firestore, não só
        pela interface: mesmo pagando, a escola só cria turmas depois desta ativação.
      </p>
    </>
  )
}
