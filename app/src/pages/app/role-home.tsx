import { Navigate } from "react-router-dom"
import { useAuth } from "@/lib/auth-context"
import { SCHOOL_ROLES, STUDENT_ROLES } from "@/lib/roles"
import { OverviewPage } from "@/pages/app/overview"

/**
 * /app é a porta única do painel: cada papel vê a home certa sem precisar
 * decorar uma URL diferente. Professores ficam aqui mesmo; escola e aluno
 * são redirecionados para os painéis próprios deles.
 */
export function RoleHome() {
  const { role } = useAuth()

  if (SCHOOL_ROLES.includes(role)) return <Navigate to="/app/escola" replace />
  if (STUDENT_ROLES.includes(role)) return <Navigate to="/app/aluno" replace />

  return <OverviewPage />
}
