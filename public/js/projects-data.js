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
