import { isProUser, type UserData } from "@/lib/roles"

/**
 * Regra de acesso ao conteúdo.
 *
 * Um lugar só para responder "isto é livre ou é do PRO?". Espalhar essa
 * decisão pelas telas é como se cria a incoerência clássica: a lista diz
 * que o curso é grátis e a tela de dentro cobra — ou o contrário, que é
 * pior, porque entrega de graça o que deveria ser pago.
 *
 * O raciocínio comercial de cada escolha está em docs/REGRAS-DE-ACESSO.md.
 * A regra dos guias vive em scripts/gerar-guias.mjs, porque aquelas
 * páginas são HTML estático gerado fora do app.
 */

/**
 * O curso aberto por inteiro.
 *
 * Scratch é a porta de entrada natural: não exige comprar nada, roda no
 * navegador da escola e é onde a maioria dos professores começa. Quem
 * termina esse curso já sabe o que a Academia entrega — e é aí que a
 * decisão de assinar faz sentido.
 */
export const CURSO_LIVRE = "scratch-para-professores"

/** O curso está aberto por inteiro para esta pessoa? */
export function cursoLiberado(
  courseId: string | undefined,
  userData: UserData | null,
  email?: string | null
): boolean {
  if (isProUser(userData, email)) return true
  return courseId === CURSO_LIVRE
}

/**
 * O módulo pode ser aberto?
 *
 * Nos cursos pagos o primeiro módulo continua aberto, de propósito: é a
 * prévia. Sem ela, a Academia vira uma lista de títulos trancados, e
 * ninguém assina o que não pôde experimentar.
 */
export function moduloLiberado(
  courseId: string | undefined,
  modulo: { free?: boolean } | undefined,
  userData: UserData | null,
  email?: string | null
): boolean {
  if (cursoLiberado(courseId, userData, email)) return true
  return Boolean(modulo?.free)
}

/** Texto curto do estado do curso, para etiquetas de lista. */
export function rotuloAcessoCurso(
  courseId: string,
  userData: UserData | null,
  email?: string | null
): { texto: string; livre: boolean } {
  if (isProUser(userData, email)) return { texto: "Liberado", livre: true }
  if (courseId === CURSO_LIVRE) return { texto: "Curso grátis", livre: true }
  return { texto: "1º módulo grátis", livre: false }
}
