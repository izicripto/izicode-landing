export const quizData = [
    {
        id: "log-001",
        category: "Lógica",
        difficulty: "easy",
        question: "O que é um Algoritmo?",
        options: [
            "Um tipo de vírus de computador",
            "Uma sequência de passos para resolver um problema",
            "Um peça do computador",
            "Um jogo famoso"
        ],
        correct: 1,
        explanation: "Algoritmo é como uma receita de bolo: um passo a passo lógico para chegar a um resultado.",
        xp: 10
    },
    {
        id: "log-002",
        category: "Lógica",
        difficulty: "easy",
        question: "Qual forma geométrica representa uma DECISÃO (se/senão) no fluxograma?",
        options: [
            "Retângulo",
            "Círculo",
            "Losango",
            "Triângulo"
        ],
        correct: 2,
        explanation: "O Losango é usado para decisões onde o caminho se divide em 'Sim' ou 'Não'.",
        xp: 15
    },
    {
        id: "log-003",
        category: "Lógica",
        difficulty: "medium",
        question: "Em um loop 'Enquanto' (While), o código roda...",
        options: [
            "Apenas uma vez",
            "Para sempre, sem parar",
            "Enquanto a condição for verdadeira",
            "Até alguém desligar o computador"
        ],
        correct: 2,
        explanation: "O loop 'Enquanto' verifica a condição antes de cada repetição e só para quando ela for falsa.",
        xp: 20
    },
    {
        id: "ard-001",
        category: "Arduino",
        difficulty: "easy",
        question: "Qual função do Arduino roda apenas UMA vez ao ligar?",
        options: [
            "void loop()",
            "void start()",
            "void setup()",
            "void begin()"
        ],
        correct: 2,
        explanation: "O void setup() serve para configurar os pinos e iniciar bibliotecas, rodando só no início.",
        xp: 10
    },
    {
        id: "ard-002",
        category: "Arduino",
        difficulty: "medium",
        question: "Para que serve o pino GND?",
        options: [
            "Fornecer 5 Volts",
            "Enviar dados para o computador",
            "É o Terra (Negativo/0V) do circuito",
            "Ligar o LED sozinho"
        ],
        correct: 2,
        explanation: "GND significa Ground (Terra), e é o polo negativo comum necessário para fechar o circuito.",
        xp: 15
    },
    {
        id: "ard-003",
        category: "Arduino",
        difficulty: "hard",
        question: "O que é um sinal PWM?",
        options: [
            "Uma forma de simular voltagem analógica ligando/desligando rápido",
            "Um tipo de sensor de temperatura",
            "Uma biblioteca de WiFi",
            "Um erro de compilação"
        ],
        correct: 0,
        explanation: "PWM (Pulse Width Modulation) controla a potência (brilho do LED, velocidade do motor) pulsando o sinal digital.",
        xp: 30
    },
    {
        id: "scr-001",
        category: "Scratch",
        difficulty: "easy",
        question: "Qual bloco usamos para iniciar um código ao clicar na bandeira verde?",
        options: [
            "Quando a tecla espaço for pressionada",
            "Quando bandeira verde for clicada",
            "Mova 10 passos",
            "Espere 1 segundo"
        ],
        correct: 1,
        explanation: "É o bloco de evento principal para iniciar a maioria dos jogos no Scratch.",
        xp: 10
    },
    {
        id: "scr-002",
        category: "Scratch",
        difficulty: "medium",
        question: "O que é uma 'Variável' no Scratch?",
        options: [
            "Um personagem do jogo",
            "Um cenário que muda de cor",
            "Um espaço na memória para guardar números ou textos (como pontuação)",
            "Um bloco que faz som"
        ],
        correct: 2,
        explanation: "Variáveis são como caixas com etiquetas onde guardamos informações que podem mudar, como 'Vidas' ou 'Pontos'.",
        xp: 20
    },
    {
        id: "scr-003",
        category: "Scratch",
        difficulty: "medium",
        question: "Para fazer um personagem andar para sempre, qual estrutura usamos?",
        options: [
            "Repita 10 vezes",
            "Se... então",
            "Sempre",
            "Espere até que"
        ],
        correct: 2,
        explanation: "O bloco 'Sempre' (Loop infinito) faz com que as ações dentro dele se repitam continuadamente.",
        xp: 15
    },
    {
        id: "maker-001",
        category: "Maker",
        difficulty: "easy",
        question: "O que significa DIY?",
        options: [
            "Do It Yesterday (Faça Ontem)",
            "Do It Yourself (Faça Você Mesmo)",
            "Digital Is Young (O Digital é Jovem)",
            "Dance In Yard (Dance no Quintal)"
        ],
        correct: 1,
        explanation: "DIY é a essência da cultura Maker: colocar a mão na massa e construir suas próprias coisas!",
        xp: 10
    },
    {
        id: "maker-002",
        category: "Maker",
        difficulty: "medium",
        question: "Qual ferramenta usamos para colar componentes com calor?",
        options: [
            "Cola Branca",
            "Fita Adesiva",
            "Pistola de Cola Quente",
            "Grampeador"
        ],
        correct: 2,
        explanation: "A cola quente é a melhor amiga do Maker para prototipagem rápida com papelão e materiais recicláveis.",
        xp: 15
    },
    {
        id: "tech-001",
        category: "Lógica",
        difficulty: "hard",
        question: "O que é um 'Bug'?",
        options: [
            "Um inseto de verdade dentro do computador",
            "Uma falha ou erro no código",
            "Um tipo de robô espião",
            "Um super computador"
        ],
        correct: 1,
        explanation: "Bug é o nome dado a falhas de software. O termo surgiu quando um inseto real causou curto num computador antigo!",
        xp: 20
    }
];
