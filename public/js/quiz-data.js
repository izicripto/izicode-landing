/**
 * Banco de Questões do Quiz Izicode
 * Categorias: Lógica, Arduino, Scratch, Micro:bit, Cultura Maker
 */

export const quizData = [
    // --- LÓGICA DE PROGRAMAÇÃO ---
    {
        id: "log-001",
        category: "Lógica",
        difficulty: "easy",
        question: "O que é um Algoritmo?",
        options: [
            "Um tipo de vírus de computador",
            "Uma sequência de passos para resolver um problema",
            "Uma peça do computador",
            "Um jogo famoso"
        ],
        correct: 1, // Index da resposta certa (0-3)
        explanation: "Algoritmo é como uma receita de bolo: um passo a passo lógico para chegar a um resultado.",
        xp: 10
    },
    {
        id: "log-002",
        category: "Lógica",
        difficulty: "easy",
        question: "Qual destes é um exemplo de 'Loop' (Repetição)?",
        options: [
            "Dar um passo para frente",
            "Pular 10 vezes",
            "Virar a direita",
            "Parar"
        ],
        correct: 1,
        explanation: "Pular 10 vezes é uma ação que se repete várias vezes, ou seja, um Loop.",
        xp: 10
    },
    {
        id: "log-003",
        category: "Lógica",
        difficulty: "medium",
        question: "Em programação, o que é uma 'Variável'?",
        options: [
            "Algo que nunca muda",
            "Uma caixa para guardar informações (dados)",
            "Um erro no código",
            "A tela do computador"
        ],
        correct: 1,
        explanation: "Variáveis são espaços na memória para guardar dados, como pontos de um jogo ou nome de um usuário.",
        xp: 15
    },
    {
        id: "log-004",
        category: "Lógica",
        difficulty: "hard",
        question: "O que significa 'Debugging'?",
        options: [
            "Colocar insetos no computador",
            "Criar um jogo novo",
            "Encontrar e corrigir erros no código",
            "Desligar o computador"
        ],
        correct: 2,
        explanation: "Debugging (ou depuração) é o processo de caçar e arrumar bugs (erros) no seu programa.",
        xp: 25
    },

    // --- ARDUINO ---
    {
        id: "ard-001",
        category: "Arduino",
        difficulty: "easy",
        question: "Qual função do Arduino roda apenas UMA vez quando ligamos a placa?",
        options: [
            "void loop()",
            "void setup()",
            "void start()",
            "void play()"
        ],
        correct: 1,
        explanation: "O 'void setup()' serve para configurar a placa e roda só no início.",
        xp: 10
    },
    {
        id: "ard-002",
        category: "Arduino",
        difficulty: "medium",
        question: "Para que serve o comando 'digitalWrite(13, HIGH);'?",
        options: [
            "Lê um valor da porta 13",
            "Desliga a porta 13",
            "Liga (envia energia) para a porta 13",
            "Muda a cor da porta 13"
        ],
        correct: 2,
        explanation: "HIGH significa 'Alto' ou 'Ligado' (5V). Então ele liga o componente na porta 13.",
        xp: 15
    },
    {
        id: "ard-003",
        category: "Arduino",
        difficulty: "medium",
        question: "Qual componente usamos para limitar a corrente e proteger um LED?",
        options: [
            "Botão",
            "Resistor",
            "Bateria",
            "Motor"
        ],
        correct: 1,
        explanation: "O Resistor 'resiste' à passagem de energia, evitando que o LED queime por excesso de corrente.",
        xp: 15
    },

    // --- SCRATCH ---
    {
        id: "scr-001",
        category: "Scratch",
        difficulty: "easy",
        question: "Qual bloco usamos para iniciar um programa no Scratch?",
        options: [
            "Quando a bandeira verde for clicada",
            "Espere 1 segundo",
            "Mova 10 passos",
            "Diga Olá"
        ],
        correct: 0,
        explanation: "A bandeira verde é o sinal universal de 'Start' no Scratch.",
        xp: 10
    },
    {
        id: "scr-002",
        category: "Scratch",
        difficulty: "easy",
        question: "No Scratch, os personagens são chamados de:",
        options: [
            "Bonecos",
            "Sprites (Atores)",
            "Figurinhas",
            "Avatares"
        ],
        correct: 1,
        explanation: "O termo técnico no Scratch é Sprite ou Ator.",
        xp: 10
    },
    {
        id: "scr-003",
        category: "Scratch",
        difficulty: "medium",
        question: "Se quisermos que o gato 'mie' quando encostar no cachorro, qual bloco usamos?",
        options: [
            "Mova 10 passos",
            "Sensores (Tocando em...)",
            "Caneta",
            "Vá para x:0 y:0"
        ],
        correct: 1,
        explanation: "Usamos blocos de Sensores para detectar colisões (tocando em).",
        xp: 15
    },

    // --- CULTURA MAKER ---
    {
        id: "mkr-001",
        category: "Maker",
        difficulty: "easy",
        question: "O que significa DIY?",
        options: [
            "Do It Yourself (Faça Você Mesmo)",
            "Dia Incrível Yate",
            "Dance In Yard",
            "Domingo Iogurte Yoga"
        ],
        correct: 0,
        explanation: "DIY é a alma da cultura maker: criar, consertar e modificar coisas com as próprias mãos.",
        xp: 10
    },
    {
        id: "mkr-002",
        category: "Maker",
        difficulty: "medium",
        question: "Qual destas ferramentas derrete plástico para criar objetos 3D?",
        options: [
            "Cortadora a Laser",
            "Impressora 3D",
            "Parafusadeira",
            "Alicate"
        ],
        correct: 1,
        explanation: "A Impressora 3D deposita camadas de plástico derretido (filamento) para criar formas.",
        xp: 15
    }
];

export function getQuestionsByCategory(category) {
    if (category === 'All') return quizData;
    return quizData.filter(q => q.category === category);
}

export function getRandomQuestion() {
    return quizData[Math.floor(Math.random() * quizData.length)];
}
