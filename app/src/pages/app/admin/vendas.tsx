import { ShieldCheck, School, TrendingUp } from "lucide-react"
import { useAdmin } from "@/components/dashboard/admin-layout"
import type { AdminUser } from "@/lib/use-admin"
import { PageHeader, StatCard } from "@/components/dashboard/page-header"

function nomeDe(u: AdminUser) {
  return u.displayName || u.name || u.email || u.id.slice(0, 8)
}

function ehPago(u: AdminUser) {
  return u.subscription?.plan === "pro" || u.role === "professor-pro" || u.role === "admin"
}

export function AdminVendasPage() {
  const admin = useAdmin()
  const m = admin.metricas
  const pagas = admin.users.filter(ehPago)

  return (
    <>
      <PageHeader title="Vendas" subtitle="Contas pagas e oportunidades em aberto." />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Contas pagas" value={m.pagantes} icon={<ShieldCheck className="h-5 w-5" />} tone="amber" />
        <StatCard
          label="Escolas contratadas"
          value={m.escolasAtivas}
          icon={<School className="h-5 w-5" />}
          tone="emerald"
        />
        <StatCard label="Oportunidades abertas" value={m.leadsNovos} icon={<TrendingUp className="h-5 w-5" />} />
      </div>

      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="mb-1 font-display text-lg font-bold">Contas pagas</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Quem hoje tem acesso PRO, seja por assinatura ou liberação manual.
        </p>

        {pagas.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma conta paga ainda.</p>
        ) : (
          <div className="divide-y">
            {pagas.map((u) => (
              <div key={u.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{nomeDe(u)}</p>
                  <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                </div>
                <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-amber-800">
                  {u.subscription?.provider ?? (u.role === "admin" ? "interno" : "manual")}
                </span>
              </div>
            ))}
          </div>
        )}

        <p className="mt-4 rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground">
          A receita por assinatura ainda não é registrada aqui: o checkout da AbacatePay precisa
          estar publicado para que os pagamentos apareçam automaticamente. Até lá, esta lista reflete
          as liberações feitas em Usuários.
        </p>
      </section>
    </>
  )
}
