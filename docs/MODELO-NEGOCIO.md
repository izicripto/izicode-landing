# Modelo de negócio — raciocínio por trás dos preços

Os números vivem em `app/src/lib/planos.ts`. Este documento explica **por que** cada um é o que é, para que um ajuste futuro seja uma decisão e não um chute.

> Os valores são uma proposta inicial, calculada sobre custos estimados. Precisam ser validados com dados reais de custo de kit, frete e consumo de IA antes de virarem compromisso comercial.

## Professor autônomo

| Plano | Preço | O que entrega |
|---|---|---|
| Gratuito | R$ 0 | 3 gerações de IA, 1º módulo de cada trilha, biblioteca e quiz |
| Professor PRO | R$ 39,90/mês | IA ilimitada com a chave da Izicode, trilhas completas |
| PRO Anual + Kit | R$ 397/ano | Tudo do PRO + Kit Arduino Básico enviado |

### Por que o kit só no plano anual

Um kit básico (placa compatível, protoboard, jumpers, LEDs, sensores, servo) custa por volta de **R$ 80–110** e o frete no Brasil, **R$ 25–40**. Chamemos de **R$ 120 entregue**.

No plano mensal de R$ 39,90, dar o kit na adesão significaria três meses de receita apenas para cobrir o custo — e prejuízo direto se a pessoa cancelasse no segundo mês.

No anual, o pagamento é adiantado: R$ 397 − R$ 120 (kit) − ~R$ 60 (IA no ano) deixa cerca de **R$ 217 de margem bruta**. O kit deixa de ser um custo de aquisição arriscado e passa a ser o argumento que justifica o compromisso anual.

Por isso também: **o kit é enviado após a confirmação do pagamento**, nunca antes.

### Por que R$ 397 e não R$ 358 (12 × 29,90)

R$ 397 equivale a R$ 33,08/mês — cerca de 10 meses de mensalidade. É um desconto real e legível ("2 meses grátis") que ainda comporta o custo do kit. Um anual calculado só como "12 × mensal com desconto" não pagaria o kit.

### Custo de IA

Os modelos Flash do Gemini são baratos por chamada. Um professor intenso deve ficar bem abaixo de **R$ 10/mês**. O risco não é o custo médio, é o abuso — daí o limite gratuito ser aplicado no servidor (`aiUsageCount`), não no navegador.

## Escola — base + assentos

| Item | Valor |
|---|---|
| Base mensal | R$ 249 (inclui 3 professores e 60 alunos) |
| Professor adicional | R$ 19/mês |
| Aluno adicional | R$ 2,50/mês |

A base cobre o que existe independentemente do tamanho: plataforma, gestão de turmas, suporte e a formação de implantação. Os assentos cobrem o que cresce com o uso.

Exemplos:

| Escola | Cálculo | Mensal |
|---|---|---|
| Pequena (3 prof., 60 alunos) | base | R$ 249 |
| Média (5 prof., 120 alunos) | 249 + 2×19 + 60×2,50 | R$ 437 |
| Grande (10 prof., 400 alunos) | 249 + 7×19 + 340×2,50 | R$ 1.232 |

O aluno adicional é deliberadamente barato: é o número que mais cresce, e um preço por aluno alto torna a proposta inviável para escola brasileira de porte médio. A margem vem do volume e da base.

**Demonstração antes da contratação:** a escola recebe um código e navega por tudo, mas `schools/{id}.plan` fica em `demo` e a criação de turmas é bloqueada — e o bloqueio está na regra do Firestore, não só na interface.

## Aulas online — vendido para famílias

Produto novo, que se apoia na conta de responsável e nos perfis de criança que já existem na plataforma.

| Plano | Preço | Formato |
|---|---|---|
| Turma Online | R$ 149/mês | 4 aulas ao vivo/mês, 60 min, até 8 alunos |
| Aula Individual | R$ 399/mês | 4 aulas ao vivo/mês, 50 min, individual |

### A economia

O custo principal é a hora do professor — algo entre **R$ 60 e R$ 80** por aula.

- **Turma cheia (8 alunos):** 8 × R$ 149 = R$ 1.192/mês por 4 aulas. Custo do professor: ~R$ 320. Margem confortável, e a turma se paga a partir de 3 alunos.
- **Individual:** R$ 399/mês por 4 aulas = ~R$ 100 por aula contra ~R$ 80 de custo. A margem é estreita de propósito: o produto existe para atender quem precisa de ritmo próprio, não para escalar.

Por isso a Turma é destacada como "mais escolhido": é onde a operação ganha.

### Por que faz sentido para a Izicode

A plataforma já tem o conteúdo (trilhas, roteiros, quiz), a conta de responsável e o perfil da criança. As aulas online monetizam o lado aluno, que hoje não gera receita direta, sem precisar construir um produto novo do zero.

O kit não é incluído: as aulas usam material que a família já tem ou o kit comprado à parte — incluir hardware num plano mensal de R$ 149 traria o mesmo problema do plano mensal do professor.
