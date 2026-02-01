# 💼 Guia de Configuração - LinkedIn API

Para automatizar postagens na página da Izicode Edu, precisamos de chaves de acesso (API Keys).

## Passo 1: Criar o App no LinkedIn
1. Acesse o **[LinkedIn Developers](https://www.linkedin.com/developers/apps/new)**.
2. Faça login com sua conta pessoal (que é admin da página da Izicode).
3. Clique em **"Create App"**.
4. Preencha:
   - **App Name:** `Izicode Automation`
   - **LinkedIn Page:** Cole a URL da página da Izicode (ex: `https://www.linkedin.com/company/izicode-edu`).
   - **Privacy Policy URL:** Pode usar `https://izicode.com.br` por enquanto.
   - **App Logo:** Suba a logo da Izicode.
5. Aceite os termos e clique em **Create App**.

## Passo 2: Solicitar Permissões (Produtos)
1. No menu do seu novo app, vá em **Products**.
2. Clique em **Request Access** para:
   - **Share on LinkedIn** (Essencial para postar).
   - **Sign In with LinkedIn** (Para autenticação).
   - **Advertising API** (Opcional, se for fazer ads).
3. O sistema pode pedir para verificar a página. Siga as instruções.

## Passo 3: Pegar as Chaves (Client ID e Secret)
1. Vá na aba **Auth**.
2. Você verá duas chaves importantes:
   - **Client ID** (ex: `77abc123...`)
   - **Client Secret** (ex: `W1XyZ...`) -> ⚠️ Copie e guarde, ela some depois!

## Passo 4: Gerar o Access Token (A parte chata)
O LinkedIn exige um "Token de Acesso" que vence a cada 60 dias (ou um de longa duração).
Para facilitar, usaremos uma ferramenta chamada **OAuth 2.0 Tools** ou faremos via script na primeira vez.

**Me forneça o `Client ID` e o `Client Secret` que eu gero o link de autorização para você.**
