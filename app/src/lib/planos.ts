/**
 * Catálogo comercial da Izicode Edu.
 *
 * Fonte única dos preços: a página de planos, o painel e (mais adiante) o
 * checkout leem daqui, para não haver dois números diferentes para a
 * mesma coisa em lugares diferentes.
 *
 * O raciocínio por trás de cada número está em docs/MODELO-NEGOCIO.md —
 * mexer no preço sem reler os custos ali é o caminho mais curto para
 * vender no prejuízo (o kit do plano anual, em especial).
 */

export interface PlanoFeature {
  texto: string
  /** Destaca o que é exclusivo daquele plano na comparação. */
  destaque?: boolean
}

export interface Plano {
  id: string
  nome: string
  publico: string
  precoCentavos: number
  /** 'mes' | 'ano' | 'sob-consulta' */
  periodo: "mes" | "ano" | "sob-consulta"
  resumo: string
  features: PlanoFeature[]
  cta: string
  ctaHref: string
  popular?: boolean
  nota?: string
}

export function formatarPreco(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: centavos % 100 === 0 ? 0 : 2,
  })
}

/* ------------------------------------------------------------------ */
/* Professor autônomo                                                  */
/* ------------------------------------------------------------------ */

export const PLANOS_PROFESSOR: Plano[] = [
  {
    id: "free",
    nome: "Gratuito",
    publico: "Para conhecer a plataforma",
    precoCentavos: 0,
    periodo: "mes",
    resumo: "Tudo que dá para usar sem pagar nada, para sempre.",
    features: [
      { texto: "3 planos de aula gerados por IA" },
      { texto: "Primeiro módulo de todas as trilhas da Academia" },
      { texto: "Biblioteca com 37 roteiros de projeto" },
      { texto: "Arena de Quiz e área do aluno" },
      { texto: "Assistente IA com sua própria chave do Gemini" },
    ],
    cta: "Criar conta grátis",
    ctaHref: "/login.html",
  },
  {
    id: "pro_mensal",
    nome: "Professor PRO",
    publico: "Para quem dá aula toda semana",
    precoCentavos: 3990,
    periodo: "mes",
    resumo: "IA sem limite e todas as trilhas completas.",
    popular: true,
    features: [
      { texto: "Planos de aula com IA ilimitados", destaque: true },
      { texto: "Chave de IA inclusa — sem configurar nada", destaque: true },
      { texto: "Todos os módulos de todas as trilhas", destaque: true },
      { texto: "Assistente IA e Criação de Conteúdo sem limite" },
      { texto: "Exportação dos roteiros para impressão" },
      { texto: "Comunidade de professores makers" },
    ],
    cta: "Assinar o PRO",
    ctaHref: "/contact.html?plano=pro_mensal",
  },
  {
    id: "pro_anual",
    nome: "PRO Anual + Kit",
    publico: "Para quem vai colocar a mão na massa",
    precoCentavos: 39700,
    periodo: "ano",
    resumo: "Dois meses grátis e um kit Arduino na sua casa.",
    features: [
      { texto: "Tudo do Professor PRO" },
      { texto: "Kit Arduino Básico enviado para você", destaque: true },
      { texto: "Equivale a 10 meses — 2 meses grátis", destaque: true },
      { texto: "Trilha Arduino do Zero com o kit em mãos" },
      { texto: "Frete incluso para todo o Brasil" },
    ],
    cta: "Assinar o anual",
    ctaHref: "/contact.html?plano=pro_anual",
    nota: "O kit é enviado após a confirmação do pagamento.",
  },
]

/** Itens do kit incluído no plano anual. */
export const KIT_ARDUINO = [
  "Placa compatível com Arduino Uno + cabo USB",
  "Protoboard de 400 pontos e kit de jumpers",
  "LEDs, resistores, botões e buzzer",
  "Sensor de temperatura, LDR e potenciômetro",
  "Servo motor e sensor ultrassônico",
  "Guia de montagem dos 5 projetos da trilha",
]

/* ------------------------------------------------------------------ */
/* Escola — base + assentos                                            */
/* ------------------------------------------------------------------ */

export const PLANO_ESCOLA = {
  baseCentavos: 24900,
  professoresInclusos: 3,
  alunosInclusos: 60,
  professorExtraCentavos: 1900,
  alunoExtraCentavos: 250,
  features: [
    "Gestão de turmas, professores e alunos",
    "Códigos de acesso próprios da escola",
    "Painel de acompanhamento por turma",
    "Estúdio IA liberado para toda a equipe docente",
    "Academia do Professor completa para os docentes",
    "Formação de implantação com a equipe Izicode",
  ],
}

/** Simulação de mensalidade da escola por número de assentos. */
export function calcularEscola(professores: number, alunos: number): number {
  const extraProf = Math.max(0, professores - PLANO_ESCOLA.professoresInclusos)
  const extraAlunos = Math.max(0, alunos - PLANO_ESCOLA.alunosInclusos)
  return (
    PLANO_ESCOLA.baseCentavos +
    extraProf * PLANO_ESCOLA.professorExtraCentavos +
    extraAlunos * PLANO_ESCOLA.alunoExtraCentavos
  )
}

/* ------------------------------------------------------------------ */
/* Aulas online — vendido para famílias                                */
/* ------------------------------------------------------------------ */

export const PLANOS_AULAS: Plano[] = [
  {
    id: "aulas_turma",
    nome: "Turma Online",
    publico: "Crianças e adolescentes de 8 a 17 anos",
    precoCentavos: 14900,
    periodo: "mes",
    resumo: "Uma aula ao vivo por semana, em turma pequena.",
    popular: true,
    features: [
      { texto: "4 aulas ao vivo por mês (60 min)", destaque: true },
      { texto: "Turmas de no máximo 8 alunos", destaque: true },
      { texto: "Professor da Izicode conduzindo" },
      { texto: "Acesso à plataforma incluso para o aluno" },
      { texto: "Relatório de evolução para os responsáveis" },
      { texto: "Aulas gravadas para rever depois" },
    ],
    cta: "Agendar aula experimental",
    ctaHref: "/contact.html?plano=aulas_turma",
  },
  {
    id: "aulas_individual",
    nome: "Aula Individual",
    publico: "Para quem quer ritmo próprio",
    precoCentavos: 39900,
    periodo: "mes",
    resumo: "Atenção exclusiva e trilha sob medida.",
    features: [
      { texto: "4 aulas individuais por mês (50 min)", destaque: true },
      { texto: "Plano de evolução personalizado", destaque: true },
      { texto: "Horário combinado com a família" },
      { texto: "Acesso à plataforma incluso" },
      { texto: "Acompanhamento direto com o professor" },
    ],
    cta: "Falar sobre horários",
    ctaHref: "/contact.html?plano=aulas_individual",
  },
]

export const AULAS_NOTA =
  "As aulas usam materiais que a família já tem em casa ou o Kit Arduino Básico, " +
  "que pode ser adquirido à parte."
