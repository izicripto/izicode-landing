**Configuração do Bot do Telegram - Status Atual**

A estrutura para um bot do Telegram já existe na função `tallyWebhook` em `functions/index.js`, mas está **incompleta**. O bot precisa de:

### O que já temos:
- ✅ Função configurada para receber webhooks do Tally
- ✅ Envio de mensagens formatadas para Telegram
- ✅ Tratamento de diferentes tipos de dados (texto, booleanos, uploads)

### O que falta:
- 🔄 **Token do Bot:** `PLACEHOLDER_TOKEN` precisa ser substituído
- 🔄 **Chat ID:** `PLACEHOLDER_CHAT_ID` onde enviar as mensagens
- 🔄 **Webhook registrado no Telegram**
- ⏳ **Bot criado no Telegram** (através do @BotFather)

### Passos para completar:

1. **Criar Bot no Telegram:**
   ```
   Falar com @BotFather no Telegram
   Comando: /newbot
   Nome: Izicode Edu Notifications
   Username: izicode_edu_bot (ou similar)
   ```

2. **Obter Token e Chat ID:**
   - Token: fornecido pelo @BotFather
   - Chat ID: iniciar conversa com o bot e ver ID com /getid

3. **Configurar no Firebase:**
   ```bash
   firebase functions:config:set telegram.token="SEU_TOKEN" telegram.chat_id="SEU_CHAT_ID"
   ```

4. **Configurar Webhook no Telegram:**
   ```bash
   curl -F "url=https://us-central1-izicode-v3.cloudfunctions.net/tallyWebhook" https://api.telegram.org/bot<SEU_TOKEN>/setWebhook
   ```

### Funcionalidade pretendida:
- Receber leads do Tally via webhook
- Notificar equipe instantaneamente
- Logs detalhados para acompanhamento

**Próxima ação:** Você pode criar o bot e me fornecer o token/Chat ID, ou prefere que eu tente configurar programaticamente?