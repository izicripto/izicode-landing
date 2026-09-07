import { createContext, useContext } from "react"
import { Outlet } from "react-router-dom"
import { Lock, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { isPlatformOwner } from "@/lib/roles"
import { useAdminData } from "@/lib/use-admin"
import { PageHeader, EmptyState } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"

type AdminData = ReturnType<typeof useAdminData>

const AdminContext = createContext<AdminData | null>(null)

/**
 * Os dados da plataforma são carregados uma vez neste layout e
 * compartilhados com todas as seções. Se cada página chamasse
 * useAdminData por conta própria, trocar de aba refaria quatro consultas
 * ao Firestore a cada clique.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAdmin(): AdminData {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error("useAdmin precisa estar dentro de AdminLayout")
  return ctx
}

export function AdminLayout() {
  const { user } = useAuth()
  const dono = isPlatformOwner(user?.email)

  // Este guard é organização de interface, não segurança: quem digitar a
  // URL chega aqui de qualquer jeito. O que impede de ler ou alterar
  // qualquer dado é isPlatformOwner() nas regras do Firestore, que compara
  // o e-mail do token assinado pelo Firebase Auth.
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

  return <AdminGate />
}

function AdminGate() {
  const admin = useAdminData()

  return (
    <AdminContext.Provider value={admin}>
      {admin.error && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <span className="flex items-start gap-2.5">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {admin.error}
          </span>
          <Button variant="outline" size="sm" onClick={admin.reload}>
            <RefreshCw className="h-4 w-4" />
            Tentar de novo
          </Button>
        </div>
      )}

      {admin.loading ? (
        <div className="flex items-center gap-3 py-10 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Carregando dados da plataforma...
        </div>
      ) : (
        <Outlet />
      )}
    </AdminContext.Provider>
  )
}
