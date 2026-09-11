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
        teacherGuide: {
            objective: "Ensinar lógica de controle em malha fechada e calibração de sensores analógicos.",
            skills: ["Resolução de problemas", "Pensamento Algorítmico", "Colaboração"],
            assessment: "O robô consegue completar uma volta completa em menos de 30 segundos?"
        },
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
        teacherGuide: {
            objective: "Mostrar que um assistente baseado em regras responde por correspondência de texto, e não por compreensão.",
            skills: ["Condicionais encadeadas", "Manipulação de texto", "Leitura crítica de IA"],
            assessment: "O chatbot responde de forma diferente a duas perguntas previstas e dá uma resposta padrão para uma pergunta que ninguém programou?"
        },
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
        teacherGuide: {
            objective: "Ensinar controle de tempo e de sequência: o computador decidindo o que acontece e por quanto tempo.",
            skills: ["Sequência lógica", "Temporização", "Leitura de circuito simples"],
            assessment: "O ciclo verde, amarelo e vermelho se repete na ordem certa e nos tempos definidos, sem ninguém tocar no circuito?"
        },
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
        teacherGuide: {
            objective: "Introduzir coordenadas de tela e detecção de colisão a partir de um jogo que a turma já entende de olhar.",
            skills: ["Noção de coordenadas", "Detecção de colisão", "Teste e ajuste"],
            assessment: "A bola rebate nas bordas e na raquete, e o jogo reconhece quando ela passa direto?"
        },
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
        teacherGuide: {
            objective: "Tornar visível o campo magnético da Terra, e mostrar por que um sensor precisa ser calibrado antes de servir.",
            skills: ["Magnetismo terrestre", "Calibração de sensor", "Orientação espacial"],
            assessment: "Girando a placa, a indicação de Norte acompanha a de uma bússola comum colocada ao lado?"
        },
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
        teacherGuide: {
            objective: "Ensinar o ângulo como grandeza que se controla por código, ligando matemática e movimento mecânico.",
            skills: ["Ângulo e amplitude", "Controle de servomotor", "Montagem mecânica"],
            assessment: "O braço pega um objeto e o solta num ponto marcado, repetindo o movimento três vezes seguidas?"
        },
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
        image: "images/scratch.png",
        ods: "ODS 4 - Educação de Qualidade",
        bncc: ["EF15LP05", "EF15AR26"],
        teacherGuide: {
            objective: "Ensinar estrutura narrativa ramificada: cada escolha do leitor muda o caminho e o final da história.",
            skills: ["Escrita criativa", "Estrutura condicional", "Comunicação entre atores"],
            assessment: "As duas escolhas levam a finais diferentes, e dá para recomeçar a história sem recarregar a página?"
        },
        content: `
# História Interativa no Scratch

## Visão Geral
Crie uma história em que o leitor decide o que acontece: em momentos-chave, dois botões aparecem na tela e cada escolha leva a um final diferente. É o formato dos livros "escolha sua aventura", programado com cenários, diálogos e mensagens entre atores.

## Objetivos de Aprendizagem
- Estruturar uma narrativa com começo, conflito, escolhas e múltiplos finais.
- Usar transmissão de mensagens para coordenar cenas entre atores e cenários.
- Personalizar a história com uma variável (o nome do herói, digitado pelo leitor).

## Passo a passo
1. **Roteiro no papel:** desenhe a árvore da história antes de abrir o Scratch — cena 1 leva às cenas 2A ou 2B; cada uma leva a um final. Três cenas e dois finais já são suficientes.
2. **Cenários:** crie ou importe um pano de fundo por cena (floresta, caverna, castelo). Cada escolha transmite uma mensagem que troca o cenário.
3. **Herói com nome:** no início, use o bloco "pergunte ... e espere" para pedir o nome do leitor e guarde a resposta numa variável "herói". Use "junte ... com ..." para colocar o nome dentro dos diálogos.
4. **Botões de escolha:** crie dois atores-botão ("Entrar na caverna" e "Seguir pela floresta"). Quando clicados, cada um transmite a mensagem da sua cena.
5. **Finais:** cada final mostra o último cenário, um diálogo de encerramento e o botão "Recomeçar" (que transmite a mensagem da cena 1).

## Estrutura de mensagens (exemplo)
\`\`\`scratch
quando bandeira verde clicada
  pergunte [Qual é o nome do herói?] e espere
  defina [herói] para (resposta)
  transmita [cena1]

quando eu receber [cena1]
  mude cenário para [floresta]
  diga (junte [herói] encontrou uma bifurcação... ) por 3 segundos

quando este ator for clicado  // botão "Caverna"
  transmita [cenaCaverna]

quando eu receber [finalBom]
  mude cenário para [tesouro]
  diga (junte [Parabéns, ] (junte (herói) [! Você achou o tesouro!])) por 4 segundos
\`\`\`

## Avaliação
Cada dupla apresenta sua história para outra dupla jogar. A turma avalia: as duas escolhas levam a lugares diferentes? O nome do herói aparece nos diálogos? Existe pelo menos um final bom e um final surpreendente?

## Desafios Extras
- **Trilha sonora:** adicione um som diferente por cena (suspense na caverna, alegria no tesouro).
- **Placar de coragem:** crie uma variável "coragem" que sobe ou desce conforme as escolhas, e mude o final de acordo com o valor dela.
`
    },
    {
        id: "sensor-umidade-solo",
        title: "Sensor de Umidade do Solo",
        description: "Construa um sensor para monitorar a umidade da terra e criar um sistema de irrigação automática.",
        tools: ["Arduino", "C++"],
        difficulty: "Intermediário",
        duration: "4 aulas",
        grade: "Ensino Fundamental II (7º e 8º ano)",
        image: "images/arduino.png",
        ods: "ODS 2 - Fome Zero e Agricultura Sustentável",
        bncc: ["EF07CI08"],
        teacherGuide: {
            objective: "Ensinar leitura analógica, calibração de sensores e automação aplicada à agricultura sustentável.",
            skills: ["Investigação científica", "Pensamento Algorítmico", "Sustentabilidade"],
            assessment: "O sistema distingue solo seco de solo úmido e aciona o alerta/irrigação no limite calibrado pela turma?"
        },
        content: `
# Sensor de Umidade do Solo com Arduino

## Visão Geral
Monte um monitor de horta: um sensor de umidade espetado na terra lê o quanto o solo está seco ou molhado, o Arduino decide se a planta precisa de água e acende um alerta (ou liga uma minibomba). É o projeto-ponte entre eletrônica e ciências da natureza — e a base do projeto "Sistema de Irrigação Inteligente" da Biblioteca.

## Objetivos de Aprendizagem
- **Eletrônica analógica:** ler valores contínuos (0–1023) com \`analogRead\` e converter em porcentagem com \`map\`.
- **Método científico:** calibrar o sensor medindo dois extremos conhecidos (ar seco e água) antes de programar os limites.
- **Automação:** transformar uma medida em decisão automática com histerese simples (liga num limite, desliga em outro).

## Materiais
- 1x Arduino Uno + cabo USB
- 1x Sensor de umidade do solo (higrômetro com módulo comparador)
- 1x LED vermelho + resistor 220Ω (alerta "precisa de água")
- 1x LED verde + resistor 220Ω (solo ok)
- Jumpers, protoboard e um vaso com terra

## Montagem Passo a Passo
1. **Sensor:** VCC → 5V, GND → GND, saída analógica (A0 do módulo) → pino A0 do Arduino.
2. **LEDs:** LED verde → pino digital 8 (com resistor), LED vermelho → pino digital 9 (com resistor), catodos → GND.
3. **Instalação:** espete a sonda na terra do vaso até metade. Não enterre o módulo eletrônico — só a sonda.

## Calibração (antes de programar!)
Com este sketch temporário, anote os valores do Monitor Serial:
\`\`\`cpp
void setup() {
  Serial.begin(9600);
}

void loop() {
  Serial.println(analogRead(A0));
  delay(500);
}
\`\`\`
1. Segure a sonda **no ar** e anote o valor (ex: ~950) — esse é o "100% seco".
2. Mergulhe só a ponta da sonda **num copo d'água** e anote (ex: ~350) — esse é o "100% molhado".
3. Use esses dois números no \`map\` do código final — cada sensor e cada solo têm valores próprios, copiar número pronto da internet dá leitura errada.

## Código base
\`\`\`cpp
const int SENSOR_PIN = A0;
const int LED_OK = 8;
const int LED_SECO = 9;

// Troque pelos valores medidos na calibração da sua turma:
const int VALOR_NO_AR = 950;   // solo totalmente seco
const int VALOR_NA_AGUA = 350; // solo encharcado

void setup() {
  pinMode(LED_OK, OUTPUT);
  pinMode(LED_SECO, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int leitura = analogRead(SENSOR_PIN);
  // Converte para porcentagem (note a ordem invertida: valor alto = seco)
  int umidade = map(leitura, VALOR_NO_AR, VALOR_NA_AGUA, 0, 100);
  umidade = constrain(umidade, 0, 100);
  Serial.println(umidade);

  if (umidade < 30) {
    digitalWrite(LED_SECO, HIGH); // precisa de água!
    digitalWrite(LED_OK, LOW);
  } else {
    digitalWrite(LED_SECO, LOW);
    digitalWrite(LED_OK, HIGH);
  }
  delay(1000);
}
\`\`\`

## Avaliação
Cada grupo apresenta sua tabela de calibração (valor no ar, valor na água) e demonstra os dois LEDs trocando ao regar o vaso de verdade. Pergunta oral: por que cada grupo tem números de calibração diferentes?

## Desafios Extras
- **Irrigação automática:** troque o LED vermelho por um módulo relé + minibomba 5V — quando a umidade cai, a bomba rega sozinha por 5 segundos.
- **Diário da horta:** anote a umidade todo dia durante uma semana e faça um gráfico — vira dado real de ciências.
`
    },
    {
        id: "pedometro-microbit",
        title: "Pedômetro com Micro:bit",
        description: "Use o acelerômetro do Micro:bit para contar passos e criar um desafio de caminhada na escola.",
        tools: ["Micro:bit", "Python"],
        difficulty: "Intermediário",
        duration: "2 aulas",
        grade: "Ensino Fundamental II (6º e 7º ano)",
        image: "images/microbit.png",
        ods: "ODS 3 - Saúde e Bem-Estar",
        bncc: ["EF06CI06"],
        teacherGuide: {
            objective: "Ensinar a transformar movimento físico em dado contável, e a discutir o erro de medição do sensor.",
            skills: ["Leitura de acelerômetro", "Noção de erro de medição", "Autocuidado e saúde"],
            assessment: "Andando 20 passos contados em voz alta, a contagem do aparelho fica a no máximo dois passos do número real?"
        },
        content: `
# Pedômetro com Micro:bit (MicroPython)

## Visão Geral
Transforme o Micro:bit num contador de passos de verdade: o acelerômetro embutido detecta o "balanço" de cada passo, o programa soma 1 a cada detecção e mostra o total na matriz de LEDs. Prenda a placa no bolso ou no tênis e faça um desafio de caminhada com a turma — saúde e dados reais na mesma aula.

## Objetivos de Aprendizagem
- **Sensores:** entender que o acelerômetro mede a força em 3 eixos (X, Y, Z), incluindo a gravidade.
- **Detecção de eventos:** transformar um sinal contínuo (balanço) num evento discreto (1 passo) com um limiar.
- **Python real:** escrever o projeto em MicroPython, a mesma linguagem usada em ciência de dados e automação.

## Passo a passo
1. **Editor Python:** abra o editor Python do Micro:bit (python.microbit.org), que também tem simulador para testar sem a placa.
2. **Entenda o gesto pronto:** o MicroPython tem \`accelerometer.was_gesture('shake')\`, que detecta um balanço — cada passo com a placa no bolso gera um balanço detectável.
3. **Contador:** crie a variável \`passos\`, some 1 a cada gesto detectado e mostre o valor na tela.
4. **Zerar:** use o botão B para zerar o contador (com confirmação visual) e o botão A para mostrar o total atual.
5. **Na placa:** grave o arquivo .hex, prenda o Micro:bit no cadarço ou no bolso com fita, e caminhe 20 passos contando mentalmente para comparar com o número da placa.

## Código base (MicroPython)
\`\`\`python
from microbit import *

passos = 0
display.show(passos)

while True:
    # Cada balanço detectado = 1 passo
    if accelerometer.was_gesture('shake'):
        passos += 1
        display.show(passos)
    # Botão A: mostra o total atual
    if button_a.was_pressed():
        display.scroll(passos)
    # Botão B: zera o contador
    if button_b.was_pressed():
        passos = 0
        display.show(passos)
    sleep(100)
\`\`\`

> **Calibração com o corpo:** caminhe 20 passos contando de verdade e compare com a placa. Se contar a mais (balanço do braço conta duplo), prenda a placa mais firme; se contar a menos, caminhe marcando mais o passo. Discutir esse erro de medição faz parte da aula.

## Avaliação
Desafio da turma: volta completa no pátio — cada aluno anota os passos da placa e estima o comprimento médio do próprio passo (distância total ÷ passos). Quem chega mais perto da distância real medida com trena?

## Desafios Extras
- **Meta diária:** adicione uma meta (ex: 100 passos) — quando atingir, o Micro:bit mostra um ícone de troféu e toca uma melodia.
- **Detector de sedentarismo:** se passar 60 segundos sem nenhum passo, mostre um ícone "levante-se" como lembrete.
`
    },
    {
        id: "calculadora-scratch",
        title: "Calculadora Interativa",
        description: "Desenvolva uma calculadora funcional no Scratch com operações básicas e interface amigável.",
        tools: ["Scratch", "Blocos"],
        difficulty: "Básico",
        duration: "2 aulas",
        grade: "Ensino Fundamental II (6º ano)",
        image: "images/scratch.png",
        ods: "ODS 4 - Educação de Qualidade",
        bncc: ["EF06MA03"],
        teacherGuide: {
            objective: "Ensinar variáveis e condicionais encadeadas usando as quatro operações, que a turma já domina no papel.",
            skills: ["Uso de variáveis", "Condicionais encadeadas", "Interface pensada para quem usa"],
            assessment: "As quatro operações devolvem o resultado certo, e a divisão por zero mostra um aviso em vez de travar?"
        },
        content: `
# Calculadora Interativa no Scratch

## Visão Geral
Desenvolva uma calculadora que pergunta dois números e a operação desejada, calcula o resultado e o exibe na tela. No caminho, a turma pratica variáveis, operadores matemáticos e condicionais encadeadas — os mesmos blocos usados depois em jogos com placar e vidas.

## Objetivos de Aprendizagem
- Guardar valores digitados pelo usuário em variáveis ("número 1", "número 2", "resultado").
- Usar os operadores de soma, subtração, multiplicação e divisão da categoria Operadores.
- Tratar um caso de erro real: divisão por zero.

## Passo a passo
1. **Variáveis:** crie três variáveis — "número 1", "número 2" e "resultado". Deixe-as visíveis no palco durante os testes.
2. **Entrada de dados:** com "pergunte ... e espere", peça o primeiro número e guarde a resposta em "número 1"; repita para o segundo número.
3. **Escolha da operação:** pergunte "Qual operação? (+, -, x, /)" e guarde em uma variável "operação".
4. **Condicionais encadeadas:** use blocos "se ... então, senão" aninhados para comparar a operação digitada e calcular o resultado correspondente.
5. **Exibição:** mostre o resultado com o bloco "diga ... por 2 segundos", montando a frase com "junte" (ex: "7 + 5 = 12").

## Estrutura dos blocos
\`\`\`scratch
quando bandeira verde clicada
  pergunte [Digite o primeiro número:] e espere
  defina [número 1] para (resposta)
  pergunte [Digite o segundo número:] e espere
  defina [número 2] para (resposta)
  pergunte [Operação? (+, -, x, /)] e espere
  defina [operação] para (resposta)
  se <(operação) = [+]> então
    defina [resultado] para ((número 1) + (número 2))
  senão
    se <(operação) = [-]> então
      defina [resultado] para ((número 1) - (número 2))
    senão
      se <(operação) = [x]> então
        defina [resultado] para ((número 1) * (número 2))
      senão
        se <(operação) = [/]> então
          se <(número 2) = [0]> então
            diga [Não é possível dividir por zero!] por 2 segundos
            pare [este script]
          fim
          defina [resultado] para ((número 1) / (número 2))
  diga (junte (junte (junte (junte (número 1) [ ] ) (operação)) [ = ]) (resultado)) por 3 segundos
\`\`\`

## Avaliação
Teste em duplas: cada aluno digita 5 contas (incluindo uma divisão por zero de propósito) e confere se o resultado bate com o cálculo mental ou com a calculadora do celular. Vale ponto extra explicar por que a divisão por zero precisa de um tratamento especial.

## Desafios Extras
- **Potência e resto:** adicione as operações de potência e resto da divisão usando os blocos de Operadores.
- **Modo prova:** crie uma variável "pontos" — a calculadora sorteia uma conta, o usuário responde, e ganha 1 ponto por acerto em 10 rodadas.
`
    },
    {
        id: "alarme-distancia",
        title: "Alarme de Proximidade",
        description: "Crie um alarme que dispara quando algo se aproxima usando sensor ultrassônico e buzzer.",
        tools: ["Arduino", "C++"],
        difficulty: "Básico",
        duration: "2 aulas",
        grade: "Ensino Fundamental II (7º ano)",
        image: "images/arduino.png",
        ods: "ODS 9 - Inovação",
        bncc: ["EF07TEC01"],
        teacherGuide: {
            objective: "Ensinar medição de distância com sensor ultrassônico e resposta proporcional com tons de buzzer.",
            skills: ["Pensamento Algorítmico", "Resolução de problemas", "Medidas e grandezas"],
            assessment: "O alarme muda de comportamento em pelo menos 3 faixas de distância diferentes?"
        },
        content: `
# Alarme de Proximidade com Arduino

## Visão Geral
Monte um "radar de estacionamento" de brinquedo: um sensor ultrassônico HC-SR04 mede a distância até o objeto mais próximo e um buzzer apita cada vez mais rápido conforme algo se aproxima — igual ao sensor de ré dos carros. É a primeira vez que a turma vê um sensor que devolve um número contínuo, não só ligado/desligado.

## Objetivos de Aprendizagem
- **Eletrônica:** ligar o sensor HC-SR04 (VCC, GND, Trig, Echo) e um buzzer ativo ao Arduino.
- **Física aplicada:** entender que o sensor mede o tempo de ida e volta do som e converte em distância.
- **Lógica proporcional:** transformar uma medida contínua em faixas de comportamento (longe, perto, muito perto).

## Materiais
- 1x Arduino Uno + cabo USB
- 1x Sensor ultrassônico HC-SR04
- 1x Buzzer ativo 5V
- Jumpers e protoboard

## Montagem Passo a Passo
1. **Sensor:** VCC → 5V, GND → GND, Trig → pino digital 9, Echo → pino digital 10.
2. **Buzzer:** pino positivo (+) → pino digital 8, pino negativo (−) → GND.
3. **Posicionamento:** aponte o sensor para uma área livre da mesa — ele enxerga num cone de cerca de 15° e mede de 2 cm até 4 m.

## Código base
\`\`\`cpp
const int TRIG_PIN = 9;
const int ECHO_PIN = 10;
const int BUZZER_PIN = 8;

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // Dispara o pulso ultrassônico
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // Mede o tempo de eco e converte em cm (velocidade do som ~0,034 cm/us, ida e volta)
  long duracao = pulseIn(ECHO_PIN, HIGH);
  float distancia = duracao * 0.034 / 2;
  Serial.println(distancia);

  if (distancia < 20) {
    // Muito perto: apito contínuo e agudo
    tone(BUZZER_PIN, 1200);
  } else if (distancia < 50) {
    // Perto: bipes rápidos
    tone(BUZZER_PIN, 800);
    delay(100);
    noTone(BUZZER_PIN);
    delay(100);
  } else if (distancia < 100) {
    // Longe: bipes espaçados
    tone(BUZZER_PIN, 600);
    delay(100);
    noTone(BUZZER_PIN);
    delay(400);
  } else {
    noTone(BUZZER_PIN);
    delay(200);
  }
}
\`\`\`

> **Leitura do Monitor Serial:** abra o Monitor Serial e aproxime a mão do sensor. Os números caem em tempo real — é a depuração mais direta possível: o aluno vê o dado bruto antes de qualquer lógica.

## Avaliação
Cada grupo demonstra o alarme com a mão em 3 distâncias (ex: 80 cm, 40 cm, 10 cm) e explica qual faixa do código foi ativada em cada uma. Pergunta oral: por que dividimos o tempo por 2 no cálculo?

## Desafios Extras
- **Semáforo de distância:** troque o buzzer por 3 LEDs (verde/amarelo/vermelho), um por faixa — o mesmo circuito lógico, outra saída.
- **Zona silenciosa:** adicione um botão que liga/desliga o alarme (modo "silencioso"), como os sensores de ré reais têm.
`
    },
    {
        id: "jogo-memoria-microbit",
        title: "Jogo da Memória LED",
        description: "Recrie o clássico jogo Genius/Simon usando os LEDs e botões do Micro:bit.",
        tools: ["Micro:bit", "Blocos"],
        difficulty: "Intermediário",
        duration: "3 aulas",
        grade: "Ensino Fundamental II (6º ao 8º ano)",
        image: "images/microbit.png",
        ods: "ODS 4 - Educação de Qualidade",
        bncc: ["EF06MA16"],
        teacherGuide: {
            objective: "Ensinar a guardar e comparar uma sequência que cresce, unindo memória de curto prazo e lógica de lista.",
            skills: ["Sequência e lista", "Comparação de padrões", "Persistência diante do erro"],
            assessment: "A sequência ganha um sinal a cada acerto, e o jogo termina no primeiro erro do jogador?"
        },
        content: `
# Jogo da Memória LED (Genius) no Micro:bit

## Visão Geral
Recrie o clássico Genius/Simon: o Micro:bit mostra uma sequência de sinais que cresce a cada rodada, e o jogador precisa repetir a sequência exatamente. São 4 sinais possíveis — botão A, botão B, sacudir e inclinar — que combinam entrada física, memória e lógica de comparação, tudo sem nenhum componente externo.

## Objetivos de Aprendizagem
- **Listas:** guardar a sequência secreta numa lista e comparar posição por posição com a jogada do jogador.
- **Aleatoriedade:** gerar cada novo passo da sequência com "escolher aleatório".
- **Máquina de estados:** organizar o jogo em fases (mostrar sequência → aguardar jogada → verificar → próxima rodada ou fim de jogo).

## Os 4 sinais
| Número | Sinal | Como mostrar | Como o jogador responde |
|---|---|---|---|
| 1 | Botão A | Seta para esquerda | Aperta o botão A |
| 2 | Botão B | Seta para direita | Aperta o botão B |
| 3 | Sacudir | Ícone "surpreso" | Sacode a placa |
| 4 | Inclinar | Seta para baixo | Inclina a placa |

## Passo a passo (MakeCode, blocos)
1. **Variáveis e lista:** crie a lista "sequência", a variável "rodada" (começa em 0) e a variável "posição".
2. **Nova rodada:** ao iniciar e a cada acerto completo, some 1 à rodada, adicione "escolher aleatório 1 a 4" ao fim da lista e chame a função "mostrar sequência".
3. **Mostrar sequência:** para cada item da lista, exiba o ícone correspondente por 500 ms com pausa de 300 ms entre eles — o jogador só observa.
4. **Ler a jogada:** zere "posição"; a cada gesto do jogador (botão A, botão B, sacudir, inclinar), converta em número (1–4) e compare com o item da lista na "posição" atual.
5. **Verificar:** se acertar a sequência inteira, toque melodia de vitória e comece a próxima rodada; se errar qualquer item, mostre "X", exiba a pontuação (rodada − 1) e reinicie.

## Estrutura dos blocos (resumo)
\`\`\`
ao iniciar
  definir rodada para 0
  apagar lista [sequência]
  chamar [nova rodada]

função [nova rodada]
  mudar rodada por 1
  adicionar (escolher aleatório 1 a 4) à lista [sequência]
  chamar [mostrar sequência]

função [mostrar sequência]
  para cada item da lista [sequência]
    mostrar ícone do sinal (item)
    pausar 500 ms
    limpar tela
    pausar 300 ms

ao pressionar botão [A]  →  chamar [tentativa] com 1
ao pressionar botão [B]  →  chamar [tentativa] com 2
ao [sacudir]             →  chamar [tentativa] com 3
ao [inclinar]            →  chamar [tentativa] com 4
\`\`\`

## Avaliação
Torneio em duplas: um joga, o outro anota a rodada máxima alcançada. Depois trocam. A dupla registra as duas pontuações e explica para a turma onde o programa "decide" entre vitória e derrota (a comparação na função de tentativa).

## Desafios Extras
- **Modo rápido:** a cada 3 rodadas, diminua o tempo de exibição (500 → 350 → 250 ms) usando uma variável "velocidade".
- **Recorde salvo:** guarde a maior pontuação numa variável e mostre o recorde ao ligar a placa, antes de começar.
`
    },
    {
        id: "animacao-stop-motion",
        title: "Animação Stop Motion",
        description: "Crie uma animação quadro a quadro no Scratch, aprendendo sobre movimento e sequências.",
        tools: ["Scratch", "Blocos"],
        difficulty: "Intermediário",
        duration: "4 aulas",
        grade: "Ensino Fundamental I (4º e 5º ano)",
        image: "images/scratch.png",
        ods: "ODS 4 - Educação de Qualidade",
        bncc: ["EF15AR04", "EF15AR26"],
        teacherGuide: {
            objective: "Ensinar que movimento na tela é ilusão criada por quadros em sequência, com tempo de espera entre eles.",
            skills: ["Noção de quadro e tempo", "Expressão visual", "Planejamento de roteiro"],
            assessment: "A animação tem pelo menos oito quadros e o movimento corre sem salto perceptível entre um e outro?"
        },
        content: `
# Animação Stop Motion no Scratch

## Visão Geral
Stop motion é a técnica de animar fotografando pequenos movimentos quadro a quadro — a mesma usada em filmes como "A Fuga das Galinhas". No Scratch, cada "foto" é uma fantasia do ator, e um loop com espera curta cria a ilusão de movimento. A turma aprende taxa de quadros, roteiro e sincronia entre imagem e som.

## Objetivos de Aprendizagem
- Entender taxa de quadros: quantos quadros por segundo criam um movimento suave.
- Planejar uma cena com roteiro e storyboard antes de animar.
- Sincronizar falas, efeitos sonoros e música com a animação.

## Passo a passo
1. **Storyboard no papel:** divida a história em 4 a 6 quadros e desenhe o que acontece em cada um. Defina também quem fala e que som toca.
2. **Fantasias como quadros:** desenhe o personagem no editor de fantasias e duplique a fantasia várias vezes, mudando um pouquinho a posição em cada cópia (braço levantando, perna andando).
3. **Loop de animação:** use "repita" ou "sempre" com "próxima fantasia" e "espere 0,1 segundos" — 0,1 s por quadro equivale a 10 quadros por segundo, um bom ponto de partida.
4. **Cenário e falas:** troque o pano de fundo por cena e use "diga ... por ... segundos" combinado com o tempo da animação.
5. **Som:** grave a narração com o microfone (aba Sons → gravar) ou escolha efeitos da biblioteca, e dispare cada som no quadro certo com "toque o som ... até o fim".

## Estrutura dos blocos
\`\`\`scratch
quando bandeira verde clicada
  mude cenário para [parque]
  mostre-se
  repita (10)
    próxima fantasia
    espere (0.1) segundos
  fim
  diga [E assim o robô aprendeu a andar!] por 2 segundos
  toque o som [fanfarra] até o fim
\`\`\`

> **Taxa de quadros na prática:** peça para testarem "espere 0,5 segundos" (2 quadros por segundo — movimento travado) contra "espere 0,05 segundos" (20 quadros por segundo — suave, mas exige muito mais fantasias). A turma descobre sozinha o compromisso entre suavidade e trabalho.

## Avaliação
Festival de curtas: cada grupo exibe sua animação (30 a 60 segundos) e a turma avalia com três critérios — a história tem começo, meio e fim? O movimento parece contínuo? O som combina com a cena?

## Desafios Extras
- **Efeito de câmera:** mova o cenário (não o personagem) para simular uma câmera que acompanha a ação.
- **Créditos finais:** crie uma cena de encerramento com os nomes da equipe subindo pela tela, usando "mude y em ..." em loop.
`
    },
    {
        id: "termometro-digital",
        title: "Termômetro Digital",
        description: "Construa um termômetro usando sensor de temperatura e display LCD para mostrar os valores.",
        tools: ["Arduino", "C++"],
        difficulty: "Básico",
        duration: "2 aulas",
        grade: "Ensino Fundamental II (6º e 7º ano)",
        image: "images/arduino.png",
        ods: "ODS 13 - Ação Contra Mudança do Clima",
        bncc: ["EF06CI13"],
        teacherGuide: {
            objective: "Ensinar conversão de leitura analógica em grandeza física (temperatura) e exibição em faixas com LEDs.",
            skills: ["Grandezas e medidas", "Pensamento Algorítmico", "Investigação científica"],
            assessment: "O termômetro exibe a temperatura correta e os LEDs indicam a faixa certa (frio, agradável, quente)?"
        },
        content: `
# Termômetro Digital com Arduino

## Visão Geral
Construa um termômetro eletrônico: um sensor LM35 mede a temperatura ambiente, o Arduino converte a leitura em graus Celsius e mostra o valor no Monitor Serial, enquanto 3 LEDs indicam a faixa (frio, agradável, quente). É um projeto de instrumentação real — o mesmo princípio dos termômetros digitais de farmácia.

## Objetivos de Aprendizagem
- **Conversão de unidades:** transformar o número bruto do conversor analógico-digital (0–1023) em graus Celsius com uma fórmula.
- **Faixas e limites:** usar condicionais encadeadas para classificar uma medida contínua em categorias.
- **Clima e dados:** relacionar a medição com discussões sobre temperatura, conforto térmico e mudanças climáticas.

## Materiais
- 1x Arduino Uno + cabo USB
- 1x Sensor de temperatura LM35
- 3x LEDs (azul, verde, vermelho) + 3x resistores 220Ω
- Jumpers e protoboard

## Montagem Passo a Passo
1. **LM35 (olhando a face plana com as pernas para baixo, da esquerda para a direita):** perna 1 (VCC) → 5V, perna 2 (saída) → pino A0, perna 3 (GND) → GND.
2. **LEDs:** azul → pino 8, verde → pino 9, vermelho → pino 10 (todos com resistor em série), catodos → GND.
3. **Atenção:** confira as pernas do LM35 duas vezes antes de ligar — inverter VCC e GND danifica o sensor.

## Código base
\`\`\`cpp
const int SENSOR_PIN = A0;
const int LED_FRIO = 8;      // azul
const int LED_OK = 9;        // verde
const int LED_QUENTE = 10;   // vermelho

void setup() {
  pinMode(LED_FRIO, OUTPUT);
  pinMode(LED_OK, OUTPUT);
  pinMode(LED_QUENTE, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int leitura = analogRead(SENSOR_PIN);
  // LM35 entrega 10mV por ºC: converte 0-1023 para 0-5V e depois para ºC
  float tensao = leitura * 5.0 / 1023.0;
  float temperatura = tensao * 100.0;
  Serial.println(temperatura);

  digitalWrite(LED_FRIO, LOW);
  digitalWrite(LED_OK, LOW);
  digitalWrite(LED_QUENTE, LOW);

  if (temperatura < 18) {
    digitalWrite(LED_FRIO, HIGH);   // frio
  } else if (temperatura <= 28) {
    digitalWrite(LED_OK, HIGH);     // agradável
  } else {
    digitalWrite(LED_QUENTE, HIGH); // quente
  }
  delay(1000);
}
\`\`\`

> **Teste com o corpo:** segure o LM35 entre os dedos por 30 segundos e observe a temperatura subir no Monitor Serial até perto dos 36–37 °C. É a prova mais convincente de que o instrumento mede de verdade.

## Avaliação
Cada grupo registra a temperatura da sala, do pátio (sol e sombra) e da mão fechada, e apresenta os três valores com os LEDs correspondentes. Pergunta oral: de onde vem o "100.0" da fórmula? (Resposta: o LM35 entrega 10 mV por grau, então 1 V = 100 °C.)

## Desafios Extras
- **Display LCD:** troque o Monitor Serial por um display LCD 16x2 com módulo I2C (biblioteca LiquidCrystal_I2C) e mostre a temperatura com uma casa decimal.
- **Alerta de calor:** adicione um buzzer que apita quando a temperatura passa de 35 °C, como os alertas de insolação.
`
    },
    {
        id: "carro-autonomo-nepo",
        title: "Carro Autônomo com NEPO",
        description: "Programe um carro que desvia de obstáculos usando sensor ultrassônico e programação visual NEPO (Open Roberta).",
        tools: ["Arduino", "NEPO", "Blocos"],
        difficulty: "Avançado",
        duration: "6 aulas",
        grade: "Ensino Fundamental II (8º e 9º ano)",
        ods: "ODS 9 - Indústria e Inovação",
        bncc: ["EF08TEC04", "EF09TEC01"],
        teacherGuide: {
            objective: "Ensinar o laço fechado entre sensor e ação: medir, decidir e agir, repetidamente e sem intervenção humana.",
            skills: ["Laço de decisão", "Programação em blocos NEPO", "Calibração de distância"],
            assessment: "O carro percorre dois metros com dois obstáculos no caminho sem encostar em nenhum?"
        },
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
        ods: "ODS 4 - Educação de Qualidade",
        bncc: ["EF06CI04", "EF15AR13"],
        teacherGuide: {
            objective: "Ensinar a mapear uma grandeza contínua, a luz, em faixas discretas que viram notas musicais.",
            skills: ["Leitura de sensor analógico", "Faixas e limiares", "Expressão musical"],
            assessment: "Aproximando e afastando a mão do sensor, saem pelo menos três alturas de som distintas e previsíveis?"
        },
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
        ods: "ODS 4 - Educação de Qualidade",
        bncc: ["EF04MA27"],
        teacherGuide: {
            objective: "Introduzir aleatoriedade e resposta a evento físico, com um objeto que a turma já usa em jogos.",
            skills: ["Número aleatório", "Evento de movimento", "Noção de probabilidade"],
            assessment: "Em vinte sacudidas, saem apenas números de 1 a 6 e aparece mais de um valor diferente?"
        },
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
        ods: "ODS 9 - Inovação",
        bncc: ["EM13TEC03", "EM13MAT307"],
        teacherGuide: {
            objective: "Ligar coordenadas cartesianas a movimento mecânico: o desenho planejado vira trajetória no papel.",
            skills: ["Plano cartesiano", "Controle coordenado de motores", "Precisão mecânica"],
            assessment: "O robô desenha um quadrado com os quatro lados visivelmente iguais e os cantos fechados?"
        },
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
        ods: "ODS 2 - Fome Zero",
        bncc: ["EF07CI08", "EF08TEC04"],
        teacherGuide: {
            objective: "Ensinar limiar de acionamento: o sistema decide sozinho quando agir, a partir de um valor de referência.",
            skills: ["Limiar de decisão", "Leitura de umidade do solo", "Consciência sobre uso de água"],
            assessment: "A bomba liga com o sensor em solo seco e desliga quando o solo molha, sem ficar ligando e desligando sem parar?"
        },
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
        ods: "ODS 11 - Cidades Inteligentes",
        bncc: ["EF08TEC04"],
        teacherGuide: {
            objective: "Ensinar a inferir direção pela ordem em que dois sensores são acionados, e não apenas a contar eventos.",
            skills: ["Ordem de eventos", "Lógica de entrada e saída", "Leitura de dados de ocupação"],
            assessment: "A contagem sobe quando alguém entra, desce quando sai, e volta a zero depois de uma entrada e uma saída?"
        },
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
        ods: "ODS 4 - Educação de Qualidade",
        bncc: ["EF06MA16"],
        teacherGuide: {
            objective: "Ensinar a medir o intervalo entre dois eventos, transformando tempo de reação em número comparável.",
            skills: ["Medição de tempo", "Leitura de evento de botão", "Comparação de resultados"],
            assessment: "O jogo mostra um tempo diferente a cada rodada e ignora quem aperta o botão antes do sinal acender?"
        },
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
        ods: "ODS 13 - Ação Climática",
        bncc: ["EM13TEC04", "EM13CNT301"],
        teacherGuide: {
            objective: "Ensinar leitura simultânea de vários sensores e a interpretar o conjunto, não cada número isolado.",
            skills: ["Leitura de múltiplos sensores", "Interpretação de dados ambientais", "Argumentação com evidência"],
            assessment: "Com a sala fechada e a turma reunida perto do sensor, os valores mudam de forma coerente e voltam ao normal depois de abrir a janela?"
        },
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
        ods: "ODS 9 - Inovação",
        bncc: ["EM13TEC03"],
        teacherGuide: {
            objective: "Ensinar a comparar dois sinais para inferir posição, princípio usado em localização por som e por rádio.",
            skills: ["Comparação de sinais", "Noção de intensidade sonora", "Depuração de leitura ruidosa"],
            assessment: "O robô vira para o lado de onde veio o som em pelo menos quatro de cinco tentativas?"
        },
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
        ods: "ODS 4 - Educação de Qualidade",
        bncc: ["EF07LP01"],
        teacherGuide: {
            objective: "Ensinar codificação: transformar letras em sinais combinados e recuperar a mensagem do outro lado.",
            skills: ["Codificação e decodificação", "Ritmo e precisão", "Comunicação a distância"],
            assessment: "Um colega que não viu o código consegue decodificar uma palavra de quatro letras olhando só o LED?"
        },
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
        ods: "ODS 9 - Inovação",
        bncc: ["EF09CI03"],
        teacherGuide: {
            objective: "Ensinar velocidade como distância dividida por tempo, com a turma medindo as duas em vez de recebê-las prontas.",
            skills: ["Relação distância e tempo", "Medição com sensores", "Análise de resultado experimental"],
            assessment: "Dois objetos lançados em velocidades visivelmente diferentes produzem leituras que respeitam essa diferença?"
        },
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
        teacherGuide: {
            objective: "Mostrar a diferença entre microcontrolador e computador completo, e o que muda quando existe sistema operacional.",
            skills: ["Fundamentos de Linux", "Controle de GPIO", "Comparação entre arquiteturas"],
            assessment: "O aluno acende um LED pela GPIO e explica por que aqui existe sistema operacional e no Arduino não?"
        },
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
        teacherGuide: {
            objective: "Ensinar montagem de um sistema completo, do sistema operacional aos periféricos, e discutir preservação digital e direito de uso.",
            skills: ["Administração de sistema Linux", "Configuração de periféricos", "Ética no uso de software"],
            assessment: "O console inicia sozinho no menu, reconhece o controle e roda um jogo que a turma tenha direito de usar?"
        },
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
        teacherGuide: {
            objective: "Explorar a automação aplicada à sustentabilidade e monitoramento remoto via IoT.",
            skills: ["Domínio de ferramentas cloud", "Eletrônica aplicada", "Análise de dados"],
            assessment: "O sistema envia dados corretamente para o dashboard e ativa a bomba no limiar definido?"
        },
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
        ods: "ODS 11 - Cidades Inteligentes",
        bncc: ["EM13TEC05"],
        teacherGuide: {
            objective: "Ensinar que um estado físico pode ser espelhado na nuvem quase em tempo real, e o que acontece quando a conexão cai.",
            skills: ["Comunicação com a nuvem", "Leitura de sensor magnético", "Tratamento de perda de conexão"],
            assessment: "Abrir a porta muda o painel em poucos segundos, e o estado continua correto depois de desligar e religar a rede?"
        },
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
        ods: "ODS 9 - Inovação",
        bncc: ["EM13TEC04"],
        teacherGuide: {
            objective: "Ensinar a consumir uma API REST autenticada, levando dados do hardware para uma interface própria.",
            skills: ["Requisição HTTP autenticada", "Leitura de JSON", "Construção de interface"],
            assessment: "A página feita pela turma mostra o mesmo valor do painel oficial e se atualiza sem recarregar?"
        },
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
        teacherGuide: {
            objective: "Demonstrar a aplicação de sensores em sistemas de segurança e medir a velocidade de resposta humana.",
            skills: ["Física do som", "Lógica condicional", "Design de interface sonora"],
            assessment: "O tempo entre os bipes reduz proporcionalmente à distância medida?"
        },
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
        ods: "ODS 13 - Ação Climática",
        bncc: ["EF06CI13", "EF07TEC02"],
        teacherGuide: {
            objective: "Ensinar o uso de biblioteca externa para controlar um periférico, e a formatar a saída para quem vai ler.",
            skills: ["Uso de biblioteca", "Formatação de saída", "Leitura de temperatura e umidade"],
            assessment: "O display mostra temperatura e umidade com as unidades, sem sobrar caractere da leitura anterior na tela?"
        },
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
        ods: "ODS 16 - Paz, Justiça e Instituições Eficazes",
        bncc: ["EM13TEC05"],
        teacherGuide: {
            objective: "Ensinar controle de estado e comparação de sequência digitada, base de qualquer sistema de autenticação.",
            skills: ["Controle de estado", "Comparação de sequência", "Integração entre teclado e atuador"],
            assessment: "A senha certa destrava o servo, a errada mantém travado, e o cofre volta a travar sozinho depois de fechado?"
        },
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
