/**
 * Academia do Professor - Catálogo de cursos
 * Trilhas em texto para professores aprenderem as ferramentas do currículo.
 *
 * Modelo de negócio: o primeiro módulo de cada curso é gratuito para
 * qualquer professor autenticado (freemium). Os demais módulos exigem
 * o plano PRO (mesma checagem de role já usada no resto da plataforma:
 * role === 'professor-pro' || role === 'admin').
 */

export const courses = [
    {
        id: "arduino-do-zero",
        title: "Arduino do Zero para Professores",
        tool: "Arduino",
        level: "Iniciante",
        logo: "images/arduino.png",
        description: "Do primeiro upload ao primeiro projeto de sala de aula: uma trilha prática pra quem nunca encostou numa placa Arduino.",
        outcome: "Ao final, você monta e programa um semáforo inteligente com seus alunos — sensores, atuadores e um plano de aula pronto.",
        modules: [
            {
                id: "m1",
                title: "Por que Arduino em Sala de Aula?",
                duration: "12 min",
                free: true,
                content: `
## O que é o Arduino, de fato

Arduino não é uma linguagem nem uma marca de robô — é uma placa de circuito com um microcontrolador, acompanhada de um ambiente de programação (a IDE) simples o suficiente para começar em uma tarde. A placa lê **entradas** (um botão, um sensor de luz, a temperatura do ambiente) e decide o que fazer com **saídas** (acender um LED, girar um motor, tocar um som).

Para efeito de sala de aula, pense assim: é a ferramenta mais direta que existe para um aluno ver o próprio código *acontecer no mundo físico* — sem abstração de tela.

## Por que vale o investimento de tempo

- **Ele torna o pensamento computacional tangível.** Um "if" deixa de ser uma linha de código e vira "se apertar o botão, o LED acende".
- **Erra barato.** Uma placa Arduino Uno original custa menos que um livro didático, e uma placa queimada raramente é fatal — na grande maioria dos erros de circuito, o pior cenário é o componente parar de funcionar.
- **Conecta com o currículo real.** Praticamente todo projeto de robótica do Ensino Fundamental II — semáforo, alarme, estufa automatizada, contador de pessoas — usa os mesmos 4 ou 5 conceitos que você vai ver nesta trilha.

## O que você vai precisar

| Item | Para que serve | Estimativa |
|---|---|---|
| Placa Arduino Uno (ou compatível) | O "cérebro" do projeto | ~R$ 60–90 |
| Cabo USB tipo B | Alimentar e programar a placa | Geralmente incluso |
| Protoboard (breadboard) | Montar o circuito sem solda | ~R$ 15 |
| Kit de jumpers (fios) | Conectar os componentes | ~R$ 10 |
| LEDs, resistores, botão, potenciômetro | Componentes dos exercícios desta trilha | ~R$ 15 no total |

Um "kit iniciante" genérico (busque por "kit arduino uno iniciante") já vem com tudo isso junto e cobre as 5 aulas desta trilha.

## Segurança: o que realmente importa

Arduino roda em **5 volts** — não há risco de choque elétrico como em uma tomada residencial. Os dois cuidados reais são:

1. **Nunca ligue a saída 5V direto no GND** (curto-circuito) — isso pode danificar a placa ou o computador.
2. **LEDs sempre precisam de um resistor em série** (normalmente 220Ω a 330Ω). Sem ele, o LED queima quase instantaneamente.

Fora isso, pode deixar os alunos experimentarem sem medo — é exatamente esse "posso tentar sem quebrar nada grave" que faz o Arduino funcionar tão bem pedagogicamente.

## O que vem a seguir

No próximo módulo você instala a IDE, entende a anatomia mínima de um programa Arduino (\`setup()\` e \`loop()\`) e faz o primeiro upload — o clássico "piscar um LED", que é o "Olá, Mundo" da eletrônica.
                `.trim(),
            },
            {
                id: "m2",
                title: "Instalando o Ambiente e Seu Primeiro Sketch",
                duration: "20 min",
                free: false,
                content: `
## Instalando a IDE

Baixe a **Arduino IDE** (gratuita) em [arduino.cc/en/software](https://www.arduino.cc/en/software) — existe versão para Windows, macOS e Linux. Se a instalação de drivers na máquina da escola for um problema (permissões de rede, antivírus corporativo), use o **Arduino Web Editor**, que roda no navegador e não exige instalação — só um pequeno plugin de conexão USB.

Depois de instalar, conecte a placa via USB e confira em **Ferramentas → Placa** se "Arduino Uno" (ou o modelo da sua placa) está selecionado, e em **Ferramentas → Porta** se uma porta apareceu (COM3, COM4... no Windows; /dev/cu.usbmodem... no Mac).

> **Problema comum**: se nenhuma porta aparece, o cabo USB pode ser "só de carga" (sem os fios de dados). Troque o cabo antes de suspeitar de driver.

## Anatomia mínima de um programa (sketch)

Todo programa Arduino — chamado de **sketch** — tem exatamente duas funções obrigatórias:

\`\`\`cpp
void setup() {
  // roda UMA vez, quando a placa liga ou reseta
}

void loop() {
  // roda EM LOOP, para sempre, enquanto a placa estiver ligada
}
\`\`\`

Essa estrutura já ensina um conceito de programação real: **inicialização vs. execução contínua**. Vale nomear isso explicitamente para a turma.

## Seu primeiro sketch: piscar um LED

A maioria das placas Arduino já tem um LED embutido, ligado ao pino 13 (identificado como \`LED_BUILTIN\`). Isso significa que dá para fazer o primeiro exercício **sem nenhum componente externo**:

\`\`\`cpp
void setup() {
  pinMode(LED_BUILTIN, OUTPUT); // avisa que o pino 13 vai ser usado como saída
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH); // acende
  delay(1000);                     // espera 1000ms = 1 segundo
  digitalWrite(LED_BUILTIN, LOW);  // apaga
  delay(1000);
}
\`\`\`

Clique em **Verificar** (✓, compila sem enviar) e depois em **Carregar** (→, envia para a placa). O LED da placa deve começar a piscar a cada segundo.

## Lendo os erros mais comuns

| Mensagem de erro | O que geralmente significa |
|---|---|
| \`expected ';' before...\` | Faltou um \`;\` no fim da linha anterior |
| \`'X' was not declared in this scope\` | Nome de variável escrito errado, ou variável usada antes de ser criada |
| \`avrdude: stk500_recv(): programmer is not responding\` | Porta errada selecionada, ou outro programa (como o Monitor Serial) está usando a porta |

Ensine a turma a **ler a primeira linha do erro**, não a última — o compilador aponta a linha exata do problema, e o erro real costuma estar ali ou logo antes.

## Atividade para aplicar em aula

Peça para os alunos alterarem os dois valores de \`delay()\` para criar um padrão de piscar diferente (ex: 200ms aceso, 800ms apagado, imitando um pisca-alerta). É a primeira alteração de código que eles fazem sozinhos — pequena, mas real.

No próximo módulo, você sai do LED embutido e monta o primeiro circuito na protoboard, com entrada de um botão.
                `.trim(),
            },
            {
                id: "m3",
                title: "Entradas e Saídas Digitais",
                duration: "25 min",
                free: false,
                content: `
## Saída digital: LED na protoboard

Diferente do módulo anterior, agora o LED fica **fora** da placa, na protoboard. O circuito mínimo:

1. Perna longa do LED (ânodo, +) → resistor de 220Ω → pino digital 8 da placa
2. Perna curta do LED (cátodo, −) → trilha GND da protoboard → pino GND da placa

\`\`\`cpp
const int LED_PIN = 8;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(500);
  digitalWrite(LED_PIN, LOW);
  delay(500);
}
\`\`\`

Note o uso de \`const int LED_PIN = 8\` no topo, em vez de escrever o número \`8\` direto em cada linha. Esse é o primeiro momento certo para introduzir **constantes nomeadas**: se depois você trocar o LED de pino, muda em um lugar só.

## Entrada digital: lendo um botão

Um botão de 4 pinos ligado à protoboard, com um pino no pino digital 2 e o outro no GND, mais um **resistor de pull-down** (10kΩ) entre o pino 2 e o GND — isso evita que a entrada "flutue" entre HIGH e LOW quando o botão não está pressionado.

\`\`\`cpp
const int BUTTON_PIN = 2;
const int LED_PIN = 8;

void setup() {
  pinMode(BUTTON_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int estadoBotao = digitalRead(BUTTON_PIN);

  if (estadoBotao == HIGH) {
    digitalWrite(LED_PIN, HIGH); // botão pressionado: LED aceso
  } else {
    digitalWrite(LED_PIN, LOW);
  }
}
\`\`\`

Se a sua placa tiver resistor de pull-up interno (a maioria tem), você pode simplificar a fiação usando \`pinMode(BUTTON_PIN, INPUT_PULLUP)\` e invertendo a lógica (o botão pressionado vira \`LOW\`, não \`HIGH\`) — vale mencionar as duas formas para a turma perceber que existe mais de um jeito certo de resolver o mesmo problema.

## O problema do "bounce" (ruído mecânico)

Um botão mecânico não liga/desliga de forma limpa — ele "trepida" por alguns milissegundos ao ser pressionado, o que pode fazer o programa "ler" vários cliques em vez de um só. Para os exercícios desta trilha isso não atrapalha (LED acende enquanto pressionado), mas é importante plantar o conceito: quando o projeto precisar **contar** cliques (ex: um contador de peças), será necessário tratar esse ruído — assunto para uma trilha mais avançada.

## Por que isso importa pedagogicamente

Esse par entrada→decisão→saída é a mesma estrutura lógica de **qualquer** sistema de automação — de um alarme residencial a um semáforo. Vale nomear isso explicitamente: "vocês acabaram de programar a mesma lógica que existe num sensor de porta de elevador".

## Atividade para aplicar em aula

Peça para inverter a lógica: LED aceso por padrão, apagando enquanto o botão está pressionado. É uma mudança de uma linha, mas obriga o aluno a entender de verdade o que o \`if\` está comparando — não só copiar o padrão.

No próximo módulo entramos em sensores analógicos: valores que não são só ligado/desligado.
                `.trim(),
            },
            {
                id: "m4",
                title: "Sensores Analógicos e PWM",
                duration: "25 min",
                free: false,
                content: `
## Do digital ao analógico

Até aqui, tudo foi ligado/desligado (HIGH/LOW). Mas boa parte do mundo real é uma escala contínua — luminosidade, temperatura, distância. Para isso o Arduino tem **pinos analógicos** (marcados A0 a A5), que leem uma faixa de valores em vez de só dois estados.

## Lendo um potenciômetro

Um potenciômetro é basicamente um resistor ajustável — o "botão giratório" clássico de volume. Ligado entre 5V e GND, com o pino do meio no pino analógico A0:

\`\`\`cpp
const int POT_PIN = A0;

void setup() {
  Serial.begin(9600); // liga a comunicação com o computador
}

void loop() {
  int valor = analogRead(POT_PIN); // valor de 0 a 1023
  Serial.println(valor);
  delay(100);
}
\`\`\`

Abra o **Monitor Serial** (ícone de lupa, canto superior direito da IDE) para ver os números mudando em tempo real enquanto gira o potenciômetro. Essa é a ferramenta de depuração mais usada em todo o resto do curso — vale ensinar a turma a abri-la desde já.

Por que 0 a 1023, e não 0 a 100? O conversor analógico-digital do Arduino Uno tem **resolução de 10 bits** (2¹⁰ = 1024 valores possíveis, de 0 a 1023). É uma boa oportunidade para conectar com o conceito de representação binária, se a turma já viu isso em outra disciplina.

## Convertendo a escala com map()

Quase sempre você vai querer converter esse 0–1023 para uma escala mais útil — por exemplo, 0–255 (a faixa de PWM, veja abaixo) ou 0–100 (uma porcentagem):

\`\`\`cpp
int valorBruto = analogRead(POT_PIN);
int porcentagem = map(valorBruto, 0, 1023, 0, 100);
\`\`\`

## PWM: simulando saída analógica

O Arduino não consegue gerar uma voltagem intermediária de verdade em pinos digitais comuns — mas alguns pinos (marcados com \`~\` na placa, ex: 3, 5, 6, 9, 10, 11) suportam **PWM** (Pulse Width Modulation): ligam e desligam tão rápido que, para o olho humano ou um motor, parece uma intensidade intermediária.

Combinando os dois conceitos — controlar o brilho de um LED com o potenciômetro:

\`\`\`cpp
const int POT_PIN = A0;
const int LED_PIN = 9; // precisa ser um pino com ~

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int valorBruto = analogRead(POT_PIN);
  int brilho = map(valorBruto, 0, 1023, 0, 255); // PWM vai de 0 a 255
  analogWrite(LED_PIN, brilho);
}
\`\`\`

Girar o potenciômetro agora controla o brilho do LED de forma contínua — o primeiro projeto da trilha que parece "de verdade" para a turma.

## Trocando o potenciômetro por um LDR

Um LDR (sensor de luz) se comporta como um resistor que muda de valor conforme a luz ambiente. Fisicamente, ele substitui o potenciômetro no mesmo circuito (com um resistor fixo de 10kΩ formando um divisor de tensão) — o código de leitura (\`analogRead\`) é **idêntico**. Essa é uma boa aula sobre abstração: o mesmo código funciona com sensores fisicamente diferentes, porque ambos "conversam" em 0–1023.

## Atividade para aplicar em aula

Peça para inverter a lógica do LDR: quanto **mais escuro** o ambiente, mais **forte** o LED acende (uma luminária automática simples). Isso exige inverter a escala do \`map()\` — trocando a ordem dos números de saída.

No módulo final, juntamos tudo — entrada digital, entrada analógica e PWM — num projeto completo de sala de aula, com plano de aula incluído.
                `.trim(),
            },
            {
                id: "m5",
                title: "Projeto Final: Semáforo Inteligente para a Turma",
                duration: "40 min",
                free: false,
                content: `
## O projeto

Um semáforo com 3 LEDs (vermelho, amarelo, verde) que opera em ciclo automático, mas com um botão de **pedestre**: ao ser pressionado, força o sinal a fechar (vermelho) mais rápido, como um semáforo de faixa real. Esse projeto já existe na Biblioteca de Projetos da plataforma (busque por "Semáforo Inteligente") com a versão de referência — aqui está o passo a passo pedagógico para dar essa aula.

## Circuito

| Componente | Pino |
|---|---|
| LED vermelho (+ resistor 220Ω) | 8 |
| LED amarelo (+ resistor 220Ω) | 9 |
| LED verde (+ resistor 220Ω) | 10 |
| Botão de pedestre | 2 (com \`INPUT_PULLUP\`) |

## Código comentado

\`\`\`cpp
const int LED_VERMELHO = 8;
const int LED_AMARELO = 9;
const int LED_VERDE = 10;
const int BOTAO_PEDESTRE = 2;

void setup() {
  pinMode(LED_VERMELHO, OUTPUT);
  pinMode(LED_AMARELO, OUTPUT);
  pinMode(LED_VERDE, OUTPUT);
  pinMode(BOTAO_PEDESTRE, INPUT_PULLUP); // HIGH em repouso, LOW pressionado
}

void loop() {
  // Fase verde — mas verifica o botão a cada 200ms, em vez de um delay() único
  acenderSomente(LED_VERDE);
  esperarOuInterromper(5000);

  acenderSomente(LED_AMARELO);
  delay(1500);

  acenderSomente(LED_VERMELHO);
  delay(3000);
}

void acenderSomente(int pinoAceso) {
  digitalWrite(LED_VERMELHO, pinoAceso == LED_VERMELHO);
  digitalWrite(LED_AMARELO, pinoAceso == LED_AMARELO);
  digitalWrite(LED_VERDE, pinoAceso == LED_VERDE);
}

void esperarOuInterromper(int duracaoNormal) {
  int tempoEspera = 0;
  while (tempoEspera < duracaoNormal) {
    if (digitalRead(BOTAO_PEDESTRE) == LOW) {
      return; // pedestre apertou: encurta a fase verde
    }
    delay(200);
    tempoEspera += 200;
  }
}
\`\`\`

Duas ideias novas aparecem aqui, e vale nomeá-las explicitamente para a turma:

1. **Funções auxiliares** (\`acenderSomente\`, \`esperarOuInterromper\`) — quebrar o programa em pedaços menores e nomeados, em vez de um \`loop()\` gigante.
2. **Substituir \`delay()\` por um laço que verifica algo a cada intervalo curto** — o primeiro passo para programação "não bloqueante", um conceito central em projetos mais avançados.

## Plano de aula sugerido (2 aulas de 50 min)

**Aula 1** — Montagem e ciclo automático
- Revisão rápida de saída digital (módulo 3)
- Montagem do circuito dos 3 LEDs em grupos de 2–3 alunos
- Upload do código sem o botão — só o ciclo verde/amarelo/vermelho
- Discussão: por que o mundo real usa exatamente essas 3 cores e essa ordem?

**Aula 2** — Adicionando o pedestre
- Introdução ao botão com \`INPUT_PULLUP\` (módulo 3, variante mencionada)
- Desafio: por que um \`delay(5000)\` simples não permite reagir ao botão no meio da espera?
- Implementação da função \`esperarOuInterromper\`
- Teste em grupo: um aluno cronometra, outro aperta o botão, terceiro observa o LED

## Alinhamento BNCC

Esse projeto já está mapeado na Biblioteca de Projetos com competências de Matemática (grandezas e medidas — tempo) e da Competência Geral 5 (cultura digital). Ao criar o plano de aula pelo Estúdio IA do seu dashboard, use a mesma descrição deste módulo como ponto de partida — o gerador já contextualiza automaticamente com BNCC.

## Critério de avaliação sugerido

Peça para cada grupo alterar **um** parâmetro e defender a escolha: tempo de cada fase, comportamento do botão durante o amarelo, ou adicionar um segundo botão. O objetivo não é o circuito funcionar — é o grupo saber explicar *por que* mudou o que mudou.

---

**Você completou a trilha Arduino do Zero.** A partir daqui, qualquer projeto de Arduino na Biblioteca de Projetos usa alguma combinação destes 5 conceitos: saída digital, entrada digital, entrada analógica, PWM e funções auxiliares.
                `.trim(),
            },
        ],
    },
    {
        id: "scratch-para-professores",
        title: "Scratch para Professores",
        tool: "Scratch",
        level: "Iniciante",
        logo: "images/scratch.png",
        description: "Programação em blocos para dar os primeiros passos com turmas do Fundamental I e II.",
        outcome: "Ao final, você monta com a turma um jogo completo de Pong — eventos, loops, variáveis e condicionais, tudo sem escrever uma linha de código-texto.",
        modules: [
            {
                id: "m1",
                title: "Por que Scratch em Sala de Aula?",
                duration: "10 min",
                free: true,
                content: `
## O que é o Scratch

Scratch é uma linguagem de programação **em blocos**, criada pelo MIT Media Lab especificamente para uso educacional. Em vez de digitar comandos com sintaxe exata (onde um ponto e vírgula esquecido quebra tudo), o aluno **encaixa blocos visuais** como peças de quebra-cabeça — um bloco "mova 10 passos" só encaixa onde faz sentido sintaticamente, o que elimina toda uma categoria de erro que costuma frustrar iniciantes.

É gratuito, roda no navegador (scratch.mit.edu) sem instalação, e também tem uma versão offline (Scratch Desktop) para escolas com internet instável.

## Por que começar por aqui, e não por Arduino ou Python

Scratch tem o menor "custo de entrada" de toda a Biblioteca de Projetos: não precisa de nenhum componente físico, roda em qualquer Chromebook ou computador da sala de informática, e a curva de aprendizado é imediata — em 15 minutos um aluno de 8 anos já está movendo um personagem na tela.

Isso o torna a porta de entrada ideal para:
- **Anos iniciais** (Fundamental I), onde a alfabetização em lógica de programação vem antes da alfabetização em sintaxe de texto.
- **Primeira aula de qualquer turma nova**, mesmo que o objetivo final da unidade seja Arduino ou Python — os conceitos de sequência, loop e condicional aprendidos aqui **transferem diretamente**.

## A interface em 4 áreas

| Área | O que fica ali |
|---|---|
| Palco (canto superior direito) | Onde a animação/jogo realmente acontece |
| Sprites (abaixo do palco) | Lista dos personagens/objetos do projeto |
| Paleta de blocos (esquerda) | Todos os blocos disponíveis, organizados por categoria e cor |
| Área de scripts (centro) | Onde você monta os blocos, arrastando da paleta |

As categorias de blocos são organizadas por cor — isso não é estético, é pedagógico: **Movimento** é azul, **Eventos** é amarelo, **Controle** é laranja, **Sensores** é ciano, **Operadores** é verde, **Variáveis** é laranja-escuro. Vale nomear essas cores para a turma desde a primeira aula; alunos passam a se referir a "o bloco amarelo" antes mesmo de saber o nome técnico da categoria.

## O que vem a seguir

No próximo módulo você cria uma conta (ou usa o modo sem login, que não salva na nuvem — bom para uma aula avulsa), explora a interface na prática, e monta o primeiro script: mover um personagem com as setas do teclado.
                `.trim(),
            },
            {
                id: "m2",
                title: "Primeiros Passos: A Interface e Seu Primeiro Projeto",
                duration: "20 min",
                free: false,
                content: `
## Criando o projeto

Em scratch.mit.edu, clique em **Criar**. Você não precisa de conta para experimentar — só precisa de conta para **salvar na nuvem**. Para uma aula de laboratório sem login individual por aluno, o projeto pode ser salvo localmente em **Arquivo → Salvar no computador** (baixa um arquivo \`.sb3\`).

O projeto novo já vem com um sprite padrão (o gato laranja, "Scratch Cat"). Você pode trocá-lo clicando no ícone de gato no canto inferior direito e escolhendo outro da biblioteca — mas para esta primeira aula, o gato padrão está ótimo.

## Seu primeiro script: mover com as setas

Arraste estes blocos da paleta para a área de scripts, encaixando um embaixo do outro:

\`\`\`scratch
quando [seta para cima] pressionada
mude y em 10

quando [seta para baixo] pressionada
mude y em -10

quando [seta para direita] pressionada
mude x em 10

quando [seta para esquerda] pressionada
mude x em -10
\`\`\`

Cada um desses é um **script independente** — não precisam estar conectados entre si. Clique nas setas do teclado real e observe o gato se mover.

> **Por que \`mude x\`/\`mude y\` e não \`vá para\`?** Porque \`mude\` é relativo (soma ao valor atual), enquanto \`vá para\` é absoluto (pula direto para uma coordenada). Essa é uma primeira oportunidade de discutir posição relativa vs. absoluta — o mesmo conceito que aparece depois em coordenadas GPS ou em programação de robótica.

## Testando: o botão de bandeira verde

No canto superior direito do palco há dois botões: a bandeira verde (▶) e o octógono vermelho (⏹). Por convenção, **todo projeto Scratch deveria começar com um script "quando bandeira verde for clicada"** — é o "play" universal. Vamos formalizar isso no próximo módulo.

## Erros comuns nesta fase

| O que acontece | Causa provável |
|---|---|
| Nada se move ao clicar na seta | O bloco de evento (\`quando [seta] pressionada\`) não está conectado ao bloco de ação — eles precisam se encaixar fisicamente |
| O personagem "sai" do palco e não volta | Não há limite de coordenada — resolvido no módulo de condicionais |
| Clicar não faz nada, mas apertar a seta no script funciona | Confusão comum: clicar num bloco solto na área de scripts **executa aquele bloco imediatamente**, é uma forma válida de testar isolado |

## Atividade para aplicar em aula

Peça para a turma trocar os valores \`10\`/\`-10\` por um número maior ou menor e descrever o que muda. É a primeira alteração de parâmetro que fazem sozinhos — pequena, mas real, igual à primeira atividade do módulo 2 de Arduino.

No próximo módulo, formalizamos o uso de eventos e loops para animações contínuas, não só reações a teclas.
                `.trim(),
            },
            {
                id: "m3",
                title: "Eventos e Loops: Dando Vida aos Personagens",
                duration: "22 min",
                free: false,
                content: `
## O bloco mais importante do Scratch: "sempre"

O bloco **sempre** (categoria Controle, laranja) repete tudo que está dentro dele, para sempre, enquanto o projeto estiver rodando. Ele é o equivalente visual do \`void loop()\` do Arduino ou do \`while (true)\` de qualquer linguagem de texto — vale fazer essa ponte explicitamente se a turma também estiver na trilha de Arduino.

\`\`\`scratch
quando bandeira verde clicada
sempre
    mude x em 2
    se <encostando na borda?> então
        vire -1 graus (rebater)
\`\`\`

Isso faz o personagem andar continuamente para a direita e "quicar" ao tocar a borda — um pingue-pongue de uma direção só, primeiro passo para o projeto final da trilha.

## "Repita" vs. "sempre"

O bloco **repita 10** roda o conteúdo um número fixo de vezes e depois **para** — diferente de \`sempre\`, que nunca para sozinho. Use \`repita\` quando o número de repetições é conhecido de antemão (ex: "pisque 3 vezes"), e \`sempre\` quando a ação deve continuar indefinidamente (ex: "o inimigo persegue o jogador").

\`\`\`scratch
quando bandeira verde clicada
repita 3
    mostrar por 0.3 segundos
    esconder por 0.3 segundos
\`\`\`

## Eventos além da bandeira verde

| Bloco de evento | Quando dispara |
|---|---|
| \`quando bandeira verde clicada\` | Ao clicar em ▶ — o "início" do projeto |
| \`quando [tecla] pressionada\` | A cada vez que aquela tecla é apertada |
| \`quando este sprite for clicado\` | Ao clicar diretamente no personagem, no palco |
| \`quando eu receber [mensagem]\` | Ao outro script "transmitir" essa mensagem — a forma de dois sprites se comunicarem |

O par **transmitir / quando eu receber** costuma ser o conceito mais difícil desta trilha, porque é o primeiro caso de dois scripts *diferentes*, rodando em sprites *diferentes*, precisando se coordenar. Vale um exemplo isolado: um sprite "botão" que transmite \`comecar\`, e um sprite "personagem" que só se move depois de receber \`comecar\`.

## Atividade para aplicar em aula

Peça para a turma adicionar um segundo personagem que se move em \`sempre\` de forma independente do primeiro, e depois usar \`transmitir\`/\`quando eu receber\` para fazer um "avisar" o outro ao encostar nele (\`encostando em [sprite]?\`, dentro de um \`se\`).

No próximo módulo entramos em variáveis e condicionais — o que transforma uma animação em um jogo de verdade, com pontuação e regras.
                `.trim(),
            },
            {
                id: "m4",
                title: "Variáveis e Condicionais: Criando um Jogo Simples",
                duration: "25 min",
                free: false,
                content: `
## Criando uma variável

Na categoria **Variáveis** (laranja-escuro), clique em **Criar uma variável** e nomeie \`pontos\`. Por padrão ela fica visível no palco como um pequeno marcador — pode ocultar depois em produção, mas **deixe visível durante a fase de testes**, é a principal ferramenta de depuração desta trilha (equivalente ao Monitor Serial do Arduino).

\`\`\`scratch
quando bandeira verde clicada
defina pontos para 0

quando este sprite for clicado
mude pontos em 1
\`\`\`

Isso já é um contador de cliques funcional — a base de praticamente qualquer sistema de pontuação.

## Condicionais: se / então / senão

\`\`\`scratch
quando bandeira verde clicada
sempre
    se <encostando em [Bola]?> então
        mude pontos em 1
        tocar som [pop] até terminar
    senão
        // nada acontece
\`\`\`

O bloco **se ... então ... senão** tem duas "bocas" — a turma só precisa da primeira boca na maioria dos casos (o \`senão\` é opcional, existe um bloco \`se ... então\` mais simples sem ele).

## Operadores para condições compostas

A categoria **Operadores** (verde) tem os blocos de comparação (\`>\`, \`<\`, \`=\`) e lógicos (\`e\`, \`ou\`, \`não\`), que encaixam **dentro** do losango de condição de um \`se\`:

\`\`\`scratch
se <<pontos > 10> e <tempo < 30>> então
    mostrar mensagem [Você venceu!]
\`\`\`

Isso é o primeiro contato da turma com **lógica booleana composta** — a mesma ideia central de uma cláusula \`WHERE\` de banco de dados ou de um \`if\` com \`&&\` em qualquer linguagem de texto.

## Sensores: a ponte entre o mundo do palco e as condições

| Bloco (categoria Sensores) | Retorna |
|---|---|
| \`encostando em [sprite/borda]?\` | Verdadeiro/falso — colisão |
| \`encostando na cor [cor]?\` | Verdadeiro/falso — útil para "linha de chegada" ou "chão" |
| \`tecla [espaço] pressionada?\` | Verdadeiro/falso — ler tecla sem esperar evento |
| \`distância até [sprite]\` | Um número — útil para lógica de perseguição/fuga |

## Atividade para aplicar em aula

Peça para a turma criar uma segunda variável \`vidas\`, começando em 3, que diminui a cada vez que o personagem encosta em um "inimigo", e que termina o jogo (\`parar tudo\`) quando \`vidas = 0\`. É a primeira vez que combinam duas variáveis com lógica de condição real.

No módulo final, juntamos tudo num jogo Pong completo — o mesmo já catalogado na Biblioteca de Projetos.
                `.trim(),
            },
            {
                id: "m5",
                title: "Projeto Final: Jogo Pong Clássico para a Turma",
                duration: "45 min",
                free: false,
                content: `
## O projeto

Uma raquete controlada pelo teclado, uma bola que se move sozinha e rebate nas bordas e na raquete, e um contador de pontos. Esse projeto já existe na Biblioteca de Projetos (busque por "Jogo Pong Clássico") com a versão de referência jogável — aqui está o passo a passo pedagógico para dar essa aula.

## Os dois sprites

**Sprite "Raquete"** — um retângulo vertical, controlado pelo jogador:

\`\`\`scratch
quando bandeira verde clicada
vá para x: -200 y: 0

sempre
    se <tecla [seta para cima] pressionada?> então
        mude y em 8
    se <tecla [seta para baixo] pressionada?> então
        mude y em -8
\`\`\`

Note o uso de **dois \`se\` separados**, em vez de um \`se/senão\` — isso permite que nenhuma tecla, uma tecla, ou (fisicamente impossível, mas logicamente permitido) as duas ao mesmo tempo sejam tratadas independentemente. É uma decisão de design pequena, mas vale discutir com a turma **por que** essa escolha foi feita em vez de um \`se/senão\`.

**Sprite "Bola"** — se move sozinha e reage a colisões:

\`\`\`scratch
quando bandeira verde clicada
vá para x: 0 y: 0
aponte para direção 60
sempre
    mova 6 passos
    se <encostando na borda?> então
        vire -1 graus (rebater)
    se <encostando em [Raquete]?> então
        vire -1 graus (rebater)
        mude pontos em 1
\`\`\`

## Circuito lógico do placar

\`\`\`scratch
quando bandeira verde clicada
defina pontos para 0
\`\`\`

Esse script fica no sprite da **Bola** (ou num sprite separado "Placar", se preferir isolar responsabilidades — bom momento para discutir organização de código com turmas mais avançadas).

## Plano de aula sugerido (2 aulas de 50 min)

**Aula 1** — Raquete e movimento
- Revisão de eventos de teclado (módulo 2) e o bloco \`sempre\` (módulo 3)
- Cada aluno/dupla monta o sprite da raquete e testa o movimento
- Discussão: o que acontece se a raquete sair da tela? (gancho para o desafio da aula 2)

**Aula 2** — Bola, colisão e pontuação
- Introdução ao sprite da bola e ao conceito de "rebater" (\`vire -1 graus\`)
- Desafio: por que \`vire -1 graus\` funciona tanto pra colisão com borda quanto com a raquete?
- Adição da variável \`pontos\` e teste em dupla: um controla a raquete, outro observa o placar

## Alinhamento BNCC

Esse projeto está mapeado na Biblioteca de Projetos com competências de Matemática (ângulos e direção) e da Competência Geral 5 (cultura digital). Use a descrição deste módulo como ponto de partida no Estúdio IA do seu dashboard para gerar o plano de aula formatado.

## Critério de avaliação sugerido

Peça para cada dupla adicionar **uma** mecânica nova e defender a escolha: uma segunda raquete (dois jogadores), aumento de velocidade a cada rebatida, ou um limite de pontos que termina o jogo. Como no projeto final de Arduino, o objetivo não é só o jogo funcionar — é a dupla saber explicar as escolhas.

---

**Você completou a trilha Scratch para Professores.** Os conceitos de eventos, loops, variáveis e condicionais se repetem em praticamente todo projeto Scratch da Biblioteca — só a combinação muda.
                `.trim(),
            },
        ],
    },
    {
        id: "microbit-para-professores",
        title: "Micro:bit para Professores",
        tool: "Micro:bit",
        level: "Iniciante",
        logo: "images/microbit.png",
        description: "Sensores embutidos, tela de LEDs e programação por blocos ou Python.",
        outcome: "Ao final, você monta com a turma uma estação meteorológica funcional — sensores, comunicação por rádio entre placas e um plano de aula pronto.",
        modules: [
            {
                id: "m1",
                title: "Por que Micro:bit em Sala de Aula?",
                duration: "10 min",
                free: true,
                content: `
## O que é o Micro:bit

O Micro:bit é uma placa de computador do tamanho de um cartão de crédito, criada pela BBC especificamente para educação. Diferente do Arduino, ele já vem **com sensores embutidos de fábrica** — acelerômetro, bússola, sensor de luz, sensor de temperatura, dois botões físicos, uma antena de rádio/Bluetooth e uma matriz de 25 LEDs. Não é preciso comprar nem montar nenhum componente extra para os três primeiros módulos desta trilha.

## Micro:bit ou Arduino — qual usar primeiro?

Não são concorrentes, são complementares, e a resposta muda pelo objetivo pedagógico:

| Se o objetivo é... | Comece por... |
|---|---|
| Resultado visível em minutos, sem fiação | **Micro:bit** — sensores já embutidos |
| Ensinar a montar circuito, entender componentes discretos (resistor, LED, sensor solto) | **Arduino** |
| Comunicação sem fio entre grupos (rádio) | **Micro:bit** — tem antena embutida |
| Projetos com muitos motores/atuadores de potência | **Arduino** — mais fácil de expandir com shields |

Na prática, muitas escolas usam Micro:bit no Fundamental I/II e migram para Arduino no Fundamental II/Médio, quando o objetivo passa a incluir eletrônica de verdade.

## Programando: MakeCode

O ambiente oficial é o **MakeCode** (makecode.microbit.org), que roda no navegador e oferece três formas de programar o mesmo projeto, intercambiáveis a qualquer momento:

- **Blocos** (como Scratch) — recomendado para começar, inclusive com turmas que já passaram pela trilha de Scratch desta Academia.
- **JavaScript** — os mesmos blocos, como texto. Bom passo intermediário entre blocos e uma linguagem de verdade.
- **Python (MicroPython)** — para turmas mais avançadas.

Os exemplos desta trilha usam blocos com o equivalente em JavaScript ao lado, para você escolher o nível certo pra sua turma.

## Conectando a placa

O Micro:bit se conecta por cabo USB e aparece como um **pendrive** (não precisa de driver especial). Programar é literalmente arrastar o arquivo \`.hex\` gerado pelo MakeCode para dentro desse "pendrive" — o LED de trás pisca durante a gravação e o programa roda assim que termina.

## O que vem a seguir

No próximo módulo você abre o MakeCode, entende o editor e faz seu primeiro programa: mostrar um ícone na matriz de LEDs ao ligar a placa.
                `.trim(),
            },
            {
                id: "m2",
                title: "Primeiros Passos: MakeCode e Seu Primeiro Programa",
                duration: "18 min",
                free: false,
                content: `
## Criando o projeto

Em makecode.microbit.org, clique em **Novo Projeto**. O editor abre com um Micro:bit virtual à esquerda (que simula o programa **sem precisar da placa física** — ótimo para testar antes de gravar) e a paleta de blocos à direita.

## O evento mais usado: "ao iniciar"

\`\`\`
ao iniciar
    mostrar ícone [Coração]
\`\`\`
\`\`\`javascript
basic.showIcon(IconNames.Heart)
\`\`\`

O bloco **ao iniciar** roda uma vez, quando a placa liga ou é resetada — exatamente como o \`setup()\` do Arduino. Vale nomear essa equivalência para turmas que também estão na trilha de Arduino.

## Repetindo para sempre: "sempre"

\`\`\`
sempre
    mostrar ícone [Coração]
    pausar (ms) 500
    limpar tela
    pausar (ms) 500
\`\`\`
\`\`\`javascript
basic.forever(function () {
    basic.showIcon(IconNames.Heart)
    basic.pause(500)
    basic.clearScreen()
    basic.pause(500)
})
\`\`\`

Isso faz um coração piscar continuamente — o mesmo par \`ao iniciar\`/\`sempre\` equivale ao \`setup()\`/\`loop()\` do Arduino ou ao \`quando bandeira verde\`/\`sempre\` do Scratch. Essa é a terceira vez que a turma vê essa mesma estrutura lógica sob um nome diferente — vale explicitar isso se a turma já passou por uma das outras trilhas.

## Testando sem gravar na placa

Clique em qualquer lugar do Micro:bit virtual (simulador) para "apertar" os botões simulados, e observe a matriz de LED responder. Isso permite testar o programa inteiro **antes** de ligar a placa física — útil quando há mais alunos que placas disponíveis.

## Gravando na placa de verdade

1. Conecte o Micro:bit por USB — ele aparece como uma unidade removível chamada "MICROBIT".
2. Clique em **Baixar** no MakeCode — isso gera um arquivo \`.hex\`.
3. Arraste (ou copie) esse arquivo para dentro da unidade "MICROBIT".
4. O LED amarelo na parte de trás da placa pisca durante a gravação; quando para, o programa já está rodando.

## Atividade para aplicar em aula

Peça para a turma trocar o ícone e o tempo de pausa, e testar no simulador antes de gravar na placa física — reforçando o hábito de testar em simulação primeiro, que economiza tempo de aula quando há poucas placas por turma.

No próximo módulo usamos os botões físicos e o acelerômetro — as duas entradas mais usadas em projetos de Micro:bit.
                `.trim(),
            },
            {
                id: "m3",
                title: "Entradas Físicas: Botões e o Acelerômetro",
                duration: "20 min",
                free: false,
                content: `
## Os botões A, B e A+B

O Micro:bit tem dois botões físicos (A e B) e reconhece também a combinação dos dois ao mesmo tempo:

\`\`\`
ao pressionar botão [A]
    mostrar número 1

ao pressionar botão [B]
    mostrar número 2

ao pressionar botão [A+B]
    mostrar ícone [Sim]
\`\`\`
\`\`\`javascript
input.onButtonPressed(Button.A, function () {
    basic.showNumber(1)
})
input.onButtonPressed(Button.B, function () {
    basic.showNumber(2)
})
input.onButtonPressed(Button.AB, function () {
    basic.showIcon(IconNames.Yes)
})
\`\`\`

Esse é um **evento**, igual ao \`quando [tecla] pressionada\` do Scratch ou ao \`digitalRead\` combinado com \`if\` do Arduino — mas aqui o próprio MakeCode já entrega o evento pronto, sem precisar programar a detecção manualmente.

## O acelerômetro: detectando movimento

O acelerômetro embutido permite detectar gestos sem nenhum sensor externo:

\`\`\`
ao sacudir
    mostrar ícone [Surpreso]

ao inclinar para a [esquerda]
    mostrar seta [Esquerda]
\`\`\`
\`\`\`javascript
input.onGesture(Gesture.Shake, function () {
    basic.showIcon(IconNames.Surprised)
})
input.onGesture(Gesture.TiltLeft, function () {
    basic.showArrow(ArrowNames.West)
})
\`\`\`

Gestos disponíveis incluem sacudir, inclinar (4 direções), queda livre, e "logo cima"/"logo baixo" (a placa virada com a tela pra cima ou pra baixo). Vale explorar a lista completa com a turma no simulador, já que sacudir/inclinar não funcionam no simulador da mesma forma que na placa física — aqui é um bom momento pra sair do simulador e ir pra placa real.

## Lendo o valor bruto do acelerômetro

Para além dos gestos prontos, dá pra ler o valor numérico de cada eixo — útil quando o gesto pronto não é exatamente o que se precisa:

\`\`\`
sempre
    mostrar número (aceleração (eixo x))
\`\`\`
\`\`\`javascript
basic.forever(function () {
    basic.showNumber(input.acceleration(Dimension.X))
})
\`\`\`

Esse valor varia aproximadamente de -1023 a 1023 — uma boa ponte com o conceito de \`analogRead\` (0–1023) já visto na trilha de Arduino, embora a origem física do dado seja diferente (inclinação, não luz ou voltagem).

## Atividade para aplicar em aula

Peça para a turma criar um "dado eletrônico": ao sacudir a placa, mostrar um número aleatório de 1 a 6 (bloco **número aleatório entre 1 e 6**, categoria Matemática). É a primeira vez que combinam um gesto com um valor não determinístico.

No próximo módulo usamos sensores de ambiente (luz e temperatura) e a comunicação por rádio entre duas placas.
                `.trim(),
            },
            {
                id: "m4",
                title: "Sensores de Ambiente e Rádio: Comunicação entre Placas",
                duration: "22 min",
                free: false,
                content: `
## Sensor de luz

O mesmo array de LEDs que exibe imagens também funciona como sensor de luz (cada LED pode medir a luz que incide sobre ele):

\`\`\`
sempre
    mostrar número (nível de luz)
    pausar (ms) 200
\`\`\`
\`\`\`javascript
basic.forever(function () {
    basic.showNumber(input.lightLevel())
    basic.pause(200)
})
\`\`\`

O valor vai de 0 (escuro) a 255 (muito claro) — a mesma lógica de um LDR ligado a um Arduino (módulo 4 da trilha de Arduino), só que sem nenhuma fiação externa.

## Sensor de temperatura

\`\`\`
sempre
    mostrar número (temperatura (°C))
    pausar (ms) 1000
\`\`\`
\`\`\`javascript
basic.forever(function () {
    basic.showNumber(input.temperature())
    basic.pause(1000)
})
\`\`\`

> O sensor de temperatura do Micro:bit mede a temperatura do **próprio chip**, não do ambiente — em repouso costuma ficar 2–4°C acima da temperatura real do ar, porque o processador esquenta levemente. Para um projeto que exige precisão, vale mencionar essa limitação à turma como uma discussão sobre **fontes de erro em medições reais**, não escondê-la.

## Comunicação por rádio entre duas placas

Esta é a funcionalidade que o Arduino básico não tem de fábrica: duas placas Micro:bit podem trocar mensagens sem fio, dentro de um raio de alguns metros.

**Placa transmissora:**
\`\`\`
ao pressionar botão [A]
    rádio enviar número (temperatura (°C))
\`\`\`
\`\`\`javascript
input.onButtonPressed(Button.A, function () {
    radio.sendNumber(input.temperature())
})
\`\`\`

**Placa receptora:**
\`\`\`
ao iniciar
    rádio definir grupo 1

ao receber número
    mostrar número (número recebido)
\`\`\`
\`\`\`javascript
radio.setGroup(1)
radio.onReceivedNumber(function (receivedNumber) {
    basic.showNumber(receivedNumber)
})
\`\`\`

O **grupo de rádio** (\`rádio definir grupo\`) funciona como um "canal" — só placas no mesmo número de grupo se ouvem, o que evita que a placa de uma dupla interfira na de outra na mesma sala. Defina um grupo diferente por dupla/grupo de alunos antes de começar o exercício.

## Atividade para aplicar em aula

Divida a turma em duplas, cada uma com duas placas em um grupo de rádio diferente (1, 2, 3...). Uma placa lê a temperatura e transmite ao apertar o botão A; a outra recebe e exibe. Peça para testar a partir de que distância a comunicação para de funcionar — é uma introdução concreta a alcance e interferência de rádio.

No módulo final, juntamos sensor e exibição num projeto completo de sala de aula: uma estação meteorológica.
                `.trim(),
            },
            {
                id: "m5",
                title: "Projeto Final: Estação Meteorológica para a Turma",
                duration: "40 min",
                free: false,
                content: `
## O projeto

Uma estação que lê temperatura e luminosidade continuamente, mostra ícones diferentes conforme a condição ("quente", "frio", "escuro", "claro"), e — usando o módulo anterior — pode transmitir essas leituras por rádio para uma segunda placa funcionando como "painel central" da sala. Esse projeto já existe na Biblioteca de Projetos (busque por "Estação Meteorológica") com a versão de referência.

## Lógica de decisão com condicionais

\`\`\`
sempre
    definir temp para (temperatura (°C))
    se temp > 28
        então mostrar ícone [Sol]
    senão se temp < 15
        então mostrar ícone [Floco de Neve]
    senão
        mostrar ícone [Feliz]
    pausar (ms) 2000
\`\`\`
\`\`\`javascript
basic.forever(function () {
    let temp = input.temperature()
    if (temp > 28) {
        basic.showIcon(IconNames.Sun)
    } else if (temp < 15) {
        basic.showIcon(IconNames.Snowflake)
    } else {
        basic.showIcon(IconNames.Happy)
    }
    basic.pause(2000)
})
\`\`\`

Note o uso de uma **variável** (\`temp\`) para guardar a leitura antes de comparar — evita ler o sensor duas vezes (uma para cada comparação), o que poderia trazer valores levemente diferentes entre uma leitura e outra. É um bom gancho para discutir por que "guardar o valor uma vez" é mais confiável do que "ler de novo toda hora".

## Adicionando luminosidade

\`\`\`
ao pressionar botão [B]
    se (nível de luz) < 50
        então mostrar ícone [Lua]
    senão
        mostrar ícone [Sol]
\`\`\`
\`\`\`javascript
input.onButtonPressed(Button.B, function () {
    if (input.lightLevel() < 50) {
        basic.showIcon(IconNames.Moon)
    } else {
        basic.showIcon(IconNames.Sun)
    }
})
\`\`\`

## Transmitindo para o painel central (opcional, com 2+ placas)

Combine com o módulo anterior: a estação transmite a temperatura por rádio a cada leitura, e uma segunda placa (o "painel da sala") recebe e exibe continuamente, permitindo comparar a leitura de várias estações montadas por diferentes grupos ao mesmo tempo.

## Plano de aula sugerido (2 aulas de 50 min)

**Aula 1** — Leitura e exibição de temperatura
- Revisão de \`sempre\` e sensor de temperatura (módulos 2 e 4)
- Implementação do \`se/senão se/senão\` com os 3 ícones de temperatura
- Discussão: por que a temperatura lida é diferente da temperatura real do ambiente? (gancho do módulo 4)

**Aula 2** — Luminosidade e painel em grupo
- Adição do sensor de luz com o botão B
- Grupos que tiverem uma segunda placa configuram a transmissão por rádio (módulo 4)
- Comparação entre as leituras dos diferentes grupos da sala — quem está no ponto mais quente/frio/claro/escuro?

## Alinhamento BNCC

Esse projeto está mapeado na Biblioteca de Projetos com competências de Ciências (fenômenos físicos, temperatura e luz) e da Competência Geral 5 (cultura digital). Use a descrição deste módulo como ponto de partida no Estúdio IA do seu dashboard para gerar o plano de aula formatado.

## Critério de avaliação sugerido

Peça para cada grupo definir **seus próprios limites** de temperatura/luz (em vez dos 28°C/15°C do exemplo) e justificar a escolha com base no clima real da região da escola. O objetivo é a turma perceber que os "números mágicos" de um código sempre carregam uma decisão de projeto por trás.

---

**Você completou a trilha Micro:bit para Professores.** Os conceitos de eventos, sensores e comunicação por rádio se combinam de formas diferentes em cada projeto de Micro:bit da Biblioteca — a estrutura lógica por trás é sempre a mesma que você viu aqui.
                `.trim(),
            },
        ],
    },
    {
        id: "codeorg-para-professores",
        title: "Code.org para Professores",
        tool: "Code.org",
        level: "Iniciante",
        logo: "images/code.png",
        description: "Conta de professor, gestão de turma e Hour of Code — a forma mais rápida de começar programação numa escola sem laboratório.",
        outcome: "Ao final, você tem sua turma configurada, sabe escolher a atividade certa por faixa etária e consegue acompanhar o progresso de cada aluno.",
        modules: [
            {
                id: "m1",
                title: "Conta de Professor e Configuração da Turma",
                duration: "15 min",
                free: true,
                content: `
## O que é o Code.org

Code.org é uma organização sem fins lucrativos que oferece currículo de computação gratuito para escolas. O produto mais conhecido é o **Hour of Code** — uma atividade de aproximadamente uma hora que introduz lógica de programação usando personagens licenciados (Minecraft, Frozen, Star Wars) para engajar turmas que nunca programaram.

Diferente do Scratch (que é uma ferramenta aberta onde o aluno cria o que quiser), o Code.org é um **currículo guiado**: as atividades já vêm sequenciadas, com objetivos definidos e correção automática. Isso muda o papel do professor — em vez de conduzir a criação, você acompanha o progresso e intervém onde a turma trava.

## Quando usar Code.org em vez de Scratch

| Situação | Ferramenta mais indicada |
|---|---|
| Primeira aula de programação, turma grande, pouco tempo de preparo | **Code.org** — atividade pronta, correção automática |
| Projeto autoral, aluno cria o próprio jogo/animação | **Scratch** — tela em branco, liberdade total |
| Professor ainda não domina programação | **Code.org** — o currículo guia você junto com a turma |
| Avaliar criatividade e autoria | **Scratch** |

Na prática, muitas escolas usam Code.org para as primeiras semanas (ganhar confiança) e migram para Scratch quando a turma já entende sequência, loop e condicional.

## Criando sua conta de professor

1. Acesse [code.org](https://code.org/pt-BR) e clique em **Fazer login** → **Criar conta**.
2. Escolha o perfil **Professor**.
3. Cadastre-se com e-mail, Google ou Microsoft — se a escola já usa Google Workspace for Education, usar o login Google economiza o trabalho de gerenciar senhas.
4. Você cai no **painel do professor**, onde ficam as turmas, o currículo e os relatórios de progresso.

## Criando a turma

1. No painel, clique em **Criar uma turma**.
2. Dê um nome que você reconheça depois (ex: "6º A — 2026").
3. Escolha como os alunos vão entrar:
   - **Código da turma** — o aluno digita um código curto. Mais simples, não exige e-mail por aluno.
   - **Imagem/palavra secreta** — para turmas do Fundamental I que ainda não digitam bem. Cada aluno recebe uma sequência de imagens como senha.
   - **E-mail** — para turmas mais velhas, com contas próprias.
4. Adicione os alunos (manualmente, por importação do Google Classroom, ou deixe que entrem sozinhos com o código).

> Para turmas do Fundamental I, a opção de **palavra/imagem secreta** costuma economizar boa parte da primeira aula — é a mesma lógica do login por imagem que a plataforma Izicode Edu usa na área do aluno.

## Desafio para aplicar

Antes da próxima aula, crie a turma e faça você mesmo, do começo ao fim, a atividade que pretende passar. Cronometre. O tempo que **você** leva, sabendo o que está fazendo, costuma ser metade do tempo que a turma vai levar — use isso para dimensionar a aula.
                `.trim(),
            },
            {
                id: "m2",
                title: "Hour of Code: Planejando a Primeira Aula",
                duration: "25 min",
                free: false,
                content: `
## Escolhendo a atividade certa

O catálogo do Hour of Code tem dezenas de atividades. A escolha errada é a causa mais comum de uma primeira aula frustrante — atividade fácil demais entedia, difícil demais trava a turma inteira e você vira suporte técnico individual por 50 minutos.

| Faixa | Atividades que funcionam bem | Por quê |
|---|---|---|
| 1º ao 3º ano | Frozen, Star Wars (versão blocos), Laboratório de Dança | Blocos grandes, poucos comandos, resultado visual imediato |
| 4º ao 6º ano | Minecraft (Viagem Aquática, Herói), Flappy Code | Introduzem loop e condicional sem exigir leitura pesada |
| 7º ano em diante | App Lab, Hora do Código com JavaScript/Python | Ponte para código de texto |

## Estrutura de uma aula de 50 minutos

1. **Contexto (5 min)** — Mostre o produto final antes de começar. "No fim da aula, vocês vão ter feito isso aqui." Sem isso, os primeiros 10 minutos são gastos com "professor, pra que serve isso?".
2. **Demonstração (5 min)** — Faça os 2 primeiros níveis projetado, em voz alta, errando de propósito uma vez e mostrando como corrigir. Ver o professor errar e consertar reduz o medo de errar da turma.
3. **Prática (30 min)** — Alunos trabalham; você circula. Não resolva o exercício de ninguém: pergunte "o que você quer que aconteça?" e "o que está acontecendo?".
4. **Fechamento (10 min)** — Dois ou três alunos mostram o que fizeram e explicam **um** trecho. É aqui que o aprendizado consolida.

## Sala com menos computadores que alunos

Programação em dupla (*pair programming*) não é só um paliativo — é uma técnica reconhecida:

- Um aluno é o **piloto** (mexe no mouse), outro é o **navegador** (lê o enunciado e sugere).
- Troque de papel a cada nível concluído. Cronometre em voz alta a troca, senão o mais confiante monopoliza.
- Duplas produzem menos código por hora, mas erram menos e explicam melhor no fechamento.

## Integrando com outras disciplinas

O Hour of Code não precisa ser uma aula isolada de "tecnologia":

- **Matemática** — atividades com ângulos e repetição (Artista, Laboratório de Dança) conversam direto com geometria e múltiplos.
- **Português** — peça o roteiro escrito antes de programar: o que acontece primeiro, depois, e quando o personagem "decide" algo.
- **História/Geografia** — na turma mais velha, use o App Lab para montar um quiz sobre o conteúdo da unidade.

## Desafio para aplicar

Escolha uma atividade e escreva um plano de 50 minutos no formato acima, marcando **onde exatamente** você espera que a turma trave. Compare depois com o que aconteceu de verdade — a diferença entre os dois é a informação mais útil que você vai ter para a próxima turma.
                `.trim(),
            },
            {
                id: "m3",
                title: "Além da Hora: Currículo Completo e Acompanhamento",
                duration: "20 min",
                free: false,
                content: `
## Do Hour of Code ao currículo contínuo

A Hora do Código é uma porta de entrada, não um programa. Se a intenção é ter computação no currículo o ano inteiro, o Code.org oferece sequências completas e gratuitas:

| Sequência | Público | Duração aproximada |
|---|---|---|
| CS Fundamentals (Cursos A–F) | Fundamental I (um curso por ano escolar) | ~20 lições por curso |
| CS Discoveries | 6º ao 9º ano | Ano letivo completo |
| CS Principles | Ensino Médio | Ano letivo completo |

Cada lição vem com plano de aula pronto, incluindo as **atividades desplugadas** (sem computador) — que são especialmente úteis quando o laboratório está ocupado ou a internet caiu. Vale conhecer essas atividades desplugadas mesmo se você usa outra ferramenta: elas ensinam algoritmo, laço e condicional com papel e movimento corporal.

## Lendo o painel de progresso

No painel do professor, a visão de turma mostra uma grade: alunos nas linhas, lições nas colunas, com o status de cada célula.

O que observar, na prática:

- **Uma coluna inteira travada** — o problema é a lição (ou a sua explicação dela), não os alunos. Vale retomar aquele conceito com a turma toda.
- **Uma linha inteira travada** — aquele aluno específico precisa de atenção individual.
- **Concluído muito rápido, com muitas tentativas** — costuma indicar tentativa e erro no braço, sem entender. Vale pedir para o aluno explicar a solução em voz alta.
- **Concluído rápido, poucas tentativas** — esse aluno está pronto para um desafio maior; tenha uma atividade extra à mão para não perdê-lo por tédio.

## O que o painel não mostra

O relatório mede conclusão, não compreensão. Um aluno pode completar todos os níveis por tentativa e erro sem entender o conceito. Por isso o fechamento oral da aula (módulo anterior) não é opcional: é o único momento em que você verifica compreensão de verdade.

## Certificados e engajamento

Ao final de cada Hora do Código, o aluno pode gerar um certificado. Parece detalhe, mas em turmas de Fundamental I esse certificado impresso costuma ser o que leva a conversa para casa — e conversa em casa é o que sustenta o programa quando a escola precisa justificar o investimento em tecnologia.

## Desafio para aplicar

Depois da primeira Hora do Código com a turma, abra o painel de progresso e identifique: qual lição travou mais gente, e qual aluno terminou primeiro. Prepare **uma** intervenção para cada caso — uma retomada coletiva e um desafio extra. Isso é diferenciação pedagógica com dado real, não com achismo.

---

**Você completou a trilha Code.org para Professores.** O passo natural daqui é a trilha de Scratch, quando a turma estiver pronta para sair do currículo guiado e criar projetos autorais.
                `.trim(),
            },
        ],
    },
    {
        id: "python-para-professores",
        title: "Python para Professores",
        tool: "Python",
        level: "Intermediário",
        logo: "images/python.jpg",
        description: "A ponte dos blocos para o código de texto — a linguagem que seus alunos vão encontrar no Ensino Médio e no mercado.",
        outcome: "Ao final, você constrói com a turma um quiz interativo que lê respostas, conta pontos e dá retorno — o primeiro programa de texto de verdade deles.",
        modules: [
            {
                id: "m1",
                title: "Por que Python em Sala de Aula?",
                duration: "12 min",
                free: true,
                content: `
## O que é Python

Python é uma linguagem de programação de texto, criada por Guido van Rossum em 1991 (o nome vem do grupo de humor britânico Monty Python, não da cobra). É hoje uma das linguagens mais usadas no mundo, em ciência de dados, inteligência artificial, automação e desenvolvimento web.

Para uso educacional, o que importa é uma característica específica: Python foi desenhado para ser **legível**. Compare o mesmo programa em duas linguagens:

\`\`\`python
if idade >= 18:
    print("Pode dirigir")
\`\`\`

\`\`\`cpp
if (idade >= 18) {
    printf("Pode dirigir");
}
\`\`\`

A versão Python tem menos símbolos entre a intenção e o código. Para um aluno de 14 anos que acabou de sair do Scratch, essa diferença determina se ele continua ou desiste.

## Quando fazer a transição dos blocos para o texto

Não é uma questão de idade, é de sintoma. A turma está pronta quando você observa:

- Alunos reclamando que arrastar blocos é lento demais para o que querem fazer.
- Projetos de Scratch ficando grandes o suficiente para virar "sopa de blocos" difícil de ler.
- Perguntas do tipo "mas como é que se faz um programa de verdade?".

Forçar a transição antes disso costuma produzir a experiência que faz alunos concluírem que "programação não é pra mim" — a frustração vem da sintaxe, não da lógica, mas o aluno não faz essa distinção sozinho.

## O que muda para o professor

No Scratch, o erro mais comum é lógico (o programa faz algo diferente do esperado). Em Python, aparece uma categoria nova: o **erro de sintaxe**, em que o programa não roda de jeito nenhum. Isso exige uma habilidade nova da turma — ler a mensagem de erro — que precisa ser ensinada explicitamente, e é o foco do módulo 2 desta trilha.

## O que você vai precisar

| Item | Observação |
|---|---|
| Python 3 instalado | Gratuito, em python.org — ou já vem instalado no Linux e macOS |
| Um editor | **Thonny** é o mais indicado para escolas: leve, feito para ensino, já vem com Python embutido |
| Alternativa sem instalação | Replit ou Google Colab, direto no navegador — útil quando não há permissão de instalar software na escola |

Thonny (thonny.org) é a recomendação para laboratório escolar: instala em um clique, já traz o Python junto, e tem um depurador visual que mostra o programa executando linha por linha — recurso pedagógico que editores profissionais não têm.

## Desafio para aplicar

Antes da próxima aula, instale o Thonny e digite o programa abaixo. Depois **quebre-o de propósito** de três formas diferentes (tire os parênteses, tire as aspas, escreva \`prnt\`) e guarde as três mensagens de erro — você vai usá-las como material didático no próximo módulo.

\`\`\`python
print("Olá, turma!")
\`\`\`
                `.trim(),
            },
            {
                id: "m2",
                title: "Primeiros Passos: Rodando Código e Lendo Erros",
                duration: "22 min",
                free: false,
                content: `
## Dois modos de executar Python

**Modo interativo (REPL)** — você digita uma linha, ela executa na hora. No Thonny, é o painel de baixo ("Shell"). Ótimo para testar uma ideia rápida:

\`\`\`python
>>> 2 + 3
5
>>> print("oi")
oi
\`\`\`

**Modo script** — você escreve o programa inteiro em um arquivo \`.py\` e roda tudo de uma vez. É assim que programas reais são feitos.

Vale mostrar os dois na primeira aula e nomear a diferença: o REPL é o rascunho, o script é o trabalho final.

## Lendo uma mensagem de erro

Esta é a habilidade mais subestimada do ensino de programação em texto. Um erro típico:

\`\`\`
File "quiz.py", line 4
    print("Olá turma)
                    ^
SyntaxError: unterminated string literal (detected at line 4)
\`\`\`

Ensine a turma a ler de trás para frente:

1. **A última linha diz o tipo do problema** — \`SyntaxError\` (escrita errada), \`NameError\` (nome que não existe), \`TypeError\` (tipo incompatível).
2. **A linha com \`^\` aponta onde** o interpretador percebeu o problema.
3. **\`line 4\` diz em que linha do arquivo** — o erro real costuma estar nessa linha ou logo antes.

| Erro | O que geralmente é |
|---|---|
| \`SyntaxError\` | Falta parêntese, aspas ou dois-pontos |
| \`NameError: name 'x' is not defined\` | Variável usada antes de existir, ou nome digitado errado |
| \`IndentationError\` | Recuo (espaços no início da linha) inconsistente |
| \`TypeError\` | Misturou texto com número sem converter |

## Indentação: a regra que confunde no começo

Em Python, o recuo **faz parte da sintaxe**. O que está indentado depois dos dois-pontos pertence àquele bloco:

\`\`\`python
if nota >= 6:
    print("Aprovado")     # dentro do if
    print("Parabéns!")    # também dentro do if
print("Fim do boletim")   # fora do if, sempre executa
\`\`\`

Em Scratch, isso era visual — o bloco ficava fisicamente encaixado dentro do \`se\`. Em Python é a mesma ideia, expressa com espaços. Fazer essa ponte explícita com quem veio da trilha de Scratch reduz muito a confusão.

## Desafio para aplicar

Use os três erros que você provocou no módulo anterior como exercício: projete cada mensagem e peça para a turma identificar, **antes de olhar o código**, qual é o tipo do problema e em que linha está. Ler erro é uma habilidade treinável, e treinar sem a pressão de estar com o próprio programa quebrado funciona melhor.
                `.trim(),
            },
            {
                id: "m3",
                title: "Variáveis, Entrada e Condicionais",
                duration: "25 min",
                free: false,
                content: `
## Variáveis

\`\`\`python
nome = "Ana"
idade = 14
altura = 1.62
\`\`\`

Diferente de linguagens como C ou Java, você não declara o tipo — Python descobre sozinho. Isso é uma vantagem no começo (menos sintaxe) e uma armadilha depois (o tipo errado só aparece quando o programa quebra), o que leva direto ao próximo ponto.

## Entrada do usuário: o detalhe que sempre pega

\`\`\`python
idade = input("Quantos anos você tem? ")
print(idade + 1)   # ERRO: TypeError
\`\`\`

O \`input()\` **sempre devolve texto**, mesmo que o usuário digite um número. Somar 1 a um texto dá \`TypeError\`. A correção:

\`\`\`python
idade = int(input("Quantos anos você tem? "))
print(idade + 1)   # funciona
\`\`\`

Esse é provavelmente o erro nº 1 de toda turma iniciante em Python — vale antecipá-lo em vez de esperar a turma tropeçar. Use \`int()\` para número inteiro e \`float()\` para número com vírgula.

## Condicionais

\`\`\`python
nota = float(input("Digite a nota: "))

if nota >= 7:
    print("Aprovado")
elif nota >= 5:
    print("Recuperação")
else:
    print("Reprovado")
\`\`\`

Três palavras novas, com equivalência direta ao que a turma já viu em blocos:

| Python | Scratch |
|---|---|
| \`if\` | \`se ... então\` |
| \`elif\` | um \`se\` encaixado dentro do \`senão\` |
| \`else\` | a parte \`senão\` |

## Comparação e igualdade

\`\`\`python
if resposta == "sim":     # DOIS iguais: comparação
    ...
resposta = "sim"          # UM igual: atribuição
\`\`\`

Confundir \`=\` com \`==\` é o segundo erro mais comum. Uma forma que costuma pegar bem com a turma: um sinal de igual **manda** ("guarde isso aqui"), dois sinais **perguntam** ("isso é igual àquilo?").

## Desafio para aplicar

Peça para a turma escrever um programa de 6 linhas que pergunte a idade e responda em qual categoria a pessoa está (criança / adolescente / adulto). Depois, peça para cada aluno **testar o programa do colega tentando quebrá-lo** — digitando texto onde se espera número, deixando em branco, digitando negativo. Descobrir os limites do próprio programa é o primeiro passo do pensamento de teste.
                `.trim(),
            },
            {
                id: "m4",
                title: "Listas e Repetição",
                duration: "25 min",
                free: false,
                content: `
## Listas

Uma lista guarda vários valores em uma única variável:

\`\`\`python
alunos = ["Ana", "Bruno", "Carla"]

print(alunos[0])       # Ana — a contagem começa em ZERO
print(len(alunos))     # 3 — quantidade de itens
alunos.append("Davi")  # adiciona no fim
\`\`\`

O índice começando em zero é contraintuitivo e vale um momento explícito de aula: o índice não é "qual item", é "quantos passos a partir do começo". Ana está a zero passos do início.

## Repetição com "for"

\`\`\`python
for aluno in alunos:
    print("Presente:", aluno)
\`\`\`

Traduzindo em voz alta: "para cada aluno dentro de alunos, faça...". Essa leitura literal ajuda mais que a explicação formal de laço, e é uma vantagem real do Python sobre a maioria das linguagens.

Para repetir um número fixo de vezes:

\`\`\`python
for i in range(5):     # 0, 1, 2, 3, 4 — cinco vezes
    print("Rodada", i + 1)
\`\`\`

## Repetição com "while"

\`\`\`python
senha = ""
while senha != "izicode":
    senha = input("Digite a senha: ")
print("Acesso liberado!")
\`\`\`

Use \`for\` quando souber quantas vezes vai repetir, e \`while\` quando depender de uma condição. É a mesma distinção entre \`repita 10\` e \`sempre\` do Scratch, que a turma já conhece.

> **Laço infinito:** se a condição do \`while\` nunca ficar falsa, o programa trava. Ensine desde já o atalho de interrupção (Ctrl+C no terminal, ou o botão de parar do Thonny) — porque vai acontecer, e é melhor a turma saber sair sozinha.

## Juntando tudo: contando com uma variável acumuladora

\`\`\`python
notas = [8, 5, 9, 6]
soma = 0

for nota in notas:
    soma = soma + nota

media = soma / len(notas)
print("Média da turma:", media)
\`\`\`

O padrão "variável que acumula dentro de um laço" é a base de praticamente qualquer contagem, soma ou pontuação — inclusive a do projeto final desta trilha.

## Desafio para aplicar

Peça para a turma criar uma lista com as próprias notas do bimestre e calcular a média. Depois, o desafio real: descobrir e informar **quantas** notas ficaram acima da média — o que exige um \`if\` dentro do \`for\` e uma segunda variável acumuladora.
                `.trim(),
            },
            {
                id: "m5",
                title: "Projeto Final: Quiz Interativo da Turma",
                duration: "40 min",
                free: false,
                content: `
## O projeto

Um quiz de terminal que faz perguntas, lê as respostas do aluno, conta os acertos e dá um retorno final conforme o desempenho. É o primeiro programa da trilha que usa **tudo junto**: listas, laço, condicional, entrada do usuário e variável acumuladora.

O melhor uso pedagógico é fazer com que o conteúdo do quiz seja de **outra disciplina** — assim o programa vira ferramenta de estudo, e não só exercício de programação.

## Código completo comentado

\`\`\`python
# Cada item da lista é uma dupla: pergunta e resposta correta
perguntas = [
    ("Qual a capital do Brasil? ", "brasilia"),
    ("Quantos estados tem o Brasil? ", "26"),
    ("Qual o maior bioma brasileiro? ", "amazonia"),
]

acertos = 0

print("=== QUIZ DE GEOGRAFIA ===")
print(f"São {len(perguntas)} perguntas. Boa sorte!\\n")

for pergunta, correta in perguntas:
    resposta = input(pergunta)

    # .lower() e .strip() deixam a comparação tolerante:
    # aceita "Brasília", "BRASILIA " e "brasilia" como iguais
    if resposta.lower().strip() == correta:
        print("Correto!\\n")
        acertos = acertos + 1
    else:
        print(f"Errado. A resposta era: {correta}\\n")

print("=== RESULTADO ===")
print(f"Você acertou {acertos} de {len(perguntas)}.")

if acertos == len(perguntas):
    print("Nota máxima! Você domina o conteúdo.")
elif acertos >= len(perguntas) / 2:
    print("Bom resultado — revise os pontos que errou.")
else:
    print("Vale retomar o conteúdo antes da prova.")
\`\`\`

Três recursos novos aparecem aqui e valem ser nomeados para a turma:

1. **f-string** (\`f"..."\`) — permite colocar o valor de uma variável dentro do texto com \`{ }\`, em vez de concatenar com \`+\`.
2. **\`.lower()\` e \`.strip()\`** — tornam a comparação tolerante a maiúsculas e espaços. Sem isso, o quiz recusa "Brasília" com B maiúsculo, e o aluno acha que o programa está quebrado.
3. **Desempacotar a dupla** (\`for pergunta, correta in perguntas\`) — pega os dois valores de cada item da lista de uma vez.

## Plano de aula sugerido (2 aulas de 50 min)

**Aula 1** — Base do quiz
- Revisão de \`input\`, \`if\` e \`for\` (módulos 3 e 4)
- Turma digita a versão com **uma** pergunta só, funcionando de ponta a ponta
- Discussão: por que \`.lower()\` é necessário? (peça para testarem sem ele primeiro — a frustração de acertar e o programa dizer "errado" ensina melhor que a explicação)

**Aula 2** — Lista de perguntas e resultado
- Transformar a pergunta única em lista de perguntas com \`for\`
- Adicionar a variável \`acertos\` e o bloco de resultado final
- Cada aluno troca o conteúdo do quiz pela matéria que escolher

## Alinhamento BNCC

O projeto conecta com a Competência Geral 5 (cultura digital) e, dependendo do conteúdo escolhido para as perguntas, com a disciplina de origem — essa é justamente a proposta. Use a descrição deste módulo como ponto de partida no Estúdio IA do seu dashboard para gerar o plano de aula formatado com os códigos da etapa da sua turma.

## Critério de avaliação sugerido

Avalie três coisas separadamente, para não confundir domínio técnico com domínio de conteúdo:

1. **O programa roda sem erro?** (técnico)
2. **As perguntas são boas e as respostas estão corretas?** (conteúdo da disciplina escolhida)
3. **O aluno consegue explicar o que a variável \`acertos\` faz?** (compreensão real, não cópia)

---

**Você completou a trilha Python para Professores.** Daqui, o próximo passo natural é levar o Python para o hardware: a trilha de Micro:bit tem uma versão MicroPython, e projetos de Arduino avançados podem ser controlados por Python rodando num Raspberry Pi.
                `.trim(),
            },
        ],
    },
];

export function getAllCourses() {
    return courses;
}

export function getCourseById(id) {
    return courses.find((c) => c.id === id) || null;
}
