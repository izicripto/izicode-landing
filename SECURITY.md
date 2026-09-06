# 🔒 Segurança - Dados Sensíveis

## ⚠️ ARQUIVOS QUE NUNCA DEVEM IR PARA O GIT

### 🔴 CRÍTICO - Chaves Privadas
- `serviceAccountKey.json` - **NUNCA COMMITAR**
- Qualquer arquivo `.env` (exceto `.env.example`)
- Chaves SSH (`*.pem`, `*.key`, `id_rsa`, etc.)

### 🟡 IMPORTANTE - Scripts com Credenciais
- `init-db-admin.mjs` - Usa service account
- `init-db-node.mjs` - Usa service account
- `test-db.mjs` - Usa service account

---

## ✅ O QUE ESTÁ PROTEGIDO

### `.gitignore` Atualizado
```
✅ serviceAccountKey.json
✅ .env, .env.local, *.env
✅ init-db-*.mjs, test-db.mjs
✅ Chaves SSH
✅ node_modules/
✅ Arquivos temporários
```

### Arquivos Removidos do Git
```bash
git rm --cached serviceAccountKey.json
git rm --cached init-db-admin.mjs
git rm --cached init-db-node.mjs
git rm --cached test-db.mjs
```

---

## 🔐 CONFIGURAÇÃO SEGURA

### 1. Firebase Client Config (PÚBLICO - OK para Git)
Localização: `public/js/firebase-config.js`

**Pode ser público porque:**
- API Key é restrita por domínio no Firebase Console
- Firestore Rules protegem os dados
- Não dá acesso administrativo

### 2. Service Account Key (PRIVADO - NUNCA Git)
Localização: `serviceAccountKey.json` (local apenas)

**Como obter:**
1. https://console.firebase.google.com/project/izicodeedu-532ac/settings/serviceaccounts/adminsdk
2. Gerar nova chave privada
3. Salvar como `serviceAccountKey.json` na raiz do projeto
4. **NUNCA** commitar este arquivo

### 3. Environment Variables (PRIVADO - NUNCA Git)
Arquivo: `.env` (criar baseado em `.env.example`)

**Variáveis sensíveis:**
- `HOTMART_CLIENT_ID`
- `HOTMART_CLIENT_SECRET`
- `HOTMART_BASIC_AUTH`

---

## 🚨 SE VOCÊ JÁ COMMITOU DADOS SENSÍVEIS

### Opção 1: Remover do histórico (Recomendado)
```bash
# Remover arquivo do histórico
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch serviceAccountKey.json" \
  --prune-empty --tag-name-filter cat -- --all

# Force push
git push origin --force --all
```

### Opção 2: Revogar e Recriar Credenciais
1. **Firebase Service Account:**
   - Ir para Firebase Console → Service Accounts
   - Deletar a chave comprometida
   - Gerar nova chave

2. **Hotmart:**
   - Revogar client_secret comprometido
   - Gerar novo

---

## ✅ CHECKLIST DE SEGURANÇA

Antes de cada commit:
- [ ] Verificar `git status`
- [ ] Confirmar que nenhum arquivo `.env` está staged
- [ ] Confirmar que `serviceAccountKey.json` não está staged
- [ ] Confirmar que scripts de admin não estão staged
- [ ] Revisar diff: `git diff --cached`

---

## 📋 BOAS PRÁTICAS

### 1. Usar Variáveis de Ambiente
```javascript
// ❌ ERRADO
const apiKey = "AIzaSy...REAL_KEY_EXPOSTA...";

// ✅ CORRETO
const apiKey = process.env.VITE_FIREBASE_API_KEY;
```

### 2. Separar Configs Públicas e Privadas
```javascript
// firebase-config.js (PÚBLICO, mas com restrição de domínio no Console)
export const firebaseConfig = {
  apiKey: "AIzaSy... (restrita por domínio)", // OK se restrita
  // ...
};

// admin-config.js (PRIVADO - não commitar)
import serviceAccount from './serviceAccountKey.json';
```

### 3. Usar Firebase Functions para Lógica Sensível
```javascript
// ❌ ERRADO - Client-side
const hotmartSecret = "abc123"; // NUNCA!

// ✅ CORRETO - Server-side (Firebase Functions)
exports.processPayment = functions.https.onRequest((req, res) => {
  const secret = process.env.HOTMART_SECRET;
  // ...
});
```

---

## 🔗 Recursos

- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Environment Variables Best Practices](https://12factor.net/config)
- [Git Secrets Prevention](https://github.com/awslabs/git-secrets)
