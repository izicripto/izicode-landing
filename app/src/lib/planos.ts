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
    // O login é só com Google e não tem modo separado de cadastro: a
    // primeira entrada já cria a conta e cai no onboarding.
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
    cta: "Assinar com Pix",
    ctaHref: "/app/assinatura?plano=pro_mensal",
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
    cta: "Assinar o anual com Pix",
    ctaHref: "/app/assinatura?plano=pro_anual",
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
    cta: "Contratar com Pix",
    ctaHref: "/app/assinatura?plano=aulas_turma",
    nota: "Depois do pagamento combinamos com você o dia e o horário da turma.",
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
    cta: "Contratar com Pix",
    ctaHref: "/app/assinatura?plano=aulas_individual",
    nota: "Depois do pagamento entramos em contato para combinar os horários.",
  },
]

/* ------------------------------------------------------------------ */
/* Comparativo Gratuito x PRO                                          */
/* ------------------------------------------------------------------ */

/**
 * O que muda de fato ao assinar. Uma lista de vantagens em cada card diz
 * o que o plano tem; esta tabela diz onde está o limite — que é a
 * pergunta que a pessoa realmente faz antes de pagar.
 *
 * Os números aqui precisam bater com FREE_AI_GENERATIONS em lib/roles.ts
 * e com o limite aplicado na Cloud Function: prometer na página o que o
 * servidor não entrega é o pior tipo de erro de preço.
 */
export const COMPARATIVO: { recurso: string; free: string; pro: string }[] = [
  { recurso: "Planos de aula gerados por IA", free: "3 no total", pro: "Ilimitados" },
  { recurso: "Chave de IA", free: "Você configura a sua", pro: "Inclusa, já configurada" },
  { recurso: "Trilhas da Academia", free: "Primeiro módulo", pro: "Todos os módulos" },
  { recurso: "Assistente IA e Criação de Conteúdo", free: "Com a sua chave", pro: "Sem limite" },
  { recurso: "Biblioteca de roteiros", free: "37 roteiros", pro: "37 roteiros" },
  { recurso: "Área do aluno e Arena de Quiz", free: "Completa", pro: "Completa" },
  { recurso: "Exportar roteiros para impressão", free: "—", pro: "Sim" },
  { recurso: "Kit Arduino Básico", free: "—", pro: "No plano anual" },
]

/* ------------------------------------------------------------------ */
/* Dúvidas antes de pagar                                              */
/* ------------------------------------------------------------------ */

export const FAQ_PLANOS: { pergunta: string; resposta: string }[] = [
  {
    pergunta: "O plano gratuito expira?",
    resposta:
      "Não. Ele é gratuito para sempre. O que é limitado são as gerações por IA (3 no total) e " +
      "o acesso aos módulos avançados das trilhas. O resto da plataforma continua aberto sem prazo.",
  },
  {
    pergunta: "Posso cancelar quando quiser?",
    resposta:
      "Pode. A assinatura mensal é cancelada a qualquer momento e vale até o fim do período já " +
      "pago. No plano anual com kit, o cancelamento antes de 12 meses desconta o valor do kit já enviado.",
  },
  {
    pergunta: "Como funciona o pagamento?",
    resposta:
      "O pagamento é processado pela AbacatePay, com Pix e cartão de crédito. A liberação do " +
      "plano é automática assim que o pagamento é confirmado — você não precisa avisar ninguém.",
  },
  {
    pergunta: "Preciso saber programar para usar?",
    resposta:
      "Não. A Academia do Professor começa do zero, e os roteiros de projeto trazem o código " +
      "pronto e comentado. A ideia é justamente dar segurança para quem nunca mexeu com robótica.",
  },
  {
    pergunta: "Sou professor de uma escola. Quem contrata?",
    resposta:
      "Depende de como você vai usar. Para planejar as suas aulas, o plano de professor autônomo " +
      "resolve e é você quem assina. Quando a escola quer acompanhar turmas e alunos, aí é o " +
      "Pacote Escola — e nesse caso a escola contrata e libera acesso para a equipe.",
  },
  {
    pergunta: "Como a escola testa antes de contratar?",
    resposta:
      "A escola recebe um código de demonstração e navega por toda a plataforma sem pagar nada. " +
      "A gestão de turmas — criar turmas, cadastrar alunos e acompanhar o progresso — é o que " +
      "fica liberado na contratação.",
  },
  {
    pergunta: "As aulas online substituem a escola?",
    resposta:
      "Não. São aulas complementares, no contraturno, para famílias que querem robótica e " +
      "programação para os filhos sem depender da escola oferecer.",
  },
  {
    pergunta: "Preciso comprar o kit para acompanhar as trilhas?",
    resposta:
      "Não para começar: os primeiros módulos usam simulador. O kit vem incluído no plano anual " +
      "e pode ser comprado à parte por quem está no mensal.",
  },
]

/**
 * Nome comercial de cada coisa que pode originar um lead — inclusive o que
 * não é plano, como o kit avulso. Sem isso o painel de suporte mostra o id
 * cru e quem atende precisa adivinhar de onde a pessoa veio.
 */
export const NOMES_PLANO: Record<string, string> = {
  ...Object.fromEntries([...PLANOS_PROFESSOR, ...PLANOS_AULAS].map((p) => [p.id, p.nome])),
  escola: "Pacote Escola",
  kit_arduino: "Kit Missão Maker (avulso)",
}

export const AULAS_NOTA =
  "As aulas usam materiais que a família já tem em casa ou o Kit Arduino Básico, " +
  "que pode ser adquirido à parte."
