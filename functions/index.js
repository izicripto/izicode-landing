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
