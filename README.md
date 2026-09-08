# Izicode Edu

**Robótica e cultura maker para a escola brasileira.**

[izicode.com.br](https://izicode.com.br) · [contato@izicode.com.br](mailto:contato@izicode.com.br) · [WhatsApp (41) 99899-6996](https://wa.me/5541998996996)

---

## Quem somos

A Izicode Edu leva tecnologia educacional para dentro da sala de aula — não
como ferramenta isolada, mas como método. Trabalhamos para que o aluno
deixe de ser usuário de tecnologia e passe a ser criador dela, com projetos
alinhados à BNCC e ao que a escola já tem de recursos.

Desde 2022, os números acumulados do nosso currículo:

| | |
|---|---|
| Turmas atendidas | 140+ |
| Alunos impactados | 2.902+ |
| Equipes formadas | 106+ |
| Projetos maker aplicados | 170+ |

## Duas formas de trabalhar com a gente

Elas convivem, e nenhuma é acessório da outra.

### A plataforma

Contratada pela própria pessoa, sem passar por vendedor. Reúne o que um
professor precisa para planejar, ensinar e acompanhar:

- **Planos de aula gerados por IA**, alinhados à BNCC
- **Academia do Professor** — sete trilhas sobre Scratch, Arduino, Micro:bit,
  Code.org, Python, Makey Makey e Tinkercad
- **Biblioteca** com 37 roteiros de projeto prontos
- **Área do aluno** com quiz, ranking e progresso
- **Gestão de turmas** para escolas, com códigos de acesso próprios

O plano gratuito não expira e não pede cartão. Preços e limites em
[/planos](https://izicode.com.br/planos).

### A consultoria

Quando a escola quer montar o laboratório e preparar o corpo docente, a
nossa equipe vai junto:

- Diagnóstico e plano de implementação do laboratório maker
- Formação docente prática, com as ferramentas em mãos
- Projetos com Arduino, Micro:bit e materiais acessíveis
- Adequação curricular à BNCC e às competências digitais
- Acompanhamento durante a implantação

## Para quem

- **Professores autônomos** que dão aula de tecnologia e precisam de material
  pronto e de formação
- **Escolas** que querem estruturar robótica no currículo, do diagnóstico à
  primeira aula
- **Famílias** que buscam aulas online de robótica e programação no
  contraturno

## Material aberto

Publicamos guias gratuitos para professores, sem cadastro:
[izicode.com.br/guias](https://izicode.com.br/guias/) — BNCC e cultura
digital, hackathon escolar, olimpíadas de tecnologia, projetos ODS,
sustentabilidade, práticas restaurativas e implantação de laboratório.

---

## Sobre este repositório

Contém o site e a plataforma. Para quem for mexer no código:

### Como está organizado

```
app/          aplicação React (landing pública + painel /app)
public/       páginas estáticas, guias gerados, assets
functions/    Cloud Functions (IA, pagamentos, entrada de aluno)
scripts/      geradores e utilitários de operação
docs/         decisões de negócio, deploy e regras
```

### Stack

- **Front-end** — React 19, Vite, TypeScript, Tailwind 4, shadcn/ui,
  React Router
- **Back-end** — Firebase: Firestore, Auth, Hosting e Cloud Functions
  (Node 20)
- **IA** — Google Gemini, com chave gerenciada para o plano PRO e chave
  pessoal para o gratuito
- **Pagamentos** — AbacatePay (Pix), API v2
- **CI/CD** — GitHub Actions, deploy automático a cada push na `main`

### Rodando localmente

```bash
cd app
npm install
npm run dev
```

O painel exige autenticação real do Firebase; a landing e os guias abrem
sem login.

### Documentação interna

| Documento | Assunto |
|---|---|
| [MODELO-NEGOCIO.md](docs/MODELO-NEGOCIO.md) | por que cada preço é o que é |
| [REGRAS-DE-ACESSO.md](docs/REGRAS-DE-ACESSO.md) | o que é gratuito e o que é do PRO |
| [DEPLOY-FUNCTIONS.md](docs/DEPLOY-FUNCTIONS.md) | credenciais, deploy e o ciclo de pagamento |
| [DNS-E-SEO.md](docs/DNS-E-SEO.md) | domínio, e-mail e busca orgânica |

### Uma regra que não se negocia

**Chave de API não entra no repositório.** Segredos ficam em
`firebase functions:config:set` ou em secret do GitHub Actions. Um segredo
commitado continua legível em `git show` mesmo depois de removido do
arquivo — e este repositório é público.

---

© Izicode Edu
