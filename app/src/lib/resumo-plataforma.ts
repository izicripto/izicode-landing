import type { AdminUser, AdminSchool, AdminLead, AdminClass } from "@/lib/use-admin"
import { PLANO_ESCOLA, PLANOS_PROFESSOR, PLANOS_AULAS, formatarPreco } from "@/lib/planos"

/**
 * Monta o resumo que vai para a IA de gestão.
 *
 * Só entram números agregados. Nome, e-mail, id e qualquer outro dado que
 * identifique uma pessoa ficam de fora de propósito: mandar a base de
 * usuários para um serviço de IA de terceiro seria expor dado pessoal sem
 * necessidade — e o que a análise precisa são as proporções, não quem é
 * quem. Escolas aparecem só por contagem e situação de plano.
 */
export function montarResumo(dados: {
  users: AdminUser[]
  schools: AdminSchool[]
  leads: AdminLead[]
  classes: AdminClass[]
}): string {
  const { users, schools, leads, classes } = dados

  const porPapel: Record<string, number> = {}
  let pagantes = 0
  let comEscola = 0
  let usaramIA = 0
  let iaTotal = 0
  let comXP = 0

  for (const u of users) {
    const papel = u.role ?? "sem papel"
    porPapel[papel] = (porPapel[papel] ?? 0) + 1
    if (u.subscription?.plan === "pro" || u.role === "professor-pro") pagantes += 1
    if (u.schoolId) comEscola += 1
    const ia = u.aiUsageCount ?? 0
    if (ia > 0) {
      usaramIA += 1
      iaTotal += ia
    }
    if ((u.xp ?? 0) > 0) comXP += 1
  }

  const ativas = schools.filter((s) => s.plan === "active").length
  const demo = schools.length - ativas

  const porStatusLead: Record<string, number> = {}
  const porOrigemLead: Record<string, number> = {}
  for (const l of leads) {
    const st = l.status ?? "new"
    porStatusLead[st] = (porStatusLead[st] ?? 0) + 1
    const origem = l.plano ? `plano:${l.plano}` : (l.source ?? "desconhecida")
    porOrigemLead[origem] = (porOrigemLead[origem] ?? 0) + 1
  }

  const alunosEmTurmas = classes.reduce((acc, c) => acc + (c.studentIds?.length ?? 0), 0)

  const lista = (obj: Record<string, number>) =>
    Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ") || "nenhum"

  const precos = [...PLANOS_PROFESSOR, ...PLANOS_AULAS]
    .filter((p) => p.precoCentavos > 0)
    .map((p) => `${p.nome} ${formatarPreco(p.precoCentavos)}/${p.periodo}`)
    .join(" · ")

  return [
    "RESUMO AGREGADO DA PLATAFORMA IZICODE EDU (sem dados pessoais)",
    "",
    "USUÁRIOS",
    `- Total: ${users.length}`,
    `- Por papel: ${lista(porPapel)}`,
    `- Com acesso pago (PRO): ${pagantes}`,
    `- Vinculados a alguma escola: ${comEscola}`,
    `- Que já usaram a IA ao menos uma vez: ${usaramIA} (${iaTotal} gerações no total)`,
    `- Com XP acumulado: ${comXP}`,
    "",
    "ESCOLAS",
    `- Total: ${schools.length} (contratadas: ${ativas}, em demonstração: ${demo})`,
    `- Turmas criadas: ${classes.length}`,
    `- Alunos vinculados a turmas: ${alunosEmTurmas}`,
    "",
    "LEADS",
    `- Total: ${leads.length}`,
    `- Por situação: ${lista(porStatusLead)}`,
    `- Por origem: ${lista(porOrigemLead)}`,
    "",
    "MODELO COMERCIAL VIGENTE",
    `- Assinaturas: ${precos}`,
    `- Escola: base ${formatarPreco(PLANO_ESCOLA.baseCentavos)}/mês incluindo ${PLANO_ESCOLA.professoresInclusos} professores e ${PLANO_ESCOLA.alunosInclusos} alunos; professor extra ${formatarPreco(PLANO_ESCOLA.professorExtraCentavos)}, aluno extra ${formatarPreco(PLANO_ESCOLA.alunoExtraCentavos)}`,
    "- Plano gratuito: 3 gerações de IA e primeiro módulo de cada trilha",
    "",
    "OBSERVAÇÕES IMPORTANTES",
    "- A cobrança automática ainda não está publicada: contas PRO hoje foram liberadas manualmente, então não há receita recorrente confirmada nesses números.",
    "- Os totais respeitam um teto de leitura de 500 registros por coleção.",
  ].join("\n")
}
