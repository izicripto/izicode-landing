/**
 * Identidade visual por projeto, para as páginas estáticas.
 *
 * Espelha app/src/components/dashboard/project-visual.tsx — a tabela de
 * temas e a lista de palavras-chave precisam ser as mesmas nos dois lados,
 * senão o mesmo projeto aparece com uma cara na biblioteca do painel e
 * outra no Hub Arduino, e quem usa acha que são coisas diferentes.
 * Mudou lá, muda aqui.
 *
 * Por que desenho e não foto: os roteiros não têm foto própria. O que havia
 * era foto genérica de banco de imagens — uma sala de aula qualquer para um
 * "Radar Ultrassônico" — e quinze projetos sem imagem nenhuma, que caíam
 * todos no logo do Arduino, inclusive os de Micro:bit. Um ícone coerente
 * com o que o projeto constrói diz mais do que qualquer uma das duas
 * coisas, e não depende de servidor de terceiro para carregar.
 */

const TEMAS = {
    robotica:    { icone: "bot",        de: "#0ea5e9", para: "#4f46e5", realce: "#bae6fd" },
    veiculo:     { icone: "car",        de: "#6366f1", para: "#a21caf", realce: "#e9d5ff" },
    sensor:      { icone: "radar",      de: "#0891b2", para: "#0e7490", realce: "#a5f3fc" },
    temperatura: { icone: "thermo",     de: "#f97316", para: "#dc2626", realce: "#fed7aa" },
    planta:      { icone: "sprout",     de: "#16a34a", para: "#047857", realce: "#bbf7d0" },
    ar:          { icone: "wind",       de: "#06b6d4", para: "#0284c7", realce: "#cffafe" },
    velocidade:  { icone: "gauge",      de: "#eab308", para: "#ea580c", realce: "#fef08a" },
    seguranca:   { icone: "lock",       de: "#475569", para: "#1e293b", realce: "#cbd5e1" },
    nuvem:       { icone: "cloud",      de: "#38bdf8", para: "#6366f1", realce: "#e0f2fe" },
    luz:         { icone: "bulb",       de: "#facc15", para: "#f59e0b", realce: "#fef9c3" },
    semaforo:    { icone: "cone",       de: "#f43f5e", para: "#b91c1c", realce: "#fecdd3" },
    som:         { icone: "music",      de: "#a855f7", para: "#7e22ce", realce: "#f3e8ff" },
    contador:    { icone: "users",      de: "#14b8a6", para: "#0f766e", realce: "#ccfbf1" },
    desenho:     { icone: "pen",        de: "#ec4899", para: "#9333ea", realce: "#fbcfe8" },
    display:     { icone: "monitor",    de: "#3b82f6", para: "#1d4ed8", realce: "#dbeafe" },
    codigo:      { icone: "code",       de: "#64748b", para: "#334155", realce: "#e2e8f0" },
    jogo:        { icone: "gamepad",    de: "#8b5cf6", para: "#4338ca", realce: "#ddd6fe" },
    criativo:    { icone: "palette",    de: "#f472b6", para: "#c026d3", realce: "#fce7f3" },
    bussola:     { icone: "compass",    de: "#0ea5e9", para: "#0369a1", realce: "#bae6fd" },
    passos:      { icone: "footprints", de: "#f59e0b", para: "#b45309", realce: "#fde68a" },
    cidade:      { icone: "building",   de: "#22d3ee", para: "#0e7490", realce: "#cffafe" },
};

/** Ordem importa: a primeira palavra que casar vence. Sempre sem acento. */
const PALAVRAS = [
    [["semaforo", "transito"], "semaforo"],
    [["irrigacao", "planta", "horta", "solo"], "planta"],
    [["qualidade", "poluicao", "ar"], "ar"],
    [["velocidade", "medidor"], "velocidade"],
    [["som", "audio", "microfone", "piano", "musica"], "som"],
    [["contador", "pessoas"], "contador"],
    [["desenhista", "plotter", "desenho"], "desenho"],
    [["cofre", "alarme", "keypad", "seguranca", "morse"], "seguranca"],
    [["cloud", "iot", "api", "rest"], "nuvem"],
    [["lcd", "display", "estacao"], "display"],
    [["termometro", "temperatura"], "temperatura"],
    [["radar", "ultrassonico", "distancia", "proximidade"], "sensor"],
    [["carro", "autonomo", "veiculo"], "veiculo"],
    [["robo", "braco", "servo", "robotico"], "robotica"],
    [["bussola", "norte"], "bussola"],
    // Só "pedometro": "passos" solto casava com "Primeiros Passos com
    // Raspberry Pi", e o curso de introdução ganhava ícone de pegadas.
    [["pedometro"], "passos"],
    [["cidade", "smart", "3d", "maquete"], "cidade"],
    [["historia", "animacao", "stop", "desenho", "arte"], "criativo"],
    [["jogo", "jogos", "console", "retropie", "pong", "memoria"], "jogo"],
    [["luz", "led", "lampada", "leds"], "luz"],
    [["python", "codigo", "calculadora", "chatbot", "dado", "raspberry", "pi"], "codigo"],
    [["sensor"], "sensor"],
];

/**
 * Casa por palavra inteira, não por trecho: "alarme" contém "ar", e sem
 * isso o Alarme de Proximidade recebia o tema de qualidade do ar. Hífen e
 * underscore contam como separador, porque os ids vêm em kebab-case.
 */
function casaPalavra(texto, palavra) {
    return new RegExp("(^|[\\s\\-_])" + palavra + "([\\s\\-_]|$)").test(texto);
}

function escolherTema(id, titulo, ferramentas) {
    const texto = (id + " " + titulo)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "");

    for (const [palavras, tema] of PALAVRAS) {
        if (palavras.some(function (p) { return casaPalavra(texto, p); })) return TEMAS[tema];
    }
    if (ferramentas && ferramentas.some(function (f) { return /cloud|iot/i.test(f); })) {
        return TEMAS.nuvem;
    }
    return TEMAS.robotica;
}

/* Traços dos ícones, no mesmo grid 24x24 do Lucide usado pelo painel. */
const TRACOS = {
    bot: "M12 8V4H8 M4 8h16v12H4z M2 14h2 M20 14h2 M9 13v2 M15 13v2",
    car: "M19 17h2v-5l-2-4H5L3 12v5h2 M5 17a2 2 0 1 0 4 0 M15 17a2 2 0 1 0 4 0 M9 17h6",
    radar: "M12 12 4.5 6.5 M12 2a10 10 0 1 0 10 10 M12 6a6 6 0 1 0 6 6",
    thermo: "M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z",
    sprout: "M7 20h10 M12 20v-8 M12 12C12 8 9 6 5 6c0 4 3 6 7 6z M12 12c0-3 2-5 6-5 0 3-2 5-6 5z",
    wind: "M3 8h10a3 3 0 1 0-3-3 M3 12h14a3 3 0 1 1-3 3 M3 16h8",
    gauge: "M12 14l4-4 M12 21a9 9 0 1 1 9-9 M3 12h2 M19 12h2 M12 3v2",
    lock: "M5 11h14v10H5z M8 11V7a4 4 0 0 1 8 0v4 M12 15v2",
    cloud: "M6 18h11a4 4 0 0 0 .5-8 6 6 0 0 0-11.4 1.5A3.5 3.5 0 0 0 6 18z",
    bulb: "M9 18h6 M10 21h4 M12 3a6 6 0 0 0-4 10.5c.7.8 1 1.5 1 2.5h6c0-1 .3-1.7 1-2.5A6 6 0 0 0 12 3z",
    cone: "M10 3h4l4 15H6z M4 21h16 M8.5 11h7",
    music: "M9 18V6l10-2v12 M9 18a3 3 0 1 1-3-3 M19 16a3 3 0 1 1-3-3",
    users: "M8 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6 M17 11a3 3 0 1 0 0-6 M17 14c2.8 0 5 2.2 5 5",
    pen: "M4 20l4-1 10-10a2.8 2.8 0 0 0-4-4L4 15z M13.5 6.5l4 4",
    monitor: "M3 5h18v11H3z M8 20h8 M12 16v4",
    code: "M9 8l-5 4 5 4 M15 8l5 4-5 4",
    gamepad: "M7 12h4 M9 10v4 M15.5 12h.01 M18 14h.01 M7 7h10a5 5 0 0 1 5 5v1a4 4 0 0 1-7 2.6H9A4 4 0 0 1 2 13v-1a5 5 0 0 1 5-5z",
    palette: "M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-1.5 1-2 2-2h1a4 4 0 0 0 4-4c0-5-4.5-10-9-10z M7.5 11h.01 M10 7.5h.01 M14.5 7.5h.01 M17 11h.01",
    compass: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M15.5 8.5l-2 5-5 2 2-5z",
    footprints: "M5 20c0-3-1-4-1-6a2.5 2.5 0 0 1 5 0c0 2-1 3-1 6z M15 15c0-3-1-4-1-6a2.5 2.5 0 0 1 5 0c0 2-1 3-1 6z",
    building: "M4 21V6l7-3v18 M11 21h9V10l-9-3 M15 11h.01 M15 15h.01 M7 10h.01 M7 14h.01",
};

/**
 * Devolve o SVG da capa do projeto, como string, para inserir no card.
 *
 * `aria-hidden`: o card já tem o título do projeto como texto ao lado. Ler
 * o desenho de novo só repetiria a mesma informação para quem usa leitor
 * de tela.
 */
export function visualDoProjeto(projeto, opcoes) {
    const tema = escolherTema(projeto.id, projeto.title || "", projeto.tools);
    const traco = TRACOS[tema.icone] || TRACOS.bot;
    const classe = (opcoes && opcoes.classe) || "";
    // Id único por card: dois gradientes com o mesmo id no documento fazem
    // o segundo card herdar a cor do primeiro.
    const gid = "pv-" + String(projeto.id).replace(/[^a-z0-9]/gi, "");

    // As trilhas e os nós são os mesmos do componente do painel, e o ícone
    // fica sobre a mesma placa translúcida. Ali a placa é uma <div> por
    // cima do SVG; aqui tudo precisa caber num SVG só, então ela vira um
    // <rect> arredondado — as medidas estão em unidades do viewBox, que
    // rende o dobro do pixel exibido no card.
    const TRILHAS = [
        "M0 40 H90 L110 60 H180",
        "M400 70 H330 L310 90 H250",
        "M0 170 H70 L95 145 H150",
        "M400 185 H320 L300 165 H240",
        "M40 220 V180 L60 160 V120",
        "M360 0 V45 L340 65 V100",
    ];
    const NOS = [[110, 60], [310, 90], [95, 145], [300, 165], [60, 160], [340, 65]];

    return (
        '<div class="' + classe + '" aria-hidden="true" ' +
             'style="position:relative;display:flex;align-items:center;justify-content:center;' +
             'overflow:hidden;isolation:isolate">' +
        '<svg style="position:absolute;inset:0;width:100%;height:100%" ' +
             'viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" ' +
             'aria-hidden="true" focusable="false">' +
          "<defs>" +
            '<linearGradient id="' + gid + '" x1="0" y1="0" x2="1" y2="1">' +
              '<stop offset="0%" stop-color="' + tema.de + '"/>' +
              '<stop offset="100%" stop-color="' + tema.para + '"/>' +
            "</linearGradient>" +
          "</defs>" +
          '<rect width="400" height="220" fill="url(#' + gid + ')"/>' +
          '<g stroke="' + tema.realce + '" stroke-width="1.5" fill="none" opacity="0.35">' +
            TRILHAS.map(function (d) { return '<path d="' + d + '"/>'; }).join("") +
          "</g>" +
          '<g fill="' + tema.realce + '" opacity="0.5">' +
            NOS.map(function (n) {
                return '<circle cx="' + n[0] + '" cy="' + n[1] + '" r="3.5"/>';
            }).join("") +
          "</g>" +
        "</svg>" +
        // A placa e o ícone ficam FORA do SVG de fundo, como no componente
        // do painel. Dentro dele os dois escalariam junto com o card, e num
        // card alto a placa passava de 60% da altura. Aqui o fundo se
        // estica e o ícone continua do mesmo tamanho, em qualquer card.
        // Estilo embutido de propósito: o CSS do Tailwind destas páginas é
        // um arquivo já compilado, e classes como bg-white/15 podem não ter
        // sido geradas — a placa sumiria sem erro nenhum.
        '<div style="position:relative;display:flex;align-items:center;justify-content:center;' +
             'width:72px;height:72px;border-radius:20px;background:rgba(255,255,255,.15);' +
             'box-shadow:inset 0 0 0 1px rgba(255,255,255,.25);backdrop-filter:blur(2px)">' +
          '<svg class="pv-icone" width="36" height="36" viewBox="0 0 24 24" fill="none" ' +
               'stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" ' +
               'stroke-linejoin="round" aria-hidden="true" focusable="false">' +
            '<path d="' + traco + '"/>' +
          "</svg>" +
        "</div>" +
        "</div>"
    );
}
