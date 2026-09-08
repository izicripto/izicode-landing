# Cloud Functions — configuração e deploy

## Como o deploy acontece hoje

Todo push para `main` dispara o workflow `.github/workflows/firebase-hosting-merge.yml`, que publica, nesta ordem:

1. **Hosting + Firestore Rules** — o site e as regras de segurança.
2. **Cloud Functions** — num job separado, que roda em paralelo.

Os dois são jobs independentes de propósito: se o deploy de functions falhar (cota, permissão da credencial, erro de build), o site continua sendo publicado normalmente.

O job de functions **não** usa `continue-on-error`. A primeira versão usava, e isso marcava o passo como verde mesmo quando o deploy falhava — foi assim que `aiChat` ficou respondendo 404 em produção sem ninguém perceber. Hoje uma falha ali aparece vermelha no painel, sem derrubar a publicação do site.

## Credencial do CI para functions (pendente)

O deploy de **hosting** funciona com o secret `FIREBASE_TOKEN` já configurado. O de **functions** falha com esse mesmo token: o Firebase descontinuou os tokens de `firebase login:ci` para operações que tocam o Google Cloud, e deploy de functions é uma delas. O sintoma é exatamente esse — o site publica, as functions não.

O caminho suportado hoje é uma conta de serviço.

### Jeito rápido: o script

Existe um script que faz tudo — habilita as APIs, cria a conta de serviço, concede os papéis, libera a assinatura de token dos alunos e gera o JSON:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\criar-gcp-sa-key.ps1
```

Ele confere primeiro qual conta está ativa no `gcloud`. **Precisa ser a conta dona do projeto** (`izicripto@gmail.com`) — se for outra, ele abre o navegador para você trocar, e para com uma mensagem clara caso a conta escolhida não enxergue o projeto.

> Esse detalhe já custou tempo: o `gcloud` desta máquina estava autenticado como `r.berlanda04@gmail.com`, que **não tem acesso** a `izicodeedu-532ac`. Qualquer comando contra o projeto responde 403 sem dizer que o problema é a conta.

No fim, o script imprime o caminho do JSON e o que fazer no GitHub. A chave é gravada **fora do repositório** (na pasta do usuário), de propósito: um JSON de conta de serviço dentro do projeto é candidato a entrar num `git add -A` distraído.

### O faturamento precisa estar ativo

Cloud Functions não existe no plano gratuito (Spark) — exige o Blaze, que só liga com uma **conta de faturamento aberta**. O script confere isso no passo 3, antes de qualquer outra coisa.

Foi exatamente onde a primeira execução parou: o `izicodeedu-532ac` estava vinculado à conta `01B478-168102-F6F259`, que está **fechada**, junto com outros três projetos. O erro que aparecia era um `FAILED_PRECONDITION` no meio da habilitação das APIs, sem dizer que a causa era faturamento.

Resolvido vinculando o projeto à conta aberta:

```bash
gcloud billing projects link izicodeedu-532ac --billing-account=0150C7-1BC6B9-FC3E45
```

Para ver o estado das contas a qualquer momento:

```bash
gcloud billing accounts list --format="table(name,displayName,open)"
gcloud billing projects describe izicodeedu-532ac
```

### Teto de gasto

Existe um orçamento de **R$ 50/mês** na conta de faturamento, filtrado só para este projeto, com alertas em 50%, 90% e 100%:

```bash
gcloud billing budgets list --billing-account=0150C7-1BC6B9-FC3E45
```

Atenção ao que isso é e ao que não é: **orçamento no Google Cloud alerta, não corta**. Passar do teto manda e-mail para os administradores do faturamento, mas o serviço continua rodando. Um corte automático exigiria uma função que desvincula o faturamento ao receber o alerta — o que derruba o site junto, e por isso não foi feito.

### Jeito manual: pelo Console

1. No Console do Google Cloud, logado como o **dono do projeto**, com `izicodeedu-532ac` selecionado, vá em **IAM e Admin → Contas de serviço → Criar conta de serviço**.
2. Nome: `github-actions-deploy`.
3. Conceda estes papéis:
   - `Firebase Admin` (`roles/firebase.admin`)
   - `Cloud Functions Admin` (`roles/cloudfunctions.admin`)
   - `Service Account User` (`roles/iam.serviceAccountUser`)
   - `Cloud Build Editor` (`roles/cloudbuild.builds.editor`)
   - `Artifact Registry Administrator` (`roles/artifactregistry.admin`)
   - `Service Usage Consumer` (`roles/serviceusage.serviceUsageConsumer`)
4. Em **Chaves → Adicionar chave → Criar nova chave → JSON**, baixe o arquivo.
5. No GitHub, em **Settings → Secrets and variables → Actions → New repository secret**, crie `GCP_SA_KEY` com o **conteúdo inteiro do JSON**.

O `Service Usage Consumer` costuma ser esquecido e é justamente o que falta quando o deploy morre em `serviceusage.googleapis.com ... HTTP Error: 403`.

### Depois de salvar o secret

O workflow já está preparado: assim que o secret existir, o passo de functions passa a usá-lo. Sem ele, continua tentando pelo token antigo (e falhando). Para disparar o deploy sem precisar de uma mudança de código:

```bash
git commit --allow-empty -m "ci: publicar functions"
git push
```

E para conferir se funcionou:

```bash
gcloud functions list --project izicodeedu-532ac
```

Uma função publicada aparece com `status: ACTIVE` em `gcloud functions describe <nome> --region us-central1`.

**Não use o código HTTP para decidir isso.** Uma tentativa anterior usava `curl` e a regra "404 = não publicada", e a conclusão foi ao contrário da realidade, por dois motivos:

- `404` é também o que uma função **publicada e funcionando** devolve quando o código lança `HttpsError('not-found')`. O `lookupClass` responde 404 com `{"error":{"message":"Turma não encontrada..."}}` — que é o comportamento correto, não ausência.
- Depois de habilitar o Cloud Run no projeto, o domínio `cloudfunctions.net` passou a devolver `401` para caminhos desconhecidos, em vez de `404`. Ou seja: os dois códigos mudaram de significado no meio do caminho.

Se quiser mesmo usar `curl`, olhe o **corpo** da resposta, não o status: uma função publicada devolve um JSON com `error.message` em português; uma inexistente devolve HTML ou uma mensagem genérica do Google.

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
| `abacatepay.api_key` | `createAbacatePayCheckout`, `confirmPayment` | O checkout não abre e a conferência de pagamento não acontece: as funções respondem `failed-precondition`. |
| `abacatepay.webhook_secret` | `abacatePayWebhook` | O webhook rejeita tudo com 401 — nenhum pagamento libera plano automaticamente. |

## Chave da AbacatePay

A chave fica **apenas** na configuração do Firebase Functions, nunca em arquivo versionado. Pegue-a no painel da AbacatePay e rode:

```bash
firebase functions:config:set \
  abacatepay.api_key="COLE_A_CHAVE_AQUI" \
  abacatepay.webhook_secret="UM_SEGREDO_LONGO_E_ALEATORIO_QUE_VOCE_ESCOLHE" \
  --project izicodeedu-532ac
```

> **Aviso de vazamento.** Uma versão anterior deste arquivo trazia a chave de produção escrita por extenso — e este repositório é **público**. A chave começada por `key_J2bM6…` foi exposta no histórico do Git e **precisa ser revogada no painel da AbacatePay**: apagar do arquivo não a remove dos commits anteriores, e chaves em repositório público costumam ser coletadas por varredores automáticos em minutos.
>
> Nunca escreva uma chave aqui, nem "só para não esquecer qual é". Se precisar registrar qual está em uso, anote só o prefixo (`key_J2bM6…`), que identifica sem permitir uso.

### A integração usa a API v2

O painel da AbacatePay mostra a **versão** de cada chave. As chaves atuais são **API v2**, e a base é `https://api.abacatepay.com/v2`. Chamar `/v1` com uma chave v2 devolve `API key version mismatch` — mensagem que não menciona endpoint e leva a procurar problema na chave, não no caminho.

O que muda da v1 para a v2, e que motivou a reescrita:

| | v1 | v2 |
|---|---|---|
| criar cobrança | `POST /v1/billing/create` | `POST /v2/transparents/create` |
| produtos | definidos na própria chamada | `checkouts/create` exige ids de catálogo |
| consultar | `GET /v1/billing/list` | `GET /v2/transparents/check?id=` |
| evento pago | `billing.paid` | `transparent.completed` |

Usamos `transparents/create` e não `checkouts/create` porque ele aceita **valor arbitrário**. O preço da escola sai da contagem de assentos e muda a cada contratação — com catálogo seria preciso cadastrar um produto por combinação possível.

Um detalhe que custou uma rodada de depuração: **não envie `customer`** em `transparents/create`. A v2 exige o objeto completo (com celular e CPF) quando ele aparece, e recusa um parcial com `Value should be one of 'object', 'object'`. Quem identifica o pagamento é a `metadata`, e pedir CPF só para gerar um Pix seria coletar dado sem necessidade.

### Conferir se a chave funciona ANTES de um cliente descobrir

```bash
curl -s -X POST -H "Authorization: Bearer SUA_CHAVE" -H "Content-Type: application/json"   -d '{"method":"PIX","data":{"amount":100,"expiresIn":3600}}'   https://api.abacatepay.com/v2/transparents/create
```

| resposta | significado |
|---|---|
| `200` com `brCode` | a chave funciona |
| `Invalid or inactive API key` | a chave não existe ou está desativada — **mesma** resposta que uma chave inventada |
| `API key version mismatch` | a chave é real, mas você chamou a versão errada da API |

Em devMode dá para fechar o ciclo inteiro sem dinheiro real: `POST /v2/transparents/simulate-payment?id=<id>` marca a cobrança como paga, e o resto do fluxo segue igual ao de produção.

Se a chave for recusada, `createAbacatePayCheckout` responde `failed-precondition` (não `internal`), e a tela mostra o aviso fixo de "pagamento indisponível" com o caminho para falar com a equipe — em vez de pedir para a pessoa tentar de novo, o que nunca funcionaria, já que o problema é nosso.

### Como a AbacatePay v2 autentica o webhook

Não é um segredo na query string — isso era a convenção da v1. A v2 usa o padrão **Standard Webhooks**: três headers (`webhook-id`, `webhook-timestamp`, `webhook-signature`) e uma assinatura HMAC-SHA256 sobre `id.timestamp.corpo`.

No painel, cadastre:

| campo | valor |
|---|---|
| URL | `https://us-central1-izicodeedu-532ac.cloudfunctions.net/abacatePayWebhook` |
| Secret | o mesmo valor de `abacatepay.webhook_secret` |
| Eventos | `transparent.completed` (os demais são ignorados sem erro) |

Dois detalhes que só apareceram testando de verdade, e que valem para quem for depurar isto no futuro:

- **A assinatura é sobre o corpo cru.** Reserializar com `JSON.stringify(req.body)` muda espaçamento e ordem de chaves, e a assinatura nunca bate. A função usa `req.rawBody`.
- **A cobrança não vem em `data.billing`.** O campo depende do evento: `transparent.completed` traz `data.transparent`, `checkout.completed` traz `data.checkout`. A documentação mostra um `data` genérico, e o código lia só `billing` — o resultado era um 401 seguido de "pagamento não identificado", sem pista de que a forma do payload era outra.

### Como saber se o webhook está funcionando

O painel da AbacatePay tem **Chamadas do webhook**, com o status de cada entrega e um botão de reenviar. Do nosso lado:

```bash
gcloud functions logs read abacatePayWebhook --project izicodeedu-532ac --region us-central1 --limit 10
```

Uma entrega bem-sucedida registra `pagamento <id> aplicado`. Os logs de recusa mostram os **nomes** dos campos e headers recebidos, nunca os valores — foi assim que descobrimos o mecanismo real de autenticação sem escrever segredo nenhum no log.

### Se o webhook falhar, ninguém fica sem o que pagou

`reconciliarPagamentos` roda a cada 10 minutos e confere na AbacatePay os pagamentos pendentes entre 2 minutos e 6 horas atrás. É a rede que cobre o caso em que o webhook não chega e a pessoa já fechou a aba — sem ela, alguém poderia pagar e nunca receber o acesso.

## O ciclo de compra, de ponta a ponta

**Professor e família (autoatendimento completo):**

1. A pessoa escolhe o plano em `/planos` e cai em `/app/assinatura` (o login é exigido aí — o plano é liberado para a conta que paga).
2. `createAbacatePayCheckout` grava a intenção em `/payments`, cria a cobrança com o preço **calculado no servidor** e devolve a URL do Pix.
3. Pagamento confirmado → `abacatePayWebhook` chama `aplicarPagamento`, que grava `subscription.plan = 'pro'` no documento do usuário. O acesso abre sozinho.
4. Se o webhook atrasar, a própria tela pergunta pelo `confirmPayment` a cada 5 segundos. As duas rotas são idempotentes: rodar as duas não libera duas vezes nem cobra de novo.

**Escola (pagamento automático, liberação manual):**

1. A escola simula os assentos em `/planos#escola` e gera a cobrança em `/app/assinatura?plano=escola&professores=N&alunos=M`.
2. O valor é recalculado no servidor por `calcularEscola` — o navegador nunca define preço.
3. Pagamento confirmado → a escola vai para `plan = 'paid_pending_activation'`, **não** para `active`, e um lead de alta prioridade entra em `/leads`.
4. A gestão de turmas continua bloqueada: `isSchoolPlanActive()` no `firestore.rules` exige `plan == 'active'`, então nem a interface nem uma chamada direta ao Firestore contornam isso.
5. Alguém da equipe valida a instituição em **Admin → Escolas** e clica em "Validar e liberar". Só então as turmas abrem.

Essa diferença é deliberada: contrato com escola envolve nota fiscal, dados de crianças e a quantidade de assentos combinada — coisas que não se conferem sozinhas.

## Entrada do aluno pelo código da turma

`lookupClass` e `studentLogin` existem porque esse fluxo não pode acontecer no navegador:

- A regra de `/classes` exige usuário autenticado, e o aluno ainda não entrou quando digita o código.
- O documento de cada aluno guarda a **palavra secreta**. Buscar a turma pelo cliente trazia a senha de todos os colegas para o navegador de qualquer um que tivesse o código da turma — que fica num cartaz na parede.

`lookupClass` devolve apenas nome e avatar. `studentLogin` confere a palavra no servidor e devolve um token assinado, então a sessão do aluno vale para as regras do Firestore como qualquer outra. Antes, o "login" era só uma gravação em `localStorage`, que qualquer pessoa podia digitar no console para virar outro aluno.

### Permissão extra para assinar o token (atenção)

`studentLogin` usa `admin.auth().createCustomToken()`, e isso **não funciona só com o deploy**: a conta de serviço que roda as functions precisa poder assinar tokens. Sem essa permissão a função publica normalmente e só falha quando um aluno tenta entrar, com o erro `Permission 'iam.serviceAccounts.signBlob' denied`.

Para conceder, uma vez:

1. No Console do Google Cloud → **IAM e Admin → IAM**, com o projeto `izicodeedu-532ac`.
2. Encontre a conta de serviço que executa as functions — normalmente `izicodeedu-532ac@appspot.gserviceaccount.com`.
3. Adicione o papel **Criador de token de conta de serviço** (`roles/iam.serviceAccountTokenCreator`).

Vale conferir isso logo depois do primeiro deploy de functions, testando a entrada por um código de turma real: é o tipo de erro que só aparece com um aluno na frente da tela.

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
