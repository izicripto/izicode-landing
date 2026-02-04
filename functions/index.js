const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

exports.onLeadCreated = functions.firestore
    .document("leads/{leadId}")
    .onCreate(async (snap, context) => {
        const lead = snap.data();
        const telegramConfig = functions.config().telegram;

        if (!telegramConfig || !telegramConfig.token || !telegramConfig.chat_id) {
            console.error("Telegram config missing");
            return null;
        }

        const token = telegramConfig.token;
        const chatId = telegramConfig.chat_id;

        const message = `
🚀 *Novo Lead Capturado!*

👤 *Nome:* ${lead.name}
📧 *Email:* ${lead.email}
🎒 *Cargo:* ${lead.role || "Não informado"}
🎯 *Interesse:* ${lead.interest || "Geral"}
💬 *Mensagem:* ${lead.message || "Sem mensagem"}

📅 *Data:* ${new Date().toLocaleString("pt-BR")}
        `;

        try {
            await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
                chat_id: chatId,
                text: message,
                parse_mode: "Markdown",
            });
            console.log("Telegram notification sent successfully");
        } catch (error) {
            console.error("Error sending Telegram notification", error);
        }

        return null;
    });
