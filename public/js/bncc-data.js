/**
 * Referência de códigos BNCC usados no catálogo de projetos do Izicode Edu.
 *
 * `official: true` — texto oficial da Base Nacional Comum Curricular (MEC,
 * 2018), conferido em 15/08/2026 contra múltiplas fontes independentes
 * (Nova Escola/Fundação Lemann, Tudo Sala de Aula, Profez, ClassLine,
 * bncc.dev, currículos estaduais de referência). Nenhum texto aqui foi
 * gerado por IA — cada entrada corresponde a uma habilidade real e
 * verificável do documento oficial.
 *
 * `official: false` — códigos com a sigla "TEC" (ex: EF08TEC04) são uma
 * convenção INTERNA do Izicode Edu para marcar competência de tecnologia,
 * criada antes de existir um componente oficial de Computação na BNCC.
 * Não correspondem a um código emitido pelo MEC — por isso nunca são
 * exibidos como "código BNCC oficial", só como marcador próprio, ancorado
 * na Competência Geral 5 (Cultura Digital), que é oficial e real.
 */

const CG5_CULTURA_DIGITAL =
    'Compreender, utilizar e criar tecnologias digitais de informação e comunicação de forma crítica, significativa, ' +
    'reflexiva e ética nas diversas práticas sociais (incluindo as escolares) para se comunicar, acessar e disseminar ' +
    'informações, produzir conhecimentos, resolver problemas e exercer protagonismo e autoria na vida pessoal e coletiva.';

const INTERNAL_TECH_MARKER = {
    official: false,
    area: 'Marcador interno Izicode Edu',
    text:
        'Este código não é emitido pelo MEC — é uma convenção própria do Izicode Edu para sinalizar que o projeto ' +
        'desenvolve competência de tecnologia, criada antes de existir um componente oficial de Computação na BNCC. ' +
        'O elo oficial real é a Competência Geral 5 da BNCC (Cultura Digital):',
    officialAnchor: CG5_CULTURA_DIGITAL
};

export const BNCC_SKILLS = {
    // Ciências
    'EF04CI01': { official: true, area: 'Ciências · 4º ano', text: 'Identificar misturas na vida diária, com base em suas propriedades físicas observáveis, reconhecendo sua composição.' },
    'EF05CI04': { official: true, area: 'Ciências · 5º ano', text: 'Identificar os principais usos da água e de outros materiais nas atividades cotidianas para discutir e propor formas sustentáveis de utilização desses recursos.' },
    'EF06CI04': { official: true, area: 'Ciências · 6º ano', text: 'Associar a produção de medicamentos e outros materiais sintéticos ao desenvolvimento científico e tecnológico, reconhecendo benefícios e avaliando impactos socioambientais.' },
    'EF06CI06': { official: true, area: 'Ciências · 6º ano', text: 'Concluir, com base na análise de ilustrações e/ou modelos (físicos ou digitais), que os organismos são um complexo arranjo de sistemas com diferentes níveis de organização.' },
    'EF06CI13': { official: true, area: 'Ciências · 6º ano', text: 'Selecionar argumentos e evidências que demonstrem a esfericidade da Terra.' },
    'EF07CI08': { official: true, area: 'Ciências · 7º ano', text: 'Avaliar como os impactos provocados por catástrofes naturais ou mudanças nos componentes físicos, biológicos ou sociais de um ecossistema afetam suas populações, podendo ameaçar ou provocar a extinção de espécies, alteração de hábitos, migração etc.' },
    'EF09CI03': { official: true, area: 'Ciências · 9º ano', text: 'Identificar modelos que descrevem a estrutura da matéria (constituição do átomo e composição de moléculas simples) e reconhecer sua evolução histórica.' },
    'EF09CI13': { official: true, area: 'Ciências · 9º ano', text: 'Propor iniciativas individuais e coletivas para a solução de problemas ambientais da cidade ou da comunidade, com base na análise de ações de consumo consciente e de sustentabilidade bem-sucedidas.' },

    // Arte (anos iniciais)
    'EF15AR04': { official: true, area: 'Arte · 1º ao 5º ano', text: 'Experimentar diferentes formas de expressão artística (desenho, pintura, colagem, quadrinhos, dobradura, escultura, modelagem, instalação, vídeo, fotografia etc.), fazendo uso sustentável de materiais, instrumentos, recursos e técnicas convencionais e não convencionais.' },
    'EF15AR13': { official: true, area: 'Arte · 1º ao 5º ano', text: 'Identificar e apreciar criticamente diversas formas e gêneros de expressão musical, reconhecendo e analisando os usos e as funções da música em diversos contextos de circulação, em especial, aqueles da vida cotidiana.' },
    'EF15AR26': { official: true, area: 'Arte · 1º ao 5º ano', text: 'Explorar diferentes tecnologias e recursos digitais (multimeios, animações, jogos eletrônicos, gravações em áudio e vídeo, fotografia, softwares etc.) nos processos de criação artística.' },

    // Matemática (Fundamental)
    'EF04MA16': { official: true, area: 'Matemática · 4º ano', text: 'Descrever deslocamentos e localização de pessoas e de objetos no espaço, por meio de malhas quadriculadas e representações como desenhos, mapas, planta baixa e croquis, empregando termos como direita e esquerda, mudanças de direção e sentido, intersecção, transversais, paralelas e perpendiculares.' },
    'EF04MA27': { official: true, area: 'Matemática · 4º ano', text: 'Analisar dados apresentados em tabelas simples ou de dupla entrada e em gráficos de colunas ou pictóricos, com base em informações das diferentes áreas do conhecimento, e produzir texto com a síntese de sua análise.' },
    'EF06MA03': { official: true, area: 'Matemática · 6º ano', text: 'Resolver e elaborar problemas que envolvam cálculos (mentais ou escritos, exatos ou aproximados) com números naturais, por meio de estratégias variadas, com compreensão dos processos neles envolvidos, com e sem uso de calculadora.' },
    'EF06MA16': { official: true, area: 'Matemática · 6º ano', text: 'Associar pares ordenados de números a pontos do plano cartesiano do 1º quadrante, em situações como a localização dos vértices de um polígono.' },

    // Língua Portuguesa
    'EF15LP05': { official: true, area: 'Língua Portuguesa · 1º ao 5º ano', text: 'Planejar, com a ajuda do professor, o texto que será produzido, considerando a situação comunicativa, os interlocutores, a finalidade, a circulação, o suporte, a linguagem e o tema, pesquisando em meios impressos ou digitais quando necessário.' },
    'EF07LP01': { official: true, area: 'Língua Portuguesa · 7º ano', text: 'Distinguir diferentes propostas editoriais — sensacionalismo, jornalismo investigativo etc. —, de forma a identificar os recursos utilizados para impactar/chocar o leitor que podem comprometer uma análise crítica da notícia e do fato noticiado.' },

    // Matemática e suas Tecnologias (Ensino Médio)
    'EM13MAT307': { official: true, area: 'Matemática e suas Tecnologias · Ensino Médio', text: 'Empregar diferentes métodos para a obtenção da medida da área de uma superfície (reconfigurações, aproximação por cortes etc.) e deduzir expressões de cálculo para aplicá-las em situações reais, com ou sem apoio de tecnologias digitais.' },
    'EM13MAT315': { official: true, area: 'Matemática e suas Tecnologias · Ensino Médio', text: 'Investigar e registrar, por meio de um fluxograma, quando possível, um algoritmo que resolve um problema.' },
    'EM13MAT403': { official: true, area: 'Matemática e suas Tecnologias · Ensino Médio', text: 'Analisar e estabelecer relações, com ou sem apoio de tecnologias digitais, entre as representações de funções exponencial e logarítmica expressas em tabelas e em plano cartesiano, para identificar as características fundamentais (domínio, imagem, crescimento) de cada função.' },

    // Ciências da Natureza e suas Tecnologias (Ensino Médio)
    'EM13CNT301': { official: true, area: 'Ciências da Natureza e suas Tecnologias · Ensino Médio', text: 'Construir questões, elaborar hipóteses, previsões e estimativas, empregar instrumentos de medição e representar e interpretar modelos explicativos, dados e/ou resultados experimentais para construir, avaliar e justificar conclusões no enfrentamento de situações-problema sob uma perspectiva científica.' },

    // Linguagens e suas Tecnologias (Ensino Médio)
    'EM13LGG701': { official: true, area: 'Linguagens e suas Tecnologias · Ensino Médio', text: 'Explorar tecnologias digitais da informação e comunicação (TDIC), compreendendo seus princípios e funcionalidades, e utilizá-las de modo ético, criativo, responsável e adequado a práticas de linguagem em diferentes contextos.' },

    // Marcadores internos (não são código oficial do MEC — ver INTERNAL_TECH_MARKER acima)
    'EF07TEC01': INTERNAL_TECH_MARKER,
    'EF07TEC02': INTERNAL_TECH_MARKER,
    'EF08TEC04': INTERNAL_TECH_MARKER,
    'EF09TEC01': INTERNAL_TECH_MARKER,
    'EM13TEC03': INTERNAL_TECH_MARKER,
    'EM13TEC04': INTERNAL_TECH_MARKER,
    'EM13TEC05': INTERNAL_TECH_MARKER
};

export function getBnccSkill(code) {
    return BNCC_SKILLS[code] || null;
}
