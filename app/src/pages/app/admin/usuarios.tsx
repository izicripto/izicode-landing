import { useMemo, useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { useAdmin } from "@/components/dashboard/admin-layout"
import { ROLE_LABELS } from "@/lib/roles"
import type { AdminUser } from "@/lib/use-admin"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

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

function nomeDe(u: AdminUser) {
  return u.displayName || u.name || u.email || u.id.slice(0, 8)
}

function ehPago(u: AdminUser) {
  return u.subscription?.plan === "pro" || u.role === "professor-pro" || u.role === "admin"
}

export function AdminUsuariosPage() {
  const admin = useAdmin()
  const toast = useToast()
  const [busca, setBusca] = useState("")
  const [salvando, setSalvando] = useState<string | null>(null)

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (!q) return admin.users
    return admin.users.filter(
      (u) =>
        nomeDe(u).toLowerCase().includes(q) ||
        (u.email ?? "").toLowerCase().includes(q) ||
        (u.role ?? "").toLowerCase().includes(q)
    )
  }, [admin.users, busca])

  async function comSalvamento(chave: string, acao: () => Promise<void>, sucesso: string) {
    setSalvando(chave)
    try {
      await acao()
      toast.sucesso(sucesso)
    } catch (err) {
      console.error("Ação administrativa falhou:", err)
      toast.erro(
        "Não foi possível aplicar a mudança",
        "Confirme que esta conta é a dona da plataforma e que as regras do Firestore estão publicadas."
      )
    } finally {
      setSalvando(null)
    }
  }

  return (
    <>
      <PageHeader title="Usuários" subtitle="Papéis, planos e acesso de cada conta." />

      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome, e-mail ou papel..."
          className="w-full rounded-xl border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
        />
      </div>
      <p className="mb-3 text-sm text-muted-foreground">
        {filtrados.length} de {admin.users.length} usuários
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
            {filtrados.map((u) => (
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
                      comSalvamento(
                        `role-${u.id}`,
                        () => admin.setUserRole(u.id, e.target.value),
                        `Papel de ${nomeDe(u)} atualizado`
                      )
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
                      comSalvamento(
                        `plan-${u.id}`,
                        () => admin.setUserPlan(u.id, ehPago(u) ? "free" : "pro"),
                        ehPago(u) ? `${nomeDe(u)} voltou para o plano gratuito` : `${nomeDe(u)} agora é PRO`
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
                <td className="px-4 py-3 text-right tabular-nums">{(u.xp ?? 0).toLocaleString("pt-BR")}</td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{u.aiUsageCount ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Clique no plano para alternar entre Gratuito e PRO. A troca de papel é aplicada na hora — as
        regras do Firestore validam quem pode fazer isso.
      </p>
    </>
  )
}
