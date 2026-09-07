# Cria a conta de servico que publica as Cloud Functions pelo GitHub Actions.
#
# Por que isso existe: o deploy de hosting funciona com o FIREBASE_TOKEN
# (gerado por 'firebase login:ci'), mas o Google descontinuou esse tipo de
# token para operacoes que tocam o Google Cloud - e deploy de functions e
# uma delas. O sintoma era exatamente esse: o site publicava e as functions
# ficavam respondendo 404.
#
# Rode UMA vez, autenticado como o dono do projeto. Ao final, o script
# imprime o caminho de um arquivo JSON para colar no secret GCP_SA_KEY do
# GitHub. Esse arquivo e uma credencial: quem tiver o conteudo publica
# codigo em nome do projeto.
#
#   powershell -ExecutionPolicy Bypass -File scripts\criar-gcp-sa-key.ps1
#
# Duas notas de implementacao, ambas aprendidas errando:
#
# 1. Sem acentos de proposito. O Windows PowerShell 5.1 le .ps1 sem BOM
#    usando a codepage ANSI, e os bytes de um travessao UTF-8 viram aspas
#    no meio de uma string, quebrando o parser.
# 2. Nada de '2>&1' em chamadas ao gcloud. No 5.1, stderr de um executavel
#    vira ErrorRecord - e o gcloud escreve ate mensagens de sucesso no
#    stderr ("Operation ... finished successfully"), o que derrubava o
#    script com ErrorActionPreference='Stop' mesmo com exit code 0.

$PROJETO = 'izicodeedu-532ac'
$DONO    = 'izicripto@gmail.com'
$SA      = 'github-actions-deploy'
$SA_MAIL = "$SA@$PROJETO.iam.gserviceaccount.com"

# A chave sai fora do repositorio de proposito. Um JSON de conta de servico
# dentro da pasta do projeto e candidato a entrar num 'git add -A' distraido.
$DESTINO = Join-Path $env:USERPROFILE "izicode-gcp-sa-key.json"

# Quem decide se um comando falhou e o LASTEXITCODE, nunca o stderr.
$ErrorActionPreference = 'Continue'

# Resolve o executavel UMA vez e chama sempre por caminho absoluto.
# Chamar '& gcloud' nao serve: no PowerShell funcoes tem precedencia sobre
# executaveis, entao uma funcao auxiliar chamada 'Gcloud' que fizesse
# '& gcloud' chamaria a si mesma ate estourar a pilha.
$GCLOUD = (Get-Command gcloud -CommandType Application, ExternalScript -ErrorAction SilentlyContinue |
           Select-Object -First 1).Source
if (-not $GCLOUD) {
    Write-Host "ERRO: gcloud nao encontrado no PATH." -ForegroundColor Red
    Write-Host "Instale o Google Cloud SDK: https://cloud.google.com/sdk/docs/install" -ForegroundColor Red
    exit 1
}

function Passo($n, $texto) {
    Write-Host ""
    Write-Host "-- $n. $texto" -ForegroundColor Cyan
}

function Invocar-Gcloud {
    param([string[]]$Argumentos)

    & $GCLOUD @Argumentos 2>$null | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "   ERRO em: gcloud $($Argumentos -join ' ')" -ForegroundColor Red
        Write-Host "   Rode o comando acima sozinho para ver a mensagem completa." -ForegroundColor Red
        exit 1
    }
}

# ---------------------------------------------------------------- 1
Passo 1 "Conferindo qual conta esta ativa"

$contaAtiva = (& $GCLOUD config get-value account 2>$null)
Write-Host "   conta ativa: $contaAtiva"

if ($contaAtiva -ne $DONO) {
    Write-Host ""
    Write-Host "   A conta ativa nao e a dona do projeto." -ForegroundColor Yellow
    Write-Host "   Vai abrir o navegador para voce entrar como $DONO." -ForegroundColor Yellow
    Write-Host ""
    & $GCLOUD auth login $DONO
}

# ---------------------------------------------------------------- 2
Passo 2 "Confirmando acesso ao projeto $PROJETO"

Invocar-Gcloud @('config','set','project',$PROJETO)
$existe = (& $GCLOUD projects describe $PROJETO --format='value(projectId)' 2>$null)
if ($existe -ne $PROJETO) {
    Write-Host ""
    Write-Host "   ERRO: esta conta nao enxerga o projeto $PROJETO." -ForegroundColor Red
    Write-Host "   Entre com a conta dona do projeto e rode de novo:" -ForegroundColor Red
    Write-Host "     gcloud auth login $DONO" -ForegroundColor Red
    exit 1
}
Write-Host "   ok: projeto acessivel"

# ---------------------------------------------------------------- 3
Passo 3 "Conferindo o faturamento"

# Cloud Functions nao existe no plano gratuito (Spark): exige o Blaze, que
# so liga com uma conta de faturamento ABERTA. Este projeto ja esteve
# vinculado a uma conta fechada, e o sintoma era um FAILED_PRECONDITION
# confuso no meio da habilitacao das APIs, um passo adiante. Melhor
# descobrir aqui, com a instrucao do que fazer.
$faturamento = (& $GCLOUD billing projects describe $PROJETO --format='value(billingEnabled)' 2>$null)
if ("$faturamento" -ne 'True') {
    Write-Host ""
    Write-Host "   ERRO: o faturamento do projeto nao esta ativo." -ForegroundColor Red
    Write-Host "   Cloud Functions exige o plano Blaze, que precisa de uma conta" -ForegroundColor Red
    Write-Host "   de faturamento aberta. Contas desta conta Google:" -ForegroundColor Red
    Write-Host ""
    & $GCLOUD billing accounts list --format='table(name,displayName,open)' 2>$null
    Write-Host ""
    Write-Host "   Vincule a uma conta com OPEN = True:" -ForegroundColor Red
    Write-Host "     gcloud billing projects link $PROJETO --billing-account=ID_DA_CONTA" -ForegroundColor Red
    exit 1
}
Write-Host "   ok: faturamento ativo"

# ---------------------------------------------------------------- 4
Passo 4 "Ligando as APIs que o deploy de functions usa"

# Sem estas APIs o primeiro deploy falha com mensagens pouco obvias sobre
# build e artefatos, em vez de dizer que falta habilitar um servico.
$apis = @(
    'cloudfunctions.googleapis.com',
    'cloudbuild.googleapis.com',
    'artifactregistry.googleapis.com',
    'iam.googleapis.com',
    'run.googleapis.com',
    'eventarc.googleapis.com'
)
foreach ($api in $apis) {
    Write-Host "   habilitando $api ..."
    Invocar-Gcloud @('services','enable',$api,'--project',$PROJETO)
}
Write-Host "   ok: APIs habilitadas"

# ---------------------------------------------------------------- 5
Passo 5 "Criando a conta de servico $SA"

$jaExiste = (& $GCLOUD iam service-accounts list --project $PROJETO `
    --filter="email:$SA_MAIL" --format='value(email)' 2>$null)

if ($jaExiste -eq $SA_MAIL) {
    Write-Host "   ja existia: $SA_MAIL (seguindo em frente)"
} else {
    Invocar-Gcloud @('iam','service-accounts','create',$SA,'--project',$PROJETO,
             '--display-name','GitHub Actions - deploy')
    Write-Host "   criada: $SA_MAIL"
}

# ---------------------------------------------------------------- 6
Passo 6 "Concedendo os papeis necessarios"

# Cada papel cobre uma etapa real do deploy: empacotar (Cloud Build),
# guardar a imagem (Artifact Registry), publicar a funcao (Cloud Functions)
# e rodar com a conta de runtime (Service Account User). O Firebase Admin
# cobre hosting e regras. O Service Usage Consumer costuma ser esquecido e
# e justamente o que falta quando o deploy morre com 403 em
# serviceusage.googleapis.com.
$papeis = @(
    'roles/firebase.admin',
    'roles/cloudfunctions.admin',
    'roles/iam.serviceAccountUser',
    'roles/cloudbuild.builds.editor',
    'roles/artifactregistry.admin',
    'roles/serviceusage.serviceUsageConsumer'
)
foreach ($papel in $papeis) {
    Write-Host "   concedendo $papel ..."
    Invocar-Gcloud @('projects','add-iam-policy-binding',$PROJETO,
             '--member',"serviceAccount:$SA_MAIL",
             '--role',$papel,'--condition=None')
}
Write-Host "   ok: papeis concedidos"

# ---------------------------------------------------------------- 7
Passo 7 "Permitindo que as functions assinem tokens de aluno"

# studentLogin usa admin.auth().createCustomToken(), que exige assinar um
# token. Sem esta permissao a funcao publica normalmente e so falha quando
# uma crianca tenta entrar com o codigo da turma, com o erro
# 'Permission iam.serviceAccounts.signBlob denied'.
$RUNTIME = "$PROJETO@appspot.gserviceaccount.com"
Invocar-Gcloud @('projects','add-iam-policy-binding',$PROJETO,
         '--member',"serviceAccount:$RUNTIME",
         '--role','roles/iam.serviceAccountTokenCreator','--condition=None')
Write-Host "   ok: $RUNTIME pode assinar tokens"

# ---------------------------------------------------------------- 8
Passo 8 "Gerando a chave JSON"

if (Test-Path $DESTINO) { Remove-Item $DESTINO -Force }
Invocar-Gcloud @('iam','service-accounts','keys','create',$DESTINO,
         '--iam-account',$SA_MAIL,'--project',$PROJETO)

if (-not (Test-Path $DESTINO)) {
    Write-Host "   ERRO: a chave nao foi gerada." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host " Pronto. A chave esta em:" -ForegroundColor Green
Write-Host "   $DESTINO"
Write-Host ""
Write-Host " Copie o conteudo para a area de transferencia:" -ForegroundColor Green
Write-Host "   Get-Content '$DESTINO' -Raw | Set-Clipboard"
Write-Host ""
Write-Host " No GitHub:" -ForegroundColor Green
Write-Host "   1. https://github.com/izicripto/izicode-landing/settings/secrets/actions"
Write-Host "   2. New repository secret"
Write-Host "   3. Name:   GCP_SA_KEY"
Write-Host "   4. Secret: cole o JSON inteiro, com as chaves de abertura e fechamento"
Write-Host ""
Write-Host " Depois, dispare o deploy:" -ForegroundColor Green
Write-Host "   git commit --allow-empty -m 'ci: publicar functions' ; git push"
Write-Host ""
Write-Host " E APAGUE o arquivo - ele nao precisa ficar no disco:" -ForegroundColor Yellow
Write-Host "   Remove-Item '$DESTINO'"
Write-Host "============================================================" -ForegroundColor Green
