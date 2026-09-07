import { Users, School, ShieldCheck, LifeBuoy, RefreshCw, Loader2 } from "lucide-react"
import { useAdmin } from "@/components/dashboard/admin-layout"
import { ROLE_LABELS } from "@/lib/roles"
import { PageHeader, StatCard } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"

export function AdminVisaoPage() {
  const admin = useAdmin()
  const m = admin.metricas

  return (
    <>
      <PageHeader
        title="Visão geral da plataforma"
        subtitle="Onde a operação está agora, em números."
        action={
          <Button variant="outline" size="sm" onClick={admin.reload} disabled={admin.loading}>
            {admin.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Atualizar
          </Button>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Usuários" value={m.totalUsuarios} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Contas pagas" value={m.pagantes} icon={<ShieldCheck className="h-5 w-5" />} tone="amber" />
        <StatCard
          label="Escolas ativas"
          value={`${m.escolasAtivas}/${m.totalEscolas}`}
          icon={<School className="h-5 w-5" />}
          tone="emerald"
        />
        <StatCard label="Leads novos" value={m.leadsNovos} icon={<LifeBuoy className="h-5 w-5" />} tone="violet" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-display text-lg font-bold">Usuários por papel</h2>
          {Object.keys(m.porPapel).length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum usuário cadastrado ainda.</p>
          ) : (
            <div className="space-y-2.5">
              {Object.entries(m.porPapel)
                .sort((a, b) => b[1] - a[1])
                .map(([papel, qtd]) => {
                  const pct = m.totalUsuarios ? (qtd / m.totalUsuarios) * 100 : 0
                  return (
                    <div key={papel}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium">{ROLE_LABELS[papel] ?? papel}</span>
                        <span className="tabular-nums text-muted-foreground">{qtd}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </section>

        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-display text-lg font-bold">Uso da plataforma</h2>
          <dl className="space-y-3 text-sm">
            {(
              [
                ["Turmas criadas", m.totalTurmas],
                ["Alunos vinculados a turmas", m.alunosEmTurmas],
                ["Usuários ligados a uma escola", m.comEscola],
                ["Escolas em demonstração", m.escolasDemo],
                ["Total de leads recebidos", m.totalLeads],
              ] as const
            ).map(([rotulo, valor]) => (
              <div key={rotulo} className="flex items-center justify-between border-b pb-2 last:border-0">
                <dt className="text-muted-foreground">{rotulo}</dt>
                <dd className="font-display text-lg font-bold tabular-nums">{valor}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Os dados vêm direto do Firestore, limitados a 500 registros por coleção.
      </p>
    </>
  )
}
