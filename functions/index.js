const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

exports.newLeadNotification = functions.firestore.document('leads/{leadId}').onCreate(async (snap, context) => {
    const lead = snap.data();
    const config = functions.config().telegram;

    if (!config || !config.token || !config.chat_id) {
        console.error("Telegram config missing");
        return null;
    }

    const TELEGRAM_TOKEN = config.token;
    const TELEGRAM_CHAT_ID = config.chat_id;

    const message = `🟢 *Novo Lead via Formulário Interno*
📅 ${new Date().toLocaleString('pt-BR')}

*Nome:* ${lead.name}
*Email:* ${lead.email}
*Escola:* ${lead.schoolName || 'Não informada'}
*Cargo:* ${lead.role || 'Não informado'}

*Mensagem:* ${lead.message || 'Sem mensagem adicional'}`;

    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: "Markdown"
            })
        });
        console.log("Telegram notification sent successfully");
    } catch (error) {
        console.error("Error sending Telegram notification", error);
    }

    return null;
});

/**
 * Stripe Webhook - Para liberar planos PRO automaticamente
 * TODO: Configurar STRIPE_WEBHOOK_SECRET no firebase config
 */
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    // Lógica de verificação de assinatura e atualização do role do usuário para 'professor-pro'
    // Logamos o evento para debug por enquanto
    console.log("Stripe Webhook received:", req.body.type);
    res.status(200).send({ received: true });
});

/**
 * Gerador de Projetos com IA (Seguro)
 * Controla limites de uso por usuário e integra com Gemini
 */
exports.generateAIProject = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    }

    const { target, subject, objective } = data;
    if (!target || !subject || !objective) {
        throw new functions.https.HttpsError('invalid-argument', 'Campos obrigatórios ausentes: target, subject ou objective.');
    }

    const userId = context.auth.uid;
    const userRef = admin.firestore().collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Usuário não encontrado no banco de dados.');
    }

    const userData = userDoc.data();
    const isPro = userData.role === 'professor-pro' || userData.role === 'admin';
    const usageCount = userData.aiUsageCount || 0;

    if (!isPro && usageCount >= 3) {
        throw new functions.https.HttpsError('resource-exhausted', 'Limite de uso gratuito atingido. Assine o plano PRO.');
    }

    const GEMINI_API_KEY = functions.config().gemini?.key;
    if (!GEMINI_API_KEY) {
        console.error("Configuração 'gemini.key' ausente no Firebase Functions");
        throw new functions.https.HttpsError('failed-precondition', 'Erro de configuração no servidor (IA key missing).');
    }

    console.log(`Iniciando geração IA para usuário ${userId}. Key presente: ${GEMINI_API_KEY.substring(0, 5)}...`);

    const prompt = `
        Você é um especialista em robótica educacional, BNCC e na API do Arduino IoT Cloud.
        Gere um PLANO DE AULA detalhado com os seguintes critérios:
        - Matéria/Tema: ${subject}
        - Público Alvo: ${target}
        - Objetivo Pedagógico: ${objective}
        
        Se o tema envolver Arduino, integre conceitos do Arduino IoT Cloud:
        1. Identifique as "Things" e "Properties" necessárias.
        2. Descreva os "Dashboards/Widgets" recomendados.
        3. Forneça um exemplo de como usar a API do Arduino Cloud para automação ou monitoramento.
        
        O plano deve seguir um destes modelos de aprendizado:
        - MODELO EXPLORATIVO: Foco em observação e coleta de dados brutos.
        - MODELO CRIATIVO: Alunos propõem soluções para problemas usando atuadores.
        - MODELO DE SISTEMAS: Foco em integração de múltiplos dispositivos e lógica em nuvem.
        
        O resultado deve conter: 
        1. Título do Projeto
        2. Materiais Necessários
        3. Configuração IoT (Things/Properties)
        4. Passo a Passo Detalhado
        5. Sugestão de Dashboard
        6. Critérios de Avaliação BNCC
        
        Retorne o resultado formatado em MARKDOWN puro, sem blocos de código extras (não use \`\`\`markdown no início).
    `;

    try {
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

        const response = await axios.post(
            url,
            {
                contents: [{
                    role: "user",
                    parts: [{ text: prompt }]
                }]
            }
        );

        if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error("Resposta inválida da API Gemini");
        }

        const aiText = response.data.candidates[0].content.parts[0].text;

        // Salvar projeto automaticamente na subcoleção 'projects' do usuário
        const projectRef = await userRef.collection('projects').add({
            title: `Plano de Aula: ${subject}`,
            content: aiText,
            target: target,
            objective: objective,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            type: 'ai_generated'
        });

        // Incrementar contador de uso
        await userRef.update({
            aiUsageCount: admin.firestore.FieldValue.increment(1)
        });

        return {
            success: true,
            content: aiText,
            projectId: projectRef.id
        };

    } catch (error) {
        const errorData = error.response?.data || {};
        console.error("Gemini API Error Detail:", JSON.stringify(errorData, null, 2));
        console.error("Internal Error Message:", error.message);

        throw new functions.https.HttpsError('internal', `Erro no processamento da IA: ${error.message}. Detalhes: ${JSON.stringify(errorData)}`);
    }
});
