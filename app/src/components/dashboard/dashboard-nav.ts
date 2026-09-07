import {
  Home,
  Library,
  Sparkles,
  Bot,
  PenLine,
  FolderKanban,
  GraduationCap,
  Cpu,
  Users,
  Gamepad2,
  Trophy,
  School,
  Wallet,
  LifeBuoy,
  TrendingUp,
  Bot as BotIcon,
  type LucideIcon,
} from "lucide-react"
import { SCHOOL_ROLES, STUDENT_ROLES } from "@/lib/roles"

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Rota externa: página legada ainda não migrada para o SPA. */
  external?: boolean
}

export interface NavGroup {
  group: string
  items: NavItem[]
}

const TEACHER_NAV: NavGroup[] = [
  {
    group: "Principal",
    items: [
      { to: "/app", label: "Visão Geral", icon: Home },
      { to: "/app/projetos", label: "Meus Projetos", icon: FolderKanban },
      { to: "/app/biblioteca", label: "Biblioteca", icon: Library },
    ],
  },
  {
    group: "Estúdio IA",
    items: [
      { to: "/app/estudio", label: "Estúdio IA", icon: Sparkles },
      { to: "/app/assistente", label: "Assistente IA", icon: Bot },
      { to: "/app/conteudo", label: "Criação de Conteúdo", icon: PenLine },
    ],
  },
  {
    group: "Aprender",
    items: [
      { to: "/app/academia", label: "Academia", icon: GraduationCap },
      { to: "/app/arduino", label: "Arduino Hub", icon: Cpu },
      { to: "/app/networking", label: "Networking", icon: Users },
    ],
  },
]

const SCHOOL_NAV: NavGroup[] = [
  {
    group: "Gestão",
    items: [
      { to: "/app/escola", label: "Visão Geral", icon: Home },
      { to: "/app/turmas", label: "Turmas e Pessoas", icon: School },
      { to: "/app/biblioteca", label: "Biblioteca", icon: Library },
    ],
  },
  {
    group: "Estúdio IA",
    items: [
      { to: "/app/estudio", label: "Estúdio IA", icon: Sparkles },
      { to: "/app/assistente", label: "Assistente IA", icon: Bot },
      { to: "/app/conteudo", label: "Criação de Conteúdo", icon: PenLine },
    ],
  },
  {
    group: "Aprender",
    items: [
      { to: "/app/academia", label: "Academia", icon: GraduationCap },
      { to: "/app/arduino", label: "Arduino Hub", icon: Cpu },
    ],
  },
]

const STUDENT_NAV: NavGroup[] = [
  {
    group: "Aprender",
    items: [
      { to: "/app/aluno", label: "Meu Painel", icon: Home },
      { to: "/app/quiz", label: "Arena de Quiz", icon: Gamepad2 },
      { to: "/app/tutor", label: "Tutor IA", icon: Bot },
      { to: "/app/ranking", label: "Ranking", icon: Trophy },
    ],
  },
  {
    group: "Recursos",
    items: [{ to: "/app/biblioteca", label: "Biblioteca", icon: Library }],
  },
]

/**
 * O responsável usa o mesmo painel do aluno, mas precisa de um item a
 * mais: a gestão dos perfis das crianças. É ali que ele troca de filho e
 * exerce a exclusão dos dados de quem representa (LGPD) — coisas que não
 * fazem sentido para um aluno vinculado a uma escola.
 */
const PARENT_NAV: NavGroup[] = [
  STUDENT_NAV[0],
  {
    group: "Responsável",
    items: [{ to: "/app/filhos", label: "Perfis das crianças", icon: Users }],
  },
  ...STUDENT_NAV.slice(1),
]

/**
 * Console do dono da plataforma.
 *
 * Substitui o menu inteiro em vez de acrescentar um item: essa conta
 * existe para configurar, analisar e administrar — não para planejar aula
 * nem fazer trilha. Deixar Estúdio IA e Aprender ali só competiria com o
 * que a conta realmente faz. As telas continuam existindo por URL, caso
 * seja preciso conferir alguma coisa como um professor veria.
 */
const OWNER_NAV: NavGroup[] = [
  {
    group: "Plataforma",
    items: [
      { to: "/app/admin", label: "Visão geral", icon: TrendingUp },
      { to: "/app/admin/usuarios", label: "Usuários", icon: Users },
      { to: "/app/admin/escolas", label: "Escolas", icon: School },
    ],
  },
  {
    group: "Operação",
    items: [
      { to: "/app/admin/vendas", label: "Vendas", icon: Wallet },
      { to: "/app/admin/suporte", label: "Suporte", icon: LifeBuoy },
    ],
  },
  {
    group: "Análise",
    items: [{ to: "/app/admin/copiloto", label: "Copiloto de gestão", icon: BotIcon }],
  },
]

export function navForRole(role: string, dono = false): NavGroup[] {
  if (dono) return OWNER_NAV

  if (SCHOOL_ROLES.includes(role)) return SCHOOL_NAV
  if (role === "parent") return PARENT_NAV
  if (STUDENT_ROLES.includes(role)) return STUDENT_NAV
  return TEACHER_NAV
}
