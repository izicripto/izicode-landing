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
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
        ods: "ODS 9 - Indústria, Inovação e Infraestrutura",
        bncc: ["EF08TEC04", "EF09TEC01"],
        schematic: "https://docs.arduino.cc/static/6df7cf50811eef2506253761cc27e467/A000066-schematic.pdf", // Link to schematic or placeholder image
        hardwareDiagram: "https://docs.arduino.cc/static/f58d249f086888c3a5062340-pinout.png",
        softwareFlow: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800", // Logical flow visual
        teacherGuide: {
            objective: "Ensinar lógica de controle em malha fechada e calibração de sensores analógicos.",
            skills: ["Resolução de problemas", "Pensamento Algorítmico", "Colaboração"],
            assessment: "O robô consegue completar uma volta completa em menos de 30 segundos?"
        },
        hacksterLink: "https://www.hackster.io/Pj.gour/line-follower-robot-arduino-b10bf4",
        stepImages: [
            "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=800"
        ],
        content: `
# Robô Seguidor de Linha (Guia Completo)

## 🎯 Visão Geral do Tutorial
Este projeto transforma um chassi mecânico em um robô inteligente capaz de tomar decisões em tempo real. Utilizando sensores infravermelhos (IR), o robô detecta o contraste entre uma linha preta (que absorve luz) e uma superfície branca (que reflete luz), ajustando a velocidade dos motores para manter-se no trajeto.

## 🔩 Materiais e Componentes
- 1x **Arduino Uno R3** (o "cérebro" do robô)
- 1x **Driver de Motor L298N** (permite controlar a direção e velocidade)
- 2x **Sensores Infravermelhos TCRT5000**
- 1x **Chassi Robótico** de 2 rodas + Roda boba
- 2x **Motores DC (3-6V)** com caixa de redução
- 1x **Suporte para 4 Pilhas AA** ou Bateria Li-Ion 7.4V
- Jumpers Macho-Macho e Macho-Fêmea

## 🛠️ Passo a Passo da Montagem

### 1. Preparação do Chassi
Fixe os dois motores DC nas laterais do chassi usando os suportes em "T". Certifique-se de que os eixos estejam alinhados para que o robô não ande "torto". Instale a roda boba (caster wheel) na parte frontal para dar estabilidade.

### 2. Instalação do Cérebro e Driver
Monte o Arduino e o Driver L298N na parte superior do chassi. Use parafusos ou fita dupla face de alta resistência. **Dica:** Deixe o conector USB do Arduino voltado para fora para facilitar a programação futura.

### 3. Posicionamento dos Sensores IR
Fixe os dois sensores TCRT5000 na parte frontal inferior do chassi. Eles devem estar posicionados a uma distância de aproximadamente **3mm a 5mm do chão**. A distância entre os dois sensores deve ser ligeiramente maior que a largura da fita isolante preta que você usará como pista.

## ⚙️ Esquema de Ligação (Wiring)

### Conexão do Driver L298N:
- **OUT1 / OUT2:** Motor Esquerdo
- **OUT3 / OUT4:** Motor Direito
- **12V In:** Positivo da Bateria
- **GND In:** Negativo da Bateria + GND do Arduino (Crucial!)
- **5V In:** Alimenta o Arduino (Pino Vin ou 5V)

### Conexão dos Sensores:
- **VCC:** 5V do Arduino
- **GND:** GND do Arduino
- **Digital Out (Esq):** Pino 2 do Arduino
- **Digital Out (Dir):** Pino 3 do Arduino

## 💻 Programação e Lógica
A lógica baseia-se em quatro estados simples:
1. **Ambos brancos:** Segue em frente.
2. **Esquerda preto, Direita branco:** Vira para a esquerda.
3. **Direita preto, Esquerda branco:** Vira para a direita.
4. **Ambos preto:** Para ou reduz a velocidade (fim de linha).

\`\`\`cpp
// Pinos de controle dos motores
const int motorE_frente = 5; 
const int motorE_tras = 6;
const int motorD_frente = 9;
const int motorD_tras = 10;

// Pinos dos sensores
const int sensorE = 2;
const int sensorD = 3;

void setup() {
  pinMode(motorE_frente, OUTPUT);
  pinMode(motorE_tras, OUTPUT);
  pinMode(motorD_frente, OUTPUT);
  pinMode(motorD_tras, OUTPUT);
  pinMode(sensorE, INPUT);
  pinMode(sensorD, INPUT);
}

void loop() {
  int leituraE = digitalRead(sensorE);
  int leituraD = digitalRead(sensorD);

  if(leituraE == LOW && leituraD == LOW) { // Branco / Branco
    moverFrente();
  } 
  else if(leituraE == HIGH && leituraD == LOW) { // Preto / Branco
    virarEsquerda();
  }
  else if(leituraE == LOW && leituraD == HIGH) { // Branco / Preto
    virarDireita();
  }
  else {
    parar();
  }
}

void moverFrente() {
  digitalWrite(motorE_frente, HIGH);
  digitalWrite(motorE_tras, LOW);
  digitalWrite(motorD_frente, HIGH);
  digitalWrite(motorD_tras, LOW);
}

void virarEsquerda() {
  digitalWrite(motorE_frente, LOW);
  digitalWrite(motorE_tras, LOW);
  digitalWrite(motorD_frente, HIGH);
  digitalWrite(motorD_tras, LOW);
}

void virarDireita() {
  digitalWrite(motorE_frente, HIGH);
  digitalWrite(motorE_tras, LOW);
  digitalWrite(motorD_frente, LOW);
  digitalWrite(motorD_tras, LOW);
}

void parar() {
  digitalWrite(motorE_frente, LOW);
  digitalWrite(motorE_tras, LOW);
  digitalWrite(motorD_frente, LOW);
  digitalWrite(motorD_tras, LOW);
}
\`\`\`

## ⚠️ Calibração e Dicas Finais
- **Ajuste de Sensibilidade:** Use a chave de fenda pequena para girar o potenciômetro azul nos sensores IR. O LED de sinal deve acender apenas quando o sensor estiver sobre a fita preta.
- **Inversão de Motores:** Se o robô girar para o lado errado, basta inverter os dois fios do motor correspondente no conector do Driver L298N.
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
        image: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&q=80&w=800",
        ods: "ODS 12 - Consumo e Produção Responsáveis",
        bncc: ["EF05CI04", "EF15AR26"],
        teacherGuide: {
            objective: "Introduzir os fundamentos da lógica de programação (colisão e variáveis) aplicada à conscientização ambiental.",
            skills: ["Pensamento Sistêmico", "Consciência Ecológica", "Lógica de Blocos"],
            assessment: "O aluno conseguiu implementar a lógica onde o lixo desaparece ao tocar na lixeira correta?"
        },
        content: `
# Jogo da Reciclagem no Scratch

## 🍃 Visão Geral
Nesta atividade de Pensamento Computacional, os alunos desenvolvem um "Arcade de Sustentabilidade". O objetivo é criar uma consciência ambiental prática enquanto aprendem conceitos fundamentais de lógica de jogos e interfaces interativas.

## 🎓 Objetivos de Aprendizagem
- **Lógica de Colisão:** Entender como computadores detectam quando dois objetos se tocam.
- **Variáveis:** Usar placares para quantificar o sucesso (Pontos) e o erro (Vidas).
- **Educação Ambiental:** Memorizar as cores e os tipos de resíduos da coleta seletiva brasileira.

## 🛠️ Passo a Passo Detalhado
1. **Configuração de Palco:** Escolha o cenário "Urban" ou desenhe uma praça. Adicione os 4 sprites de lixeiras na parte inferior.
2. **Criação de Clones:** Não crie vários atores de lixo. Use blocos de "Criar clone de mim mesmo" com posição X aleatória e espera de 1 a 2 segundos entre cada um.
3. **Lógica de Separação:** Cada lixo deve ter uma variável interna "tipo". Exemplo: Papel = 1, Plástico = 2. Ao tocar na lixeira, o código verifica se o tipo do lixo coincide com o da lixeira.
4. **Game Over:** Crie uma tela de encerramento que aparece quando as vidas chegam a zero, mostrando a pontuação final.

## 💡 Dicas Pedagógicas
Incentive os alunos a buscarem sons reais (como garrafas quebrando ou papel amassando) para os efeitos sonoros do jogo, tornando a experiência mais imersiva.

## 🏆 Desafios de Desenvolvimento
- **Nível 2:** Adicionar um "Lixo Especial" que cai mais rápido e vale 5 pontos.
- **Surpresa:** Adicionar um item de lixo orgânico (casca de banana) que não tem lixeira correspondente e deve ser ignorado.
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
        image: "https://images.unsplash.com/photo-1590055531615-f16d3698cc88?auto=format&fit=crop&q=80&w=800",
        ods: "ODS 13 - Ação Contra a Mudança Global do Clima",
        bncc: ["EF06CI13", "EF07TEC02"],
        teacherGuide: {
            objective: "Ensinar a coleta e interpretação de dados ambientais reais usando sensores digitais.",
            skills: ["Análise de Dados", "Investigação Científica", "Alfabetização Climática"],
            assessment: "Os alunos conseguem explicar a relação entre a luz medida e a variação da temperatura no experimento?"
        },
        content: `
# Estação Meteorológica com Micro:bit

## 🌡️ Visão Geral
Transforme sua sala de aula em um centro de monitoramento climático. Neste projeto, os alunos exploram como a tecnologia nos ajuda a entender e combater as mudanças climáticas, coletando dados ambientais reais em tempo real.

## 🎓 Objetivos de Aprendizagem
- **Grandezas Físicas:** Compreender na prática o que são Celsius (°C) e níveis de iluminância.
- **Análise de Dados:** Diferenciar variações momentâneas de tendências climáticas (ex: sombra passageira vs. fim de tarde).
- **Ação Climática (ODS 13):** Discutir como o monitoramento constante pode prevenir desastres naturais.

## 🛠️ Passo a Passo Detalhado
1. **Ativação dos Sensores:** O Micro:bit possui sensores embutidos no seu processador (temperatura) e na matriz de LEDs (luz). Não é necessário hardware externo inicial.
2. **Interface de Exibição:** Use o comando \`display.scroll()\` para mostrar os valores. **Dica:** Adicione um texto explicativo antes do valor, como "Luz: ".
3. **Calibração:** Compare a leitura do Micro:bit com um termômetro de mercúrio ou app de celular. Existem diferenças? Por que?

## 📝 Avaliação e Prática
Peça aos grupos para medirem a temperatura em diferentes locais: perto da janela, sob o ar-condicionado e no pátio. Eles devem criar uma tabela comparativa.

## 🚀 Desafios Extras
- **Umidade Simples:** Use dois pregos e cabos jacaré para medir a umidade do solo de uma planta. Meça a resistência elétrica entre os pregos (mais água = menos resistência).
- **Log de Dados:** Use o recurso de "Datalogging" (se disponível na sua versão) para gravar dados por 24 horas e gerar um gráfico no computador.
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
        image: "https://images.unsplash.com/photo-1550985543-f47f38aee65e?auto=format&fit=crop&q=80&w=800",
        ods: "ODS 4 - Educação de Qualidade",
        bncc: ["EF15AR13", "EF04CI01"],
        teacherGuide: {
            objective: "Explorar a condutividade elétrica de materiais orgânicos e fechar circuitos usando o corpo humano.",
            skills: ["Criatividade Musical", "Circuitos Básicos", "Curiosidade Científica"],
            assessment: "O grupo conseguiu identificar quais frutas conduzem eletricidade e quais não?"
        },
        content: `
# Piano de Frutas com Makey Makey

## 🎹 Visão Geral
Esta é a experiência "WAW" definitiva para introduzir eletrônica. Transformamos objetos comuns e condutores em teclados musicais. É excelente para desmistificar a tecnologia e mostrar que ela está em todo lugar, até na natureza.

## 🎓 Objetivos de Aprendizagem
- **Condutividade:** Diferenciar materiais condutores de isolantes através da experimentação física.
- **Circuitos:** Compreender que a corrente elétrica precisa de um caminho de volta (o corpo humano servindo como fio de retorno/terra).
- **Expressão Artística:** Combinar tecnologia com performance musical.

## 🔩 Materiais e Configuração
- **Makey Makey:** Placa controladora que emula um teclado HID.
- **Atores Condutores:** Bananas, Maçãs, Potes com água, Folhas de planta ou até Colegas de classe!
- **Garra Jacaré:** Para conectar a placa aos objetos e ao usuário.

## 🛠️ Como Montar (Com Dicas Técnicas)
1. Conecte o cabo USB ao computador. Nenhuma instalação é necessária, o PC o reconhecerá como um teclado comum.
2. Clipes "Earth": Prenda um cabo no local indicado como terra na placa. O aluno deve segurar a ponta metálica deste cabo (isso fecha o circuito).
3. Teclas Criativas: Espete as garras nas frutas. Cada fruta será uma nota.
4. Código: No Scratch, use o bloco "Quando a tecla [Espaço] for pressionada" para tocar uma nota musical específica.

## ⚠️ Solução de Problemas
"Minha fruta não toca": Verifique se você está segurando firmemente o cabo de terra (Earth). Se as mãos estiverem muito secas, a condutividade pode diminuir — tente umedecer levemente a ponta do dedo.

## 🌈 Expandindo a Ideia
- **Escada Musical:** Se a sua escola tiver escadas, coloque fitas de alumínio nos degraus e transforme a subida em um piano gigante!
- **Game Controller:** Use massinha de modelar para criar os botões de um controle de videogame personalizado e jogue Flappy Bird ou Mario.
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
        image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=800",
        ods: "ODS 11 - Cidades e Comunidades Sustentáveis",
        bncc: ["EF09CI13", "EM13MAT307"],
        teacherGuide: {
            objective: "Projetar soluções urbanas usando modelagem 3D, integrando conceitos de geometria e sustentabilidade.",
            skills: ["Visão Espacial", "Design Thinking", "Urbanismo Sustentável"],
            assessment: "O projeto final contempla pelo menos duas soluções de energia renovável ou gestão de resíduos?"
        },
        content: `
# Cidade Inteligente e Sustentável no Tinkercad

## 🏙️ Visão Geral
Os alunos assumem o papel de arquitetos e urbanistas para resolver o maior desafio do século XXI: criar cidades que não agridem o planeta. O foco é na modelagem 3D como ferramenta de prototipagem e solução de problemas urbanos.

## 🎓 Objetivos de Aprendizagem
- **Geometria Espacial:** Manipular sólidos (cubos, cilindros, esferas) para criar estruturas complexas.
- **Pensamento Sistêmico:** Entender como a energia, o transporte e o lixo estão conectados em uma cidade.
- **Prototipagem 3D:** Dominar as operações de agrupamento (\`Group\`) e orifícios (\`Hole\`) para detalhamento técnico.

## 🛠️ Guia de Design (Urbanismo Moderno)
- **Energia:** Cada edifício deve ter um teto solar. Use a ferramenta de "Duplicate" (Ctrl+D) para criar painéis solares em série rapidamente.
- **Mobilidade:** Desenhe ciclovias e áreas verdes. Cidades inteligentes priorizam pessoas, não apenas carros.
- **Sustentabilidade:** Crie uma usina de compostagem ou reciclagem. Use cores padrão da coleta seletiva (Azul, Amarelo, Vermelho, Verde) nas lixeiras 3D.

## 📝 Avaliação do Projeto
A cidade é funcional? Existe espaço para todos? O design é eficiente para economia de materiais se fosse impresso?

## 🖨️ Da Tela para o Mundo Real
Exporte os modelos em formato \`.STL\`. Se a escola possuir uma impressora 3D, imprima os prédios mais icônicos para montar uma maquete física interativa com luzes reais usando Arduino!
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
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800",
        ods: "ODS 9 - Inovação",
        bncc: ["EM13TEC04", "EM13MAT403"],
        content: `
# Chatbot Simples em Python

## 🤖 Visão Geral
Este projeto é a porta de entrada para a Inteligência Artificial textual. Os alunos aprendem que por trás de um "assistente inteligente" existe uma lógica estruturada de processamento de linguagem e tomada de decisão baseada em regras.

## 🎓 Objetivos de Aprendizagem
- **Algoritmos Sequenciais:** Seguir a ordem lógica de uma conversa humana.
- **Tipos de Dados:** Diferenciar Números (integers) de Textos (strings).
- **Estruturas de Repetição:** Usar o \`while True\` para manter o programa "vivo" e interativo infinitamente.

## 💻 Código Base Comentado
\`\`\`python
# Saudação inicial e entrada de dados
print("Olá! Eu sou o BotCode. Qual é o seu nome?")
nome = input()

print("Prazer em te conhecer, " + nome + "!")

# Loop principal: mantém o bot escutando o usuário
while True:
    print("\\nO que você quer fazer?")
    print("1. Ouvir uma piada")
    print("2. Saber a tabuada")
    print("3. Sair")
    
    opcao = input("Escolha: ")
    
    if opcao == "1":
        print("P: Por que o computador foi ao médico?")
        print("R: Porque ele estava com um vírus!")
    elif opcao == "2":
        num = int(input("Tabuada de qual número? "))
        for i in range(1, 11):
            # Exemplo de f-string (formatação moderna de texto)
            print(f"\${num} x \${i} = \${num*i}")
    elif opcao == "3":
        print("Tchau! Até mais.")
        break # Encerra o loop e o programa
    else:
        print("Opção inválida. Tente digitar 1, 2 ou 3.")
\`\`\`

## 📝 Reflexão Crítica
O Chatbot "pensa" de verdade ou ele apenas reage ao que foi programado? Como poderíamos ensinar o bot a reconhecer sentimentos (ex: se o usuário disser "estou triste")?

## 🚀 Desafios Extras
- **Calculadora de Notas:** Crie uma opção onde o usuário digita 3 notas e o bot diz se ele foi aprovado.
- **Personalidade:** Mude as mensagens do bot para que ele fale como uma pirata, um cientista ou um astronauta.
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
        image: "https://images.unsplash.com/photo-1521791136064-7986c2923216?auto=format&fit=crop&q=80&w=800",
        ods: "ODS 11 - Cidades Sustentáveis",
        bncc: ["EF06CI04"],
        content: `
# Semáforo Inteligente

## 🚦 Visão Geral
Construa um protótipo de gestão de tráfego urbano. Este projeto ensina como os computadores controlam o tempo e a sequência de eventos no mundo real, uma base fundamental para entender sistemas críticos e automação urbana.

## 🎓 Objetivos de Aprendizagem
- **Eletrônica Básica:** Compreender a polaridade dos LEDs e a função dos resistores (proteção).
- **Lógica de Sequenciamento:** Desenvolver algoritmos que respeitem uma ordem cronológica rígida.
- **Urbanismo:** Discutir a importância dos semáforos para a segurança e o fluxo das cidades.

## ⚙️ Montagem Passo a Passo
1. **Circuito:** Conecte o anodo (perna longa) de cada LED a uma porta digital do Arduino através de um resistor. Conecte todos os catodos (perna curta) ao barramento negativo (GND).
2. **Definição de Tempos:** O Vermelho deve durar mais que o Amarelo. Experimente: Vermelho (5s), Verde (5s), Amarelo (2s).
3. **Teste de Segurança:** Verifique se não há dois LEDs "acesos" ao mesmo tempo que possam causar confusão em um cruzamento hipotético.

## 📝 Avaliação e Prática
Peça para os alunos modificarem o código para incluir um "botão de pedestre". Quando pressionado, o semáforo deve interromper seu ciclo normal para permitir a travessia.

## 🚀 Desafios Extras
- **Modo Noturno:** Use um sensor de luz (LDR). Quando escurecer, o semáforo deve ficar apenas piscando em amarelo (atenção).
- **Semáforo Duplo:** Tente sincronizar dois semáforos para um cruzamento de duas ruas!

## Código base
\`\`\`cpp
void setup() {
  pinMode(13, OUTPUT); // Vermelho
  pinMode(12, OUTPUT); // Amarelo
  pinMode(11, OUTPUT); // Verde
}

void loop() {
  digitalWrite(13, HIGH); delay(5000); digitalWrite(13, LOW);
  digitalWrite(11, HIGH); delay(5000); digitalWrite(11, LOW);
  digitalWrite(12, HIGH); delay(2000); digitalWrite(12, LOW);
}
\`\`\`
`
    },
    {
        id: "jogo-pong-scratch",
        title: "Jogo Pong Clássico",
        description: "Recrie o clássico jogo Pong no Scratch, aprendendo sobre física de colisões e controle de personagens.",
        tools: ["Scratch", "Blocos"],
        difficulty: "Básico",
        duration: "2 aulas",
        grade: "Ensino Fundamental I (4º e 5º ano)",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
        ods: "ODS 4 - Educação de Qualidade",
        bncc: ["EF04MA16"],
        content: `
# Jogo Pong no Scratch

## Visão Geral
Recrie um dos primeiros videogames da história. O objetivo é controlar uma raquete para rebater uma bola e não deixá-la cair.

## Objetivos de Aprendizagem
- Trabalhar com reflexão e ângulos.
- Criar controles de teclado ou mouse.
- Programar condições de vitória e derrota.

## Passo a passo
1. Crie um ator "Raquete" e um ator "Bola".
2. Programar a raquete para seguir o mouse (eixo X).
3. Programar a bola para se mover e "se tocar na borda, volte".
4. Adicionar lógica: "se tocar na raquete, mude a direção para um ângulo oposto".
`
    },
    {
        id: "bussola-digital-microbit",
        title: "Bússola Digital",
        description: "Use o magnetômetro do Micro:bit para criar uma bússola digital que aponta para o Norte.",
        tools: ["Micro:bit", "Blocos"],
        difficulty: "Básico",
        duration: "1 aula",
        grade: "Ensino Fundamental II (6º ano)",
        image: "https://images.unsplash.com/photo-1519709042477-8d67af318bc5?auto=format&fit=crop&q=80&w=800",
        ods: "ODS 9 - Inovação",
        bncc: ["EF06CI13"],
        content: `
# Bússola Digital com Micro:bit

## 🧭 Visão Geral
Utilize o magnetômetro interno do Micro:bit para explorar as leis do magnetismo terrestre. Este projeto une geografia e tecnologia, transformando dados invisíveis do campo magnético em informações visuais úteis para navegação.

## 🎓 Objetivos de Aprendizagem
- **Magnetismo:** Entender o conceito de pólos magnéticos e como a Terra funciona como um grande imã.
- **Cartografia:** Relacionar graus de rotação (0-360) com os pontos cardeais (N, S, L, O).
- **Tratamento de Dados:** Aplicar condições lógicas para transformar números em ícones de direção.

## 🛠️ Passo a Passo Detalhado
1. **Calibração:** Ao iniciar, o Micro:bit pedirá para "desenhar um círculo" movendo a placa. Isso é essencial para que o sensor entenda o ambiente magnético local.
2. **Lógica de Graus:** Lembre-se que 0° é Norte. Use blocos de "se/então" para definir faixas. **Dica:** Se o valor estiver entre 315 e 45, o Micro:bit deve mostrar um "N".
3. **Display Dinâmico:** Use setas ou letras para indicar a direção.

## 📝 Reflexão e Avaliação
O que acontece se você aproximar um imã ou um celular da bússola? Os dados continuam confiáveis? Por que precisamos recalibrar sensores eletrônicos?

## 🚀 Desafios de Expansão
- **Alarme de Direção:** Faça o Micro:bit emitir um som (beep) apenas quando você estiver apontando exatamente para o Norte.
- **Navegação Real:** Use a bússola para fazer uma "caça ao tesouro" na escola seguindo apenas orientações magnéticas.
`
    },
    {
        id: "braco-robotico-servo",
        title: "Braço Robótico com Servos",
        description: "Monte um braço robótico controlado por servomotores e aprenda sobre ângulos e movimento mecânico.",
        tools: ["Arduino", "C++"],
        difficulty: "Avançado",
        duration: "6 aulas",
        grade: "Ensino Médio",
        image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
        ods: "ODS 9 - Indústria e Inovação",
        bncc: ["EM13TEC03"],
        content: `
# Braço Robótico com Servos

## Visão Geral
Um projeto avançado de mecânica e eletrônica onde os alunos montam um braço capaz de pegar e mover objetos, controlado por potenciômetros ou via código.

## Objetivos de Aprendizagem
- Entender o funcionamento de servomotores (controle de ângulo).
- Trabalhar com mapeamento de valores analógicos (map).
- Resolver problemas de torque e equilíbrio mecânico.

## Materiais
- 1x Kit de Braço Robótico (MDF ou 3D)
- 4x Servomotores MG90 ou SG90
- 1x Arduino Uno
- 4x Potenciômetros (se quiser controle manual)
`
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

## Visão Geral
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

## Programação
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

## Visão Geral
Inspirado no Open Roberta Lab. Use o sensor de luz do Micro:bit para criar um instrumento musical interativo.

## 🎯 Objetivos
- Mapear valores de sensor para notas musicais
- Entender escalas e frequências
- Programar com blocos NEPO

## Como Funciona
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

## Visão Geral
Projeto do Open Roberta adaptado. Crie um dado eletrônico usando o acelerômetro do Micro:bit.

## 🎯 Objetivos
- Usar números aleatórios
- Detectar movimento (shake)
- Exibir no display de LEDs

## Desafio
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

## Visão Geral
Inspirado em projetos do Open Roberta. Crie um plotter XY que desenha usando servomotores.

## Objetivos
- Controlar movimento em 2 eixos
- Aplicar trigonometria
- Programar trajetórias

## Desafios
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

## Visão Geral
Projeto do Open Roberta adaptado. Use sensor de umidade para automatizar irrigação.

## Objetivos
- Ler sensores analógicos
- Controlar relé/bomba
- Implementar lógica de decisão

## Materiais
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

## Visão Geral
Inspirado no Open Roberta Lab. Use dois sensores IR para detectar direção de movimento.

## Objetivos
- Detectar sequência de eventos
- Incrementar/decrementar contadores
- Exibir em display LCD

## Aplicação Real
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

## Visão Geral
Projeto do Open Roberta. Crie um jogo que testa tempo de reação.

## Objetivos
- Usar temporizadores
- Detectar entrada de botão
- Calcular tempo de resposta

## Como Jogar
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

## Visão Geral
Inspirado em projetos do Open Roberta. Monitore múltiplos sensores ambientais.

## Objetivos
- Integrar múltiplos sensores
- Processar dados em tempo real
- Exibir em dashboard

## Sensores
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

## Visão Geral
Projeto avançado do Open Roberta. Robô localiza fonte sonora por triangulação.

## Objetivos
- Processar sinais de áudio
- Comparar intensidades
- Implementar navegação autônoma

## Materiais
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

## Visão Geral
Projeto do Open Roberta Lab. Aprenda código Morse e comunicação digital.

## Objetivos
- Entender codificação de mensagens
- Usar arrays e strings
- Implementar comunicação via rádio

## Desafio Extra
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

## Visão Geral
Inspirado no Open Roberta. Calcule velocidade usando física e sensores.

## Objetivos
- Aplicar fórmula v = d/t
- Usar interrupções
- Medir tempo com precisão

## Aplicação
Crie um radar de velocidade para carrinhos de brinquedo!
`
    },
    {
        id: "introducao-raspberry-pi",
        title: "Primeiros Passos com Raspberry Pi",
        description: "Aprenda as bases da computação física usando o Raspberry Pi, configurando o sistema e controlando seus primeiros componentes.",
        tools: ["Raspberry Pi", "Python"],
        difficulty: "Intermediário",
        duration: "3 aulas",
        grade: "Ensino Médio",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
        ods: "ODS 9 - Inovação",
        content: `
# Primeiros Passos com Raspberry Pi

## Visão Geral
Diferente do Arduino, o Raspberry Pi é um computador completo. Neste projeto, os alunos aprendem a configurar o ambiente e realizar o controle básico de hardware.

## Objetivos de Aprendizagem
- Configurar o sistema operacional Raspberry Pi OS.
- Entender a diferença entre microcontrolador e microcomputador.
- Programar GPIOs usando a biblioteca RPi.GPIO ou gpiozero.

## Atividades
1. Instalação e boot do sistema.
2. Navegação básica no terminal Linux.
3. Hello World físico: Piscando um LED com Python.
`
    },
    {
        id: "retropie-console",
        title: "Console de Jogos RetroPie",
        description: "Transforme um Raspberry Pi em uma central de games clássicos, aprendendo sobre emulação, sistemas Linux e configuração de hardware.",
        tools: ["Raspberry Pi"],
        difficulty: "Muito Difícil",
        duration: "5 aulas",
        grade: "Ensino Médio e Técnico",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800", // Gaming/Hardware
        ods: "ODS 9 - Indústria, Inovação e Infraestrutura",
        bncc: ["EM13MAT315", "EM13LGG701"],
        content: `
# Console de Jogos com RetroPie

## 🎮 Visão Geral
Este é o projeto definitivo para entusiastas de hardware e software. Os alunos constroem uma estação de emulação completa, lidando com sistemas operacionais Linux, drivers de periféricos e a ética da preservação digital.

## 🎓 Objetivos de Aprendizagem
- **Sistemas Operacionais:** Entender como o Linux gerencia hardware e sistemas de arquivos.
- **Emulação vs. Simulação:** Discutir como o software pode mimetizar o hardware de consoles antigos.
- **Redes e Transferência:** Configurar conexões SSH ou Samba para gerenciar o sistema remotamente.

## 🛠️ Guia de Implementação (Nível Especialista)
### 1. Preparação da "Bios"
Utilize o **Raspberry Pi Imager** para gravar a imagem do RetroPie. Este processo apaga todos os dados do SD, então certifique-se de usar um cartão limpo.

### 2. Otimização de Performance
No menu de configuração, ajuste a memória de vídeo (VRAM). Para o Raspberry Pi 4, você pode rodar jogos de consoles mais modernos com fluidez.

### 3. Interface e Temas
Instale novos "Themes" através do menu do EmulationStation para mudar a cara do seu console. Sinta-se como se estivesse em um fliperama real!

## 📝 Avaliação e Ética
Discuta com a turma: Qual a importância de preservar jogos antigos? Por que existem diferentes formatos de arquivos para cada console?

## 🚀 Desafios de Engenharia
- **Case Personalizada:** Projete uma carcaça que comporte ventiladores de resfriamento (coolers) para evitar o superaquecimento durante longas sessões de jogo.
- **Arcade Portátil:** Tente alimentar o Raspberry Pi com uma PowerBank e conectar uma tela LCD pequena para criar um GameBoy gigante!
`
    },
    {
        id: "horta-iot-cloud",
        title: "Horta Inteligente IoT",
        description: "Monitore a umidade da sua horta de qualquer lugar do mundo usando o Arduino IoT Cloud e receba alertas no celular.",
        tools: ["Arduino", "IoT Cloud"],
        difficulty: "Intermediário",
        duration: "4 aulas",
        grade: "Ensino Fundamental II e Médio",
        image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=800",
        ods: "ODS 2 - Fome Zero",
        bncc: ["EF08TEC04", "EM13TEC04"],
        schematic: "https://docs.arduino.cc/static/219323c2a0ba-schematic.pdf",
        hardwareDiagram: "https://docs.arduino.cc/static/f16216628859-mkr-pinout.png",
        softwareFlow: "https://images.unsplash.com/photo-1454165833767-027ffea30c4b?auto=format&fit=crop&q=80&w=800",
        teacherGuide: {
            objective: "Explorar a automação aplicada à sustentabilidade e monitoramento remoto via IoT.",
            skills: ["Domínio de ferramentas cloud", "Eletrônica aplicada", "Análise de dados"],
            assessment: "O sistema envia dados corretamente para o dashboard e ativa a bomba no limiar definido?",
            hacksterLink: "https://www.hackster.io/mishraanurag/smart-garden-iot-cloud-8275e5"
        },
        stepImages: [
            "https://images.unsplash.com/photo-1592150621124-3c344a39a5ec?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1530836361253-219323c2a0ba?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1516216628859-9bccecca29ca?auto=format&fit=crop&q=80&w=800"
        ],
        content: `
# Horta Inteligente IoT (Official Cloud Project)

## 🌿 Visão Geral do Projeto
Este projeto utiliza a tecnologia **Arduino IoT Cloud** para criar um sistema de monitoramento agrícola inteligente. O objetivo é automatizar o cuidado com as plantas, garantindo que elas recebam água apenas quando necessário e permitindo que o usuário monitore a saúde do jardim de qualquer lugar do mundo através de um smartphone.

## 🔩 Materiais Necessários
- 1x **Arduino MKR WiFi 1010** ou **Arduino Nano 33 IoT**
- 1x **Sensor de Umidade do Solo** (Analógico)
- 1x **Módulo Relé 5V** (para controlar a bomba)
- 1x **Mini Bomba de Água Submersível**
- 1x Fonte de Alimentação 9V ou 12V
- Mangueira de silicone e reservatório de água

## 🛠️ Configuração da Arduino IoT Cloud

### 1. Criando a "Thing"
Acesse o portal [Arduino Cloud](https://create.arduino.cc/iot) e crie uma nova **Thing** chamada "Minha Horta". Associe sua placa (Device) através do assistente de configuração.

### 2. Definindo as Variáveis Cloud
Adicione as seguintes variáveis:
- \`umidade_solo\` (Tipo: Integer, Permissão: Read Only)
- \`bomba_status\` (Tipo: Boolean, Permissão: Read & Write)
- \`rega_automatica\` (Tipo: Boolean, Permissão: Read & Write)

### 3. Criando o Dashboard
Monte um painel visual com os seguintes widgets:
- **Gauge:** Conectado à variável \`umidade_solo\`.
- **Switch:** Conectado à variável \`bomba_status\`.
- **Messenger:** Para receber alertas de falta de água.

## ⚙️ Esquema de Ligação (Hardware)

1. **Sensor de Umidade:** VCC -> VCC, GND -> GND, Sinal -> Pino **A1**.
2. **Módulo Relé:** VCC -> VCC, GND -> GND, IN -> Pino **D2**.
3. **Bomba:** Conecte o fio positivo da bomba no terminal **Comum** (C) do relé e a fonte de energia no terminal **Normalmente Aberto** (NO). Isso garante que a bomba só ligue quando o Arduino enviar um sinal.

## 💻 Programação IoT

O código na Arduino Cloud é gerado automaticamente com os segredos de rede (WiFi), você só precisa preencher a lógica principal no \`thingProperties.h\` e no loop:

\`\`\`cpp
#include "thingProperties.h"

void setup() {
  Serial.begin(9600);
  initProperties();
  ArduinoCloud.begin(ArduinoIoTPreferredConnection);
  
  pinMode(2, OUTPUT); // Pino do Relé
  setDebugMessageLevel(2);
  ArduinoCloud.printDebugInfo();
}

void loop() {
  ArduinoCloud.update();
  
  // Leitura do Sensor
  int valorAnalogico = analogRead(A1);
  umidade_solo = map(valorAnalogico, 1023, 0, 0, 100); // Converte para %
  
  // Lógica de Rega Automática
  if (rega_automatica && umidade_solo < 30) {
    onBombaStatusChange(); // Liga a bomba
  }
}

void onBombaStatusChange()  {
  if (bomba_status) {
    digitalWrite(2, HIGH);
    Serial.println("Bomba Ativada via Cloud");
  } else {
    digitalWrite(2, LOW);
    Serial.println("Bomba Desligada");
  }
}
\`\`\`

## 🚀 Dicas de Uso
- **Calibração:** Mergulhe o sensor em um copo com água para ver o valor máximo e deixe secar para o valor mínimo. Ajuste a função \`map()\` se necessário.
- **Segurança:** Nunca deixe as conexões expostas à água. Use uma caixa estanque para proteger a eletrônica.
`
    },
    {
        id: "alarme-cloud-iot",
        title: "Segurança Residencial IoT",
        description: "Crie um sistema de alarme que avisa no seu dashboard se uma porta for aberta, usando sensores magnéticos e nuvem.",
        tools: ["Arduino", "IoT Cloud"],
        difficulty: "Intermediário",
        duration: "3 aulas",
        grade: "Ensino Médio",
        image: "arduino-alarm",
        ods: "ODS 11 - Cidades Inteligentes",
        bncc: ["EM13TEC05"],
        content: `
# Alarme Residencial via Cloud API

## 🏠 Visão Geral
Aprenda a aplicar a **API do Arduino IoT Cloud** em cenários de segurança patrimonial. O foco é na baixa latência e na confiabilidade da conexão para monitoramento de estados críticos.

## 🎓 Objetivos de Aprendizagem
- **Event-Driven Programming:** Entender como as funções \`onVariableChange\` agem como gatilhos para ações.
- **Log de Eventos:** Utilizar a nuvem para manter um histórico de quando o alarme foi acionado.
- **Segurança Digital:** Discutir a importância da criptografia em dispositivos IoT residenciais.

## 🛠️ Atividades Práticas
1. **Configuração de Hardware:** Use um sensor magnético (Reed Switch) e um Buzzer.
2. **Setup Cloud:** Crie uma variável \`alarme_ativo\` e uma \`intrusao_detectada\`.
3. **Dashboard:** Crie um painel com um botão grande de "PÂNICO" que ativa o buzzer remotamente.

## 💡 Dica Técnica (API Sync)
Use o método \`ArduinoCloud.update()\` com frequência no loop para garantir que o dispositivo e a nuvem estejam sempre sincronizados sem bloqueios de tempo (\`delay\` é proibido aqui, use \`millis\`).
`
    },
    {
        id: "api-rest-arduino",
        title: "Dashboard Web com API Cloud",
        description: "Aprenda a consumir dados do Arduino IoT Cloud em um site externo usando a API REST oficial (arduino.cc), criando sua própria interface personalizada.",
        tools: ["API Cloud", "Javascript", "Python"],
        difficulty: "Avançado",
        duration: "5 aulas",
        grade: "Ensino Médio e Técnico",
        image: "python",
        ods: "ODS 9 - Inovação",
        bncc: ["EM13TEC04"],
        content: `
# Dashboard Personalizado via API REST Arduino

## 🌐 Visão Geral
Nesta aula avançada, saímos do ambiente fechado dos Dashboards do Arduino e aprendemos a conectar nossos dados de hardware a qualquer lugar da internet usando a **API REST oficial (cloud-api.arduino.cc)**. É o passo final para transformar um projeto de robótica em uma solução de mercado.

## 🎓 Objetivos de Aprendizagem
- **Autenticação OAuth2:** Aprender como obter e usar IDs de cliente e Segredos para acesso seguro.
- **Requisições HTTP (GET/POST):** Dominar o consumo de endpoints de dados em tempo real.
- **Frontend Dinâmico:** Atualizar uma página HTML/JS automaticamente quando um valor no sensor físico mudar.

## 🛠️ Atividades da Jornada
1. **Credenciais API:** Acesse o painel de desenvolvedor no Arduino Cloud e gere uma chave de API para o seu usuário.
2. **Endpoint de Propriedades:** Use o comando \`fetch\` (Javascript) ou a biblioteca \`requests\` (Python) para ler o valor de uma Thing específica.
3. **Visualização Customizada:** Use a biblioteca **Chart.js** para criar gráficos de linha profissionais com os dados históricos que a API fornece.

## 💻 Exemplo de Chamada (Javascript)
\`\`\`javascript
const response = await fetch('https://api2.arduino.cc/iot/v2/things/{id}/properties/{id_property}/timeseries', {
  headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN }
});
const data = await response.json();
console.log("Histórico de Sensores:", data);
\`\`\`

## 📝 Reflexão Profissional
Como essa integração permite criar apps mobile nativos ou sistemas de gestão para empresas? Quais os limites de taxa (rate limits) da API gratuita?
`
    },
    {
        id: "radar-ultrassonico",
        title: "Radar de Estacionamento",
        description: "Recrie o sistema de sensores de ré de um carro usando um sensor ultrassônico e um buzzer para alertar a proximidade.",
        tools: ["Arduino", "C++"],
        difficulty: "Intermediário",
        duration: "3 aulas",
        grade: "Ensino Fundamental II (8º e 9º ano)",
        image: "https://images.unsplash.com/photo-1593344484962-796055d4a3a4?auto=format&fit=crop&q=80&w=800",
        ods: "ODS 9 - Indústria e Inovação",
        bncc: ["EF08TEC04", "EF09TEC01"],
        schematic: "https://docs.arduino.cc/static/radar-circuit-view.pdf",
        hardwareDiagram: "https://docs.arduino.cc/static/ultrasonic-wiring.png",
        softwareFlow: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
        teacherGuide: {
            objective: "Demonstrar a aplicação de sensores em sistemas de segurança e medir a velocidade de resposta humana.",
            skills: ["Física do som", "Lógica condicional", "Design de interface sonora"],
            assessment: "O tempo entre os bipes reduz proporcionalmente à distância medida?",
            hacksterLink: "https://www.hackster.io/akarsh98/arduino-uno-ultrasonic-radar-1-0-c6ee0d"
        },
        stepImages: [
            "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
        ],
        content: `
# Radar de Estacionamento (Automotive Guide)

## 🚙 Visão Geral do Projeto
Este projeto replica o sistema de auxílio ao estacionamento presente em carros modernos. Utilizando ondas de ultra-som, o radar mede a distância entre o para-choque do veículo e obstáculos, fornecendo alertas visuais (LEDs) e sonoros (Buzzer) que aumentam de intensidade conforme a colisão se aproxima.

## 🎓 Objetivos de Aprendizagem
- **Física das Ondas:** Entender o princípio do eco e a velocidade do som.
- **Lógica Progressiva:** Criar um sistema de alerta que "bipa" mais rápido conforme o objeto se aproxima.
- **Prototipagem de Segurança:** Discutir como sistemas redundantes evitam acidentes.

## 🔩 Materiais e Componentes
- 1x **Arduino Uno** ou **Nano**
- 1x **Sensor Ultrassônico HC-SR04**
- 1x **Buzzer Ativo** 5V
- 3x **LEDs** (Verde, Amarelo, Vermelho)
- 3x **Resistores de 220Ω**
- 1x Protoboard e Jumpers

## 🛠️ Passo a Passo da Montagem

### 1. Preparação do Sensor
O sensor HC-SR04 possui 4 pinos: VCC, Trig, Echo e GND. Instale-o na borda da protoboard voltado para fora, simulando a posição no para-choque do carro.

### 2. Semáforo de Alerta
Conecte os três LEDs em série. O **Verde** indica segurança (> 30cm), o **Amarelo** indica cautela (15cm a 30cm) e o **Vermelho** indica perigo iminente (< 15cm).

### 3. Alerta Sonoro
Conecte o Buzzer. A lógica será: quanto menor a distância, menor será o tempo entre os "beeps", criando um senso de urgência.

## ⚙️ Esquema de Ligação (Wiring)

- **HC-SR04:** Trig -> Pino 9 | Echo -> Pino 10
- **LED Verde:** Pino 2 (com resistor)
- **LED Amarelo:** Pino 3 (com resistor)
- **LED Vermelho:** Pino 4 (com resistor)
- **Buzzer:** Pino 5
- **GND e VCC:** Conectados aos respectivos barramentos da protoboard.

## 💻 Programação Técnica
\`\`\`cpp
#define trigPin 9
#define echoPin 10
#define buzzer 3

void loop() {
  digitalWrite(trigPin, LOW); delayMicroseconds(2);
  digitalWrite(trigPin, HIGH); delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  long duracao = pulseIn(echoPin, HIGH);
  int distancia = duracao / 58;
  
  if (distancia < 10) {
    tone(buzzer, 1000); // Som contínuo
  } else if (distancia < 30) {
    tone(buzzer, 1000); delay(100); noTone(buzzer); delay(100);
  }
}
\`\`\`
`
    },
    {
        id: "estacao-lcd-arduino",
        title: "Monitor Ambiental com LCD",
        description: "Crie uma estação que mostra temperatura e umidade em um display de cristal líquido (LCD), formatando dados profissionalmente.",
        tools: ["Arduino", "C++"],
        difficulty: "Básico",
        duration: "2 aulas",
        grade: "Ensino Fundamental II (6º e 7º ano)",
        image: "arduino-temp",
        ods: "ODS 13 - Ação Climática",
        bncc: ["EF06CI13", "EF07TEC02"],
        content: `
# Monitor Ambiental com LCD (Project Hub Edition)

## 🌡️ Visão Geral
Saia do Monitor Serial do computador e leve seus dados para um display físico! Este projeto ensina a usar bibliotecas externas para controlar periféricos de visualização, uma habilidade essencial para criar dispositivos independentes.

## 🎓 Objetivos de Aprendizagem
- **Bibliotecas:** Aprender a importar e usar a \`LiquidCrystal_I2C.h\`.
- **UX/UI para Hardware:** Decidir como organizar as informações em uma tela limitada de 16x2 caracteres.
- **Protocolos de Comunicação:** Uma introdução visual ao funcionamento do I2C (apenas 2 fios de dados).

## 🛠️ Montagem e Código
1. **Conexão I2C:** Ligue o SDA ao A4 e o SCL ao A5 do Arduino.
2. **Setup do Sensor:** O DHT11 deve ser conectado a um pino digital (ex: pino 2).
3. **Lógica de Loop:** Leia os dados a cada 2 segundos e use \`lcd.setCursor()\` para atualizar as linhas separadamente.

## 📝 Dica de Ouro
Use caracteres especiais! A biblioteca LCD permite criar o símbolo de grau (°) customizado para deixar seu design mais profissional.
`
    },
    {
        id: "cofre-eletronico-keypad",
        title: "Cofre com Senha Digital",
        description: "Construa um cofre funcional com teclado numérico e trava eletrônica (servo), protegendo seus objetos com código secreto.",
        tools: ["Arduino", "C++"],
        difficulty: "Avançado",
        duration: "5 aulas",
        grade: "Ensino Médio e Técnico",
        image: "arduino-robot",
        ods: "ODS 16 - Paz, Justiça e Instituições Eficazes",
        bncc: ["EM13TEC05"],
        content: `
# Cofre Digital com Keypad

## 🔐 Visão Geral
Este é um projeto clássico do Arduino Project Hub que envolve lógica de strings, arrays e controle de estado. Os alunos desenvolvem um sistema de segurança completo, simulando o funcionamento de fechaduras de hotéis ou bancos.

## 🎓 Objetivos de Aprendizagem
- **Manipulação de Arrays:** Armazenar e comparar sequências de caracteres digitadas pelo usuário.
- **Máquina de Estados:** Gerenciar os modos "Bloqueado", "Aguardando Senha", "Acesso Permitido" e "Senha Incorreta".
- **Mecânica de Trava:** Usar um servomotor para criar o movimento físico de trancar e destrancar.

## 📦 Componentes Chave
- Teclado de Membrana 4x4
- Servomotor SG90
- Display LCD 16x2 (I2C)
- LEDs de status (Verde e Vermelho)

## 🛠️ Desafio de Lógica
Implemente um sistema de "Tentativas Esgotadas". Se o usuário errar a senha 3 vezes, o sistema deve travar por 1 minuto e emitir um alarme sonoro constante.
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
