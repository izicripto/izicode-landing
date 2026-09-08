# O que é gratuito e o que é do plano PRO

Este documento é a fonte da regra. O código a implementa em dois lugares —
`app/src/lib/acesso.ts` (Academia, dentro do app) e `scripts/gerar-guias.mjs`
(guias, que são HTML estático gerado fora do app) — e ambos apontam para cá.

## O princípio

Todo conteúdo pago tem uma porta de entrada gratuita **de verdade**, não uma
amostra simbólica. Ninguém assina o que não pôde experimentar, e uma lista
onde tudo aparece trancado não convida a clicar em nada.

Ao mesmo tempo, o gratuito precisa terminar em algum lugar visível — senão
não existe motivo para pagar.

## Guias

| Guia | Acesso |
|---|---|
| Tecnologia educacional alinhada à BNCC | **completo** |
| Manual de implementação na escola | **completo** |
| Hackathon escolar | prévia (3 seções) |
| Olimpíadas e competições | prévia (3 seções) |
| Projetos ODS | prévia (3 seções) |
| Ecologia e sustentabilidade | prévia (3 seções) |
| Práticas restaurativas | prévia (3 seções) |

Os dois abertos não foram escolhidos ao acaso: são os de maior volume de
busca e os que melhor mostram o padrão do material. Quem chega por eles vê a
qualidade inteira antes de decidir pagar.

### Por que prévia e não bloqueio

Estas páginas existem para o Google indexar e trazer professor novo por
busca orgânica. Atrás de login, o robô vê uma parede: a página sai da busca
e o motivo dela existir desaparece junto.

A prévia é o padrão que jornais usam para o mesmo dilema. O leitor chega
pela busca, lê o começo de verdade e encontra o incentivo para assinar.

### Um detalhe que não é opcional

**O corte acontece na geração do HTML.** A página publicada contém apenas a
prévia; o restante não está no arquivo.

Esconder o texto completo com CSS ou JavaScript pareceria equivalente, mas
não é: o Google receberia o conteúdo inteiro e o leitor veria só um pedaço.
Isso se chama *cloaking*, e é punido com remoção do índice — exatamente o
oposto do que estamos tentando conseguir.

## Academia

| Curso | Acesso |
|---|---|
| Scratch para Professores | **completo** |
| Arduino do Zero | 1º módulo |
| Micro:bit para Professores | 1º módulo |
| Code.org para Professores | 1º módulo |
| Python para Professores | 1º módulo |
| Makey Makey para Professores | 1º módulo |

Scratch é a porta de entrada natural: não exige comprar nada, roda no
navegador da escola e é onde a maioria dos professores começa. Quem termina
essa trilha já sabe o que a Academia entrega.

O primeiro módulo dos demais continua aberto pelo mesmo motivo da prévia dos
guias — sem ele, a Academia vira uma lista de títulos trancados.

## Ao mudar a regra

Mexa em **um** lugar por vez e confira o outro:

- `app/src/lib/acesso.ts` — `CURSO_LIVRE`, `cursoLiberado()`, `moduloLiberado()`
- `scripts/gerar-guias.mjs` — a marca `livre: true` e `SECOES_NA_PREVIA`;
  depois rode `node scripts/gerar-guias.mjs` para regerar as páginas

O erro clássico aqui é a lista prometer uma coisa e a tela de dentro
entregar outra — a pessoa clica num "grátis" e encontra um cadeado. Por
isso a etiqueta da lista e o bloqueio da tela do curso leem da **mesma**
função, em vez de cada uma fazer a sua conta.

Os textos que descrevem a regra para o usuário também precisam acompanhar:
a mensagem do módulo bloqueado, o rótulo da lista de cursos, a parede dos
guias e o bloco da Academia dentro dos guias.
