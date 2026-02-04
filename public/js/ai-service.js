/**
 * AI Service for Izicode Edu
 * Integration with Gemini API for dynamic quiz generation
 */

// Replace with your API Key or handle via Firebase Config/Functions
const GEMINI_API_KEY = "PLACEHOLDER_API_KEY";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function generateProjectQuiz(projectTitle, projectContent) {
    console.log(`Generating AI Quiz for: ${projectTitle}`);

    const prompt = `
        Você é um tutor de robótica e programação para crianças chamado Izicode.
        Com base STRICTAMENTE no conteúdo do projeto abaixo, gere 3 perguntas de múltipla escolha para testar o conhecimento do aluno.
        
        CONTEÚDO DO PROJETO:
        Título: ${projectTitle}
        Markdown do Projeto:
        """
        ${projectContent}
        """
        
        REGRAS CRÍTICAS:
        1. As perguntas DEVEM ser sobre conceitos, materiais ou passos descritos no conteúdo ACIMA.
        2. Não use conhecimento geral fora desse conteúdo (ex: se o projeto não cita 'resistores', não pergunte sobre eles).
        3. A linguagem deve ser amigável e simples (alvo: 8-14 anos).
        4. Cada pergunta deve ter 4 opções. Apenas uma resposta está correta.
        5. Forneça uma explicação curta do PORQUÊ a resposta está correta.
        6. Retorne APENAS um objeto JSON no seguinte formato:
        {
            "questions": [
                {
                    "question": "texto da pergunta",
                    "options": ["opção 1", "opção 2", "opção 3", "opção 4"],
                    "correct": 0,
                    "explanation": "explicação curta",
                    "xp": 20
                }
            ]
        }
    `;

    try {
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        });

        if (!response.ok) throw new Error("Falha na chamada da IA");

        const data = await response.json();
        const result = JSON.parse(data.candidates[0].content.parts[0].text);
        return result.questions;

    } catch (error) {
        console.error("Erro ao gerar quiz com IA:", error);
        // Fallback or re-throw
        throw error;
    }
}
