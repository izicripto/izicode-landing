// Banco de dados estático de projetos para a biblioteca pública
// Esses projetos são visíveis para todos os usuários (logados ou não)

const projectsData = [
    {
        id: "arduino-semaforo",
        title: "Semáforo Inteligente com Arduino",
        description: "Aprenda lógica de programação criando um semáforo funcional com LEDs.",
        grade: "6º ao 9º ano",
        duration: "4 aulas",
        difficulty: "basico",
        ods: "ODS 11",
        tools: ["Arduino", "LEDs", "Tinkercad"],
        content: `# Semáforo Inteligente com Arduino

## 📋 Visão Geral
- **Série:** 6º ao 9º ano (Ensino Fundamental II)
- **Duração:** 4 aulas de 50 min
- **Dificuldade:** Básico
- **ODS:** 11 - Cidades e Comunidades Sustentáveis
- **Competências BNCC:** (EF06TEC01), (EF07TEC02) - Pensamento Computacional e Cultura Digital

## 🎯 Objetivos de Aprendizagem
1. Compreender o funcionamento básico de um microcontrolador (Arduino).
2. Entender a lógica sequencial de programação (algoritmo).
3. Aplicar conceitos de circuitos elétricos (LEDs, Resistores).
4. Discutir mobilidade urbana e segurança no trânsito.

## 🔧 Materiais Necessários
- 1x Arduino Uno R3 (ou simulador Tinkercad)
- 1x Protoboard
- 3x LEDs (Vermelho, Amarelo, Verde)
- 3x Resistores de 220Ω ou 330Ω
- Cabos jumpers (macho-macho)
- Computadores com acesso à internet

## 📚 Cronograma de Aulas

### Aula 1: Introdução e Circuito
**Objetivos:** Conhecer o Arduino e montar o circuito físico.
**Atividades:**
1. Apresentação do Arduino e seus pinos digitais.
2. Explicação sobre LEDs (polaridade) e resistores.
3. Montagem prática na protoboard: conectar um LED ao pino 13 e GND.
4. Desafio: Fazer o LED acender (Blink).

### Aula 2: Lógica do Semáforo
**Objetivos:** Desenvolver o algoritmo do semáforo.
**Atividades:**
1. Discussão em grupo: Qual a sequência de cores de um semáforo? Quanto tempo cada um fica?
2. Escrever o algoritmo em português estruturado (papel).
3. Traduzir para blocos no Tinkercad ou C++ na IDE.
4. Testar a sequência básica: Verde -> Amarelo -> Vermelho.

### Aula 3: Semáforo de Pedestres
**Objetivos:** Adicionar complexidade e interatividade.
**Atividades:**
1. Adicionar mais 2 LEDs (Verde e Vermelho) para o pedestre.
2. Adicionar um botão (pushbutton) para solicitar a travessia.
3. Programar a lógica: O sinal de carros só fecha quando o botão é pressionado? Ou tem um ciclo fixo?
4. Testes e depuração.

### Aula 4: Apresentação e ODS 11
**Objetivos:** Contextualizar o projeto na sociedade.
**Atividades:**
1. Montagem de maquetes simples (papelão) simulando um cruzamento.
2. Apresentação dos grupos: Como a tecnologia ajuda na organização das cidades?
3. Debate sobre acessibilidade (sinais sonoros) e sustentabilidade.

## 💡 Dicas para o Professor
- Use o simulador Tinkercad antes de ir para os componentes físicos para evitar queima de LEDs.
- Explique a analogia do "loop" como uma rotina que nunca para.
- Para turmas avançadas, desafie-os a usar a função \`millis()\` ao invés de \`delay()\`.

## 🚀 Extensões e Desafios
- Adicionar um buzzer para sinal sonoro (acessibilidade para deficientes visuais).
- Criar um sistema de "radar" com sensor ultrassônico.
`
    },
    {
        id: "scratch-piano",
        title: "Piano de Frutas com Makey Makey",
        description: "Transforme bananas e maçãs em teclas de piano usando condutividade.",
        grade: "1º ao 5º ano",
        duration: "2 aulas",
        difficulty: "basico",
        ods: "ODS 4",
        tools: ["Makey Makey", "Scratch", "Frutas"],
        content: `# Piano de Frutas com Makey Makey

## 📋 Visão Geral
- **Série:** 1º ao 5º ano (Ensino Fundamental I)
- **Duração:** 2 aulas de 50 min
- **Dificuldade:** Básico
- **ODS:** 4 - Educação de Qualidade
- **Competências BNCC:** (EF01CI01) - Materiais e suas propriedades

## 🎯 Objetivos de Aprendizagem
1. Entender o conceito de condutividade elétrica.
2. Explorar a interface física-digital.
3. Criar sons e músicas no Scratch.
4. Trabalhar a criatividade e experimentação.

## 🔧 Materiais Necessários
- 1x Kit Makey Makey (Placa + Garras Jacaré)
- 1x Computador com acesso ao Scratch
- Frutas diversas (Bananas, Maçãs, Laranjas) ou massinha de modelar condutiva
- Papel alumínio (opcional)

## 📚 Cronograma de Aulas

### Aula 1: O Que Conduz Eletricidade?
**Objetivos:** Descobrir materiais condutores e isolantes.
**Atividades:**
1. Roda de conversa: O que é eletricidade? É perigosa? (Explicar que o Makey Makey é seguro).
2. "Caça aos condutores": Usar o Makey Makey para testar objetos da sala (lápis, borracha, colher, colega).
3. Registrar em uma tabela o que funcionou e o que não funcionou.

### Aula 2: A Orquestra de Frutas
**Objetivos:** Criar o instrumento musical.
**Atividades:**
1. Abrir o Scratch e carregar o projeto "Piano".
2. Conectar as frutas nas setas do Makey Makey (Cima, Baixo, Esquerda, Direita).
3. Conectar o "Terra" (Earth) no próprio corpo do aluno.
4. Tocar músicas tocando nas frutas!
5. Desafio: Criar uma música própria e gravar no Scratch.

## 💡 Dicas para o Professor
- Certifique-se de que os alunos estão sempre segurando o cabo "Terra", senão o circuito não fecha.
- Frutas cítricas ou com bastante água conduzem melhor.
- Limpe as garras jacaré após o uso com frutas para não oxidar.

## 🚀 Extensões e Desafios
- Desenhar um controle de videogame com grafite (lápis 6B) em papel e jogar Mario Bros.
- Criar um tapete de dança com papelão e papel alumínio.
`
    },
    {
        id: "microbit-passos",
        title: "Contador de Passos com Micro:bit",
        description: "Crie seu próprio 'Fitbit' e promova a saúde na escola.",
        grade: "4º ao 7º ano",
        duration: "3 aulas",
        difficulty: "intermediario",
        ods: "ODS 3",
        tools: ["Micro:bit", "MakeCode"],
        content: `# Contador de Passos com Micro:bit

## 📋 Visão Geral
- **Série:** 4º ao 7º ano
- **Duração:** 3 aulas
- **Dificuldade:** Intermediário
- **ODS:** 3 - Saúde e Bem-Estar
- **Competências BNCC:** Pensamento Computacional, Vida Saudável

## 🎯 Objetivos de Aprendizagem
1. Utilizar o acelerômetro do Micro:bit.
2. Trabalhar com variáveis (armazenar números).
3. Promover atividade física e coleta de dados.

## 🔧 Materiais Necessários
- 1x Micro:bit V2
- 1x Bateria para Micro:bit
- Computador com MakeCode
- Fita adesiva ou braçadeira (para prender na perna)

## 📚 Cronograma de Aulas

### Aula 1: Sensores e Movimento
**Objetivos:** Entender como o Micro:bit sente o movimento.
**Atividades:**
1. Explorar o bloco "Em agitação" (On Shake) no MakeCode.
2. Criar um programa simples que mostra um ícone quando chacoalha.
3. Testar a sensibilidade.

### Aula 2: Programando o Contador
**Objetivos:** Usar variáveis para contar.
**Atividades:**
1. Criar uma variável chamada "Passos".
2. Definir "Passos" para 0 no início (On Start).
3. Somar 1 à variável "Passos" a cada agitação.
4. Mostrar o número de passos no display de LED.

### Aula 3: A Maratona da Escola
**Objetivos:** Teste de campo e análise de dados.
**Atividades:**
1. Prender o Micro:bit no tornozelo dos alunos.
2. Realizar uma caminhada pelo pátio da escola.
3. Comparar os resultados: Quem deu mais passos? Por que deu diferença? (Calibração).
4. Discutir a importância de se exercitar (ODS 3).

## 💡 Dicas para o Professor
- O acelerômetro pode ser muito sensível. Ensine os alunos a filtrar pequenos movimentos se necessário.
- Ótimo projeto para integrar com a aula de Educação Física.

## 🚀 Extensões e Desafios
- Calcular a distância percorrida (multiplicar passos pelo tamanho médio do passo).
- Criar um "tamagotchi" que fica feliz quando você anda bastante.
`
    }
];

export function getProjectById(id) {
    return projectsData.find(p => p.id === id);
}

export function getAllProjects() {
    return projectsData;
}
