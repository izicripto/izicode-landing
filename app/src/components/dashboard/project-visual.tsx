import {
  Bot,
  Radar,
  Thermometer,
  Sprout,
  Wind,
  Gauge,
  Lock,
  Cloud,
  Lightbulb,
  Music,
  Users,
  PenTool,
  MonitorSmartphone,
  Code2,
  Car,
  TrafficCone,
  Gamepad2,
  Palette,
  Compass,
  Footprints,
  Building2,
  type LucideIcon,
} from "lucide-react"

/**
 * Identidade visual por projeto.
 *
 * Os roteiros do Hub não têm foto própria — e as fotos genéricas de banco
 * de imagens (uma sala de aula qualquer para um "Radar Ultrassônico")
 * comunicavam menos que um desenho certo. Aqui cada projeto ganha um
 * ícone e uma paleta coerentes com o que ele constrói, escolhidos por
 * palavra-chave e estáveis entre renders.
 */

interface Visual {
  icon: LucideIcon
  from: string
  to: string
  accent: string
}

const THEMES: Record<string, Visual> = {
  robotica: { icon: Bot, from: "#0ea5e9", to: "#4f46e5", accent: "#bae6fd" },
  veiculo: { icon: Car, from: "#6366f1", to: "#a21caf", accent: "#e9d5ff" },
  sensor: { icon: Radar, from: "#0891b2", to: "#0e7490", accent: "#a5f3fc" },
  temperatura: { icon: Thermometer, from: "#f97316", to: "#dc2626", accent: "#fed7aa" },
  planta: { icon: Sprout, from: "#16a34a", to: "#047857", accent: "#bbf7d0" },
  ar: { icon: Wind, from: "#06b6d4", to: "#0284c7", accent: "#cffafe" },
  velocidade: { icon: Gauge, from: "#eab308", to: "#ea580c", accent: "#fef08a" },
  seguranca: { icon: Lock, from: "#475569", to: "#1e293b", accent: "#cbd5e1" },
  nuvem: { icon: Cloud, from: "#38bdf8", to: "#6366f1", accent: "#e0f2fe" },
  luz: { icon: Lightbulb, from: "#facc15", to: "#f59e0b", accent: "#fef9c3" },
  semaforo: { icon: TrafficCone, from: "#f43f5e", to: "#b91c1c", accent: "#fecdd3" },
  som: { icon: Music, from: "#a855f7", to: "#7e22ce", accent: "#f3e8ff" },
  contador: { icon: Users, from: "#14b8a6", to: "#0f766e", accent: "#ccfbf1" },
  desenho: { icon: PenTool, from: "#ec4899", to: "#9333ea", accent: "#fbcfe8" },
  display: { icon: MonitorSmartphone, from: "#3b82f6", to: "#1d4ed8", accent: "#dbeafe" },
  codigo: { icon: Code2, from: "#64748b", to: "#334155", accent: "#e2e8f0" },
  jogo: { icon: Gamepad2, from: "#8b5cf6", to: "#4338ca", accent: "#ddd6fe" },
  criativo: { icon: Palette, from: "#f472b6", to: "#c026d3", accent: "#fce7f3" },
  bussola: { icon: Compass, from: "#0ea5e9", to: "#0369a1", accent: "#bae6fd" },
  passos: { icon: Footprints, from: "#f59e0b", to: "#b45309", accent: "#fde68a" },
  cidade: { icon: Building2, from: "#22d3ee", to: "#0e7490", accent: "#cffafe" },
}

/**
 * Palavras-chave em ordem de especificidade: a primeira que casar vence.
 * Sempre sem acento — o texto comparado é normalizado antes.
 */
const KEYWORDS: [string[], keyof typeof THEMES][] = [
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
  [["pedometro", "passos"], "passos"],
  [["cidade", "smart", "3d", "maquete"], "cidade"],
  [["historia", "animacao", "stop", "desenho", "arte"], "criativo"],
  [["jogo", "jogos", "console", "retropie", "pong", "memoria"], "jogo"],
  [["luz", "led", "lampada", "leds"], "luz"],
  [["python", "codigo", "calculadora", "chatbot", "dado", "raspberry", "pi"], "codigo"],
  [["sensor"], "sensor"],
]

/**
 * Casa por palavra inteira, não por substring: "alarme" contém "ar", e
 * sem isso o Alarme de Proximidade recebia o tema de qualidade do ar.
 * Hífen e underscore contam como separador, já que os ids vêm em
 * kebab-case ("qualidade-ar", "alarme-distancia").
 */
function matchesWord(haystack: string, word: string) {
  return new RegExp(`(^|[\\s\\-_])${word}([\\s\\-_]|$)`).test(haystack)
}

function pickVisual(id: string, title: string, tools?: string[]): Visual {
  const haystack = `${id} ${title}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")

  for (const [words, theme] of KEYWORDS) {
    if (words.some((w) => matchesWord(haystack, w))) return THEMES[theme]
  }
  if (tools?.some((t) => /cloud|iot/i.test(t))) return THEMES.nuvem
  return THEMES.robotica
}

export function ProjectVisual({
  id,
  title,
  tools,
  className = "",
  size = "card",
}: {
  id: string
  title: string
  tools?: string[]
  className?: string
  size?: "card" | "hero"
}) {
  const visual = pickVisual(id, title, tools)
  const Icon = visual.icon
  // Id único por instância: dois gradientes com o mesmo id no documento
  // fazem o segundo card herdar a cor do primeiro.
  const gradientId = `pv-${id.replace(/[^a-z0-9]/gi, "")}-${size}`

  return (
    <div
      className={`relative isolate flex items-center justify-center overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 220">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={visual.from} />
            <stop offset="100%" stopColor={visual.to} />
          </linearGradient>
        </defs>
        <rect width="400" height="220" fill={`url(#${gradientId})`} />
        {/* Trilhas de placa de circuito: sugerem eletrônica sem virar ruído. */}
        <g stroke={visual.accent} strokeWidth="1.5" fill="none" opacity="0.35">
          <path d="M0 40 H90 L110 60 H180" />
          <path d="M400 70 H330 L310 90 H250" />
          <path d="M0 170 H70 L95 145 H150" />
          <path d="M400 185 H320 L300 165 H240" />
          <path d="M40 220 V180 L60 160 V120" />
          <path d="M360 0 V45 L340 65 V100" />
        </g>
        <g fill={visual.accent} opacity="0.5">
          {[
            [110, 60],
            [310, 90],
            [95, 145],
            [300, 165],
            [60, 160],
            [340, 65],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.5" />
          ))}
        </g>
      </svg>

      <div className="relative flex items-center justify-center rounded-2xl bg-white/15 p-4 backdrop-blur-sm ring-1 ring-white/25">
        <Icon className={size === "hero" ? "h-14 w-14 text-white" : "h-9 w-9 text-white"} strokeWidth={1.5} />
      </div>
    </div>
  )
}
