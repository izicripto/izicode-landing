/**
 * Montador de Soluções — base de conhecimento local.
 *
 * Ao contrário do Estúdio IA (que chama a Cloud Function generateAIProject
 * e consome o limite de gerações), esta matriz é 100% estática: cruza
 * hardware disponível na escola/em casa com um objetivo pedagógico e
 * devolve, na hora e sem custo de IA, a combinação de ferramentas (open
 * source ou parceiras), lista de materiais, esquema de ligação e um
 * código inicial já funcional para o professor adaptar.
 *
 * Cada combinação hardware+objetivo é uma "receita" fixa e testada —
 * não uma geração probabilística — o que a torna confiável para uso em
 * sala de aula sem revisão prévia extensa.
 */

export type HardwareId = "arduino"| "microbit" | "makeymakey" | "nenhum"

export interface HardwareOption {
  id: HardwareId
  label: string
  description: string
}

export const HARDWARE_OPTIONS: HardwareOption[] = [
  { id: "arduino", label: "Arduino (Uno ou compatível)", description: "Sensores, atuadores, protoboard" },
  { id: "microbit", label: "Micro:bit", description: "Placa com LEDs, botões e sensores embutidos" },
  { id: "makeymakey", label: "Makey Makey", description: "Transforma objetos do dia a dia em teclado/mouse" },
  { id: "nenhum", label: "Nenhum (só computador)", description: "Programação sem hardware físico" },
]

export type ObjectiveId =
  | "automatizar"
  | "medir-ambiente"
  | "criar-jogo"
  | "arte-interativa"
  | "alarme-seguranca"

export interface ObjectiveOption {
  id: ObjectiveId
  label: string
}

export const OBJECTIVE_OPTIONS: ObjectiveOption[] = [
  { id: "automatizar", label: "Automatizar algo (ligar/desligar sozinho)" },
  { id: "medir-ambiente", label: "Medir o ambiente (luz, temperatura, distância)" },
  { id: "criar-jogo", label: "Criar um jogo ou desafio interativo" },
  { id: "arte-interativa", label: "Arte ou música interativa" },
  { id: "alarme-seguranca", label: "Alarme ou sistema de alerta" },
]

export interface Solution {
  title: string
  software: string[]
  materials: string[]
  wiring: string
  code: string
  steps: string[]
}

const SOLUTIONS: Record<HardwareId, Partial<Record<ObjectiveId, Solution>>> = {
  arduino: {
    automatizar: {
      title: "Iluminação automática com sensor de luz",
      software: ["Arduino IDE (open source)"],
      materials: ["Arduino Uno", "LDR (fotoresistor)", "Resistor 10kΩ", "LED", "Resistor 220Ω", "Protoboard", "Jumpers"],
      wiring:
        "LDR: uma perna no 5V, outra no pino analógico A0 e também num resistor de 10kΩ para o GND (divisor de tensão).\n" +
        "LED: ânodo no pino digital 9 através de um resistor de 220Ω; cátodo no GND.",
      code:
        "const int LDR_PIN = A0;\n" +
        "const int LED_PIN = 9;\n" +
        "const int LIMIAR = 500; // ajuste conforme a luz do ambiente\n\n" +
        "void setup() {\n" +
        "  pinMode(LED_PIN, OUTPUT);\n" +
        "  Serial.begin(9600);\n" +
        "}\n\n" +
        "void loop() {\n" +
        "  int luz = analogRead(LDR_PIN);\n" +
        "  Serial.println(luz);\n" +
        "  digitalWrite(LED_PIN, luz < LIMIAR ? HIGH : LOW);\n" +
        "  delay(200);\n" +
        "}",
      steps: [
        "Monte o divisor de tensão do LDR na protoboard e confirme que o valor lido no Monitor Serial muda ao cobrir o sensor com a mão.",
        "Some o LED com o resistor de 220Ω no pino 9.",
        "Carregue o código e ajuste o LIMIAR até o LED acender só quando o ambiente escurece.",
        "Desafio para a turma: trocar o LED por um relé para acionar uma lâmpada real (com segurança elétrica supervisionada).",
      ],
    },
    "medir-ambiente": {
      title: "Estação de monitoramento com sensor ultrassônico",
      software: ["Arduino IDE (open source)"],
      materials: ["Arduino Uno", "Sensor ultrassônico HC-SR04", "Protoboard", "Jumpers"],
      wiring:
        "HC-SR04: VCC no 5V, GND no GND, TRIG no pino digital 9, ECHO no pino digital 10.",
      code:
        "const int TRIG = 9;\n" +
        "const int ECHO = 10;\n\n" +
        "void setup() {\n" +
        "  pinMode(TRIG, OUTPUT);\n" +
        "  pinMode(ECHO, INPUT);\n" +
        "  Serial.begin(9600);\n" +
        "}\n\n" +
        "void loop() {\n" +
        "  digitalWrite(TRIG, LOW);\n" +
        "  delayMicroseconds(2);\n" +
        "  digitalWrite(TRIG, HIGH);\n" +
        "  delayMicroseconds(10);\n" +
        "  digitalWrite(TRIG, LOW);\n\n" +
        "  long duracao = pulseIn(ECHO, HIGH);\n" +
        "  float distanciaCm = duracao * 0.034 / 2;\n" +
        "  Serial.print(\"Distância: \");\n" +
        "  Serial.print(distanciaCm);\n" +
        "  Serial.println(\" cm\");\n" +
        "  delay(300);\n" +
        "}",
      steps: [
        "Monte o sensor na protoboard seguindo o esquema de ligação.",
        "Abra o Monitor Serial e observe a distância mudar ao aproximar a mão.",
        "Proponha à turma medir e registrar a distância de objetos diferentes, discutindo margem de erro do sensor.",
        "Extensão: usar a leitura para acionar um alarme quando algo se aproxima (combine com o objetivo 'Alarme ou sistema de alerta').",
      ],
    },
    "alarme-seguranca": {
      title: "Alarme de proximidade com buzzer",
      software: ["Arduino IDE (open source)"],
      materials: ["Arduino Uno", "Sensor ultrassônico HC-SR04", "Buzzer", "Protoboard", "Jumpers"],
      wiring:
        "HC-SR04: VCC no 5V, GND no GND, TRIG no pino 9, ECHO no pino 10.\n" +
        "Buzzer: terminal positivo no pino digital 8, terminal negativo no GND.",
      code:
        "const int TRIG = 9;\n" +
        "const int ECHO = 10;\n" +
        "const int BUZZER = 8;\n" +
        "const int DISTANCIA_ALERTA_CM = 15;\n\n" +
        "void setup() {\n" +
        "  pinMode(TRIG, OUTPUT);\n" +
        "  pinMode(ECHO, INPUT);\n" +
        "  pinMode(BUZZER, OUTPUT);\n" +
        "}\n\n" +
        "void loop() {\n" +
        "  digitalWrite(TRIG, LOW);\n" +
        "  delayMicroseconds(2);\n" +
        "  digitalWrite(TRIG, HIGH);\n" +
        "  delayMicroseconds(10);\n" +
        "  digitalWrite(TRIG, LOW);\n\n" +
        "  long duracao = pulseIn(ECHO, HIGH);\n" +
        "  float distanciaCm = duracao * 0.034 / 2;\n\n" +
        "  digitalWrite(BUZZER, distanciaCm < DISTANCIA_ALERTA_CM ? HIGH : LOW);\n" +
        "  delay(100);\n" +
        "}",
      steps: [
        "Monte o sensor e o buzzer conforme o esquema.",
        "Carregue o código e teste aproximando a mão até o buzzer disparar.",
        "Ajuste DISTANCIA_ALERTA_CM conforme o cenário (porta, gaveta, cofre de sala de aula).",
        "Discuta com a turma outros usos: alarme de gaveta, contador de entrada em um ambiente.",
      ],
    },
  },
  microbit: {
    "criar-jogo": {
      title: "Jogo de reação com os LEDs do Micro:bit",
      software: ["MakeCode (open source, editor por blocos ou Python)"],
      materials: ["Placa Micro:bit", "Cabo USB (ou pareamento via Bluetooth)"],
      wiring: "Sem circuito externo: o jogo usa só a matriz de LEDs e os botões A/B já embutidos na placa.",
      code:
        "# MakeCode Python\n" +
        "from microbit import *\n" +
        "import random\n\n" +
        "pontos = 0\n" +
        "while True:\n" +
        "    display.show(Image.HEART)\n" +
        "    sleep(random.randint(500, 2000))\n" +
        "    display.show(Image.TARGET)\n" +
        "    inicio = running_time()\n" +
        "    while not (button_a.is_pressed() or button_b.is_pressed()):\n" +
        "        pass\n" +
        "    tempo = running_time() - inicio\n" +
        "    if tempo < 400:\n" +
        "        pontos += 1\n" +
        "        display.show(str(pontos))\n" +
        "    else:\n" +
        "        display.show(Image.SAD)\n" +
        "    sleep(1000)",
      steps: [
        "No MakeCode, comece pela versão em blocos e só depois mostre a versão em Python equivalente.",
        "Peça para a turma testar o próprio tempo de reação e comparar resultados.",
        "Desafio: adicionar o acelerômetro para reiniciar o jogo ao chacoalhar a placa (input.on_gesture('shake')).",
      ],
    },
    "medir-ambiente": {
      title: "Termômetro e bússola de bolso",
      software: ["MakeCode (open source)"],
      materials: ["Placa Micro:bit", "Cabo USB"],
      wiring: "Sem circuito externo: usa o sensor de temperatura e a bússola já embutidos na placa.",
      code:
        "from microbit import *\n\n" +
        "compass.calibrate()\n\n" +
        "while True:\n" +
        "    if button_a.is_pressed():\n" +
        "        display.show(temperature())\n" +
        "    elif button_b.is_pressed():\n" +
        "        display.show(compass.heading() // 10)\n" +
        "    sleep(200)",
      steps: [
        "Calibre a bússola seguindo a animação na tela da placa.",
        "Botão A mostra a temperatura, botão B mostra a direção em graus.",
        "Proponha uma caça ao tesouro simples usando a bússola para orientar a turma pelo pátio.",
      ],
    },
  },
  makeymakey: {
    "arte-interativa": {
      title: "Piano de frutas com Scratch",
      software: ["Scratch (open source)", "Makey Makey Classroom (app oficial, opcional)"],
      materials: ["Kit Makey Makey", "Cabo USB", "Fios com garra (jacaré)", "Objetos condutores (frutas, massinha, folha de alumínio)"],
      wiring:
        "Ligue o fio TERRA (GND) a um objeto que a pessoa vai tocar continuamente (ex: pulseira de papel alumínio).\n" +
        "Ligue cada tecla (seta, espaço, W/A/S/D...) a uma fruta ou objeto diferente.",
      code:
        "// Scratch: não há código textual — a lógica é montada em blocos.\n" +
        "quando tecla espaço for pressionada\n" +
        "  tocar som [nota-do]\n\n" +
        "quando tecla seta-direita for pressionada\n" +
        "  tocar som [nota-re]",
      steps: [
        "No Scratch, crie um evento 'quando tecla X pressionada' para cada nota musical.",
        "Grave ou importe sons de instrumentos para cada evento.",
        "Ligue as frutas ao Makey Makey conforme o esquema e teste tocando cada uma.",
        "Desafio: a turma compõe uma música curta usando só as 'teclas-fruta' disponíveis.",
      ],
    },
    "criar-jogo": {
      title: "Controle de jogo com objetos do dia a dia",
      software: ["Scratch (open source)"],
      materials: ["Kit Makey Makey", "Cabo USB", "Fios com garra (jacaré)", "Objetos condutores (moedas, talheres, plasticina condutiva)"],
      wiring:
        "Fio TERRA em um objeto de contato contínuo (ex: pulseira ou tapete de alumínio).\n" +
        "Setas direcionais ligadas a quatro objetos diferentes, formando um 'controle' improvisado.",
      code:
        "// Scratch: lógica em blocos usando as setas do teclado\n" +
        "quando tecla seta-cima pressionada\n" +
        "  mude y em 10\n\n" +
        "quando tecla seta-baixo pressionada\n" +
        "  mude y em -10",
      steps: [
        "Escolha (ou adapte) um jogo simples do Scratch que já use as setas do teclado.",
        "Ligue cada seta a um objeto diferente via Makey Makey.",
        "Teste o controle improvisado e ajuste a posição dos objetos para facilitar o uso.",
        "Discuta com a turma o conceito de condutividade elétrica: por que alguns objetos funcionam e outros não.",
      ],
    },
  },
  nenhum: {
    "criar-jogo": {
      title: "Jogo de perguntas e respostas no Scratch",
      software: ["Scratch (open source)"],
      materials: ["Computador ou tablet com navegador"],
      wiring: "Não se aplica — projeto 100% em software.",
      code:
        "// Scratch: lógica em blocos\n" +
        "pergunte [Qual é a capital do Brasil?] e espere\n" +
        "se <resposta = [Brasília]> então\n" +
        "  mude pontos em 1\n" +
        "  diga [Certa resposta!] por 2 segundos",
      steps: [
        "Monte de 5 a 10 perguntas sobre o tema da aula usando o bloco 'pergunte e espere'.",
        "Use uma variável 'pontos' para contar acertos.",
        "Adicione um som ou animação para acerto e outro para erro.",
        "Publique o projeto na comunidade da turma e deixe os colegas jogarem entre si.",
      ],
    },
    "arte-interativa": {
      title: "Desenho animado interativo no Scratch",
      software: ["Scratch (open source)"],
      materials: ["Computador ou tablet com navegador"],
      wiring: "Não se aplica — projeto 100% em software.",
      code:
        "// Scratch: lógica em blocos\n" +
        "quando esse sprite for clicado\n" +
        "  mude para o próximo traje\n" +
        "  tocar som [pop]",
      steps: [
        "Peça para a turma desenhar 2 ou 3 'trajes' (poses) diferentes do mesmo personagem no editor do Scratch.",
        "Use o bloco 'quando este sprite for clicado' para alternar entre os trajes.",
        "Some efeitos sonoros gravados pela própria turma.",
        "Desafio: transformar em uma cena com vários personagens reagindo ao clique.",
      ],
    },
  },
}

/** Combinação disponível para o par hardware+objetivo, se existir na matriz. */
export function findSolution(hardware: HardwareId, objective: ObjectiveId): Solution | null {
  return SOLUTIONS[hardware]?.[objective] ?? null
}

/** Quais objetivos têm receita pronta para o hardware escolhido. */
export function availableObjectives(hardware: HardwareId): ObjectiveId[] {
  return Object.keys(SOLUTIONS[hardware] ?? {}) as ObjectiveId[]
}
