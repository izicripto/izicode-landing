# 📊 RELATÓRIO DE STATUS - IZICODE EDU
**Atualizado em:** 11/09/2026

## ✅ CONCLUÍDO RECENTEMENTE
- **LGPD/Cookies:** Termos de Uso, Política de Privacidade e banner de consentimento de cookies publicados em todas as páginas.
- **Analytics:** GA4 ligado de fato, respeitando o consentimento do usuário.
- **Login resiliente:** sessão sobrevive ao navegador embutido do Instagram.
- **CSP corrigida:** conversão do Google Ads e demais hosts de conversão liberados no `connect-src`, sem abrir o site a scripts arbitrários.
- **Estúdio IA:** corrigido bug que escondia as três gerações gratuitas de quem tinha acabado de se cadastrar.
- **Segurança:** fechada brecha de autopromoção a papel `dev` que dava acesso à IA paga (chave da Izicode) de graça para conta gratuita.
- **PWA:** `manifest.json` funcional e banner de instalação no topo do site — instalação como app está realmente ativa (não é mais só um esboço).
- **Pagamentos:** migração completa para AbacatePay API v2 (Pix), com webhook validado por assinatura HMAC (padrão Standard Webhooks) e reconciliação periódica de pagamentos pendentes.
- **SEO técnico:** `sitemap.xml` e `robots.txt` publicados; medição de analytics também presente nos guias públicos, que são a porta de entrada de busca.
- **Regras de acesso:** 2 guias e 1 curso liberados sem cadastro; o restante da Academia e da Biblioteca é do plano PRO.
- **Conteúdo:** cursos de Tinkercad e Makey Makey adicionados à Academia do Professor; link oficial da ferramenta aparece como recompensa ao concluir o curso.

## 🚧 EM ANDAMENTO
- Nenhum bloqueio crítico aberto no momento. O foco atual é iteração de conversão (SEO, CSP, onboarding) e pequenos ajustes de UX identificados em uso real.

## 📅 PRÓXIMOS PASSOS (Roadmap)
1. **Relatórios PDF:** permitir exportar roteiros gerados por IA em PDF para o professor.
2. **Automação de marketing:** avaliar retomada de alertas via Telegram/LinkedIn para leads e consultores.
3. **Conteúdo:** seguir expandindo a Biblioteca e as trilhas da Academia do Professor.

## ⚠️ NOTAS TÉCNICAS
- O plano de pagamento é AbacatePay (Pix), não Hotmart — a integração antiga com Hotmart foi descontinuada e substituída.
- Preços cobrados no back-end (`functions/index.js`) precisam continuar espelhando exatamente `app/src/lib/planos.ts`; qualquer divergência é problema comercial, não só técnico.
- Chave de API do Firebase client-side em `public/js/firebase-config.js` e `public/js/env.js` é pública por design (restrita por domínio, protegida pelas Firestore Rules) — não é uma exposição indevida.
