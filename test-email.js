const nodemailer = require('nodemailer');

// TODO: Configurar com credenciais reais
async function sendTestEmail() {
    let transporter = nodemailer.createTransport({
        host: "smtp.exemplo.com",
        port: 587,
        secure: false,
        auth: {
            user: "seu-email@izicode.com.br",
            pass: "sua-senha",
        },
    });

    try {
        let info = await transporter.sendMail({
            from: '"Izicode Bot" <bot@izicode.com.br>',
            to: "seu-email-pessoal@gmail.com",
            subject: "🚀 Teste de Conexão Izicode",
            text: "Se você está lendo isso, a conexão de e-mail do sistema Izicode está funcionando!",
            html: "<b>Se você está lendo isso, a conexão de e-mail do sistema Izicode está funcionando!</b>",
        });
        console.log("E-mail enviado: %s", info.messageId);
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
    }
}

sendTestEmail();
