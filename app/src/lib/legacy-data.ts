/**
 * Os conteúdos de cursos e projetos ainda moram nos módulos ES do site
 * legado (public/js/courses-data.js e projects-data.js), que também são
 * usados pelas páginas HTML antigas. Importamos de lá em runtime em vez
 * de duplicar tudo aqui — assim continua existindo uma fonte única de
 * verdade enquanto a migração para o SPA acontece por partes.
 *
 * Em dev, /js/ é servido pelo proxy do site legado (ver vite.config.ts);
 * em produção os dois estão no mesmo domínio.
 */

export interface CourseModule {
  id: string
  title: string
  free?: boolean
  duration?: string
}

export interface Course {
  id: string
  title: string
  tool?: string
  /** Endereço oficial da ferramenta, para o link no fim do curso. */
  toolUrl?: string
  level?: string
  logo?: string
  description?: string
  comingSoon?: boolean
  modules: CourseModule[]
}

export interface LegacyProject {
  id: string
  title: string
  description?: string
  tools?: string[]
  difficulty?: string
  image?: string
  duration?: string
}

export interface QuizQuestion {
  id: string
  category?: string
  difficulty?: string
  question: string
  options: string[]
  correct: number
  explanation?: string
  xp?: number
}

let coursesPromise: Promise<Course[]> | null = null
let projectsPromise: Promise<LegacyProject[]> | null = null
let quizPromise: Promise<QuizQuestion[]> | null = null

/**
 * O caminho vai numa variável de propósito: são módulos que só existem em
 * runtime (servidos por public/), então o TypeScript não tem como
 * resolvê-los em tempo de build — e o Vite não deve tentar empacotá-los.
 */
function importLegacy(path: string): Promise<Record<string, unknown>> {
  return import(/* @vite-ignore */ path)
}

export function loadCourses(): Promise<Course[]> {
  coursesPromise ??= importLegacy("/js/courses-data.js")
    .then((mod) => {
      const getAll = mod.getAllCourses as (() => Course[]) | undefined
      return getAll ? getAll() : ((mod.courses as Course[]) ?? [])
    })
    .catch((error) => {
      console.error("Não foi possível carregar os cursos:", error)
      return [] as Course[]
    })
  return coursesPromise
}

export function loadProjects(): Promise<LegacyProject[]> {
  projectsPromise ??= importLegacy("/js/projects-data.js")
    .then((mod) => {
      const getAll = mod.getAllProjects as (() => LegacyProject[]) | undefined
      return getAll ? getAll() : ((mod.projects as LegacyProject[]) ?? [])
    })
    .catch((error) => {
      console.error("Não foi possível carregar os projetos:", error)
      return [] as LegacyProject[]
    })
  return projectsPromise
}

export function loadQuizQuestions(): Promise<QuizQuestion[]> {
  quizPromise ??= importLegacy("/js/quiz-data.js")
    .then((mod) => (mod.quizData as QuizQuestion[]) ?? [])
    .catch((error) => {
      console.error("Não foi possível carregar as perguntas do quiz:", error)
      return [] as QuizQuestion[]
    })
  return quizPromise
}
