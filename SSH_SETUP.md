# 🔑 Configuração de Chave SSH - Antigravity

## ✅ Chave Gerada com Sucesso!

**Localização:**
- Chave privada: `C:\Users\izicripto\.ssh\antigravity_izicode`
- Chave pública: `C:\Users\izicripto\.ssh\antigravity_izicode.pub`

---

## 📋 Chave Pública (Copie esta linha)

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILc91XnBWu/InpMMpAuslcqk4Q3wZ37mQtcikKeW3uMbk antigravity@izicode
```

---

## 🚀 Próximos Passos

### **1. Adicionar Chave na VPS**

Conecte-se à VPS e execute:

```bash
# Conectar à VPS
ssh izicripto@104.197.154.130

# Adicionar chave ao authorized_keys
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILc91XnBWu/InpMMpAuslcqk4Q3wZ37mQtcikKeW3uMbk antigravity@izicode" >> ~/.ssh/authorized_keys

# Verificar permissões
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# Sair
exit
```

---

### **2. Testar Conexão**

Depois de adicionar a chave, teste:

```powershell
# No Windows (PowerShell)
ssh -i "$env:USERPROFILE\.ssh\antigravity_izicode" izicripto@104.197.154.130
```

Se conectar sem pedir senha, está funcionando! ✅

---

### **3. Configurar SSH Config (Opcional)**

Para facilitar, adicione ao `~/.ssh/config`:

```
Host izicode-vps
    HostName 104.197.154.130
    User izicripto
    IdentityFile C:\Users\izicripto\.ssh\antigravity_izicode
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

Depois, conecte apenas com:
```bash
ssh izicode-vps
```

---

## 🤖 Uso pelo Antigravity

Após configurar, eu poderei executar comandos na VPS automaticamente:

```bash
# Verificar OpenClaw
ssh -i ~/.ssh/antigravity_izicode izicripto@104.197.154.130 "ps aux | grep openclaw"

# Executar comandos
ssh -i ~/.ssh/antigravity_izicode izicripto@104.197.154.130 "cd ~/openclaw && git pull"
```

---

## ⚠️ Segurança

- ✅ Chave privada fica apenas no seu computador
- ✅ Nunca compartilhe a chave privada
- ✅ Chave pública pode ser compartilhada
- ✅ Use `-N ""` apenas para automação (sem passphrase)

---

## 📞 Próximo Passo

**Execute o comando na VPS para adicionar a chave, depois me avise que está pronto!**
