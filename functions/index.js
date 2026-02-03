const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();

// Configurar variáveis de ambiente:
// firebase functions:config:set telegram.token="SEU_TOKEN_AQUI" telegram.chat_id="SEU_CHAT_ID"
const TELEGRAM_TOKEN = functions.config().telegram?.token || "PLACEHOLDER_TOKEN";
const TELEGRAM_CHAT_ID = functions.config().telegram?.chat_id || "PLACEHOLDER_CHAT_ID";

/**
 * Webhook para receber submissões do Tally e enviar para o Telegram.
 * URL: https://us-central1-<PROJECT-ID>.cloudfunctions.net/tallyWebhook
 */
exports.tallyWebhook = functions.https.onRequest(async (req, res) => {
  // Verificar método
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const payload = req.body;
  
  if (!payload || !payload.data) {
     console.warn("Payload inválido ou vazio recebido.");
     return res.status(400).send("No data received");
  }

  const formData = payload.data;
  const formName = formData.formName || "Novo Formulário";
  const submissionId = formData.responseId || "N/A";
  const submittedAt = formData.createdAt ? new Date(formData.createdAt).toLocaleString('pt-BR') : "Data desconhecida";

  // Construir mensagem
  let message = `🔔 *Novo Lead: ${formName}*\n`;
  message += `📅 ${submittedAt}\n\n`;
  
  if (formData.fields && Array.isArray(formData.fields)) {
      formData.fields.forEach(field => {
          // Filtrar campos vazios e tratar tipos
          if (field.value !== null && field.value !== undefined && field.value !== "") {
            // Limpar markdown que possa vir no label
            const label = field.label.replace(/\*/g, ""); 
            
            // Tratar uploads (array de urls)
            let value = field.value;
            if (Array.isArray(value)) {
                value = value.map(v => v.url || v).join(", ");
            } else if (typeof value === 'boolean') {
                value = value ? "Sim" : "Não";
            }

            message += `*${label}:* ${value}\n`;
          }
      });
  }

  message += `\n🆔 ID: \`${submissionId}\``;

  try {
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "Markdown"
      }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro na API do Telegram:", errorText);
        return res.status(500).send("Falha ao enviar para o Telegram");
    }

    console.log(`Mensagem enviada com sucesso para o Telegram (ID: ${submissionId})`);
    return res.status(200).send("OK");
  } catch (error) {
    console.error("Erro interno no Webhook:", error);
    return res.status(500).send("Erro interno do servidor");
  }
});

// Importar módulo LinkedIn
const linkedin = require("./linkedin");
const LINKEDIN_TOKEN = functions.config().linkedin?.token;
const LINKEDIN_URN = functions.config().linkedin?.urn;

/**
 * Função agendada para postar dicas semanais no LinkedIn.
 * Agenda: Toda terça-feira às 10:00 AM (America/Sao_Paulo)
 */
exports.scheduledLinkedInTip = functions.pubsub.schedule('every tuesday 10:00')
    .timeZone('America/Sao_Paulo')
    .onRun(async (context) => {
        if (!LINKEDIN_TOKEN || !LINKEDIN_URN) {
            console.log("LinkedIn credentials not set. Skipping.");
            return null;
        }

        // Exemplo de banco de dicas (poderia vir do Firestore)
        const tips = [
            "💡 Dica Izicode: O uso de robótica em sala de aula aumenta o engajamento em 40%! #EdTech #Robotica",
            "🚀 Sabia que a Cultura Maker desenvolve 5 das 10 habilidades do futuro? #Maker #Educacao",
            "🤖 Arduino ou Micro:bit? Para iniciantes de 8-10 anos, o Micro:bit é imbatível! #DicaPedagogica"
        ];
        
        // Escolher dica aleatória
        const tip = tips[Math.floor(Math.random() * tips.length)];

        try {
            await linkedin.createTextPost(tip, LINKEDIN_TOKEN, LINKEDIN_URN);
            console.log("Postado no LinkedIn:", tip);
        } catch (error) {
            console.error("Erro ao postar no LinkedIn:", error);
        }
        
        return null;
    });
