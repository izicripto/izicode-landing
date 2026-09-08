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
  /** Gerações de IA já consumidas. Quem manda é o servidor: a Cloud
   *  Function incrementa e bloqueia; aqui o valor serve só para mostrar
   *  o saldo antes do professor tentar. */
  aiUsageCount?: number
}

/** Gerações de IA incluídas no plano gratuito (espelha generateAIProject). */
export const FREE_AI_GENERATIONS = 3

export function remainingFreeGenerations(userData: UserData | null): number {
  return Math.max(0, FREE_AI_GENERATIONS - (userData?.aiUsageCount ?? 0))
}

/**
 * PRO pode vir de duas fontes: o papel 'professor-pro' (definido
 * manualmente por um admin) ou subscription.plan === 'pro' (definido pelo
 * webhook de pagamento). Checar só uma delas deixava contas pagas sem
 * acesso — por isso as duas contam aqui, num único lugar.
 */
/**
 * Tem acesso PRO?
 *
 * O `email` vem do usuário autenticado do Firebase (`user.email`), não do
 * documento no Firestore — este último é gravável pelo próprio dono, e
 * confiar nele deixaria qualquer pessoa se declarar a dona da plataforma
 * escrevendo o e-mail no próprio perfil.
 *
 * O papel 'dev' foi retirado desta lista. Ele não é atribuído por nenhum
 * fluxo de cadastro e existia só como conveniência de exibição — mas as
 * regras do Firestore permitiam que a pessoa o escrevesse no próprio
 * documento, o que transformava um campo do cliente em passe para a IA
 * paga da Izicode. A conta dona continua reconhecida, agora pelo e-mail
 * assinado no token, que ninguém consegue forjar.
 */
export function isProUser(userData: UserData | null, email?: string | null): boolean {
  if (isPlatformOwner(email)) return true
  if (!userData) return false
  return (
    userData.role === "professor-pro" ||
    userData.role === "admin" ||
    // 'dev' não entra aqui. Ele não é atribuído por nenhum fluxo de
    // cadastro — existe como conveniência de exibição para a conta dona,
    // que já é reconhecida pelo e-mail assinado no token. Aceitá-lo
    // transformava um campo gravável pelo cliente em passe para o PRO.
    userData.subscription?.plan === "pro"
  )
}

/**
 * Conta dona da plataforma. Precisa ser exatamente a mesma string do
 * `isPlatformOwner()` em firestore.rules — lá é onde o acesso realmente
 * é concedido; aqui só decidimos se vale a pena desenhar o painel.
 *
 * Esconder o menu não protege nada: quem digitar a URL chega na tela.
 * O que impede de ver ou mudar qualquer coisa é a regra do servidor.
 */
export const PLATFORM_OWNER_EMAIL = "izicripto@gmail.com"

export function isPlatformOwner(email?: string | null): boolean {
  return !!email && email.toLowerCase().trim() === PLATFORM_OWNER_EMAIL
}

export function homeForRole(role?: string, email?: string | null): string {
  // O dono cai direto no console: a home de professor não é o lugar dele.
  if (isPlatformOwner(email)) return "/app/admin"

  if (!role) return "/app"
  if (SCHOOL_ROLES.includes(role)) return "/app/escola"
  if (STUDENT_ROLES.includes(role)) return "/app/aluno"
  return "/app"
}
