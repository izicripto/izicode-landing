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
 * AbacatePay Webhook - libera o plano PRO (professor autônomo) ou ativa
 * o plano da escola automaticamente após confirmação de pagamento.
 *
 * Configure em `firebase functions:config:set abacatepay.webhook_secret="..."`
 * e cadastre a URL desta function com `?webhookSecret=<mesmo valor>` no
 * painel da AbacatePay (é assim que a AbacatePay autentica webhooks: um
 * secret na própria query string da URL, não em header/assinatura HMAC).
 * Fail-closed: sem secret configurado ou secret incorreto, rejeita com 401.
 */
exports.abacatePayWebhook = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send({ error: 'Method not allowed' });
        return;
    }

    const expectedSecret = functions.config().abacatepay?.webhook_secret;
    const providedSecret = req.query?.webhookSecret;
    if (!expectedSecret || providedSecret !== expectedSecret) {
        console.error("AbacatePay Webhook: webhookSecret ausente ou inválido. Recusando.");
        res.status(401).send({ error: 'Unauthorized' });
        return;
    }

    const event = req.body?.event;
    const billing = req.body?.data?.billing || req.body?.data || {};

    if (event !== 'billing.paid') {
        console.log("AbacatePay Webhook: evento ignorado:", event);
        res.status(200).send({ received: true, ignored: true });
        return;
    }

    const email = billing?.customer?.metadata?.email || billing?.customer?.email;
    const targetSchoolId = billing?.metadata?.schoolId || billing?.frequency?.metadata?.schoolId;

    if (!email && !targetSchoolId) {
        console.error("AbacatePay Webhook: nenhum email de cliente ou schoolId no payload.");
        res.status(400).send({ error: 'Missing customer email or schoolId' });
        return;
    }

    try {
        if (targetSchoolId) {
            // Pagamento do pacote Escola: ativa o plano da escola (turmas liberadas).
            await admin.firestore().collection('schools').doc(targetSchoolId).set({
                plan: 'active',
                activatedAt: admin.firestore.FieldValue.serverTimestamp(),
                paymentProvider: 'abacatepay'
            }, { merge: true });
            console.log(`AbacatePay: escola ${targetSchoolId} ativada (plan=active).`);
        } else {
            // Pagamento do professor autônomo: libera o plano PRO da conta.
            const usersSnap = await admin.firestore().collection('users').where('email', '==', email).limit(1).get();
            if (usersSnap.empty) {
                console.error(`AbacatePay Webhook: nenhum usuário encontrado para o email ${email}.`);
                res.status(404).send({ error: 'User not found' });
                return;
            }
            await usersSnap.docs[0].ref.set({
                subscription: {
                    plan: 'pro',
                    provider: 'abacatepay',
                    activatedAt: admin.firestore.FieldValue.serverTimestamp()
                }
            }, { merge: true });
            console.log(`AbacatePay: usuário ${email} promovido a plano PRO.`);
        }

        res.status(200).send({ received: true });
    } catch (error) {
        console.error("AbacatePay Webhook: erro ao processar pagamento:", error.message);
        res.status(500).send({ error: 'Internal error processing payment' });
    }
});

/**
 * Cria uma cobrança na AbacatePay e devolve a URL de checkout para o
 * front-end redirecionar o usuário. A chave da API (AbacatePay API Key)
 * fica só no servidor (functions.config().abacatepay.api_key) — nunca no
 * cliente. Configure com:
 *   firebase functions:config:set abacatepay.api_key="abc_..." abacatepay.webhook_secret="..."
 *
 * Valores de referência (ajustar depois com o time comercial):
 *   professor_pro: R$ 29,90/mês | escola: R$ 199,90/mês (base, cobrado por
 *   professor+aluno em cima disso — ajustar quando o modelo de preço por
 *   assento estiver definido).
 */
const ABACATEPAY_PLANS = {
    professor_pro: { name: 'Izicode Edu - Professor PRO', priceCents: 2990 },
    escola: { name: 'Izicode Edu - Plano Escola', priceCents: 19990 }
};

exports.createAbacatePayCheckout = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    }

    const { plan, schoolId } = data;
    const planConfig = ABACATEPAY_PLANS[plan];
    if (!planConfig) {
        throw new functions.https.HttpsError('invalid-argument', `Plano desconhecido: ${plan}`);
    }

    const apiKey = functions.config().abacatepay?.api_key;
    if (!apiKey) {
        console.error("Configuração 'abacatepay.api_key' ausente no Firebase Functions");
        throw new functions.https.HttpsError('failed-precondition', 'Pagamentos temporariamente indisponíveis.');
    }

    const userRecord = await admin.auth().getUser(context.auth.uid);

    try {
        const response = await axios.post(
            'https://api.abacatepay.com/v1/billing/create',
            {
                frequency: 'ONE_TIME',
                methods: ['PIX'],
                products: [{
                    externalId: plan,
                    name: planConfig.name,
                    quantity: 1,
                    price: planConfig.priceCents
                }],
                returnUrl: 'https://izicodeedu-532ac.web.app/dashboard.html',
                completionUrl: 'https://izicodeedu-532ac.web.app/dashboard.html?payment=success',
                customer: {
                    name: userRecord.displayName || 'Usuário Izicode',
                    email: userRecord.email,
                    metadata: { email: userRecord.email }
                },
                metadata: schoolId ? { schoolId } : undefined
            },
            { headers: { Authorization: `Bearer ${apiKey}` } }
        );

        const checkoutUrl = response.data?.data?.url;
        if (!checkoutUrl) {
            throw new Error('AbacatePay não retornou uma URL de checkout.');
        }

        return { success: true, checkoutUrl };
    } catch (error) {
        console.error("AbacatePay: erro ao criar cobrança:", error.response?.data || error.message);
        throw new functions.https.HttpsError('internal', 'Erro ao iniciar o pagamento. Tente novamente.');
    }
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
    const isPro = userData.role === 'professor-pro' || userData.role === 'admin' || userData.subscription?.plan === 'pro';
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
