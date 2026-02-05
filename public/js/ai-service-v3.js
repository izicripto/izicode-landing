/**
 * AI Service for Izicode Edu - V3
 * Integration with Gemini API for dynamic quiz generation
 */

// Retrieve API Key from LocalStorage (set by Assistant Settings)
const getApiKey = () => localStorage.getItem('gemini_api_key');

export async function generateProjectQuiz(projectTitle, projectContent, userRole = 'student') {
    console.log(`Generating AI Quiz (V3) for: ${projectTitle} (Role: ${userRole})`);

    const isTeacher = ['teacher', 'freelance_teacher', 'school_admin'].includes(userRole);

    const basePersonality = isTeacher
        ? "Você é um especialista em pedagogia e robótica educacional."
        : "Você é um tutor de robótica e programação para crianças chamado Izicode.";

    const targetAudience = isTeacher
        ? "professores e educadores (foco em domínio técnico e aplicação pedagógica)"
        : "crianças de 8 a 14 anos (linguagem simples e gamificada)";

    const prompt = `
        ${basePersonality}
        Com base STRICTAMENTE no conteúdo do projeto abaixo, gere 3 perguntas de múltipla escolha para testar o conhecimento do ${isTeacher ? 'educador' : 'aluno'}.
        
        CONTEÚDO DO PROJETO:
        Título: ${projectTitle}
        Markdown do Projeto:
        """
        ${projectContent}
        """
        
        REGRAS CRÍTICAS:
        1. As perguntas DEVEM ser sobre conceitos, materiais ou passos descritos no conteúdo ACIMA.
        2. Não use conhecimento geral fora desse conteúdo.
        3. Público Alvo: ${targetAudience}.
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

    // Validation
    const apiKey = getApiKey();
    console.log("AI Service V3 - Key Loaded:", apiKey ? `${apiKey.substring(0, 4)}...` : "NONE");

    if (!apiKey || apiKey.includes('PLACEHOLDER')) {
        if (apiKey) localStorage.removeItem('gemini_api_key'); 
        throw new Error("Chave API Inválida (PLACEHOLDER detectado). Configure novamente no Assistente IA.");
    }

    // Models - Priority to 2.5
    const models = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
    let errors = [];

    for (const model of models) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

            console.log(`Tentando gerar quiz com modelo: ${model}`);

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        responseMimeType: "application/json"
                    }
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                // If it's a key error, don't retry, just fail
                if (errText.includes('API_KEY')) throw new Error("Chave API Inválida");
                throw new Error(`Status ${response.status}: ${errText}`);
            }

            const data = await response.json();
            const result = JSON.parse(data.candidates[0].content.parts[0].text);
            return result.questions;

        } catch (error) {
            console.warn(`Erro com modelo ${model}:`, error);
            errors.push(`${model}: ${error.message}`);
            // Continue to next model
        }
    }

    // If all failed
    const finalErrorMessage = errors.join(" | ");
    console.error("Todas as tentativas de IA falharam (V4):", finalErrorMessage);
    throw new Error(`Falha na IA (V4): ${finalErrorMessage}`);
}
