import { useMemo, useState } from "react"
import {
  Users,
  School,
  ShieldCheck,
  TrendingUp,
  LifeBuoy,
  Search,
  RefreshCw,
  Loader2,
  AlertCircle,
  Check,
  Trash2,
  GraduationCap,
  Wallet,
  Lock,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { isPlatformOwner, ROLE_LABELS } from "@/lib/roles"
import { useAdminData, type AdminUser } from "@/lib/use-admin"
import { PageHeader, StatCard, EmptyState } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"

type Aba = "visao" | "usuarios" | "escolas" | "vendas" | "suporte"

const ABAS: { id: Aba; label: string; icon: typeof Users }[] = [
  { id: "visao", label: "Visão geral", icon: TrendingUp },
  { id: "usuarios", label: "Usuários", icon: Users },
  { id: "escolas", label: "Escolas", icon: School },
  { id: "vendas", label: "Vendas", icon: Wallet },
  { id: "suporte", label: "Suporte", icon: LifeBuoy },
]

const PAPEIS = [
  "student",
  "parent",
  "teacher",
  "freelance_teacher",
  "professor-pro",
  "school_admin",
  "consultant",
  "admin",
]

const inputClass =
  "w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"

function nomeDe(u: AdminUser) {
  return u.displayName || u.name || u.email || u.id.slice(0, 8)
}

function ehPago(u: AdminUser) {
  return u.subscription?.plan === "pro" || u.role === "professor-pro" || u.role === "admin"
}

export function AdminPage() {
  const { user } = useAuth()
  const dono = isPlatformOwner(user?.email)
  const admin = useAdminData()
  const [aba, setAba] = useState<Aba>("visao")
  const [busca, setBusca] = useState("")
  const [salvando, setSalvando] = useState<string | null>(null)

  const usuariosFiltrados = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (!q) return admin.users
    return admin.users.filter(
      (u) =>
        nomeDe(u).toLowerCase().includes(q) ||
        (u.email ?? "").toLowerCase().includes(q) ||
        (u.role ?? "").toLowerCase().includes(q)
    )
  }, [admin.users, busca])

  // O guard visual não é a proteção: quem digitar a URL chega aqui de
  // qualquer forma. O que impede de ver ou alterar dado é a regra do
  // Firestore (isPlatformOwner). Isto aqui evita desenhar um painel
  // inteiro que só mostraria erros de permissão.
  if (!dono) {
    return (
      <>
        <PageHeader title="Administração" subtitle="Gestão da plataforma." />
        <EmptyState
          icon={<Lock className="h-6 w-6" />}
          title="Área restrita"
          description="Esta área é exclusiva da conta responsável pela plataforma."
        />
      </>
    )
  }

  async function comSalvamento(chave: string, acao: () => Promise<void>) {
    setSalvando(chave)
    try {
      await acao()
    } catch (err) {
      console.error("Ação administrativa falhou:", err)
    } finally {
      setSalvando(null)
    }
  }

  const m = admin.metricas

  return (
    <>
      <PageHeader
        title="Administração da plataforma"
        subtitle="Visão completa de usuários, escolas, vendas e suporte."
        action={
          <Button variant="outline" size="sm" onClick={admin.reload} disabled={admin.loading}>
            {admin.loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Atualizar
          </Button>
        }
      />

      {admin.error && (
        <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{admin.error}</p>
        </div>
      )}

      {/* Abas */}
      <div className="mb-6 flex flex-wrap gap-1 rounded-2xl border bg-muted/40 p-1">
        {ABAS.map((a) => {
          const Icon = a.icon
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => setAba(a.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                aba === a.id ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {a.label}
            </button>
          )
        })}
      </div>

      {admin.loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl border bg-muted/40" />
          ))}
        </div>
      ) : (
        <>
          {/* ---------------- VISÃO GERAL ---------------- */}
          {aba === "visao" && (
            <>
              <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Usuários" value={m.totalUsuarios} icon={<Users className="h-5 w-5" />} />
                <StatCard
                  label="Contas pagas"
                  value={m.pagantes}
                  icon={<ShieldCheck className="h-5 w-5" />}
                  tone="amber"
                />
                <StatCard
                  label="Escolas ativas"
                  value={`${m.escolasAtivas}/${m.totalEscolas}`}
                  icon={<School className="h-5 w-5" />}
                  tone="emerald"
                />
                <StatCard
                  label="Leads novos"
                  value={m.leadsNovos}
                  icon={<LifeBuoy className="h-5 w-5" />}
                  tone="violet"
                />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <section className="rounded-2xl border bg-card p-6 shadow-sm">
                  <h2 className="mb-4 font-display text-lg font-bold">Usuários por papel</h2>
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
                </section>

                <section className="rounded-2xl border bg-card p-6 shadow-sm">
                  <h2 className="mb-4 font-display text-lg font-bold">Uso da plataforma</h2>
                  <dl className="space-y-3 text-sm">
                    {[
                      ["Turmas criadas", m.totalTurmas],
                      ["Alunos vinculados a turmas", m.alunosEmTurmas],
                      ["Usuários ligados a uma escola", m.comEscola],
                      ["Escolas em demonstração", m.escolasDemo],
                      ["Total de leads recebidos", m.totalLeads],
                    ].map(([rotulo, valor]) => (
                      <div key={String(rotulo)} className="flex items-center justify-between border-b pb-2 last:border-0">
                        <dt className="text-muted-foreground">{rotulo}</dt>
                        <dd className="font-display text-lg font-bold tabular-nums">{valor}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              </div>
            </>
          )}

          {/* ---------------- USUÁRIOS ---------------- */}
          {aba === "usuarios" && (
            <>
              <div className="relative mb-4">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar por nome, e-mail ou papel..."
                  className={`${inputClass} pl-10`}
                />
              </div>
              <p className="mb-3 text-sm text-muted-foreground">
                {usuariosFiltrados.length} de {admin.users.length} usuários
              </p>

              <div className="overflow-x-auto rounded-2xl border">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Usuário</th>
                      <th className="px-4 py-3 text-left font-semibold">Papel</th>
                      <th className="px-4 py-3 text-left font-semibold">Plano</th>
                      <th className="px-4 py-3 text-right font-semibold">XP</th>
                      <th className="px-4 py-3 text-right font-semibold">IA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.map((u) => (
                      <tr key={u.id} className="border-t">
                        <td className="px-4 py-3">
                          <p className="font-medium">{nomeDe(u)}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={u.role ?? ""}
                            disabled={salvando === `role-${u.id}`}
                            onChange={(e) =>
                              comSalvamento(`role-${u.id}`, () => admin.setUserRole(u.id, e.target.value))
                            }
                            className="rounded-lg border bg-background px-2 py-1 text-xs outline-none focus:border-primary"
                          >
                            <option value="">sem papel</option>
                            {PAPEIS.map((p) => (
                              <option key={p} value={p}>
                                {ROLE_LABELS[p] ?? p}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            size="sm"
                            variant={ehPago(u) ? "default" : "outline"}
                            disabled={salvando === `plan-${u.id}`}
                            onClick={() =>
                              comSalvamento(`plan-${u.id}`, () =>
                                admin.setUserPlan(u.id, ehPago(u) ? "free" : "pro")
                              )
                            }
                          >
                            {salvando === `plan-${u.id}` ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : ehPago(u) ? (
                              "PRO"
                            ) : (
                              "Gratuito"
                            )}
                          </Button>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {(u.xp ?? 0).toLocaleString("pt-BR")}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                          {u.aiUsageCount ?? 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Clique no plano para alternar entre Gratuito e PRO. A mudança de papel é aplicada
                assim que você escolhe — as regras do Firestore validam quem pode fazer isso.
              </p>
            </>
          )}

          {/* ---------------- ESCOLAS ---------------- */}
          {aba === "escolas" && (
            <>
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
                            <p className="flex items-center gap-2 font-semibold">
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
                              {membros.filter((u) => u.role === "teacher" || u.role === "school_admin").length}{" "}
                              professores · {turmas.length} turmas
                              {s.studentCode && ` · código aluno ${s.studentCode}`}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant={ativa ? "outline" : "default"}
                            disabled={salvando === `escola-${s.id}`}
                            onClick={() =>
                              comSalvamento(`escola-${s.id}`, () =>
                                admin.setSchoolPlan(s.id, ativa ? "demo" : "active")
                              )
                            }
                          >
                            {salvando === `escola-${s.id}` ? (
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
                Ativar a contratação libera a gestão de turmas para a escola. O bloqueio do modo
                demonstração é aplicado pela regra do Firestore, não só pela interface.
              </p>
            </>
          )}

          {/* ---------------- VENDAS ---------------- */}
          {aba === "vendas" && (
            <>
              <div className="mb-8 grid gap-4 sm:grid-cols-3">
                <StatCard
                  label="Contas pagas"
                  value={m.pagantes}
                  icon={<ShieldCheck className="h-5 w-5" />}
                  tone="amber"
                />
                <StatCard
                  label="Escolas contratadas"
                  value={m.escolasAtivas}
                  icon={<School className="h-5 w-5" />}
                  tone="emerald"
                />
                <StatCard
                  label="Oportunidades abertas"
                  value={m.leadsNovos}
                  icon={<TrendingUp className="h-5 w-5" />}
                />
              </div>

              <section className="rounded-2xl border bg-card p-6 shadow-sm">
                <h2 className="mb-1 font-display text-lg font-bold">Contas pagas</h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  Quem hoje tem acesso PRO, seja por assinatura ou liberação manual.
                </p>
                {admin.users.filter(ehPago).length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma conta paga ainda.</p>
                ) : (
                  <div className="divide-y">
                    {admin.users.filter(ehPago).map((u) => (
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
                  A receita por assinatura ainda não é registrada aqui: o checkout da AbacatePay
                  precisa estar publicado para que os pagamentos apareçam automaticamente. Até lá,
                  esta lista reflete as liberações feitas na aba Usuários.
                </p>
              </section>
            </>
          )}

          {/* ---------------- SUPORTE ---------------- */}
          {aba === "suporte" && (
            <>
              {admin.leads.length === 0 ? (
                <EmptyState
                  icon={<LifeBuoy className="h-6 w-6" />}
                  title="Nenhuma solicitação"
                  description="Pedidos de contato, orçamento e acesso aparecem aqui."
                />
              ) : (
                <div className="grid gap-3">
                  {admin.leads.map((l) => {
                    const status = l.status ?? "new"
                    return (
                      <div key={l.id} className="rounded-2xl border bg-card p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="flex flex-wrap items-center gap-2 font-semibold">
                              {l.name || "Sem nome"}
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider ${
                                  status === "new"
                                    ? "bg-sky-100 text-sky-800"
                                    : status === "done"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {status === "new" ? "novo" : status === "done" ? "resolvido" : status}
                              </span>
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {l.email}
                              {l.schoolName && ` · ${l.schoolName}`}
                              {l.createdAt?.toDate &&
                                ` · ${l.createdAt.toDate().toLocaleDateString("pt-BR")}`}
                            </p>
                            {(l.goal || l.message) && (
                              <p className="mt-2 text-sm text-muted-foreground">
                                {l.goal}
                                {l.goal && l.message ? " — " : ""}
                                {l.message}
                              </p>
                            )}
                          </div>

                          <div className="flex shrink-0 gap-2">
                            {status !== "done" && (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={salvando === `lead-${l.id}`}
                                onClick={() =>
                                  comSalvamento(`lead-${l.id}`, () => admin.setLeadStatus(l.id, "done"))
                                }
                              >
                                <Check className="h-4 w-4" />
                                Resolver
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-muted-foreground hover:text-destructive"
                              disabled={salvando === `del-${l.id}`}
                              onClick={() => comSalvamento(`del-${l.id}`, () => admin.removeLead(l.id))}
                              aria-label="Excluir solicitação"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </>
      )}

      {!admin.loading && aba === "visao" && (
        <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
          <GraduationCap className="h-3.5 w-3.5" />
          Os dados vêm direto do Firestore, limitados a 500 registros por coleção.
        </p>
      )}
    </>
  )
}
