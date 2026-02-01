# 📡 Configuração do Radar de Inteligência (Telegram)

Para que o Agente CTO envie insights diários e documentos para os consultores, precisamos configurar um Bot do Telegram.

## Passo 1: Criar o Bot
1.  Abra o Telegram e fale com o **@BotFather**.
2.  Envie o comando `/newbot`.
3.  Dê um nome (ex: `Izicode Intel`).
4.  Dê um username (ex: `izicode_intel_bot`).
5.  Copie o **TOKEN** que ele vai gerar (parece com `123456:ABC-DEF...`).

## Passo 2: Configurar o Canal/Grupo
1.  Crie um Grupo no Telegram (ex: "Izicode Consultores").
2.  Adicione o bot que você criou (`@izicode_intel_bot`) como membro (e admin, se possível).
3.  Descubra o **Chat ID** do grupo:
    *   Adicione o bot `@RawDataBot` ao grupo temporariamente.
    *   Ele vai mandar um JSON. Procure por `"chat": { "id": -100123456... }`.
    *   Copie esse número (incluindo o sinal de menos).
    *   Remova o `@RawDataBot`.

## Passo 3: Ativar o Agente
Me forneça:
1.  **Bot Token**
2.  **Chat ID**

Com isso, posso rodar scripts diários para buscar tendências de:
*   BNCC e Novo Ensino Médio
*   Editais de Tecnologia Educacional
*   Lançamentos de Robótica (Arduino/Micro:bit)

E enviar um resumo executivo automático no grupo toda manhã. ☕
