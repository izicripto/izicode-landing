export const quizData = [
    {
        id: "log-001",
        category: "Lógica",
        difficulty: "easy",
        question: "O que é um Algoritmo?",
        options: [
            "Um tipo de vírus de computador",
            "Uma sequência de passos para resolver um problema",
            "Um peça do computador",
            "Um jogo famoso"
        ],
        correct: 1,
        explanation: "Algoritmo é como uma receita de bolo: um passo a passo lógico para chegar a um resultado.",
        xp: 10
    },
    {
        id: "log-002",
        category: "Lógica",
        difficulty: "easy",
        question: "Qual forma geométrica representa uma DECISÃO (se/senão) no fluxograma?",
        options: [
            "Retângulo",
            "Círculo",
            "Losango",
            "Triângulo"
        ],
        correct: 2,
        explanation: "O Losango é usado para decisões onde o caminho se divide em 'Sim' ou 'Não'.",
        xp: 15
    },
    {
        id: "log-003",
        category: "Lógica",
        difficulty: "medium",
        question: "Em um loop 'Enquanto' (While), o código roda...",
        options: [
            "Apenas uma vez",
            "Para sempre, sem parar",
            "Enquanto a condição for verdadeira",
            "Até alguém desligar o computador"
        ],
        correct: 2,
        explanation: "O loop 'Enquanto' verifica a condição antes de cada repetição e só para quando ela for falsa.",
        xp: 20
    },
    {
        id: "ard-001",
        category: "Arduino",
        difficulty: "easy",
        question: "Qual função do Arduino roda apenas UMA vez ao ligar?",
        options: [
            "void loop()",
            "void start()",
            "void setup()",
            "void begin()"
        ],
        correct: 2,
        explanation: "O void setup() serve para configurar os pinos e iniciar bibliotecas, rodando só no início.",
        xp: 10
    },
    {
        id: "ard-002",
        category: "Arduino",
        difficulty: "medium",
        question: "Para que serve o pino GND?",
        options: [
            "Fornecer 5 Volts",
            "Enviar dados para o computador",
            "É o Terra (Negativo/0V) do circuito",
            "Ligar o LED sozinho"
        ],
        correct: 2,
        explanation: "GND significa Ground (Terra), e é o polo negativo comum necessário para fechar o circuito.",
        xp: 15
    },
    {
        id: "ard-003",
        category: "Arduino",
        difficulty: "hard",
        question: "O que é um sinal PWM?",
        options: [
            "Uma forma de simular voltagem analógica ligando/desligando rápido",
            "Um tipo de sensor de temperatura",
            "Uma biblioteca de WiFi",
            "Um erro de compilação"
        ],
        correct: 0,
        explanation: "PWM (Pulse Width Modulation) controla a potência (brilho do LED, velocidade do motor) pulsando o sinal digital.",
        xp: 30
    },
    {
        id: "scr-001",
        category: "Scratch",
        difficulty: "easy",
        question: "Qual bloco usamos para iniciar um código ao clicar na bandeira verde?",
        options: [
            "Quando a tecla espaço for pressionada",
            "Quando bandeira verde for clicada",
            "Mova 10 passos",
            "Espere 1 segundo"
        ],
        correct: 1,
        explanation: "É o bloco de evento principal para iniciar a maioria dos jogos no Scratch.",
        xp: 10
    },
    {
        id: "scr-002",
        category: "Scratch",
        difficulty: "medium",
        question: "O que é uma 'Variável' no Scratch?",
        options: [
            "Um personagem do jogo",
            "Um cenário que muda de cor",
            "Um espaço na memória para guardar números ou textos (como pontuação)",
            "Um bloco que faz som"
        ],
        correct: 2,
        explanation: "Variáveis são como caixas com etiquetas onde guardamos informações que podem mudar, como 'Vidas' ou 'Pontos'.",
        xp: 20
    },
    {
        id: "scr-003",
        category: "Scratch",
        difficulty: "medium",
        question: "Para fazer um personagem andar para sempre, qual estrutura usamos?",
        options: [
            "Repita 10 vezes",
            "Se... então",
            "Sempre",
            "Espere até que"
        ],
        correct: 2,
        explanation: "O bloco 'Sempre' (Loop infinito) faz com que as ações dentro dele se repitam continuadamente.",
        xp: 15
    },
    {
        id: "maker-001",
        category: "Maker",
        difficulty: "easy",
        question: "O que significa DIY?",
        options: [
            "Do It Yesterday (Faça Ontem)",
            "Do It Yourself (Faça Você Mesmo)",
            "Digital Is Young (O Digital é Jovem)",
            "Dance In Yard (Dance no Quintal)"
        ],
        correct: 1,
        explanation: "DIY é a essência da cultura Maker: colocar a mão na massa e construir suas próprias coisas!",
        xp: 10
    },
    {
        id: "maker-002",
        category: "Maker",
        difficulty: "medium",
        question: "Qual ferramenta usamos para colar componentes com calor?",
        options: [
            "Cola Branca",
            "Fita Adesiva",
            "Pistola de Cola Quente",
            "Grampeador"
        ],
        correct: 2,
        explanation: "A cola quente é a melhor amiga do Maker para prototipagem rápida com papelão e materiais recicláveis.",
        xp: 15
    },
    {
        id: "tech-001",
        category: "Lógica",
        difficulty: "hard",
        question: "O que é um 'Bug'?",
        options: [
            "Um inseto de verdade dentro do computador",
            "Uma falha ou erro no código",
            "Um tipo de robô espião",
            "Um super computador"
        ],
        correct: 1,
        explanation: "Bug é o nome dado a falhas de software. O termo surgiu quando um inseto real causou curto num computador antigo!",
        xp: 20
    },
    {
        id: "mic-001",
        category: "Micro:bit",
        difficulty: "easy",
        question: "O que o Micro:bit já traz de fábrica, sem comprar nada extra?",
        options: [
            "Sensores embutidos (movimento, bússola, luz, temperatura), botões e 25 LEDs",
            "Um motor e duas rodas",
            "Tela sensível ao toque colorida",
            "Caixa de som estéreo"
        ],
        correct: 0,
        explanation: "O Micro:bit já vem com acelerômetro, bússola, sensores de luz e temperatura, 2 botões e matriz de 25 LEDs — dá para fazer os primeiros projetos sem nenhum componente extra.",
        xp: 10
    },
    {
        id: "mic-002",
        category: "Micro:bit",
        difficulty: "easy",
        question: "No MakeCode, qual bloco roda UMA vez quando a placa liga?",
        options: [
            "sempre",
            "ao iniciar",
            "ao pressionar botão A",
            "pausar (ms)"
        ],
        correct: 1,
        explanation: "O bloco 'ao iniciar' roda uma única vez ao ligar — é o equivalente ao setup() do Arduino.",
        xp: 10
    },
    {
        id: "mic-003",
        category: "Micro:bit",
        difficulty: "medium",
        question: "Para que serve 'rádio definir grupo' no Micro:bit?",
        options: [
            "Aumentar o brilho dos LEDs",
            "Criar um canal para que só placas do mesmo grupo se ouçam",
            "Conectar a placa à internet",
            "Salvar o programa na placa"
        ],
        correct: 1,
        explanation: "O grupo de rádio funciona como um canal: só placas com o mesmo número se ouvem, evitando que uma dupla interfira na outra na mesma sala.",
        xp: 15
    },
    {
        id: "mic-004",
        category: "Micro:bit",
        difficulty: "medium",
        question: "O sensor de temperatura do Micro:bit mede o quê, exatamente?",
        options: [
            "A temperatura exata do ar da sala",
            "A temperatura do próprio chip (costuma marcar 2 a 4°C acima do ar)",
            "A umidade do ar",
            "A pressão atmosférica"
        ],
        correct: 1,
        explanation: "O sensor mede o chip, que esquenta um pouco ao funcionar — por isso marca acima do ambiente. Ótima discussão sobre fontes de erro em medições reais!",
        xp: 15
    },
    {
        id: "mic-005",
        category: "Micro:bit",
        difficulty: "hard",
        question: "Os valores do acelerômetro do Micro:bit variam aproximadamente entre...",
        options: [
            "0 e 100",
            "-1023 e 1023",
            "0 e 255",
            "1 e 10"
        ],
        correct: 1,
        explanation: "Assim como o analogRead do Arduino (0–1023, 10 bits), o acelerômetro devolve uma faixa numérica — aqui negativa e positiva, porque mede inclinação para os dois lados.",
        xp: 25
    },
    {
        id: "pyt-001",
        category: "Python",
        difficulty: "easy",
        question: "Em Python, o que o comando print(\"Olá\") faz?",
        options: [
            "Apaga a tela",
            "Mostra o texto na saída",
            "Salva um arquivo",
            "Desliga o computador"
        ],
        correct: 1,
        explanation: "print() exibe informações — é a primeira ferramenta de todo programador para ver o que o código está fazendo.",
        xp: 10
    },
    {
        id: "pyt-002",
        category: "Python",
        difficulty: "easy",
        question: "Qual símbolo marca um comentário em Python?",
        options: [
            "//",
            "#",
            "<!-- -->",
            "**"
        ],
        correct: 1,
        explanation: "Tudo depois do # na linha é ignorado pelo computador — serve para documentar o código para humanos.",
        xp: 10
    },
    {
        id: "pyt-003",
        category: "Python",
        difficulty: "medium",
        question: "O que a linha `pontos = pontos + 1` faz?",
        options: [
            "Compara dois valores",
            "Soma 1 ao valor atual da variável",
            "Cria uma variável nova zerada",
            "Apaga a variável pontos"
        ],
        correct: 1,
        explanation: "O Python primeiro lê o valor atual de pontos, soma 1 e guarda de volta — é assim que placares e contadores funcionam.",
        xp: 15
    },
    {
        id: "pyt-004",
        category: "Python",
        difficulty: "medium",
        question: "No Micro:bit em MicroPython, o que `display.show(5)` faz?",
        options: [
            "Mostra o número 5 na matriz de LEDs",
            "Acende 5 LEDs aleatórios",
            "Espera 5 segundos",
            "Toca 5 bipes"
        ],
        correct: 0,
        explanation: "display.show() desenha na matriz de 25 LEDs — números, textos (letra por letra) e ícones prontos.",
        xp: 15
    },
    {
        id: "pyt-005",
        category: "Python",
        difficulty: "hard",
        question: "O que é indentação em Python e por que ela importa?",
        options: [
            "Um enfeite visual opcional",
            "Os espaços no início da linha, que definem o que está dentro de um if ou loop",
            "Um tipo especial de variável",
            "Um erro de digitação"
        ],
        correct: 1,
        explanation: "Python não usa chaves: é a indentação que diz ao computador quais linhas pertencem ao if ou ao while. Indentar errado muda o programa!",
        xp: 25
    },
    {
        id: "cod-001",
        category: "Code.org",
        difficulty: "easy",
        question: "O que é o Hour of Code?",
        options: [
            "Uma atividade de cerca de 1 hora que introduz programação com personagens famosos",
            "Um campeonato mundial de robótica",
            "Uma prova online obrigatória",
            "Um curso pago de informática"
        ],
        correct: 0,
        explanation: "O Hour of Code usa personagens como os de Minecraft e Frozen para dar a primeira experiência com lógica de programação em uma aula.",
        xp: 10
    },
    {
        id: "cod-002",
        category: "Code.org",
        difficulty: "easy",
        question: "Como alunos sem e-mail entram na turma do Code.org?",
        options: [
            "Não conseguem entrar",
            "Com código da turma ou imagem/palavra secreta",
            "Só com CPF dos pais",
            "Ligando para o suporte"
        ],
        correct: 1,
        explanation: "Para o Fundamental I, cada aluno recebe uma sequência de imagens como senha — ninguém precisa digitar e-mail.",
        xp: 10
    },
    {
        id: "cod-003",
        category: "Code.org",
        difficulty: "medium",
        question: "Qual a diferença entre Code.org e Scratch?",
        options: [
            "Não há diferença",
            "Code.org é currículo guiado com correção automática; Scratch é ferramenta aberta de criação",
            "Scratch é pago e Code.org é grátis",
            "Code.org só funciona sem internet"
        ],
        correct: 1,
        explanation: "No Code.org as atividades já vêm sequenciadas e o professor acompanha o progresso; no Scratch o aluno cria livremente do zero.",
        xp: 15
    },
    {
        id: "cod-004",
        category: "Code.org",
        difficulty: "hard",
        question: "No painel do professor do Code.org, os relatórios de progresso servem para...",
        options: [
            "Ver em que fase cada aluno travou e intervir onde a turma precisa",
            "Alterar as notas oficiais da escola",
            "Enviar e-mails automáticos aos pais",
            "Gerar provas impressas"
        ],
        correct: 0,
        explanation: "O papel do professor muda: em vez de conduzir a criação, ele acompanha os relatórios e intervém exatamente onde cada aluno travou.",
        xp: 25
    },
    {
        id: "log-004",
        category: "Lógica",
        difficulty: "hard",
        question: "Numa condição com 'E' (AND), o resultado é verdadeiro quando...",
        options: [
            "QUALQUER uma das partes for verdadeira",
            "TODAS as partes forem verdadeiras",
            "Nenhuma parte for verdadeira",
            "O programa terminar"
        ],
        correct: 1,
        explanation: "O 'E' exige tudo verdadeiro ao mesmo tempo (ex: ter pontos > 10 E tempo < 30). Com 'OU' (OR), basta uma parte ser verdadeira.",
        xp: 25
    },
    {
        id: "ard-004",
        category: "Arduino",
        difficulty: "easy",
        question: "O que o comando delay(1000) faz no Arduino?",
        options: [
            "Apaga o programa da placa",
            "Pausa por 1000 milissegundos, ou seja, 1 segundo",
            "Acelera o processador",
            "Reinicia a placa"
        ],
        correct: 1,
        explanation: "O delay conta em milissegundos: delay(1000) = 1 segundo parado antes da próxima linha. É assim que controlamos o ritmo do semáforo e do pisca-LED.",
        xp: 10
    },
    {
        id: "scr-004",
        category: "Scratch",
        difficulty: "hard",
        question: "Para que serve o par 'transmita [mensagem]' / 'quando eu receber [mensagem]'?",
        options: [
            "Aumentar o volume do projeto",
            "Fazer dois scripts ou sprites diferentes se coordenarem",
            "Salvar o projeto na nuvem",
            "Trocar o cenário automaticamente"
        ],
        correct: 1,
        explanation: "É como um ator avisar o outro: um sprite transmite 'comecar' e outro reage. Primeiro caso de coordenação entre scripts independentes.",
        xp: 25
    },
    {
        id: "maker-003",
        category: "Maker",
        difficulty: "medium",
        question: "O que é prototipagem rápida?",
        options: [
            "Fazer a versão final perfeita de primeira",
            "Montar uma versão simples e rápida para testar a ideia (papelão, cola quente) e melhorar depois",
            "Comprar tudo pronto em vez de construir",
            "Desenhar o projeto sem nunca construir"
        ],
        correct: 1,
        explanation: "Protótipo não precisa ser bonito: precisa responder rápido se a ideia funciona. Testou, aprendeu, melhorou — esse é o ciclo maker.",
        xp: 15
    }
];
