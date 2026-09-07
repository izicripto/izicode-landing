# Cria a conta de serviço que publica as Cloud Functions pelo GitHub Actions.
#
# Por que isso existe: o deploy de hosting funciona com o FIREBASE_TOKEN
# (gerado por `firebase login:ci`), mas o Google descontinuou esse tipo de
# token para operações que tocam o Google Cloud — e deploy de functions é
# uma delas. O sintoma é exatamente o que acontece hoje: o site publica e
# as functions ficam respondendo 404.
#
# Rode UMA vez, autenticado como o dono do projeto. Ao final, o script
# imprime o caminho de um arquivo JSON para colar no secret GCP_SA_KEY do
# GitHub. Esse arquivo é uma credencial: quem tiver o conteúdo publica
# código em nome do projeto.
#
#   powershell -ExecutionPolicy Bypass -File scripts\criar-gcp-sa-key.ps1

$ErrorActionPreference = 'Stop'

$PROJETO = 'izicodeedu-532ac'
$DONO    = 'izicripto@gmail.com'
$SA      = 'github-actions-deploy'
$SA_MAIL = "$SA@$PROJETO.iam.gserviceaccount.com"

# A chave sai fora do repositório de propósito. Um JSON de conta de serviço
# dentro da pasta do projeto é candidato a entrar num `git add -A` distraído.
$DESTINO = Join-Path $env:USERPROFILE "izicode-gcp-sa-key.json"

function Passo($n, $texto) {
    Write-Host ""
    Write-Host "── $n. $texto" -ForegroundColor Cyan
}

# ---------------------------------------------------------------- 1
Passo 1 "Conferindo qual conta está ativa"

$contaAtiva = (gcloud config get-value account 2>$null)
Write-Host "   conta ativa: $contaAtiva"

if ($contaAtiva -ne $DONO) {
    Write-Host ""
    Write-Host "   A conta ativa não é a dona do projeto." -ForegroundColor Yellow
    Write-Host "   Vai abrir o navegador para você entrar como $DONO." -ForegroundColor Yellow
    Write-Host "   (Se entrar com outra conta, o script para no passo seguinte.)" -ForegroundColor Yellow
    Write-Host ""
    gcloud auth login $DONO
}

# ---------------------------------------------------------------- 2
Passo 2 "Confirmando acesso ao projeto $PROJETO"

gcloud config set project $PROJETO | Out-Null
$existe = (gcloud projects describe $PROJETO --format='value(projectId)' 2>$null)
if ($existe -ne $PROJETO) {
    Write-Host ""
    Write-Host "   ERRO: esta conta não enxerga o projeto $PROJETO." -ForegroundColor Red
    Write-Host "   Entre com a conta que é dona do projeto no Firebase e rode de novo:" -ForegroundColor Red
    Write-Host "     gcloud auth login $DONO" -ForegroundColor Red
    exit 1
}
Write-Host "   ok: projeto acessível"

# ---------------------------------------------------------------- 3
Passo 3 "Ligando as APIs que o deploy de functions usa"

# Sem estas APIs o primeiro deploy falha com mensagens pouco óbvias sobre
# build e artefatos, em vez de dizer que falta habilitar um serviço.
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
    gcloud services enable $api --project $PROJETO 2>&1 | Out-Null
}
Write-Host "   ok: APIs habilitadas"

# ---------------------------------------------------------------- 4
Passo 4 "Criando a conta de serviço $SA"

$jaExiste = (gcloud iam service-accounts list --project $PROJETO `
    --filter="email:$SA_MAIL" --format='value(email)' 2>$null)

if ($jaExiste -eq $SA_MAIL) {
    Write-Host "   já existia: $SA_MAIL (seguindo em frente)"
} else {
    gcloud iam service-accounts create $SA `
        --project $PROJETO `
        --display-name 'GitHub Actions - deploy' | Out-Null
    Write-Host "   criada: $SA_MAIL"
}

# ---------------------------------------------------------------- 5
Passo 5 "Concedendo os papéis necessários"

# Cada papel cobre uma etapa real do deploy: empacotar (Cloud Build),
# guardar a imagem (Artifact Registry), publicar a função (Cloud Functions)
# e rodá-la com a conta de runtime (Service Account User). O Firebase Admin
# cobre hosting e regras, para esta mesma conta poder publicar tudo.
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
    gcloud projects add-iam-policy-binding $PROJETO `
        --member "serviceAccount:$SA_MAIL" `
        --role $papel `
        --condition=None 2>&1 | Out-Null
}
Write-Host "   ok: papéis concedidos"

# ---------------------------------------------------------------- 6
Passo 6 "Permitindo que as functions assinem tokens de aluno"

# studentLogin usa admin.auth().createCustomToken(), que exige assinar um
# token. Sem esta permissão a função publica normalmente e só falha quando
# uma criança tenta entrar com o código da turma — com o erro
# 'Permission iam.serviceAccounts.signBlob denied'.
$RUNTIME = "$PROJETO@appspot.gserviceaccount.com"
gcloud projects add-iam-policy-binding $PROJETO `
    --member "serviceAccount:$RUNTIME" `
    --role 'roles/iam.serviceAccountTokenCreator' `
    --condition=None 2>&1 | Out-Null
Write-Host "   ok: $RUNTIME pode assinar tokens"

# ---------------------------------------------------------------- 7
Passo 7 "Gerando a chave JSON"

if (Test-Path $DESTINO) {
    Remove-Item $DESTINO -Force
}
gcloud iam service-accounts keys create $DESTINO `
    --iam-account $SA_MAIL `
    --project $PROJETO | Out-Null

if (-not (Test-Path $DESTINO)) {
    Write-Host "   ERRO: a chave não foi gerada." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host " Pronto. A chave está em:" -ForegroundColor Green
Write-Host "   $DESTINO"
Write-Host ""
Write-Host " Agora, no GitHub:" -ForegroundColor Green
Write-Host "   1. Abra https://github.com/izicripto/izicode-landing/settings/secrets/actions"
Write-Host "   2. New repository secret"
Write-Host "   3. Name:   GCP_SA_KEY"
Write-Host "   4. Secret: cole o conteúdo INTEIRO do arquivo acima"
Write-Host "              (incluindo as chaves { } — é um JSON completo)"
Write-Host ""
Write-Host " Para copiar o conteúdo direto para a área de transferência:" -ForegroundColor Green
Write-Host "   Get-Content '$DESTINO' -Raw | Set-Clipboard"
Write-Host ""
Write-Host " Depois de salvar o secret, dispare o deploy:" -ForegroundColor Green
Write-Host "   git commit --allow-empty -m 'ci: publicar functions' ; git push"
Write-Host ""
Write-Host " E APAGUE o arquivo — ele não precisa continuar no disco:" -ForegroundColor Yellow
Write-Host "   Remove-Item '$DESTINO'"
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
