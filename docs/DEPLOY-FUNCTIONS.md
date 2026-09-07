# Cloud Functions — configuração e deploy

## Como o deploy acontece hoje

Todo push para `main` dispara o workflow `.github/workflows/firebase-hosting-merge.yml`, que publica, nesta ordem:

1. **Hosting + Firestore Rules** — o site e as regras de segurança.
2. **Cloud Functions** — em passo separado, com `continue-on-error: true`.

O segundo passo é separado de propósito: se o deploy de functions falhar (cota, permissão do token, erro de build), o site já publicado no passo anterior continua no ar. A falha aparece no log da Action, sem derrubar o deploy inteiro.

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
