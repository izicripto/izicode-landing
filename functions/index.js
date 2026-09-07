const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

/** Precisa ser a mesma string de isPlatformOwner() em firestore.rules e de
 *  PLATFORM_OWNER_EMAIL no app. */
const PLATFORM_OWNER_EMAIL = 'izicripto@gmail.com';

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
 * Os valores precisam bater com app/src/lib/planos.ts, que é o que a
 * página de planos mostra ao cliente — cobrar diferente do anunciado é
 * problema comercial e jurídico, não só inconsistência de código.
 * Ver docs/MODELO-NEGOCIO.md para o raciocínio de cada preço.
 */
const ABACATEPAY_PLANS = {
    professor_pro: { name: 'Izicode Edu - Professor PRO', priceCents: 3990 },
    pro_anual: { name: 'Izicode Edu - PRO Anual + Kit Arduino', priceCents: 39700 },
    escola: { name: 'Izicode Edu - Plano Escola (base)', priceCents: 24900 },
    aulas_turma: { name: 'Izicode Edu - Turma Online', priceCents: 14900 },
    aulas_individual: { name: 'Izicode Edu - Aula Individual', priceCents: 39900 }
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
                returnUrl: 'https://izicodeedu-532ac.web.app/app',
                completionUrl: 'https://izicodeedu-532ac.web.app/app?payment=success',
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
 * Assistente pedagógico (chat) com a chave gerenciada da Izicode.
 *
 * Só o plano PRO usa esta rota — é a Izicode que paga o uso da API aqui.
 * Contas gratuitas continuam usando a chave pessoal do próprio professor
 * direto do navegador (BYOK), sem passar por aqui.
 */
/*
 * Ordem de fallback dos modelos.
 *
 * 'gemini-flash-latest' vem primeiro de propósito: é um alias que o Google
 * mantém apontando para o flash atual, então não envelhece. Os nomes fixos
 * abaixo são só rede de segurança — e essa lista já esteve quebrada:
 * gemini-2.0-flash e gemini-1.5-flash foram descontinuados e respondiam
 * 404, o que derrubaria toda a IA da plataforma mesmo com chave válida.
 */
const CHAT_MODELS = ["gemini-flash-latest", "gemini-3.8-flash", "gemini-3.6-flash"];

/**
 * As personas ficam NO SERVIDOR e o cliente só escolhe uma pela chave.
 * Aceitar um system prompt vindo do navegador deixaria qualquer usuário
 * reescrever as regras — inclusive as de segurança infantil do tutor —
 * usando a chave de IA que a Izicode paga.
 */
const CHAT_PERSONAS = {
    professor:
        "Você é o assistente pedagógico da Izicode Edu, especialista em robótica " +
        "educacional, cultura maker, BNCC e ensino de programação para crianças e " +
        "adolescentes. Responda em português do Brasil, de forma prática e direta, " +
        "sempre pensando em como o professor vai aplicar aquilo em sala de aula.",
    gestao:
        "Você é o copiloto de gestão da Izicode Edu, uma plataforma de robótica " +
        "educacional. Recebe um resumo AGREGADO e anônimo da base (contagens, " +
        "distribuições, indicadores) e ajuda a interpretá-lo. REGRAS: " +
        "1) Responda em português do Brasil, direto ao ponto, como um sócio " +
        "analisando o negócio — não como consultor genérico. " +
        "2) Baseie-se apenas nos números do resumo: se algo não estiver ali, diga " +
        "que não dá para afirmar, em vez de estimar. " +
        "3) Quando sugerir uma ação, diga qual número te levou a ela. " +
        "4) Não invente nomes de usuários, escolas ou valores de receita. " +
        "5) Prefira duas ou três recomendações concretas a uma lista longa.",
    aluno:
        "Você é o 'Tutor Izicode', um assistente amigável para crianças e adolescentes. " +
        "REGRAS: 1) Você SÓ responde sobre Programação, Robótica, Lógica, Matemática e " +
        "Ciências. 2) Se perguntarem sobre qualquer outro assunto (violência, política, " +
        "relacionamentos, conteúdo adulto, fofoca), recuse gentilmente e convide de volta: " +
        "'Eu sou um robô de programação, só sei falar de código! Que tal criarmos um jogo?'. " +
        "3) Use linguagem simples, exemplos divertidos e emojis com moderação. " +
        "4) Nunca entregue a resposta pronta do dever de casa — dê pistas para o aluno chegar lá. " +
        "5) Seja sempre encorajador e nunca peça dados pessoais da criança."
};

function resolvePersona(value) {
    return CHAT_PERSONAS[value] ? value : "professor";
}

exports.aiChat = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    }

    const history = Array.isArray(data.history) ? data.history : [];
    const message = typeof data.message === 'string' ? data.message.trim() : '';
    if (!message) {
        throw new functions.https.HttpsError('invalid-argument', 'Mensagem vazia.');
    }

    const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    // O e-mail vem do token verificado pelo Firebase Auth, não do
    // documento — a conta dona da plataforma continua tendo IA mesmo que
    // o doc dela esteja incompleto ou tenha sido alterado.
    const ehDono = (context.auth.token.email || '').toLowerCase() === PLATFORM_OWNER_EMAIL;
    const isPro = ehDono || userData.role === 'professor-pro' || userData.role === 'admin' ||
        userData.role === 'dev' || userData.subscription?.plan === 'pro';

    if (!isPro) {
        // Fail-closed: sem plano pago, o cliente deve usar a própria chave.
        throw new functions.https.HttpsError(
            'permission-denied',
            'O assistente com a chave da Izicode é exclusivo do plano PRO. ' +
            'Configure sua chave pessoal do Gemini para usar no plano gratuito.'
        );
    }

    const GEMINI_API_KEY = functions.config().gemini?.key;
    if (!GEMINI_API_KEY) {
        console.error("Configuração 'gemini.key' ausente no Firebase Functions");
        throw new functions.https.HttpsError('failed-precondition', 'Assistente indisponível no momento.');
    }

    // Só as últimas trocas vão para a API: além de baratear a chamada, evita
    // estourar o limite de contexto numa conversa longa.
    const persona = resolvePersona(data.persona);
    const contents = [
        { role: 'user', parts: [{ text: CHAT_PERSONAS[persona] }] },
        { role: 'model', parts: [{ text: 'Entendido. Como posso ajudar?' }] },
        ...history.slice(-12).map((m) => ({
            role: m.role === 'ai' || m.role === 'model' ? 'model' : 'user',
            parts: [{ text: String(m.text || '').slice(0, 8000) }]
        })),
        { role: 'user', parts: [{ text: message.slice(0, 8000) }] }
    ];

    let lastError = null;
    for (const model of CHAT_MODELS) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
            const response = await axios.post(url, { contents });
            const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) return { success: true, text, model };
            lastError = new Error(`Resposta vazia do modelo ${model}`);
        } catch (error) {
            // Modelo indisponível/renomeado: tenta o próximo da lista antes
            // de desistir, já que os nomes do Gemini mudam com frequência.
            lastError = error;
            console.warn(`Modelo ${model} falhou:`, error.response?.data?.error?.message || error.message);
        }
    }

    console.error('Todos os modelos falharam no aiChat:', lastError?.message);
    throw new functions.https.HttpsError('internal', 'A IA não respondeu. Tente novamente em instantes.');
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

    // Conta autenticada sem doc no Firestore (cadastro recém-criado, ou
    // perfil ainda não gravado) vale como plano gratuito zerado. Antes
    // isso virava 'not-found' e o professor batia num beco sem saída,
    // sem entender que bastava completar o cadastro.
    const userData = userDoc.exists ? userDoc.data() : {};
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
        // Mesma lista de fallback do chat: modelo fixo aqui já quebrou a
        // geração inteira quando o Google descontinuou o gemini-2.0-flash.
        const modelo = CHAT_MODELS[0];
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

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

        // Incrementar contador de uso. set/merge em vez de update porque
        // o doc do usuário pode ainda não existir (ver acima) — update
        // falharia e o professor perderia o plano recém-gerado.
        await userRef.set({
            aiUsageCount: admin.firestore.FieldValue.increment(1)
        }, { merge: true });

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
