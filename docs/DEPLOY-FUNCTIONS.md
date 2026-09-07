# Cloud Functions — configuração e deploy

## Como o deploy acontece hoje

Todo push para `main` dispara o workflow `.github/workflows/firebase-hosting-merge.yml`, que publica, nesta ordem:

1. **Hosting + Firestore Rules** — o site e as regras de segurança.
2. **Cloud Functions** — em passo separado, com `continue-on-error: true`.

O segundo passo é separado de propósito: se o deploy de functions falhar (cota, permissão do token, erro de build), o site já publicado no passo anterior continua no ar. A falha aparece no log da Action, sem derrubar o deploy inteiro.

## Credencial do CI para functions (pendente)

O deploy de **hosting** funciona com o secret `FIREBASE_TOKEN` já configurado. O de **functions** falha com esse mesmo token: o Firebase descontinuou os tokens de `firebase login:ci` para operações que tocam o Google Cloud, e deploy de functions é uma delas. O sintoma é exatamente esse — o site publica, as functions não.

O caminho suportado hoje é uma conta de serviço. Passo a passo (precisa ser feito por quem é dono do projeto):

1. No Console do Google Cloud, com o projeto `izicodeedu-532ac` selecionado, vá em **IAM e Admin → Contas de serviço → Criar conta de serviço**.
2. Dê um nome como `github-actions-deploy`.
3. Conceda estes papéis:
   - `Firebase Admin`
   - `Cloud Functions Admin`
   - `Service Account User`
   - `Cloud Build Editor`
   - `Artifact Registry Administrator`
4. Em **Chaves → Adicionar chave → Criar nova chave → JSON**, baixe o arquivo.
5. No GitHub, em **Settings → Secrets and variables → Actions → New repository secret**, crie o secret `GCP_SA_KEY` com o **conteúdo inteiro do JSON**.

O workflow já está preparado: assim que o secret existir, o passo de functions passa a usá-lo. Sem ele, continua tentando pelo token antigo (e falhando).

> O deploy de functions roda num job separado, sem `continue-on-error`. Uma falha ali aparece vermelha no painel da Action, mas **não impede** a publicação do site — os dois jobs são independentes.

## Configuração obrigatória (feita uma vez, fora do repositório)

As chaves são segredos: não ficam no Git e não entram no bundle do navegador. Precisam ser definidas na configuração do Firebase Functions, direto da sua máquina, logado como dono do projeto:

```bash
firebase functions:config:set \
  gemini.key="SUA_CHAVE_DO_GEMINI" \
  abacatepay.api_key="SUA_CHAVE_ABACATEPAY" \
  abacatepay.webhook_secret="UM_SEGREDO_QUE_VOCE_DEFINE" \
  --project izicodeedu-532ac
```

Depois de definir, é preciso um novo deploy de functions para elas enxergarem os valores (um push para `main` já resolve).

Para conferir o que está configurado:

```bash
firebase functions:config:get --project izicodeedu-532ac
```

## O que cada chave destrava

| Chave | Usada por | Se faltar |
|---|---|---|
| `gemini.key` | `aiChat`, `generateAIProject` | Plano PRO não usa a IA pela chave gerenciada. A função responde `failed-precondition` e o painel mostra "assistente temporariamente indisponível". Contas com chave pessoal continuam funcionando. |
| `abacatepay.api_key` | `createAbacatePayCheckout` | O checkout não abre: a função responde `failed-precondition`. |
| `abacatepay.webhook_secret` | `abacatePayWebhook` | O webhook rejeita tudo com 401 — nenhum pagamento libera plano automaticamente. |

## Webhook da AbacatePay

Depois do deploy, cadastre esta URL no painel da AbacatePay (o segredo vai na própria query string, que é como a AbacatePay autentica):

```
https://us-central1-izicodeedu-532ac.cloudfunctions.net/abacatePayWebhook?webhookSecret=O_MESMO_SEGREDO
```

## Como saber se está tudo publicado

```bash
for fn in aiChat generateAIProject createAbacatePayCheckout abacatePayWebhook; do
  echo -n "$fn -> "
  curl -s -o /dev/null -w "%{http_code}\n" -X POST \
    "https://us-central1-izicodeedu-532ac.cloudfunctions.net/$fn" \
    -H "Content-Type: application/json" -d '{"data":{}}'
done
```

Leitura do resultado:

- **404** — a função não está publicada.
- **400 / 401 / 500** — a função existe e rejeitou a chamada vazia, que é o esperado sem autenticação e sem corpo válido.

## Personas da IA

O `aiChat` aceita `persona: 'professor' | 'aluno'` e monta o prompt **no servidor**. O navegador nunca envia o texto do system prompt.

Isso é proposital: o tutor do aluno tem regras de conteúdo (só responde sobre programação, robótica, lógica, matemática e ciências; nunca entrega dever pronto; nunca pede dado pessoal). Se o cliente pudesse enviar o prompt, qualquer usuário reescreveria essas regras usando a chave de IA que a Izicode paga. Valor desconhecido cai em `professor`.
