export type Role =
  | "dev"
  | "admin"
  | "school_admin"
  | "teacher"
  | "freelance_teacher"
  | "professor-pro"
  | "student"
  | "parent"
  | "consultant"

export const ROLE_LABELS: Record<string, string> = {
  dev: "Desenvolvedor",
  admin: "Administrador",
  school_admin: "Gestão Escolar",
  teacher: "Professor(a)",
  freelance_teacher: "Professor(a) Autônomo(a)",
  "professor-pro": "Professor PRO",
  student: "Aluno(a)",
  parent: "Responsável",
  consultant: "Consultor(a)",
}

/**
 * 'professor-pro' é o professor autônomo com plano pago — mesmo painel e
 * mesma navegação de 'freelance_teacher', muda só o rótulo e o que está
 * liberado. Tratar como papéis diferentes foi a origem de contas PRO
 * caindo no dashboard genérico vazio.
 */
export const TEACHER_ROLES: string[] = ["freelance_teacher", "professor-pro"]
export const SCHOOL_ROLES: string[] = ["teacher", "school_admin"]
export const STUDENT_ROLES: string[] = ["student", "parent"]

export interface UserData {
  uid?: string
  displayName?: string
  email?: string
  photoURL?: string
  role?: string
  schoolId?: string | null
  subscription?: { plan?: string; provider?: string }
  createdAt?: { toDate: () => Date }
  xp?: number
  badges?: string[]
  challengesCompleted?: number
}

/**
 * PRO pode vir de duas fontes: o papel 'professor-pro' (definido
 * manualmente por um admin) ou subscription.plan === 'pro' (definido pelo
 * webhook de pagamento). Checar só uma delas deixava contas pagas sem
 * acesso — por isso as duas contam aqui, num único lugar.
 */
export function isProUser(userData: UserData | null): boolean {
  if (!userData) return false
  return (
    userData.role === "professor-pro" ||
    userData.role === "admin" ||
    userData.role === "dev" ||
    userData.subscription?.plan === "pro"
  )
}

export function homeForRole(role?: string): string {
  if (!role) return "/app"
  if (SCHOOL_ROLES.includes(role)) return "/app/escola"
  if (STUDENT_ROLES.includes(role)) return "/app/aluno"
  return "/app"
}
