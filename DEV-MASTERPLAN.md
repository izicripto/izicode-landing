# 🏗️ IZICODE EDU - DEV MASTERPLAN & OPERATIONS GUIDE
**Versão:** 4.0 (Pós-lançamento, em operação)
**Status:** Em produção, iteração contínua
**Stack:** React 19 + Vite + TypeScript + Tailwind 4 (app) · Firebase (Auth, Firestore, Hosting, Functions) · Gemini IA · AbacatePay (Pix)

---

## 🎯 1. VISÃO DO PROJETO
Plataforma B2B/B2C para escolas, professores autônomos e famílias, focada em robótica e cultura maker — planos de aula por IA alinhados à BNCC, Academia do Professor, Biblioteca de projetos e Área do Aluno gamificada.

---

## ✅ 2. O QUE FOI FEITO

### Infraestrutura & SEO
- [x] Domínio oficial `izicode.com.br` com SSL e deploy automático no Firebase Hosting.
- [x] SEO técnico: `sitemap.xml`, `robots.txt`, medição de analytics também nos guias públicos.
- [x] Content-Security-Policy revisada para permitir conversão do Google Ads sem abrir mão de restrições de origem.
- [x] LGPD: Termos de Uso, Política de Privacidade e banner de consentimento de cookies em todas as páginas.

### Conteúdo & Materiais
- [x] Guias abertos (BNCC, hackathon escolar, olimpíadas, ODS, sustentabilidade, práticas restaurativas, implantação de laboratório).
- [x] Academia do Professor com trilhas de Scratch, Arduino, Micro:bit, Code.org, Python, Makey Makey e Tinkercad.
- [x] Biblioteca com roteiros de projeto prontos.
- [x] Regra de acesso: 2 guias e 1 curso livres; restante no plano PRO.

### Funcionalidades (SaaS)
- [x] Gerador de projetos por IA salvando no Firestore, com limite gratuito real (3 gerações) e liberação ilimitada no plano PRO.
- [x] Área do Aluno com gamificação funcional (XP, nível, quiz, ranking).
- [x] Painel do professor em SPA React (`/app`), com sidebar fixa e carregamento sob demanda.
- [x] Gestão de turmas para escolas, com plano `demo`/`active` e códigos de acesso próprios.
- [x] Painel de administração restrito à conta dono da plataforma.

### Pagamentos
- [x] Migração completa para AbacatePay API v2 (Pix): checkout transparente, webhook com verificação de assinatura HMAC (padrão Standard Webhooks) e reconciliação periódica de pagamentos pendentes.
- [x] Preço da escola calculado por contagem de assentos (`professores`/`alunos`), sempre no servidor — nunca aceito do cliente.

### Segurança
- [x] Firestore Rules com lista de permissão de papéis (em vez de lista de bloqueio), fechando brecha de autopromoção a `admin`/`dev`/`professor-pro`.
- [x] Owner da plataforma ancorado no e-mail assinado pelo token de autenticação, não em campo do documento do usuário.
- [x] Validação de IDs vindos do cliente antes de virarem caminho no Firestore (evita 500 e exposição de subcoleções).

---

## 🚀 3. PRÓXIMAS ETAPAS

### 1. Conteúdo e Produto
- [ ] Página de blog/conteúdo para SEO orgânico.
- [ ] Relatórios PDF do roteiro gerado por IA para o professor.
- [ ] Expandir Biblioteca e trilhas da Academia do Professor.

### 2. Monetização
- [ ] Sistema de cupons de desconto.
- [ ] Marketplace de projetos entre professores.

### 3. Operação
- [ ] Reavaliar automação de marketing (Telegram/LinkedIn) para leads e consultores, hoje sem uso ativo.
- [ ] Manter documentação interna (`STATUS_REPORT.md`, `CTO-REPORT.md`, `docs/PROJECT-DOSSIER.md`) alinhada ao histórico real de commits.
