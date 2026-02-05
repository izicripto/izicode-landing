export const pedagogicalTips = [
    // --- Motivação & Filosofia ---
    {
        type: 'motivation',
        text: "A educação não é o preenchimento de um balde, mas o acendimento de um fogo.",
        source: "W.B. Yeats"
    },
    {
        type: 'motivation',
        text: "O que ouvimos, esquecemos; o que vemos, lembramos; o que fazemos, entendemos.",
        source: "Confúcio"
    },
    {
        type: 'motivation',
        text: "Não prepare o caminho para a criança. Prepare a criança para o caminho.",
        source: "Provérbio"
    },

    // --- RPG & Gamificação (Solicitado) ---
    {
        type: 'rpg',
        title: "RPG na Sala de Aula: A Jornada do Herói",
        text: "Transforme sua aula em uma missão! Divida o conteúdo em 'fases'. Ao completar uma lista de exercícios, o aluno ganha XP ou 'itens' (como um adesivo ou vantagem na prova).",
        tag: "Gamificação"
    },
    {
        type: 'rpg',
        title: "Dados da Narrativa",
        text: "Use dados de RPG (D20, D6) para decisões aleatórias na aula. Ex: Role um D20 para definir a dificuldade do próximo exercício ou quem apresentará o trabalho. Isso gera engajamento imediato!",
        tag: "Dinâmica"
    },
    {
        type: 'rpg',
        title: "Classes de Personagens",
        text: "Em trabalhos em grupo, atribua 'Classes': O 'Escriba' (anota), o 'Orador' (apresenta), o 'Líder' (organiza) e o 'Sabio' (pesquisa). Todos têm um papel vital na missão.",
        tag: "Gestão de Sala"
    },
    {
        type: 'rpg',
        title: "O Mestre da Aula",
        text: "Assuma o papel de Mestre de RPG. Crie um 'cenário' problemático (o vilão) que só pode ser derrotado com o conhecimento da matéria (a espada mágica).",
        tag: "Storytelling"
    },
    {
        type: 'tip',
        title: "Sorteio com Dados",
        text: "Tem 30 alunos? Use '2d20' (jogar dois dados de 20 lados e somar/adaptar) ou um app de dados para chamar alunos para a lousa. A aleatoriedade é vista como mais justa e divertida pelos alunos.",
        tag: "Dica Rápida"
    },

    // --- Dicas Técnicas ---
    {
        type: 'tip',
        title: "Pair Programming",
        text: "Coloque alunos em duplas: um 'Piloto' (digita) e um 'Copiloto' (revisa). Troque os papéis a cada 15 min. Isso melhora a comunicação e reduz a frustração com o código.",
        tag: "Metodologia"
    },
    {
        type: 'tip',
        title: "Rubber Duck Debugging",
        text: "Ensine seus alunos a explicarem o código linha por linha para um 'pato de borracha' (ou colega) antes de chamar o professor. 90% dos erros são achados assim!",
        tag: "Debug"
    },
    {
        type: 'tip',
        title: "Pensamento Computacional",
        text: "Antes de codar, peça para desenharem a solução no papel (Flowchart). Entender a lógica antes da sintaxe é a chave para o aprendizado real.",
        tag: "Planejamento"
    }
];

export const techCuriosities = [
    {
        type: 'curiosity',
        text: "Você sabia? O primeiro 'bug' de computador foi, na verdade, uma mariposa real presa dentro de uma máquina em 1947!",
        source: "História da Computação"
    },
    {
        type: 'curiosity',
        text: "Ada Lovelace é considerada a primeira programadora da história, e ela escreveu código para uma máquina que nem existia ainda!",
        source: "Mulheres na Tech"
    },
    {
        type: 'curiosity',
        text: "O jogo Minecraft foi criado por uma única pessoa, Markus Persson (Notch), antes de se tornar um sucesso mundial.",
        source: "Game Dev"
    },
    {
        type: 'curiosity',
        text: "Os computadores da Apollo 11 que levaram o homem à Lua tinham menos poder de processamento que o seu celular hoje!",
        source: "Espaço"
    },
    {
        type: 'curiosity',
        text: "A linguagem Python tem esse nome por causa do grupo de comédia 'Monty Python', e não por causa da cobra!",
        source: "Python"
    }
];

export function getTechCuriosity() {
    return techCuriosities[Math.floor(Math.random() * techCuriosities.length)];
}

export function getDailyTip() {
    // Escolhe baseado no dia do ano para ser consistente para todos os users naquele dia
    // Ou aleatório para dinamismo. Vamos de aleatório com "seed" do dia para mudar a cada 24h.

    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Simples hash do dia para escolher o index
    const index = dayOfYear % pedagogicalTips.length;

    return pedagogicalTips[index];
}

export function getRandomTip() {
    return pedagogicalTips[Math.floor(Math.random() * pedagogicalTips.length)];
}
