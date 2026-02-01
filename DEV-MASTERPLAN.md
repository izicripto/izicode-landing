# 🏗️ IZICODE EDU - DEV MASTERPLAN & OPERATIONS GUIDE
**Versão:** 2.0 (CTO Update)
**Status:** Em Desenvolvimento Ativo
**Stack:** HTML5 / TailwindCSS / Firebase / Vercel

---

## 🎯 1. VISÃO DO PROJETO
Plataforma educacional Maker/Robótica que une **Marketing** (Landing Page de alta conversão) com **SaaS** (Ferramentas de IA para professores e Gamificação para alunos).

**Objetivo:** Captar escolas via consultoria e reter professores/alunos via plataforma digital.

---

## 🗺️ 2. ARQUITETURA DE ROTAS E FLUXOS

### 🟢 Área Pública (Marketing & SEO)
*Foco: Performance, SEO, Conversão (Leads).*
- `/` (index.html) -> Landing Page Principal. **[STATUS: ESTÁVEL]**
- `/docs/*` -> Documentação Técnica/Pedagógica (Markdown). **[STATUS: ESTÁVEL]**
- **Ação:** Botões levam para Login ou Tally (Formulário externo).

### 🟡 Área de Autenticação (Firebase)
- Login Google Popup -> Redireciona para Dashboard.
- Persistência: Firebase Auth + Firestore (`users` collection).

### 🔵 Área Logada (Aplicação)
*Foco: Funcionalidade, Interatividade.*
- `/dashboard.html` -> Hub central. Mostra resumo e atalhos. **[STATUS: UI PRONTA / DADOS MOCKADOS]**
- `/create-project.html` -> **Core Feature**. Gerador de Planos de Aula com IA (Gemini). **[STATUS: FUNCIONAL / SEM PERSISTÊNCIA]**
- `/library.html` -> Repositório de projetos da comunidade. **[STATUS: ESTRUTURA APENAS]**
- `/student-area.html` -> Gamificação para alunos. **[STATUS: UI PRONTA / SEM BACKEND]**

---

## 🛠️ 3. PROTOCOLOS PARA AGENTES (DEV OPS)

**Para qualquer agente que assumir este projeto:**

1.  **Frontend First:** Não usamos React/Vue complexos. É **HTML + ES Modules + Tailwind CDN**. Mantenha simples.
2.  **Imagens:**
    - Sempre em `public/images/`.
    - Nomes **sempre** em kebab-case (ex: `meu-arquivo-legal.jpg`), sem espaços ou acentos.
    - Use tags `alt` descritivas para SEO.
3.  **SEO:**
    - Ao criar nova página pública, adicione ao `sitemap.xml`.
    - Use Meta Tags Open Graph.
4.  **Firebase:**
    - Não expor chaves de serviço (Admin SDK) no frontend.
    - Use `js/firebase-config.js` para imports.

---

## 🚀 4. ROADMAP DE DESENVOLVIMENTO (PRÓXIMAS ETAPAS)

### ETAPA 1: O "Cérebro" da Aplicação (PRIORIDADE IMEDIATA) 🚨
O Gerador de Projetos (IA) funciona, mas não salva nada.
- [x] Criar coleção `projects` no Firestore.
- [x] Conectar o botão "Salvar" do `create-project.html` ao Firestore.
- [x] Fazer a `dashboard.html` ler os projetos salvos do usuário. (Feito via `my-projects.html`)

### ETAPA 2: Biblioteca de Conteúdo (SEO Dinâmico)
A biblioteca está vazia. Precisamos de conteúdo para atrair tráfego.
- [x] Criar arquivo semente `projects-data.js` com 10 projetos prontos.
- [x] Popular `library.html` com esses dados via JS.
- [x] Criar página de visualização de projeto (`project-view.html?id=XYZ`) para renderizar o conteúdo.

### ETAPA 3: Gamificação Real
A área do aluno é apenas visual.
- [x] Criar lógica de XP no Firestore. (Integrado no `student-area.html`)
- [x] Fazer o Quiz dar XP real para o usuário logado.
- [x] Recompensar criação de projetos com XP.
- [x] Mostrar resumo de XP/Nível na Dashboard principal.

### ETAPA 4: Monetização
- [x] Criar página de venda do "Kit Missão Maker". (`shop-kit.html`)
- [ ] Botão de compra integrado (Link de pagamento).

### ETAPA 5: Marketing Ops (Radar de Tendências) 📡
Central de inteligência para consultores.
- [ ] Criar Bot do Telegram para envio de Insights.
- [ ] Script de curadoria de notícias (BNCC, Robótica).
- [ ] Integração com LinkedIn (Link no rodapé feito, falta estratégia de conteúdo).

---

## 📂 ESTRUTURA DE ARQUIVOS
```
public/
├── images/          # Assets visuais (Otimizados)
├── js/
│   ├── auth.js      # Lógica de Login/Logout
│   ├── firebase-config.js # Inicialização
│   └── projects.js  # (TODO) Lógica de CRUD de projetos
├── docs/            # MD Files para SEO/Conteúdo
├── index.html       # Landing Page
└── [app_pages].html # Dashboard, Create, etc.
```
