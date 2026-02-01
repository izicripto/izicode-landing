// Biblioteca de Projetos Prontos - Izicode Edu
export const projectsLibrary = [
    {
        id: 1,
        title: "Semáforo Inteligente com Arduino",
        description: "Programe um semáforo funcional e aprenda sobre lógica de programação e temporização.",
        category: "hardware",
        difficulty: "basico",
        grade: "6º ao 9º ano",
        duration: "4 aulas",
        ods: "ODS 11 - Cidades Sustentáveis",
        tools: ["Arduino", "LEDs", "Resistores"],
        bncc: ["EM13MAT315", "EF09CI01"],
        status: "ready",
        content: `# 🚦 Semáforo Inteligente com Arduino

## 📋 Visão Geral
- **Série:** 6º ao 9º ano
- **Duração:** 4 aulas de 50 min
- **Dificuldade:** Básico
- **ODS:** 11 - Cidades Sustentáveis
- **Competências BNCC:** Pensamento Computacional, Cultura Digital

## 🎯 Objetivos de Aprendizagem
1. Compreender o funcionamento de um semáforo real
2. Programar sequências lógicas com Arduino
3. Montar circuitos elétricos básicos com LEDs
4. Relacionar tecnologia com mobilidade urbana

## 🔧 Materiais Necessários
- 1x Arduino Uno
- 3x LEDs (vermelho, amarelo, verde)
- 3x Resistores 220Ω
- Jumpers
- Protoboard
- Cabo USB

## 📚 Cronograma de Aulas

### Aula 1: Introdução e Conceitos
**Objetivos:** Entender o funcionamento de semáforos
**Atividades:**
1. Roda de conversa: Como funcionam os semáforos da cidade?
2. Vídeo explicativo sobre temporização
3. Desenho do circuito no caderno

### Aula 2: Montagem do Circuito
**Objetivos:** Montar o circuito físico
**Atividades:**
1. Identificação dos componentes
2. Montagem passo a passo na protoboard
3. Teste de continuidade

### Aula 3: Programação
**Objetivos:** Criar o código do semáforo
**Atividades:**
1. Estrutura básica do Arduino (setup/loop)
2. Função digitalWrite e delay
3. Upload e teste do código

### Aula 4: Desafios e Apresentação
**Objetivos:** Expandir e apresentar
**Atividades:**
1. Desafio: adicionar botão de pedestre
2. Apresentação dos projetos
3. Círculo de encerramento

## 💻 Código Base
\`\`\`cpp
int vermelho = 13;
int amarelo = 12;
int verde = 11;

void setup() {
  pinMode(vermelho, OUTPUT);
  pinMode(amarelo, OUTPUT);
  pinMode(verde, OUTPUT);
}

void loop() {
  // Verde
  digitalWrite(verde, HIGH);
  delay(5000);
  digitalWrite(verde, LOW);
  
  // Amarelo
  digitalWrite(amarelo, HIGH);
  delay(2000);
  digitalWrite(amarelo, LOW);
  
  // Vermelho
  digitalWrite(vermelho, HIGH);
  delay(5000);
  digitalWrite(vermelho, LOW);
}
\`\`\`

## 💡 Dicas para o Professor
- Teste todos os componentes antes da aula
- Tenha LEDs e resistores extras
- Use simulador Tinkercad para demonstração
- Incentive trabalho em duplas

## 🔄 Práticas Restaurativas
- Círculo inicial: "O que você sabe sobre trânsito seguro?"
- Trabalho colaborativo em duplas
- Círculo final: "O que aprendi hoje?"

---
*Projeto Izicode Edu*`
    },
    {
        id: 2,
        title: "Jogo da Coleta Seletiva no Scratch",
        description: "Crie um game educativo sobre reciclagem usando programação em blocos.",
        category: "software",
        difficulty: "basico",
        grade: "4º ao 6º ano",
        duration: "3 aulas",
        ods: "ODS 12 - Consumo Responsável",
        tools: ["Scratch"],
        bncc: ["EF05CI05", "EF15AR26"],
        status: "ready",
        content: `# ♻️ Jogo da Coleta Seletiva no Scratch

## 📋 Visão Geral
- **Série:** 4º ao 6º ano
- **Duração:** 3 aulas de 50 min
- **Dificuldade:** Básico
- **ODS:** 12 - Consumo Responsável
- **Competências BNCC:** Pensamento Computacional, Responsabilidade Socioambiental

## 🎯 Objetivos de Aprendizagem
1. Criar um jogo funcional no Scratch
2. Aprender sobre coleta seletiva e reciclagem
3. Usar condicionais e variáveis
4. Desenvolver pensamento lógico

## 🔧 Materiais Necessários
- Computadores com acesso à internet
- Conta no Scratch (scratch.mit.edu)
- Projetor para demonstração

## 📚 Cronograma de Aulas

### Aula 1: Design e Cenário
**Objetivos:** Planejar o jogo e criar cenário
**Atividades:**
1. Brainstorm: Como será nosso jogo?
2. Pesquisa sobre cores da coleta seletiva
3. Criação do cenário e sprites (lixeiras)

### Aula 2: Programação dos Objetos
**Objetivos:** Fazer os objetos caírem e serem arrastados
**Atividades:**
1. Programar itens de lixo caindo
2. Criar arraste com mouse
3. Detectar colisão com lixeiras

### Aula 3: Pontuação e Finalização
**Objetivos:** Adicionar sistema de pontos
**Atividades:**
1. Criar variável de pontuação
2. Adicionar sons e efeitos
3. Teste e apresentação

## 💻 Blocos Principais
- **Movimento:** glide, go to random position
- **Controle:** forever, if-then
- **Sensores:** touching color?
- **Variáveis:** score

## 💡 Dicas para o Professor
- Demonstre o jogo finalizado antes de começar
- Use a galeria do Scratch para inspiração
- Permita personalização (novos itens de lixo)
- Incentive remix entre colegas

## 🔄 Práticas Restaurativas
- Círculo inicial: "O que você recicla em casa?"
- Trabalho colaborativo
- Círculo final: Compartilhar os jogos criados

---
*Projeto Izicode Edu*`
    },
    {
        id: 3,
        title: "Piano de Frutas com Makey Makey",
        description: "Transforme frutas em teclas de piano e aprenda sobre condutividade elétrica.",
        category: "hardware",
        difficulty: "basico",
        grade: "3º ao 5º ano",
        duration: "2 aulas",
        ods: "ODS 4 - Educação de Qualidade",
        tools: ["Makey Makey", "Scratch"],
        bncc: ["EF04CI02", "EF15AR17"],
        status: "ready",
        content: `# 🍌 Piano de Frutas com Makey Makey

## 📋 Visão Geral
- **Série:** 3º ao 5º ano
- **Duração:** 2 aulas de 50 min
- **Dificuldade:** Básico
- **ODS:** 4 - Educação de Qualidade
- **Competências BNCC:** Investigação Científica, Cultura Digital

## 🎯 Objetivos de Aprendizagem
1. Entender o conceito de condutividade elétrica
2. Conectar o mundo físico ao digital
3. Criar música de forma interativa
4. Experimentar com diferentes materiais

## 🔧 Materiais Necessários
- 1x Kit Makey Makey
- Frutas variadas (banana, maçã, laranja, limão)
- Computador com Scratch
- Garras jacaré
- Massinha de modelar (opcional)

## 📚 Cronograma de Aulas

### Aula 1: Descoberta e Conexão
**Objetivos:** Entender como o Makey Makey funciona
**Atividades:**
1. Experimento: O que conduz eletricidade?
2. Teste com diferentes materiais
3. Primeira conexão com o computador

### Aula 2: Criando o Piano
**Objetivos:** Montar e tocar o piano de frutas
**Atividades:**
1. Abrir projeto de piano no Scratch
2. Conectar cada fruta a uma nota
3. Apresentação musical em grupos

## 💡 Dicas para o Professor
- Frutas firmes funcionam melhor
- Demonstre o circuito completo (fruta → corpo → terra)
- Tenha materiais extras para experimentação
- Grave vídeos das apresentações

## 🔄 Práticas Restaurativas
- Círculo de abertura: "Qual seu instrumento favorito?"
- Trabalho em grupos de 4
- Apresentação musical colaborativa

---
*Projeto Izicode Edu*`
    },
    {
        id: 4,
        title: "Sensor de Umidade para Horta",
        description: "Monte um sistema de monitoramento de umidade do solo para plantas.",
        category: "hardware",
        difficulty: "intermediario",
        grade: "7º ao 9º ano",
        duration: "6 aulas",
        ods: "ODS 15 - Vida Terrestre",
        tools: ["Arduino", "Sensor de Umidade"],
        bncc: ["EF07CI07", "EM13CNT301"],
        status: "ready",
        content: `# 🌱 Sensor de Umidade para Horta Escolar

## 📋 Visão Geral
- **Série:** 7º ao 9º ano
- **Duração:** 6 aulas de 50 min
- **Dificuldade:** Intermediário
- **ODS:** 15 - Vida Terrestre
- **Competências BNCC:** Pensamento Científico, Sustentabilidade

## 🎯 Objetivos de Aprendizagem
1. Compreender o ciclo da água nas plantas
2. Usar sensores para coleta de dados
3. Programar tomada de decisões
4. Integrar tecnologia e sustentabilidade

## 🔧 Materiais Necessários
- 1x Arduino Uno
- 1x Sensor de umidade do solo
- 1x LED vermelho e 1x verde
- 1x Buzzer (opcional)
- Jumpers e protoboard
- Vaso com planta

## 📚 Cronograma de Aulas

### Aulas 1-2: Fundamentos
- Ciclo da água e necessidades das plantas
- Funcionamento do sensor de umidade
- Montagem do circuito básico

### Aulas 3-4: Programação
- Leitura de valores analógicos
- Condicionais para diferentes níveis
- Alertas visuais e sonoros

### Aulas 5-6: Integração e Testes
- Instalação na horta escolar
- Coleta de dados durante uma semana
- Apresentação dos resultados

## 💻 Código Base
\`\`\`cpp
int sensorPin = A0;
int ledVerde = 12;
int ledVermelho = 13;
int umidade;

void setup() {
  pinMode(ledVerde, OUTPUT);
  pinMode(ledVermelho, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  umidade = analogRead(sensorPin);
  Serial.println(umidade);
  
  if (umidade > 600) { // Solo seco
    digitalWrite(ledVermelho, HIGH);
    digitalWrite(ledVerde, LOW);
  } else { // Solo úmido
    digitalWrite(ledVermelho, LOW);
    digitalWrite(ledVerde, HIGH);
  }
  delay(1000);
}
\`\`\`

## 💡 Dicas para o Professor
- Calibre o sensor com solo seco e molhado
- Use o Monitor Serial para debug
- Incentive registro em planilha
- Conecte com aulas de Ciências

---
*Projeto Izicode Edu*`
    },
    {
        id: 5,
        title: "Animação Stop Motion com Scratch",
        description: "Crie histórias animadas quadro a quadro usando programação.",
        category: "software",
        difficulty: "basico",
        grade: "3º ao 5º ano",
        duration: "4 aulas",
        ods: "ODS 4 - Educação de Qualidade",
        tools: ["Scratch"],
        bncc: ["EF15AR26", "EF35LP25"],
        status: "ready",
        content: `# 🎬 Animação Stop Motion com Scratch

## 📋 Visão Geral
- **Série:** 3º ao 5º ano
- **Duração:** 4 aulas de 50 min
- **Dificuldade:** Básico
- **ODS:** 4 - Educação de Qualidade

## 🎯 Objetivos de Aprendizagem
1. Entender o conceito de animação quadro a quadro
2. Criar fantasias/costumes no Scratch
3. Desenvolver narrativa visual
4. Usar loops e timing

## 🔧 Materiais Necessários
- Computadores com Scratch
- Papel e lápis para storyboard
- Projetor

## 📚 Cronograma de Aulas

### Aula 1: O que é Stop Motion?
- Vídeos de animações famosas
- Conceito de quadros por segundo
- Criação do storyboard

### Aula 2: Desenhando os Quadros
- Editor de fantasias do Scratch
- Criar 4-6 variações do personagem
- Organizar sequência

### Aula 3: Programação da Animação
- Bloco "próxima fantasia"
- Ajuste de velocidade com "espere"
- Adicionar movimento

### Aula 4: Trilha Sonora e Exibição
- Gravar ou escolher sons
- Sincronizar áudio
- Festival de curtas da turma

## 💡 Dicas para o Professor
- Comece com animações simples (bola pulando)
- Demonstre o editor de fantasias
- Incentive histórias sobre temas da turma
- Crie uma galeria virtual

---
*Projeto Izicode Edu*`
    },
    {
        id: 6,
        title: "Robô Seguidor de Linha",
        description: "Construa um robô autônomo que segue uma linha preta no chão.",
        category: "hardware",
        difficulty: "avancado",
        grade: "8º ano ao Ensino Médio",
        duration: "8 aulas",
        ods: "ODS 9 - Indústria e Inovação",
        tools: ["Arduino", "Motores DC", "Sensores IR"],
        bncc: ["EM13MAT315", "EM13CNT301"],
        status: "ready",
        content: `# 🤖 Robô Seguidor de Linha

## 📋 Visão Geral
- **Série:** 8º ano ao Ensino Médio
- **Duração:** 8 aulas de 50 min
- **Dificuldade:** Avançado
- **ODS:** 9 - Indústria, Inovação e Infraestrutura

## 🎯 Objetivos de Aprendizagem
1. Construir um robô móvel funcional
2. Programar lógica de controle
3. Usar sensores infravermelhos
4. Entender conceitos de automação

## 🔧 Materiais Necessários
- 1x Arduino Uno
- 2x Motores DC com rodas
- 1x Ponte H (L298N ou similar)
- 2x Sensores IR
- Chassi (pode ser reciclado)
- Baterias 9V
- Fita isolante preta

## 📚 Cronograma Resumido

### Semana 1 (Aulas 1-2): Montagem Mecânica
- Construção do chassi
- Fixação dos motores
- Instalação das rodas

### Semana 2 (Aulas 3-4): Eletrônica
- Circuito da ponte H
- Conexão dos sensores
- Alimentação elétrica

### Semana 3 (Aulas 5-6): Programação
- Controle dos motores
- Leitura dos sensores
- Lógica de decisão

### Semana 4 (Aulas 7-8): Testes e Competição
- Calibração dos sensores
- Ajuste de velocidade
- Corrida entre os robôs

## 💻 Código Base
\`\`\`cpp
// Pinos dos sensores
int sensorE = A0;
int sensorD = A1;

// Pinos dos motores
int motorE1 = 5;
int motorE2 = 6;
int motorD1 = 9;
int motorD2 = 10;

void setup() {
  pinMode(motorE1, OUTPUT);
  pinMode(motorE2, OUTPUT);
  pinMode(motorD1, OUTPUT);
  pinMode(motorD2, OUTPUT);
}

void loop() {
  int esquerda = analogRead(sensorE);
  int direita = analogRead(sensorD);
  
  if (esquerda < 500 && direita < 500) {
    frente();
  } else if (esquerda > 500) {
    virarEsquerda();
  } else if (direita > 500) {
    virarDireita();
  }
}

void frente() {
  digitalWrite(motorE1, HIGH);
  digitalWrite(motorE2, LOW);
  digitalWrite(motorD1, HIGH);
  digitalWrite(motorD2, LOW);
}

void virarEsquerda() {
  digitalWrite(motorE1, LOW);
  digitalWrite(motorE2, LOW);
  digitalWrite(motorD1, HIGH);
  digitalWrite(motorD2, LOW);
}

void virarDireita() {
  digitalWrite(motorE1, HIGH);
  digitalWrite(motorE2, LOW);
  digitalWrite(motorD1, LOW);
  digitalWrite(motorD2, LOW);
}
\`\`\`

## 💡 Dicas para o Professor
- Monte um protótipo antes
- Use chassi de materiais recicláveis
- Prepare pista com fita isolante
- Organize competição final

---
*Projeto Izicode Edu*`
    }
];

// Função para buscar projeto por ID
export function getProjectById(id) {
    return projectsLibrary.find(p => p.id === parseInt(id));
}

// Função para filtrar projetos
export function filterProjects(filters = {}) {
    return projectsLibrary.filter(project => {
        if (filters.category && project.category !== filters.category) return false;
        if (filters.difficulty && project.difficulty !== filters.difficulty) return false;
        if (filters.status && project.status !== filters.status) return false;
        return true;
    });
}
