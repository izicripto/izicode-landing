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
  ShieldCheck,
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
 * O item de administração é anexado ao menu de quem for dono da
 * plataforma, qualquer que seja o papel da conta. Esconder o item não
 * protege nada — quem digitar /app/admin chega na tela de qualquer jeito;
 * o que protege é a regra do Firestore. Isto é só para não poluir o menu
 * de todo mundo com uma área que ninguém mais consegue usar.
 */
const ADMIN_GROUP: NavGroup = {
  group: "Plataforma",
  items: [{ to: "/app/admin", label: "Administração", icon: ShieldCheck }],
}

export function navForRole(role: string, dono = false): NavGroup[] {
  const base = SCHOOL_ROLES.includes(role)
    ? SCHOOL_NAV
    : role === "parent"
      ? PARENT_NAV
      : STUDENT_ROLES.includes(role)
        ? STUDENT_NAV
        : TEACHER_NAV

  return dono ? [...base, ADMIN_GROUP] : base
}
