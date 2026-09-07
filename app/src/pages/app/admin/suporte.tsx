import { useState } from "react"
import { LifeBuoy, Check, Trash2 } from "lucide-react"
import { useAdmin } from "@/components/dashboard/admin-layout"
import { PLANOS_PROFESSOR, PLANOS_AULAS } from "@/lib/planos"
import { PageHeader, EmptyState } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"

/** Mostra o nome comercial em vez do id cru gravado no lead. */
const NOMES_PLANO: Record<string, string> = {
  ...Object.fromEntries([...PLANOS_PROFESSOR, ...PLANOS_AULAS].map((p) => [p.id, p.nome])),
  escola: "Pacote Escola",
}

export function AdminSuportePage() {
  const admin = useAdmin()
  const [salvando, setSalvando] = useState<string | null>(null)

  async function comSalvamento(chave: string, acao: () => Promise<void>) {
    setSalvando(chave)
    try {
      await acao()
    } catch (err) {
      console.error("Ação de suporte falhou:", err)
    } finally {
      setSalvando(null)
    }
  }

  return (
    <>
      <PageHeader title="Suporte" subtitle="Pedidos de contato, orçamento e ajuda." />

      {admin.leads.length === 0 ? (
        <EmptyState
          icon={<LifeBuoy className="h-6 w-6" />}
          title="Nenhuma solicitação"
          description="Pedidos vindos do formulário de contato e da página de planos aparecem aqui."
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
                      {l.createdAt?.toDate && ` · ${l.createdAt.toDate().toLocaleDateString("pt-BR")}`}
                    </p>

                    {/* Origem do lead: sem isso, um pedido vindo da página de
                        planos chega sem dizer de qual plano a pessoa veio —
                        justamente o que orienta a resposta. */}
                    {(l.plano || l.source) && (
                      <p className="mt-1.5 flex flex-wrap gap-1.5">
                        {l.plano && (
                          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-primary">
                            {NOMES_PLANO[l.plano] ?? l.plano}
                          </span>
                        )}
                        {l.source && (
                          <span className="rounded-md bg-muted px-2 py-0.5 text-[0.65rem] text-muted-foreground">
                            {l.source}
                          </span>
                        )}
                      </p>
                    )}

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
                        onClick={() => comSalvamento(`lead-${l.id}`, () => admin.setLeadStatus(l.id, "done"))}
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
  )
}
