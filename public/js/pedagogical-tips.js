/**
 * Base de dados de dicas pedagógicas para o Izicode Edu
 * Foco em STEAM, Cultura Maker e Robótica
 */

export const pedagogicalTips = [
    {
        id: "loops-dance",
        title: "Loops com Movimento",
        content: "O conceito de 'Loops' é melhor ensinado com dança! Crie uma sequência de passos (ex: pular, girar, bater palma) e peça para repetirem 3 vezes. Isso introduz a lógica de iteração de forma física.",
        category: "Programação",
        grade: "Fund I e II"
    },
    {
        id: "debug-detective",
        title: "Detetive de Bugs",
        content: "Em vez de corrigir o erro para o aluno, pergunte: 'O que você esperava que acontecesse?' e 'O que está acontecendo agora?'. Deixe que ele identifique a discrepância.",
        category: "Metodologia",
        grade: "Todas"
    },
    {
        id: "unplugged-binary",
        title: "Binário Desplugado",
        content: "Use cartões com 1, 2, 4, 8 e 16 pontos para ensinar números binários. Virar ou desvirar o cartão representa 0 ou 1. É uma maneira visual e tátil de entender a base da computação.",
        category: "Computação",
        grade: "Fund II"
    },
    {
        id: "storytelling-scratch",
        title: "Primeiro o Roteiro",
        content: "Antes de abrir o Scratch, peça para os alunos desenharem um storyboard em papel. Isso reduz a ansiedade de 'não saber por onde começar' e foca na lógica narrativa.",
        category: "Scratch",
        grade: "Fund I"
    },
    {
        id: "maker-trash",
        title: "Lixo Eletrônico Criativo",
        content: "Componentes velhos (como mouses quebrados) são ótimos para desmontar e entender o que tem dentro. Estimula a curiosidade sobre o funcionamento das coisas.",
        category: "Cultura Maker",
        grade: "Ensino Médio"
    },
    {
        id: "restorative-circles",
        title: "Círculos de Diálogo",
        content: "Use círculos de 5 minutos no final da aula para compartilhar 'A maior dificuldade que venci hoje'. Isso fortalece a resiliência e o senso de comunidade.",
        category: "Socioemocional",
        grade: "Todas"
    }
];

export function getDailyTip() {
    // Rotação baseada no dia do ano
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    return pedagogicalTips[dayOfYear % pedagogicalTips.length];
}
