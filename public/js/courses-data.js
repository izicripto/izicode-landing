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
        outcome: "Em breve.",
        comingSoon: true,
        modules: [],
    },
    {
        id: "microbit-para-professores",
        title: "Micro:bit para Professores",
        tool: "Micro:bit",
        level: "Iniciante",
        logo: "images/microbit.png",
        description: "Sensores embutidos, tela de LEDs e programação por blocos ou Python.",
        outcome: "Em breve.",
        comingSoon: true,
        modules: [],
    },
];

export function getAllCourses() {
    return courses;
}

export function getCourseById(id) {
    return courses.find((c) => c.id === id) || null;
}
