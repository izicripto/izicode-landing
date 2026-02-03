/**
 * Base de dados de projetos educacionais do Izicode Edu
 * Projetos alinhados à BNCC e ODS
 */

export const projects = [
    {
        id: "robo-seguidor-linha",
        title: "Robô Seguidor de Linha",
        description: "Construa e programe um robô autônomo capaz de identificar e seguir um trajeto marcado no chão usando sensores infravermelhos.",
        tools: ["Arduino", "C++"],
        difficulty: "Intermediário",
        duration: "4 aulas",
        grade: "Ensino Fundamental II (8º e 9º ano)",
        image: "arduino-robot", // Placeholder
        ods: "ODS 9 - Indústria, Inovação e Infraestrutura",
        bncc: ["EF08TEC04", "EF09TEC01"],
        content: `
# Robô Seguidor de Linha

## 📋 Visão Geral
Neste projeto, os alunos irão construir um robô autônomo que utiliza sensores infravermelhos para detectar o contraste entre o chão e uma linha (geralmente fita isolante preta) e ajustar seus motores para seguir o caminho.

## 🎯 Objetivos de Aprendizagem
- Compreender o funcionamento de sensores infravermelhos (emissor/receptor).
- Aprender lógica de controle de motores (Ponte H).
- Aplicar estruturas condicoes (if/else) na programação.

## 🔧 Materiais Necessários
- 1x Arduino Uno
- 1x Driver de Motor (L298N ou Shield)
- 2x Motores DC com roda e caixa de redução
- 2x Sensores Infravermelho de Linha
- 1x Chassi de robô (pode ser papelão ou MDF)
- 1x Bateria 9V ou Suporte para pilhas AA
- Cabos Jumper

## 💻 Código Base (Arduino)
\`\`\`cpp
// Definição dos pinos
int motorEsqFrente = 5;
int motorEsqTras = 6;
int motorDirFrente = 9;
int motorDirTras = 10;
int sensorEsq = A0;
int sensorDir = A1;

void setup() {
  pinMode(motorEsqFrente, OUTPUT);
  pinMode(motorEsqTras, OUTPUT);
  pinMode(motorDirFrente, OUTPUT);
  pinMode(motorDirTras, OUTPUT);
  pinMode(sensorEsq, INPUT);
  pinMode(sensorDir, INPUT);
}

void loop() {
  int valorEsq = digitalRead(sensorEsq);
  int valorDir = digitalRead(sensorDir);

  if (valorEsq == HIGH && valorDir == HIGH) {
    // Frente
    frente();
  } else if (valorEsq == LOW && valorDir == HIGH) {
    // Virar Esquerda
    esquerda();
  } else if (valorEsq == HIGH && valorDir == LOW) {
    // Virar Direita
    direita();
  } else {
    // Parar
    parar();
  }
}

void frente() {
  analogWrite(motorEsqFrente, 150);
  digitalWrite(motorEsqTras, LOW);
  analogWrite(motorDirFrente, 150);
  digitalWrite(motorDirTras, LOW);
}
// ... Implementar outras funções de movimento
\`\`\`

## 🚀 Desafios Extras
1. Aumentar a velocidade do robô sem que ele saia da pista.
2. Adicionar LEDs que piscam indicando a direção da curva.
3. Criar uma pista com cruzamentos e obstáculos.
`
    },
    {
        id: "jogo-reciclagem-scratch",
        title: "Jogo da Reciclagem",
        description: "Um jogo interativo criado no Scratch onde o jogador deve separar corretamente o lixo nas lixeiras de coleta seletiva.",
        tools: ["Scratch", "Blocos"],
        difficulty: "Básico",
        duration: "2 aulas",
        grade: "Ensino Fundamental I (3º ao 5º ano)",
        image: "scratch-game",
        ods: "ODS 12 - Consumo e Produção Responsáveis",
        bncc: ["EF05CI04", "EF15AR26"],
        content: `
# Jogo da Reciclagem no Scratch

## 📋 Visão Geral
Os alunos criarão um jogo onde objetos (lixo) caem do topo da tela e devem ser arrastados ou direcionados para as lixeiras corretas (Papel, Plástico, Vidro, Metal).

## 🎯 Objetivos de Aprendizagem
- Identificar as cores da coleta seletiva.
- Compreender coordenadas X e Y no Scratch.
- Usar eventos de colisão e variáveis de pontuação.

## 👣 Passo a Passo
1. **Cenário e Atores:** Escolha um fundo urbano e adicione atores para as 4 lixeiras e diversos tipos de lixo.
2. **Movimento do Lixo:** Programe os itens para aparecerem em posição X aleatória no topo e caírem (Y diminui).
3. **Interação:** Se o lixo tocar na lixeira correta -> Som de sucesso, +1 Ponto, Esconder.
4. **Erro:** Se tocar na lixeira errada -> Som de erro, -1 Vida.

## 💡 Dicas
- Use clones para gerar múltiplos lixos infinitamente.
- Aumente a velocidade de queda conforme a pontuação sobe.
`
    },
    {
        id: "estacao-meteorologica-microbit",
        title: "Estação Meteorológica",
        description: "Use o Micro:bit para medir temperatura e luminosidade, exibindo os dados em tempo real e criando gráficos.",
        tools: ["Micro:bit", "Python"],
        difficulty: "Básico",
        duration: "3 aulas",
        grade: "Ensino Fundamental II (6º e 7º ano)",
        image: "microbit-weather",
        ods: "ODS 13 - Ação Contra a Mudança Global do Clima",
        bncc: ["EF06CI13", "EF07TEC02"],
        content: `
# Estação Meteorológica com Micro:bit

## 📋 Visão Geral
Utilizando os sensores internos do Micro:bit, os alunos criarão um dispositivo que monitora as condições ambientais da sala de aula ou do pátio da escola.

## 🎯 Objetivos de Aprendizagem
- Entender grandezas físicas (temperatura, luz).
- Coletar e interpretar dados.
- Programar display de LEDs e comunicação serial.

## 💻 Código (Python/MicroPython)
\`\`\`python
from microbit import *

while True:
    temp = temperature()
    luz = display.read_light_level()
    
    if button_a.is_pressed():
        display.scroll("Temp: " + str(temp) + "C")
    elif button_b.is_pressed():
        display.scroll("Luz: " + str(luz))
        
    sleep(100)
\`\`\`

## 🚀 Extensão
- Adicionar umidade do solo com um prego e clipes (sensor resistivo).
- Enviar dados via Rádio para outro Micro:bit dentro da sala.
`
    },
    {
        id: "piano-de-frutas",
        title: "Piano de Frutas",
        description: "Transforme bananas, maçãs e massinha de modelar em teclas de piano usando a placa Makey Makey e condutividade.",
        tools: ["Makey Makey", "Scratch"],
        difficulty: "Iniciante",
        duration: "1 aula",
        grade: "Ensino Fundamental I (Todas as idades)",
        image: "makey-piano",
        ods: "ODS 4 - Educação de Qualidade",
        bncc: ["EF15AR13", "EF04CI01"],
        content: `
# Piano de Frutas com Makey Makey

## 📋 Visão Geral
Uma atividade lúdica e surpreendente para introduzir circuitos elétricos e condutividade. As crianças tocam músicas usando frutas como teclas.

## 🎯 Objetivos de Aprendizagem
- Entender o conceito de circuito fechado e terra (GND).
- Explorar materiais condutores e isolantes.
- Divertir-se com música e tecnologia.

## 🔧 Materiais
- 1x Kit Makey Makey
- 4x Frutas (Bananas, Laranjas, etc.)
- Cabos garra jacaré
- Computador com Scratch

## 👣 Como Montar
1. Conecte o cabo USB do Makey Makey ao computador.
2. Conecte um cabo jacaré no "Earth" (Terra) e segure a outra ponta metálica.
3. Conecte outros cabos nas setas (Cima, Baixo, Esq, Dir) e espete a outra ponta nas frutas.
4. Abra um projeto de Piano no Scratch.
5. Toque nas frutas enquanto segura o cabo de terra para fechar o circuito e tocar o som!
`
    },
    {
        id: "cidade-inteligente-tinkercad",
        title: "Cidade Inteligente 3D",
        description: "Projete uma cidade sustentável no Tinkercad 3D, incorporando fontes de energia renovável e soluções urbanas.",
        tools: ["Tinkercad", "Modelagem 3D"],
        difficulty: "Intermediário",
        duration: "5 aulas",
        grade: "Ensino Fundamental II e Médio",
        image: "tinkercad-city",
        ods: "ODS 11 - Cidades e Comunidades Sustentáveis",
        bncc: ["EF09CI13", "EM13MAT307"],
        content: `
# Cidade Inteligente e Sustentável no Tinkercad

## 📋 Visão Geral
Os alunos atuarão como urbanistas do futuro, projetando bairros que priorizam o pedestre, usam energia solar e eólica, e possuem gestão eficiente de resíduos.

## 🎯 Objetivos de Aprendizagem
- Desenvolver visão espacial e geometria 3D.
- Planejar soluções urbanas para problemas reais.
- Aprender as ferramentas de modelagem sólida do Tinkercad.

## 🚀 Desafios de Design
- Criar postes de iluminação com painéis solares.
- Projetar um parque com sistema de captação de água da chuva.
- Modelar casas modulares eco-friendly.

## 🖨️ Impressão 3D
Se a escola tiver impressora 3D, exporte os melhores modelos em .STL e imprima para criar uma maquete física coletiva da cidade!
`
    },
    {
        id: "chat-python-ia",
        title: "Chatbot Simples com Python",
        description: "Crie seu primeiro assistente virtual baseado em regras usando Python, aprendendo sobre strings, input e condicionais.",
        tools: ["Python", "Lógica"],
        difficulty: "Iniciante",
        duration: "2 aulas",
        grade: "Ensino Médio",
        image: "python-code",
        ods: "ODS 9 - Inovação",
        bncc: ["EM13TEC04", "EM13MAT403"],
        content: `
# Chatbot Simples em Python

## 📋 Visão Geral
Uma introdução prática à programação textual. Os alunos criam um "bot" que responde a perguntas básicas, conta piadas ou ajuda em cálculos matemáticos.

## 🎯 Objetivos de Aprendizagem
- Manipular Strings (texto).
- Receber entrada do usuário (input).
- Usar lógica condicional (if/elif/else).

## 💻 Código Base
\`\`\`python
print("Olá! Eu sou o BotCode. Qual é o seu nome?")
nome = input()

print("Prazer em te conhecer, " + nome + "!")

while True:
    print("\\nO que você quer fazer?")
    print("1. Ouvir uma piada")
    print("2. Saber a tabuada")
    print("3. Sair")
    
    opcao = input("Escolha: ")
    
    if opcao == "1":
        print("P: O que o zero disse para o oito?")
        print("R: Belo cinto!")
    elif opcao == "2":
        num = int(input("Tabuada de qual número? "))
        for i in range(1, 11):
            print(f"{num} x {i} = {num*i}")
    elif opcao == "3":
        print("Tchau! Até mais.")
        break
    else:
        print("Não entendi. Tente de novo.")
\`\`\`
`
    },
    {
        id: "semaforo-inteligente",
        title: "Semáforo Inteligente",
        description: "Construa um semáforo com LEDs que muda automaticamente de cor e aprenda sobre temporizadores e sequências lógicas.",
        tools: ["Arduino", "C++"],
        difficulty: "Básico",
        duration: "2 aulas",
        grade: "Ensino Fundamental II (6º ano)",
        image: "arduino-traffic",
        ods: "ODS 11 - Cidades Sustentáveis",
        bncc: ["EF06CI04"]
    },
    {
        id: "jogo-pong-scratch",
        title: "Jogo Pong Clássico",
        description: "Recrie o clássico jogo Pong no Scratch, aprendendo sobre física de colisões e controle de personagens.",
        tools: ["Scratch", "Blocos"],
        difficulty: "Básico",
        duration: "2 aulas",
        grade: "Ensino Fundamental I (4º e 5º ano)",
        image: "scratch-game",
        ods: "ODS 4 - Educação de Qualidade",
        bncc: ["EF04MA16"]
    },
    {
        id: "bussola-digital-microbit",
        title: "Bússola Digital",
        description: "Use o magnetômetro do Micro:bit para criar uma bússola digital que aponta para o Norte.",
        tools: ["Micro:bit", "Blocos"],
        difficulty: "Básico",
        duration: "1 aula",
        grade: "Ensino Fundamental II (6º ano)",
        image: "microbit-compass",
        ods: "ODS 9 - Inovação",
        bncc: ["EF06CI13"]
    },
    {
        id: "braco-robotico-servo",
        title: "Braço Robótico com Servos",
        description: "Monte um braço robótico controlado por servomotores e aprenda sobre ângulos e movimento mecânico.",
        tools: ["Arduino", "C++"],
        difficulty: "Avançado",
        duration: "6 aulas",
        grade: "Ensino Médio",
        image: "arduino-robot",
        ods: "ODS 9 - Indústria e Inovação",
        bncc: ["EM13TEC03"]
    },
    {
        id: "historia-interativa-scratch",
        title: "História Interativa",
        description: "Crie uma história onde o leitor pode escolher diferentes caminhos e finais usando Scratch.",
        tools: ["Scratch", "Blocos"],
        difficulty: "Intermediário",
        duration: "3 aulas",
        grade: "Ensino Fundamental I (3º ao 5º ano)",
        image: "scratch-story",
        ods: "ODS 4 - Educação de Qualidade",
        bncc: ["EF15LP05", "EF15AR26"]
    },
    {
        id: "sensor-umidade-solo",
        title: "Sensor de Umidade do Solo",
        description: "Construa um sensor para monitorar a umidade da terra e criar um sistema de irrigação automática.",
        tools: ["Arduino", "C++"],
        difficulty: "Intermediário",
        duration: "4 aulas",
        grade: "Ensino Fundamental II (7º e 8º ano)",
        image: "arduino-sensor",
        ods: "ODS 2 - Fome Zero e Agricultura Sustentável",
        bncc: ["EF07CI08"]
    },
    {
        id: "pedometro-microbit",
        title: "Pedômetro com Micro:bit",
        description: "Use o acelerômetro do Micro:bit para contar passos e criar um desafio de caminhada na escola.",
        tools: ["Micro:bit", "Python"],
        difficulty: "Intermediário",
        duration: "2 aulas",
        grade: "Ensino Fundamental II (6º e 7º ano)",
        image: "microbit-step",
        ods: "ODS 3 - Saúde e Bem-Estar",
        bncc: ["EF06CI06"]
    },
    {
        id: "calculadora-scratch",
        title: "Calculadora Interativa",
        description: "Desenvolva uma calculadora funcional no Scratch com operações básicas e interface amigável.",
        tools: ["Scratch", "Blocos"],
        difficulty: "Básico",
        duration: "2 aulas",
        grade: "Ensino Fundamental II (6º ano)",
        image: "scratch-calc",
        ods: "ODS 4 - Educação de Qualidade",
        bncc: ["EF06MA03"]
    },
    {
        id: "alarme-distancia",
        title: "Alarme de Proximidade",
        description: "Crie um alarme que dispara quando algo se aproxima usando sensor ultrassônico e buzzer.",
        tools: ["Arduino", "C++"],
        difficulty: "Básico",
        duration: "2 aulas",
        grade: "Ensino Fundamental II (7º ano)",
        image: "arduino-alarm",
        ods: "ODS 9 - Inovação",
        bncc: ["EF07TEC01"]
    },
    {
        id: "jogo-memoria-microbit",
        title: "Jogo da Memória LED",
        description: "Recrie o clássico jogo Genius/Simon usando os LEDs e botões do Micro:bit.",
        tools: ["Micro:bit", "Blocos"],
        difficulty: "Intermediário",
        duration: "3 aulas",
        grade: "Ensino Fundamental II (6º ao 8º ano)",
        image: "microbit-game",
        ods: "ODS 4 - Educação de Qualidade",
        bncc: ["EF06MA16"]
    },
    {
        id: "animacao-stop-motion",
        title: "Animação Stop Motion",
        description: "Crie uma animação quadro a quadro no Scratch, aprendendo sobre movimento e sequências.",
        tools: ["Scratch", "Blocos"],
        difficulty: "Intermediário",
        duration: "4 aulas",
        grade: "Ensino Fundamental I (4º e 5º ano)",
        image: "scratch-animation",
        ods: "ODS 4 - Educação de Qualidade",
        bncc: ["EF15AR04", "EF15AR26"]
    },
    {
        id: "termometro-digital",
        title: "Termômetro Digital",
        description: "Construa um termômetro usando sensor de temperatura e display LCD para mostrar os valores.",
        tools: ["Arduino", "C++"],
        difficulty: "Básico",
        duration: "2 aulas",
        grade: "Ensino Fundamental II (6º e 7º ano)",
        image: "arduino-temp",
        ods: "ODS 13 - Ação Contra Mudança do Clima",
        bncc: ["EF06CI13"]
    },
    {
        id: "carro-autonomo-nepo",
        title: "Carro Autônomo com NEPO",
        description: "Programe um carro que desvia de obstáculos usando sensor ultrassônico e programação visual NEPO (Open Roberta).",
        tools: ["Arduino", "NEPO", "Blocos"],
        difficulty: "Avançado",
        duration: "6 aulas",
        grade: "Ensino Fundamental II (8º e 9º ano)",
        image: "arduino-robot",
        ods: "ODS 9 - Indústria e Inovação",
        bncc: ["EF08TEC04", "EF09TEC01"],
        content: `
# Carro Autônomo com NEPO

## 📋 Visão Geral
Projeto inspirado no Open Roberta Lab. Use programação visual NEPO para criar um carro que detecta e desvia de obstáculos automaticamente.

## 🎯 Objetivos
- Entender lógica de decisão autônoma
- Programar com blocos visuais (NEPO)
- Aplicar conceitos de robótica móvel

## 🔧 Materiais
- 1x Arduino Uno
- 1x Sensor Ultrassônico HC-SR04
- 2x Motores DC + Ponte H
- 1x Chassi de carro
- Bateria 9V

## 💻 Programação
Use o Open Roberta Lab (lab.open-roberta.org) para programar visualmente e exportar código para Arduino.
`
    },
    {
        id: "piano-luz-microbit",
        title: "Piano de Luz com Micro:bit",
        description: "Crie um instrumento musical que toca notas diferentes baseado na quantidade de luz detectada.",
        tools: ["Micro:bit", "NEPO", "Blocos"],
        difficulty: "Intermediário",
        duration: "3 aulas",
        grade: "Ensino Fundamental II (6º e 7º ano)",
        image: "microbit-music",
        ods: "ODS 4 - Educação de Qualidade",
        bncc: ["EF06CI04", "EF15AR13"],
        content: `
# Piano de Luz com Micro:bit

## 📋 Visão Geral
Inspirado no Open Roberta Lab. Use o sensor de luz do Micro:bit para criar um instrumento musical interativo.

## 🎯 Objetivos
- Mapear valores de sensor para notas musicais
- Entender escalas e frequências
- Programar com blocos NEPO

## 💡 Como Funciona
Quanto mais luz, mais aguda a nota. Cubra o sensor para tocar notas graves!
`
    },
    {
        id: "dado-digital-calliope",
        title: "Dado Digital",
        description: "Simule um dado de 6 faces que mostra números aleatórios ao ser sacudido.",
        tools: ["Micro:bit", "Blocos"],
        difficulty: "Básico",
        duration: "1 aula",
        grade: "Ensino Fundamental I (4º e 5º ano)",
        image: "microbit-dice",
        ods: "ODS 4 - Educação de Qualidade",
        bncc: ["EF04MA27"],
        content: `
# Dado Digital

## 📋 Visão Geral
Projeto do Open Roberta adaptado. Crie um dado eletrônico usando o acelerômetro do Micro:bit.

## 🎯 Objetivos
- Usar números aleatórios
- Detectar movimento (shake)
- Exibir no display de LEDs

## 🎲 Desafio
Adicione animação de "rolagem" antes de mostrar o número final!
`
    },
    {
        id: "robo-desenhista",
        title: "Robô Desenhista",
        description: "Construa um robô que desenha formas geométricas controlando motores com precisão.",
        tools: ["Arduino", "C++"],
        difficulty: "Avançado",
        duration: "8 aulas",
        grade: "Ensino Médio",
        image: "arduino-plotter",
        ods: "ODS 9 - Inovação",
        bncc: ["EM13TEC03", "EM13MAT307"],
        content: `
# Robô Desenhista

## 📋 Visão Geral
Inspirado em projetos do Open Roberta. Crie um plotter XY que desenha usando servomotores.

## 🎯 Objetivos
- Controlar movimento em 2 eixos
- Aplicar trigonometria
- Programar trajetórias

## 🚀 Desafios
- Desenhar quadrado
- Desenhar círculo
- Desenhar seu nome
`
    },
    {
        id: "sistema-irrigacao-inteligente",
        title: "Sistema de Irrigação Inteligente",
        description: "Crie um sistema que rega plantas automaticamente baseado na umidade do solo.",
        tools: ["Arduino", "C++"],
        difficulty: "Intermediário",
        duration: "5 aulas",
        grade: "Ensino Fundamental II (7º e 8º ano)",
        image: "arduino-plant",
        ods: "ODS 2 - Fome Zero",
        bncc: ["EF07CI08", "EF08TEC04"],
        content: `
# Sistema de Irrigação Inteligente

## 📋 Visão Geral
Projeto do Open Roberta adaptado. Use sensor de umidade para automatizar irrigação.

## 🎯 Objetivos
- Ler sensores analógicos
- Controlar relé/bomba
- Implementar lógica de decisão

## 🔧 Materiais
- Arduino Uno
- Sensor de Umidade do Solo
- Relé 5V
- Mini bomba d'água
- Mangueira
`
    },
    {
        id: "contador-pessoas-sensor",
        title: "Contador de Pessoas",
        description: "Sistema que conta quantas pessoas entram e saem de um ambiente usando sensores infravermelhos.",
        tools: ["Arduino", "C++"],
        difficulty: "Intermediário",
        duration: "4 aulas",
        grade: "Ensino Fundamental II (8º e 9º ano)",
        image: "arduino-counter",
        ods: "ODS 11 - Cidades Inteligentes",
        bncc: ["EF08TEC04"],
        content: `
# Contador de Pessoas

## 📋 Visão Geral
Inspirado no Open Roberta Lab. Use dois sensores IR para detectar direção de movimento.

## 🎯 Objetivos
- Detectar sequência de eventos
- Incrementar/decrementar contadores
- Exibir em display LCD

## 💡 Aplicação Real
Usado em lojas, ônibus e controle de lotação.
`
    },
    {
        id: "jogo-reacao-leds",
        title: "Jogo de Reação com LEDs",
        description: "Teste seus reflexos! Aperte o botão quando o LED acender para marcar pontos.",
        tools: ["Micro:bit", "Blocos"],
        difficulty: "Básico",
        duration: "2 aulas",
        grade: "Ensino Fundamental II (6º ano)",
        image: "microbit-game",
        ods: "ODS 4 - Educação de Qualidade",
        bncc: ["EF06MA16"],
        content: `
# Jogo de Reação com LEDs

## 📋 Visão Geral
Projeto do Open Roberta. Crie um jogo que testa tempo de reação.

## 🎯 Objetivos
- Usar temporizadores
- Detectar entrada de botão
- Calcular tempo de resposta

## 🎮 Como Jogar
1. LED acende em tempo aleatório
2. Aperte o botão o mais rápido possível
3. Veja seu tempo no display
`
    },
    {
        id: "estacao-qualidade-ar",
        title: "Estação de Qualidade do Ar",
        description: "Monitore CO2, temperatura e umidade para avaliar qualidade do ar em ambientes fechados.",
        tools: ["Arduino", "C++"],
        difficulty: "Avançado",
        duration: "6 aulas",
        grade: "Ensino Médio",
        image: "arduino-air",
        ods: "ODS 13 - Ação Climática",
        bncc: ["EM13TEC04", "EM13CNT301"],
        content: `
# Estação de Qualidade do Ar

## 📋 Visão Geral
Inspirado em projetos do Open Roberta. Monitore múltiplos sensores ambientais.

## 🎯 Objetivos
- Integrar múltiplos sensores
- Processar dados em tempo real
- Exibir em dashboard

## 🔧 Sensores
- MQ-135 (CO2)
- DHT22 (Temperatura/Umidade)
- Display OLED
`
    },
    {
        id: "robo-seguidor-som",
        title: "Robô Seguidor de Som",
        description: "Robô que se move em direção à fonte sonora mais alta usando microfones.",
        tools: ["Arduino", "C++"],
        difficulty: "Avançado",
        duration: "7 aulas",
        grade: "Ensino Médio",
        image: "arduino-sound",
        ods: "ODS 9 - Inovação",
        bncc: ["EM13TEC03"],
        content: `
# Robô Seguidor de Som

## 📋 Visão Geral
Projeto avançado do Open Roberta. Robô localiza fonte sonora por triangulação.

## 🎯 Objetivos
- Processar sinais de áudio
- Comparar intensidades
- Implementar navegação autônoma

## 🔧 Materiais
- 2x Módulos de Microfone
- Arduino Uno
- Chassi com motores
- Ponte H L298N
`
    },
    {
        id: "sinalizador-morse",
        title: "Sinalizador Morse",
        description: "Envie mensagens em código Morse usando LEDs e botões do Micro:bit.",
        tools: ["Micro:bit", "Blocos"],
        difficulty: "Intermediário",
        duration: "3 aulas",
        grade: "Ensino Fundamental II (7º ano)",
        image: "microbit-morse",
        ods: "ODS 4 - Educação de Qualidade",
        bncc: ["EF07LP01"],
        content: `
# Sinalizador Morse

## 📋 Visão Geral
Projeto do Open Roberta Lab. Aprenda código Morse e comunicação digital.

## 🎯 Objetivos
- Entender codificação de mensagens
- Usar arrays e strings
- Implementar comunicação via rádio

## 📡 Desafio Extra
Envie mensagens entre dois Micro:bits usando rádio!
`
    },
    {
        id: "medidor-velocidade-luz",
        title: "Medidor de Velocidade com Luz",
        description: "Calcule a velocidade de objetos usando dois sensores de luz e cronômetro.",
        tools: ["Arduino", "C++"],
        difficulty: "Intermediário",
        duration: "4 aulas",
        grade: "Ensino Fundamental II (9º ano)",
        image: "arduino-speed",
        ods: "ODS 9 - Inovação",
        bncc: ["EF09CI03"],
        content: `
# Medidor de Velocidade com Luz

## 📋 Visão Geral
Inspirado no Open Roberta. Calcule velocidade usando física e sensores.

## 🎯 Objetivos
- Aplicar fórmula v = d/t
- Usar interrupções
- Medir tempo com precisão

## 🚗 Aplicação
Crie um radar de velocidade para carrinhos de brinquedo!
`
    }
];

export function getAllProjects() {
    return projects;
}

export function getProjectById(id) {
    return projects.find(p => p.id === id);
}

export function getProjectsByTool(tool) {
    if (tool === 'Todos') return projects;
    return projects.filter(p => p.tools.includes(tool));
}
