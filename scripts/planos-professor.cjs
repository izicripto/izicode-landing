/**
 * Planos do professor para os projetos que estavam sem.
 *
 * Vinte e sete dos 37 roteiros não tinham teacherGuide, e a aba "Guia do
 * Educador" preenchia com um texto genérico igual para todos. O rótulo já
 * foi corrigido para não chamar aquilo de plano exclusivo, mas o buraco
 * continuava: o guia do professor é um dos motivos de a escola pagar.
 *
 * O padrão segue os dez que já existiam:
 *
 *   objective  — uma frase, verbo de ensino na frente, nomeando o conceito
 *                que aquele projeto ensina. Não "desenvolver o pensamento
 *                computacional", que serve para qualquer coisa.
 *   skills     — três, específicas do projeto.
 *   assessment — uma PERGUNTA que o professor responde olhando o que a
 *                turma montou. É o que separa um plano útil de um enfeite:
 *                "avaliar a participação" não diz se o projeto funcionou;
 *                "o carro percorre dois metros com dois obstáculos sem
 *                encostar?" diz.
 *
 * As perguntas só citam comportamento que o próprio roteiro produz. Nada
 * de avaliar recurso que a montagem não tem.
 */
module.exports = {
  "chat-python-ia": {
    objective:
      "Mostrar que um assistente baseado em regras responde por correspondência de texto, e não por compreensão.",
    skills: ["Condicionais encadeadas", "Manipulação de texto", "Leitura crítica de IA"],
    assessment:
      "O chatbot responde de forma diferente a duas perguntas previstas e dá uma resposta padrão para uma pergunta que ninguém programou?",
  },
  "semaforo-inteligente": {
    objective:
      "Ensinar controle de tempo e de sequência: o computador decidindo o que acontece e por quanto tempo.",
    skills: ["Sequência lógica", "Temporização", "Leitura de circuito simples"],
    assessment:
      "O ciclo verde, amarelo e vermelho se repete na ordem certa e nos tempos definidos, sem ninguém tocar no circuito?",
  },
  "jogo-pong-scratch": {
    objective:
      "Introduzir coordenadas de tela e detecção de colisão a partir de um jogo que a turma já entende de olhar.",
    skills: ["Noção de coordenadas", "Detecção de colisão", "Teste e ajuste"],
    assessment:
      "A bola rebate nas bordas e na raquete, e o jogo reconhece quando ela passa direto?",
  },
  "bussola-digital-microbit": {
    objective:
      "Tornar visível o campo magnético da Terra, e mostrar por que um sensor precisa ser calibrado antes de servir.",
    skills: ["Magnetismo terrestre", "Calibração de sensor", "Orientação espacial"],
    assessment:
      "Girando a placa, a indicação de Norte acompanha a de uma bússola comum colocada ao lado?",
  },
  "braco-robotico-servo": {
    objective:
      "Ensinar o ângulo como grandeza que se controla por código, ligando matemática e movimento mecânico.",
    skills: ["Ângulo e amplitude", "Controle de servomotor", "Montagem mecânica"],
    assessment:
      "O braço pega um objeto e o solta num ponto marcado, repetindo o movimento três vezes seguidas?",
  },
  "historia-interativa-scratch": {
    objective:
      "Ensinar estrutura narrativa ramificada: cada escolha do leitor muda o caminho e o final da história.",
    skills: ["Escrita criativa", "Estrutura condicional", "Comunicação entre atores"],
    assessment:
      "As duas escolhas levam a finais diferentes, e dá para recomeçar a história sem recarregar a página?",
  },
  "pedometro-microbit": {
    objective:
      "Ensinar a transformar movimento físico em dado contável, e a discutir o erro de medição do sensor.",
    skills: ["Leitura de acelerômetro", "Noção de erro de medição", "Autocuidado e saúde"],
    assessment:
      "Andando 20 passos contados em voz alta, a contagem do aparelho fica a no máximo dois passos do número real?",
  },
  "calculadora-scratch": {
    objective:
      "Ensinar variáveis e condicionais encadeadas usando as quatro operações, que a turma já domina no papel.",
    skills: ["Uso de variáveis", "Condicionais encadeadas", "Interface pensada para quem usa"],
    assessment:
      "As quatro operações devolvem o resultado certo, e a divisão por zero mostra um aviso em vez de travar?",
  },
  "jogo-memoria-microbit": {
    objective:
      "Ensinar a guardar e comparar uma sequência que cresce, unindo memória de curto prazo e lógica de lista.",
    skills: ["Sequência e lista", "Comparação de padrões", "Persistência diante do erro"],
    assessment:
      "A sequência ganha um sinal a cada acerto, e o jogo termina no primeiro erro do jogador?",
  },
  "animacao-stop-motion": {
    objective:
      "Ensinar que movimento na tela é ilusão criada por quadros em sequência, com tempo de espera entre eles.",
    skills: ["Noção de quadro e tempo", "Expressão visual", "Planejamento de roteiro"],
    assessment:
      "A animação tem pelo menos oito quadros e o movimento corre sem salto perceptível entre um e outro?",
  },
  "carro-autonomo-nepo": {
    objective:
      "Ensinar o laço fechado entre sensor e ação: medir, decidir e agir, repetidamente e sem intervenção humana.",
    skills: ["Laço de decisão", "Programação em blocos NEPO", "Calibração de distância"],
    assessment:
      "O carro percorre dois metros com dois obstáculos no caminho sem encostar em nenhum?",
  },
  "piano-luz-microbit": {
    objective:
      "Ensinar a mapear uma grandeza contínua, a luz, em faixas discretas que viram notas musicais.",
    skills: ["Leitura de sensor analógico", "Faixas e limiares", "Expressão musical"],
    assessment:
      "Aproximando e afastando a mão do sensor, saem pelo menos três alturas de som distintas e previsíveis?",
  },
  "dado-digital-calliope": {
    objective:
      "Introduzir aleatoriedade e resposta a evento físico, com um objeto que a turma já usa em jogos.",
    skills: ["Número aleatório", "Evento de movimento", "Noção de probabilidade"],
    assessment:
      "Em vinte sacudidas, saem apenas números de 1 a 6 e aparece mais de um valor diferente?",
  },
  "robo-desenhista": {
    objective:
      "Ligar coordenadas cartesianas a movimento mecânico: o desenho planejado vira trajetória no papel.",
    skills: ["Plano cartesiano", "Controle coordenado de motores", "Precisão mecânica"],
    assessment:
      "O robô desenha um quadrado com os quatro lados visivelmente iguais e os cantos fechados?",
  },
  "sistema-irrigacao-inteligente": {
    objective:
      "Ensinar limiar de acionamento: o sistema decide sozinho quando agir, a partir de um valor de referência.",
    skills: ["Limiar de decisão", "Leitura de umidade do solo", "Consciência sobre uso de água"],
    assessment:
      "A bomba liga com o sensor em solo seco e desliga quando o solo molha, sem ficar ligando e desligando sem parar?",
  },
  "contador-pessoas-sensor": {
    objective:
      "Ensinar a inferir direção pela ordem em que dois sensores são acionados, e não apenas a contar eventos.",
    skills: ["Ordem de eventos", "Lógica de entrada e saída", "Leitura de dados de ocupação"],
    assessment:
      "A contagem sobe quando alguém entra, desce quando sai, e volta a zero depois de uma entrada e uma saída?",
  },
  "jogo-reacao-leds": {
    objective:
      "Ensinar a medir o intervalo entre dois eventos, transformando tempo de reação em número comparável.",
    skills: ["Medição de tempo", "Leitura de evento de botão", "Comparação de resultados"],
    assessment:
      "O jogo mostra um tempo diferente a cada rodada e ignora quem aperta o botão antes do sinal acender?",
  },
  "estacao-qualidade-ar": {
    objective:
      "Ensinar leitura simultânea de vários sensores e a interpretar o conjunto, não cada número isolado.",
    skills: ["Leitura de múltiplos sensores", "Interpretação de dados ambientais", "Argumentação com evidência"],
    assessment:
      "Com a sala fechada e a turma reunida perto do sensor, os valores mudam de forma coerente e voltam ao normal depois de abrir a janela?",
  },
  "robo-seguidor-som": {
    objective:
      "Ensinar a comparar dois sinais para inferir posição, princípio usado em localização por som e por rádio.",
    skills: ["Comparação de sinais", "Noção de intensidade sonora", "Depuração de leitura ruidosa"],
    assessment:
      "O robô vira para o lado de onde veio o som em pelo menos quatro de cinco tentativas?",
  },
  "sinalizador-morse": {
    objective:
      "Ensinar codificação: transformar letras em sinais combinados e recuperar a mensagem do outro lado.",
    skills: ["Codificação e decodificação", "Ritmo e precisão", "Comunicação a distância"],
    assessment:
      "Um colega que não viu o código consegue decodificar uma palavra de quatro letras olhando só o LED?",
  },
  "medidor-velocidade-luz": {
    objective:
      "Ensinar velocidade como distância dividida por tempo, com a turma medindo as duas em vez de recebê-las prontas.",
    skills: ["Relação distância e tempo", "Medição com sensores", "Análise de resultado experimental"],
    assessment:
      "Dois objetos lançados em velocidades visivelmente diferentes produzem leituras que respeitam essa diferença?",
  },
  "introducao-raspberry-pi": {
    objective:
      "Mostrar a diferença entre microcontrolador e computador completo, e o que muda quando existe sistema operacional.",
    skills: ["Fundamentos de Linux", "Controle de GPIO", "Comparação entre arquiteturas"],
    assessment:
      "O aluno acende um LED pela GPIO e explica por que aqui existe sistema operacional e no Arduino não?",
  },
  "retropie-console": {
    objective:
      "Ensinar montagem de um sistema completo, do sistema operacional aos periféricos, e discutir preservação digital e direito de uso.",
    skills: ["Administração de sistema Linux", "Configuração de periféricos", "Ética no uso de software"],
    assessment:
      "O console inicia sozinho no menu, reconhece o controle e roda um jogo que a turma tenha direito de usar?",
  },
  "alarme-cloud-iot": {
    objective:
      "Ensinar que um estado físico pode ser espelhado na nuvem quase em tempo real, e o que acontece quando a conexão cai.",
    skills: ["Comunicação com a nuvem", "Leitura de sensor magnético", "Tratamento de perda de conexão"],
    assessment:
      "Abrir a porta muda o painel em poucos segundos, e o estado continua correto depois de desligar e religar a rede?",
  },
  "api-rest-arduino": {
    objective:
      "Ensinar a consumir uma API REST autenticada, levando dados do hardware para uma interface própria.",
    skills: ["Requisição HTTP autenticada", "Leitura de JSON", "Construção de interface"],
    assessment:
      "A página feita pela turma mostra o mesmo valor do painel oficial e se atualiza sem recarregar?",
  },
  "estacao-lcd-arduino": {
    objective:
      "Ensinar o uso de biblioteca externa para controlar um periférico, e a formatar a saída para quem vai ler.",
    skills: ["Uso de biblioteca", "Formatação de saída", "Leitura de temperatura e umidade"],
    assessment:
      "O display mostra temperatura e umidade com as unidades, sem sobrar caractere da leitura anterior na tela?",
  },
  "cofre-eletronico-keypad": {
    objective:
      "Ensinar controle de estado e comparação de sequência digitada, base de qualquer sistema de autenticação.",
    skills: ["Controle de estado", "Comparação de sequência", "Integração entre teclado e atuador"],
    assessment:
      "A senha certa destrava o servo, a errada mantém travado, e o cofre volta a travar sozinho depois de fechado?",
  },
}
