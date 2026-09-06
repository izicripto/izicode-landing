import {
  Home,
  Library,
  Sparkles,
  Bot,
  FolderKanban,
  GraduationCap,
  Cpu,
  Users,
  Gamepad2,
  Trophy,
  School,
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
      { to: "/ia-assistant.html", label: "Assistente IA", icon: Bot, external: true },
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
      { to: "/school-management.html", label: "Gestão Escolar", icon: School, external: true },
      { to: "/app/biblioteca", label: "Biblioteca", icon: Library },
    ],
  },
  {
    group: "Estúdio IA",
    items: [
      { to: "/app/estudio", label: "Estúdio IA", icon: Sparkles },
      { to: "/ia-assistant.html", label: "Assistente IA", icon: Bot, external: true },
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
      { to: "/quiz-arena.html", label: "Arena de Quiz", icon: Gamepad2, external: true },
      { to: "/ranking.html", label: "Ranking", icon: Trophy, external: true },
    ],
  },
  {
    group: "Recursos",
    items: [{ to: "/app/biblioteca", label: "Biblioteca", icon: Library }],
  },
]

export function navForRole(role: string): NavGroup[] {
  if (SCHOOL_ROLES.includes(role)) return SCHOOL_NAV
  if (STUDENT_ROLES.includes(role)) return STUDENT_NAV
  return TEACHER_NAV
}
