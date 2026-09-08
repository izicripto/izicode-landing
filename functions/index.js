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
/**
 * Confere a assinatura de um webhook no padrao Standard Webhooks.
 *
 * O conteudo assinado e "<webhook-id>.<webhook-timestamp>.<corpo cru>", e
 * o corpo precisa ser exatamente os bytes recebidos: reserializar o JSON
 * com JSON.stringify muda espacos e ordem de chaves, e a assinatura passa
 * a nunca bater. Por isso usamos req.rawBody.
 */
function assinaturaValida(req, segredo) {
    const crypto = require('crypto');
    const id = req.headers['webhook-id'];
    const timestamp = req.headers['webhook-timestamp'];
    const cabecalho = req.headers['webhook-signature'];
    if (!id || !timestamp || !cabecalho) return false;

    // Evento antigo demais e recusado: sem isso, quem capturasse uma
    // entrega valida poderia reenvia-la para sempre e liberar planos.
    const idadeSegundos = Math.abs(Date.now() / 1000 - Number(timestamp));
    if (!Number.isFinite(idadeSegundos) || idadeSegundos > 300) {
        console.error('AbacatePay Webhook: evento fora da janela de tempo.');
        return false;
    }

    const corpo = req.rawBody ? req.rawBody.toString('utf8') : JSON.stringify(req.body || {});
    const conteudo = `${id}.${timestamp}.${corpo}`;

    // O padrao guarda o segredo como "whsec_<base64>"; um segredo em texto
    // puro tambem funciona, e e o que geramos por aqui.
    const chave = String(segredo).startsWith('whsec_')
        ? Buffer.from(String(segredo).slice(6), 'base64')
        : Buffer.from(String(segredo), 'utf8');

    const esperada = crypto.createHmac('sha256', chave).update(conteudo).digest('base64');

    // O header pode trazer varias assinaturas separadas por espaco, cada
    // uma no formato "v1,<base64>".
    return String(cabecalho).split(' ').some((parte) => {
        const valor = parte.includes(',') ? parte.split(',')[1] : parte;
        const a = Buffer.from(valor || '');
        const b = Buffer.from(esperada);
        // Comparacao em tempo constante: com === o tempo de resposta
        // entrega quantos caracteres iniciais ja batem.
        return a.length === b.length && crypto.timingSafeEqual(a, b);
    });
}

exports.abacatePayWebhook = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send({ error: 'Method not allowed' });
        return;
    }

    const expectedSecret = functions.config().abacatepay?.webhook_secret;
    if (!expectedSecret) {
        console.error('AbacatePay Webhook: abacatepay.webhook_secret nao configurado. Recusando.');
        res.status(401).send({ error: 'Unauthorized' });
        return;
    }

    // A AbacatePay v2 assina os webhooks pelo padrao Standard Webhooks:
    // tres headers (webhook-id, webhook-timestamp, webhook-signature) e
    // HMAC-SHA256 sobre "id.timestamp.corpo".
    //
    // Nao ha segredo na query string. A versao anterior deste codigo lia
    // req.query.webhookSecret, convencao da v1, e por isso recusava todo
    // evento com 401 — o painel da AbacatePay mostrava "Falha" em cada
    // entrega e o log daqui dizia so "secret ausente ou invalido", sem
    // pista de que o mecanismo inteiro era outro.
    const autenticado =
        assinaturaValida(req, expectedSecret) ||
        // Reserva para um webhook cadastrado a moda antiga, com o segredo
        // na propria URL.
        (req.query?.webhookSecret && req.query.webhookSecret === expectedSecret);

    if (!autenticado) {
        // Registra os NOMES do que veio, nunca os valores.
        console.error(
            'AbacatePay Webhook: nao autenticado. Recusando. ' +
            `query=[${Object.keys(req.query || {}).join(', ')}] ` +
            `headers=[${Object.keys(req.headers || {}).filter((h) => /webhook|signature|secret/i.test(h)).join(', ')}]`
        );
        res.status(401).send({ error: 'Unauthorized' });
        return;
    }

    // Eventos de pagamento confirmado na API v2. 'billing.paid' era o nome
    // na v1 e fica aqui só para nao quebrar caso alguma cobranca antiga
    // ainda dispare o evento velho.
    const EVENTOS_PAGOS = [
        'transparent.completed',
        'checkout.completed',
        'subscription.completed',
        'billing.paid'
    ];

    // O nome do campo do evento variou entre versoes da API, entao
    // aceitamos os tres nomes em uso em vez de depender de um so.
    const event = req.body?.event || req.body?.type || req.body?.data?.event;

    if (!EVENTOS_PAGOS.includes(event)) {
        // Nomes dos campos, nunca os valores: e o que permite descobrir a
        // forma real do payload sem escrever dado de cliente no log.
        console.log(
            `AbacatePay Webhook: evento ignorado: ${event} | ` +
            `campos=[${Object.keys(req.body || {}).join(', ')}] | ` +
            `campos de data=[${Object.keys(req.body?.data || {}).join(', ')}]`
        );
        res.status(200).send({ received: true, ignored: true });
        return;
    }

    // Onde a cobranca fica no payload depende do tipo do evento:
    //   transparent.completed -> data.transparent   (Pix e boleto)
    //   checkout.completed    -> data.checkout
    //   billing.paid (v1)     -> data.billing
    // Descobrir isso custou uma rodada de log: a documentacao mostra um
    // 'data' generico, e o codigo procurava so por 'billing'.
    const corpoData = req.body?.data || {};
    const cobranca =
        corpoData.transparent ||
        corpoData.checkout ||
        corpoData.billing ||
        corpoData.subscription ||
        corpoData;

    const metadata = cobranca?.metadata || corpoData?.metadata || {};
    const email =
        corpoData?.customer?.email ||
        corpoData?.customer?.metadata?.email ||
        cobranca?.customer?.email ||
        corpoData?.payerInformation?.email;
    const paymentId = metadata.paymentId;

    try {
        const db = admin.firestore();

        // Caminho normal: a cobrança foi criada por createAbacatePayCheckout,
        // então existe um documento em /payments com uid, plano e valor já
        // registrados. Nada aqui depende do que o payload do webhook diz
        // sobre preço ou plano — só de qual pagamento ele identifica.
        let ref = paymentId ? db.collection('payments').doc(paymentId) : null;
        let snap = ref ? await ref.get() : null;

        if (!snap || !snap.exists) {
            // Reserva: cobrança feita fora do fluxo (link manual, cobrança
            // recriada no painel da AbacatePay). Reconstrói pelo billingId
            // e, em último caso, pelo e-mail do cliente.
            const billingId = cobranca?.id;
            if (billingId) {
                const porBilling = await db.collection('payments').where('billingId', '==', billingId).limit(1).get();
                if (!porBilling.empty) {
                    ref = porBilling.docs[0].ref;
                    snap = porBilling.docs[0];
                }
            }
        }

        if (!snap || !snap.exists) {
            if (!email) {
                console.error(
                    'AbacatePay Webhook: pagamento nao identificado e sem e-mail. ' +
                    `evento=${event} | data=[${Object.keys(req.body?.data || {}).join(', ')}] | ` +
                    `cobranca=[${Object.keys(cobranca || {}).join(', ')}] | ` +
                    `metadata=[${Object.keys(metadata || {}).join(', ')}] | ` +
                    `cobranca.id=${cobranca?.id ?? '(ausente)'}`
                );
                res.status(400).send({ error: 'Unidentified payment' });
                return;
            }
            const usersSnap = await db.collection('users').where('email', '==', email).limit(1).get();
            if (usersSnap.empty) {
                console.error(`AbacatePay Webhook: nenhum usuário para o email ${email}.`);
                res.status(404).send({ error: 'User not found' });
                return;
            }
            ref = db.collection('payments').doc();
            const reconstruido = {
                uid: usersSnap.docs[0].id,
                email,
                plan: metadata.plan || 'pro_mensal',
                tipo: metadata.schoolId ? 'escola' : 'assinatura',
                schoolId: metadata.schoolId || null,
                billingId: cobranca?.id || null,
                status: 'pending',
                origem: 'webhook-sem-checkout',
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            };
            await ref.set(reconstruido);
            await aplicarPagamento(ref, reconstruido);
            console.log(`AbacatePay: pagamento reconstruído e aplicado para ${email}.`);
            res.status(200).send({ received: true });
            return;
        }

        const resultado = await aplicarPagamento(ref, snap.data() || {});
        console.log(
            resultado.jaAplicado
                ? `AbacatePay: pagamento ${ref.id} já estava aplicado (webhook repetido).`
                : `AbacatePay: pagamento ${ref.id} aplicado (${resultado.tipo}).`
        );

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
const ABACATEPAY_API = 'https://api.abacatepay.com/v2';

const ABACATEPAY_PLANS = {
    professor_pro: { name: 'Izicode Edu - Professor PRO', priceCents: 3990, tipo: 'assinatura' },
    pro_mensal: { name: 'Izicode Edu - Professor PRO', priceCents: 3990, tipo: 'assinatura' },
    pro_anual: { name: 'Izicode Edu - PRO Anual + Kit Arduino', priceCents: 39700, tipo: 'assinatura' },
    aulas_turma: { name: 'Izicode Edu - Turma Online', priceCents: 14900, tipo: 'assinatura' },
    aulas_individual: { name: 'Izicode Edu - Aula Individual', priceCents: 39900, tipo: 'assinatura' },
    // A escola não tem preço fixo: o valor sai da contagem de assentos, e a
    // liberação depende de conferência humana. Ver calcularEscola abaixo.
    escola: { name: 'Izicode Edu - Pacote Escola', priceCents: null, tipo: 'escola' }
};

/**
 * Preço da escola — precisa ser idêntico a PLANO_ESCOLA em
 * app/src/lib/planos.ts, que é o que o simulador mostra na tela.
 * Se os dois divergirem, a escola vê um número e recebe outro na cobrança.
 */
const PRECO_ESCOLA = {
    baseCentavos: 24900,
    professoresInclusos: 3,
    alunosInclusos: 60,
    professorExtraCentavos: 1900,
    alunoExtraCentavos: 250
};

function calcularEscola(professores, alunos) {
    const p = Math.max(1, Math.min(500, Math.floor(Number(professores) || 0)));
    const a = Math.max(1, Math.min(20000, Math.floor(Number(alunos) || 0)));
    const extraProf = Math.max(0, p - PRECO_ESCOLA.professoresInclusos);
    const extraAlunos = Math.max(0, a - PRECO_ESCOLA.alunosInclusos);
    return {
        professores: p,
        alunos: a,
        totalCentavos:
            PRECO_ESCOLA.baseCentavos +
            extraProf * PRECO_ESCOLA.professorExtraCentavos +
            extraAlunos * PRECO_ESCOLA.alunoExtraCentavos
    };
}

exports.createAbacatePayCheckout = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Entre na sua conta para continuar.');
    }

    const { plan, schoolId } = data || {};
    const planConfig = ABACATEPAY_PLANS[plan];
    if (!planConfig) {
        throw new functions.https.HttpsError('invalid-argument', `Plano desconhecido: ${plan}`);
    }

    const apiKey = functions.config().abacatepay?.api_key;
    if (!apiKey) {
        console.error("Configuração 'abacatepay.api_key' ausente no Firebase Functions");
        throw new functions.https.HttpsError('failed-precondition', 'Pagamentos temporariamente indisponíveis.');
    }

    // O preço vem SEMPRE daqui, nunca do que o navegador mandou: aceitar
    // um valor do cliente seria deixar qualquer pessoa assinar por R$ 0,01.
    let priceCents = planConfig.priceCents;
    let contagem = null;
    let escolaId = schoolId || null;
    let nomeEscola = null;

    if (planConfig.tipo === 'escola') {
        contagem = calcularEscola(data.professores, data.alunos);
        priceCents = contagem.totalCentavos;

        // A qual escola este pagamento pertence sai do perfil de quem está
        // pagando, não do que o navegador mandou — senão daria para pagar
        // uma cobrança e apontá-la para a escola de outra pessoa. Sem isso,
        // o pagamento também ficaria órfão e a equipe não saberia qual
        // instituição validar.
        const perfil = await admin.firestore().collection('users').doc(context.auth.uid).get();
        const doPerfil = perfil.exists ? (perfil.data() || {}).schoolId : null;
        if (doPerfil) {
            escolaId = doPerfil;
            const escola = await admin.firestore().collection('schools').doc(escolaId).get();
            nomeEscola = escola.exists ? (escola.data() || {}).name || null : null;
        } else if (escolaId) {
            // schoolId veio só do cliente: aceita apenas se a escola existir
            // e a pessoa for a administradora cadastrada nela.
            const escola = await admin.firestore().collection('schools').doc(escolaId).get();
            if (!escola.exists || (escola.data() || {}).adminId !== context.auth.uid) {
                escolaId = null;
            } else {
                nomeEscola = (escola.data() || {}).name || null;
            }
        }
    }

    if (!priceCents || priceCents < 100) {
        throw new functions.https.HttpsError('invalid-argument', 'Valor da cobrança inválido.');
    }

    const userRecord = await admin.auth().getUser(context.auth.uid);

    // Registra a intenção de compra ANTES de chamar a AbacatePay. Se o
    // webhook chegar antes da resposta, ou se a pessoa fechar o navegador
    // no meio, ainda existe um documento para reconciliar o pagamento.
    const pagamentoRef = admin.firestore().collection('payments').doc();
    await pagamentoRef.set({
        uid: context.auth.uid,
        email: userRecord.email || null,
        plan,
        tipo: planConfig.tipo,
        amountCents: priceCents,
        schoolId: escolaId,
        schoolName: nomeEscola,
        seats: contagem,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    try {
        // API v2, endpoint 'transparents' e não 'checkouts'.
        //
        // Os dois criam cobrança, mas 'checkouts/create' recebe
        // `items: [{id, quantity}]` — ids de produtos que precisam existir
        // no catálogo da AbacatePay. Isso não serve para a escola, cujo
        // preço sai da contagem de assentos e muda a cada contratação:
        // seria preciso cadastrar um produto por combinação possível.
        // 'transparents/create' aceita um valor arbitrário, o que cobre
        // tanto os planos fixos quanto a escola com o mesmo caminho.
        const response = await axios.post(
            `${ABACATEPAY_API}/transparents/create`,
            {
                method: 'PIX',
                data: {
                    amount: priceCents,
                    description: planConfig.name,
                    // Uma hora é folgado para um Pix e evita que a pessoa
                    // volte no dia seguinte com um QR code morto na tela.
                    expiresIn: 3600,
                    // 'customer' fica de fora de propósito. A API v2 exige o
                    // objeto completo (com celular e CPF) quando ele é
                    // enviado, e recusa um parcial com a mensagem opaca
                    // "Value should be one of 'object', 'object'". Não temos
                    // nem precisamos desses dados: quem identifica o
                    // pagamento é a metadata abaixo, e pedir CPF só para
                    // gerar um Pix seria coletar dado sem necessidade.
                    //
                    // O uid é o que liga o pagamento à conta com segurança;
                    // o e-mail pode ser trocado no caminho, o uid não.
                    metadata: {
                        uid: context.auth.uid,
                        email: userRecord.email || '',
                        paymentId: pagamentoRef.id,
                        plan,
                        ...(escolaId ? { schoolId: escolaId } : {})
                    }
                }
            },
            { headers: { Authorization: `Bearer ${apiKey}` } }
        );

        const cobranca = response.data?.data || {};
        if (!cobranca.id || !cobranca.brCode) {
            throw new Error('AbacatePay não retornou o código Pix.');
        }

        await pagamentoRef.set({
            billingId: cobranca.id,
            expiresAt: cobranca.expiresAt || null
        }, { merge: true });

        return {
            success: true,
            paymentId: pagamentoRef.id,
            billingId: cobranca.id,
            // Código copia-e-cola e a imagem do QR, para a tela mostrar o
            // pagamento sem tirar a pessoa do site.
            brCode: cobranca.brCode,
            brCodeBase64: cobranca.brCodeBase64 || null,
            expiresAt: cobranca.expiresAt || null,
            amountCents: priceCents,
            tipo: planConfig.tipo
        };
    } catch (error) {
        const status = error.response?.status;
        const detalhe = error.response?.data;
        console.error("AbacatePay: erro ao criar cobrança:", detalhe || error.message);
        await pagamentoRef.set({ status: 'failed', error: error.message }, { merge: true });

        // Chave recusada é problema NOSSO, não da pessoa que está comprando.
        // Devolver 'internal' faria a tela dizer "tente novamente", e tentar
        // de novo nunca vai funcionar — a pessoa ficaria repetindo até
        // desistir. Com 'failed-precondition' a tela mostra o aviso fixo de
        // pagamento indisponível, com o caminho para falar com a equipe.
        if (status === 401 || status === 403) {
            console.error(
                "AbacatePay: a chave em abacatepay.api_key foi recusada. " +
                "Confira a chave no painel da AbacatePay e rode functions:config:set de novo."
            );
            throw new functions.https.HttpsError(
                'failed-precondition',
                'Pagamentos temporariamente indisponíveis.'
            );
        }

        throw new functions.https.HttpsError('internal', 'Erro ao iniciar o pagamento. Tente novamente.');
    }
});

/**
 * Aplica o que um pagamento confirmado libera.
 *
 * Fica separado porque dois caminhos precisam dele: o webhook da AbacatePay
 * e a conferência que a própria tela faz ao voltar do checkout. Webhook
 * atrasa, se perde e chega repetido — então esta função é idempotente e
 * pode rodar duas vezes sem efeito colateral.
 *
 * A diferença de tratamento entre professor/família e escola é regra de
 * negócio, não detalhe técnico:
 *
 *  - professor e família: pagou, liberou. É autoatendimento de ponta a ponta.
 *  - escola: pagou, NÃO liberou. O acesso à gestão de turmas depende de a
 *    equipe conferir a instituição e validar a chave da escola. Contrato
 *    com instituição envolve nota, dados de alunos menores de idade e
 *    quantidade de assentos combinada — coisas que ninguém confere sozinho.
 */
async function aplicarPagamento(pagamentoRef, dadosPagamento) {
    const db = admin.firestore();
    const agora = admin.firestore.FieldValue.serverTimestamp();

    if (dadosPagamento.status === 'paid') {
        return { jaAplicado: true, tipo: dadosPagamento.tipo };
    }

    if (dadosPagamento.tipo === 'escola') {
        if (dadosPagamento.schoolId) {
            await db.collection('schools').doc(dadosPagamento.schoolId).set({
                // 'paid_pending_activation', e não 'active': quem libera a
                // gestão de turmas é a equipe, depois de validar a escola.
                plan: 'paid_pending_activation',
                paidAt: agora,
                paymentProvider: 'abacatepay',
                contractedSeats: dadosPagamento.seats || null
            }, { merge: true });
        }

        // Entra na fila de suporte para alguém entrar em contato. Sem isso o
        // pagamento da escola ficaria esperando um telefonema que ninguém
        // sabe que precisa dar.
        await db.collection('leads').add({
            name: dadosPagamento.schoolName || dadosPagamento.email || 'Escola',
            email: dadosPagamento.email || null,
            schoolId: dadosPagamento.schoolId || null,
            role: 'school',
            goal: 'activation',
            plano: 'escola',
            source: 'pagamento:escola',
            message:
                'Pagamento do Pacote Escola confirmado. Validar a instituição e ' +
                'liberar a chave de acesso da escola.',
            status: 'new',
            priority: 'high',
            createdAt: agora
        });
    } else if (dadosPagamento.uid) {
        // Pelo uid, não pelo e-mail: o e-mail no checkout pode ser outro.
        await db.collection('users').doc(dadosPagamento.uid).set({
            subscription: {
                plan: 'pro',
                planId: dadosPagamento.plan || null,
                provider: 'abacatepay',
                activatedAt: agora
            }
        }, { merge: true });
    } else {
        throw new Error('Pagamento sem uid e sem schoolId — nada a liberar.');
    }

    await pagamentoRef.set({ status: 'paid', paidAt: agora }, { merge: true });
    return { jaAplicado: false, tipo: dadosPagamento.tipo };
}

/**
 * Conferência do pagamento a pedido da tela.
 *
 * O webhook é o caminho principal, mas ele pode atrasar ou se perder — e a
 * pessoa está parada na tela esperando o acesso que acabou de pagar. Aqui a
 * própria página pergunta à AbacatePay se a cobrança foi paga e, se foi,
 * libera na hora. Quem decide continua sendo o servidor: o navegador só
 * informa qual pagamento conferir.
 */
exports.confirmPayment = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Entre na sua conta para continuar.');
    }

    const paymentId = String((data && data.paymentId) || '').trim();
    if (!paymentId) {
        throw new functions.https.HttpsError('invalid-argument', 'Informe qual pagamento conferir.');
    }

    const ref = admin.firestore().collection('payments').doc(paymentId);
    const snap = await ref.get();
    if (!snap.exists) {
        throw new functions.https.HttpsError('not-found', 'Pagamento não encontrado.');
    }

    const pagamento = snap.data() || {};
    if (pagamento.uid !== context.auth.uid) {
        throw new functions.https.HttpsError('permission-denied', 'Este pagamento não é da sua conta.');
    }

    if (pagamento.status === 'paid') {
        return { status: 'paid', tipo: pagamento.tipo, jaLiberado: true };
    }

    const apiKey = functions.config().abacatepay?.api_key;
    if (!apiKey || !pagamento.billingId) {
        return { status: pagamento.status || 'pending', tipo: pagamento.tipo };
    }

    try {
        const resposta = await axios.get(`${ABACATEPAY_API}/transparents/check`, {
            params: { id: pagamento.billingId },
            headers: { Authorization: `Bearer ${apiKey}` }
        });
        const cobranca = resposta.data?.data || {};
        const pago = String(cobranca.status).toUpperCase() === 'PAID';

        if (!pago) {
            return { status: 'pending', tipo: pagamento.tipo };
        }

        await aplicarPagamento(ref, pagamento);
        return { status: 'paid', tipo: pagamento.tipo, jaLiberado: false };
    } catch (error) {
        console.error('AbacatePay: erro ao conferir pagamento:', error.response?.data || error.message);
        throw new functions.https.HttpsError('internal', 'Não foi possível conferir o pagamento agora.');
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

/* ==================================================================== */
/* Entrada do aluno pelo código da turma                                */
/* ==================================================================== */

/**
 * O aluno entra pelo código impresso no cartaz da turma, sem e-mail e sem
 * senha — ele não tem conta própria (é criança, e a conta é da escola).
 *
 * Antes, a página buscava a turma direto no Firestore. Isso tinha dois
 * problemas: a regra de /classes exige usuário autenticado, então a busca
 * nunca funcionava de verdade; e o documento dos alunos vinha inteiro para
 * o navegador — inclusive a palavra secreta de cada colega. Quem tivesse o
 * código da turma lia a senha de todo mundo no painel do navegador.
 *
 * Estas duas funções resolvem os dois pontos: a consulta acontece aqui,
 * com credencial de servidor, e a palavra secreta nunca sai daqui.
 */

/** Só o que a tela de escolha do aluno precisa desenhar. Nada além disso. */
function alunoPublico(doc) {
    const d = doc.data() || {};
    return { id: doc.id, name: d.name || "Aluno", avatar: d.avatar || "🎓" };
}

async function buscarTurmaPorCodigo(code) {
    const codigo = String(code || "").trim().toUpperCase();
    if (codigo.length < 4) return null;

    const snap = await admin.firestore()
        .collection("classes")
        .where("sectionCode", "==", codigo)
        .limit(1)
        .get();

    return snap.empty ? null : snap.docs[0];
}

/**
 * Devolve a turma e a lista de alunos SEM as palavras secretas.
 * Aberta a quem não está autenticado, porque é exatamente esse o caso de
 * uso: a criança ainda não entrou.
 */
exports.lookupClass = functions.https.onCall(async (data) => {
    const turma = await buscarTurmaPorCodigo(data && data.code);
    if (!turma) {
        // Código errado é o caso comum (criança copiando do quadro), não um
        // erro de sistema — e a mensagem precisa dizer isso.
        throw new functions.https.HttpsError(
            "not-found",
            "Turma não encontrada. Confira o código com seu professor."
        );
    }

    const alunosSnap = await admin.firestore()
        .collection(`classes/${turma.id}/students`)
        .get();

    const dados = turma.data() || {};
    return {
        id: turma.id,
        name: dados.name || "Turma",
        gradeName: dados.gradeName || null,
        students: alunosSnap.docs.map(alunoPublico),
    };
});

/**
 * Confere a palavra secreta no servidor e devolve um token de acesso.
 *
 * Antes, a conferência era feita no navegador e o "login" era só uma
 * gravação em localStorage — dava para digitar no console e virar
 * qualquer colega. Com o token assinado, a sessão do aluno passa a valer
 * para as regras do Firestore como qualquer outra.
 *
 * O uid é derivado da turma e do aluno, sem e-mail e sem dado pessoal
 * novo: a criança continua sem conta própria fora da turma.
 */
exports.studentLogin = functions.https.onCall(async (data) => {
    const turma = await buscarTurmaPorCodigo(data && data.code);
    if (!turma) {
        throw new functions.https.HttpsError("not-found", "Turma não encontrada.");
    }

    const studentId = String((data && data.studentId) || "").trim();
    const secret = String((data && data.secret) || "").trim().toLowerCase();
    if (!studentId || !secret) {
        throw new functions.https.HttpsError("invalid-argument", "Informe o aluno e a palavra secreta.");
    }

    const alunoRef = admin.firestore().doc(`classes/${turma.id}/students/${studentId}`);
    const alunoSnap = await alunoRef.get();
    if (!alunoSnap.exists) {
        throw new functions.https.HttpsError("not-found", "Aluno não encontrado nesta turma.");
    }

    const aluno = alunoSnap.data() || {};
    const esperado = String(aluno.secret || "").trim().toLowerCase();
    if (!esperado || esperado !== secret) {
        // Mesma resposta para palavra errada e aluno sem palavra cadastrada:
        // dizer qual dos dois foi ajudaria quem está tentando adivinhar.
        throw new functions.https.HttpsError("permission-denied", "Palavra secreta incorreta.");
    }

    const uid = `student_${turma.id}_${studentId}`;
    const token = await admin.auth().createCustomToken(uid, {
        role: "student",
        classId: turma.id,
        studentId,
    });

    return {
        token,
        student: alunoPublico(alunoSnap),
        classId: turma.id,
        className: (turma.data() || {}).name || "Turma",
    };
});

/* ==================================================================== */
/* Reconciliação de pagamentos                                          */
/* ==================================================================== */

/**
 * Rede de segurança para pagamentos que ficaram pendentes.
 *
 * Existem três caminhos para liberar um acesso pago, e os dois primeiros
 * podem falhar de formas que a gente não controla:
 *
 *  1. O webhook da AbacatePay — pode não estar cadastrado, estar no
 *     ambiente errado, ou simplesmente não chegar.
 *  2. A conferência que a própria tela faz — só funciona enquanto a pessoa
 *     estiver com a aba aberta. Quem paga e fecha o navegador não tem quem
 *     confira por ela.
 *  3. Esta função, que roda sozinha e não depende de nenhum dos dois.
 *
 * Sem o item 3, o pior cenário do produto é possível: alguém paga, fecha a
 * aba, e nunca recebe o que comprou — sem nem saber a quem reclamar.
 */
exports.reconciliarPagamentos = functions.pubsub
    .schedule('every 10 minutes')
    .timeZone('America/Sao_Paulo')
    .onRun(async () => {
        const apiKey = functions.config().abacatepay?.api_key;
        if (!apiKey) {
            console.warn('Reconciliação: abacatepay.api_key não configurada. Nada a fazer.');
            return null;
        }

        const db = admin.firestore();

        // Janela: nada recém-criado (o fluxo normal ainda está em curso) e
        // nada velho demais (o Pix expira em uma hora; depois disso não vai
        // ser pago). Isso mantém a consulta pequena e evita reprocessar
        // cobranças mortas para sempre.
        const agora = Date.now();
        const doisMinutosAtras = new Date(agora - 2 * 60 * 1000);
        const seisHorasAtras = new Date(agora - 6 * 60 * 60 * 1000);

        const pendentes = await db.collection('payments')
            .where('status', '==', 'pending')
            .where('createdAt', '<', doisMinutosAtras)
            .where('createdAt', '>', seisHorasAtras)
            .limit(50)
            .get();

        if (pendentes.empty) return null;

        let liberados = 0;
        for (const doc of pendentes.docs) {
            const pagamento = doc.data() || {};
            if (!pagamento.billingId) continue;

            try {
                const resposta = await axios.get(`${ABACATEPAY_API}/transparents/check`, {
                    params: { id: pagamento.billingId },
                    headers: { Authorization: `Bearer ${apiKey}` }
                });
                const status = String(resposta.data?.data?.status || '').toUpperCase();
                if (status !== 'PAID') continue;

                await aplicarPagamento(doc.ref, pagamento);
                liberados += 1;
                console.log(
                    `Reconciliação: pagamento ${doc.id} estava pago e não havia sido aplicado ` +
                    `(${pagamento.tipo}, uid ${pagamento.uid}).`
                );
            } catch (error) {
                // Uma cobrança com problema não pode impedir as outras.
                console.error(`Reconciliação: falha ao conferir ${doc.id}:`, error.message);
            }
        }

        if (liberados > 0) {
            console.log(`Reconciliação: ${liberados} pagamento(s) liberado(s) fora do webhook.`);
        }
        return null;
    });
