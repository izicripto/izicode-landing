import { CheckCircle2, Sparkles, Lightbulb, BookMarked, Globe2, ShieldCheck } from "lucide-react"

const COMMITMENTS = [
  {
    icon: BookMarked,
    title: "BNCC",
    description: "O currículo oficial do MEC. Cada projeto é desenhado para conectar direto com as competências exigidas na etapa escolar do aluno.",
  },
  {
    icon: Globe2,
    title: "ODS",
    description: "Os Objetivos de Desenvolvimento Sustentável da ONU. Todo projeto maker carrega um propósito real, não só técnico.",
  },
  {
    icon: ShieldCheck,
    title: "CERT.br",
    description: "O centro de referência em segurança digital do Brasil. É a base das práticas de cidadania digital que levamos para a sala de aula.",
  },
]

const PILLARS = [
  {
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-100",
    title: "STEAM & PBL",
    description: "Aprendizagem prática baseada em desafios reais e interdisciplinaridade.",
  },
  {
    icon: Sparkles,
    color: "text-blue-600",
    bg: "bg-blue-100",
    title: "Gamificação e Narrativa",
    description: "Engajamento total com missões, RPG e storytelling.",
  },
  {
    icon: Lightbulb,
    color: "text-purple-600",
    bg: "bg-purple-100",
    title: "Startup Thinking",
    description: "Foco em resolução de problemas, ideação e projetos autorais.",
  },
]

export function Methodology() {
  return (
    <section id="metodologia" className="bg-muted/40 py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="space-y-10">
          <h2 className="text-balance font-display text-4xl font-bold leading-tight tracking-tight text-primary lg:text-5xl">
            Ensinamos a Pensar, não apenas a usar
          </h2>
          <div className="space-y-6">
            {PILLARS.map((p) => (
              <div key={p.title} className="flex items-start gap-5">
                <div className={`mt-1 flex size-12 shrink-0 items-center justify-center rounded-full ${p.bg}`}>
                  <p.icon className={`size-6 ${p.color}`} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-foreground">{p.title}</h4>
                  <p className="mt-1 text-lg text-muted-foreground">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2.5rem] border bg-card p-10 shadow-2xl">
          <h4 className="mb-4 font-display text-2xl font-bold text-foreground">Compromisso com a Educação</h4>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Nossa curadoria aborda o cumprimento das 10 competências da{" "}
            <strong className="text-foreground">BNCC</strong>, contribui para os{" "}
            <strong className="text-foreground">ODS</strong> da ONU e segue as diretrizes de segurança do{" "}
            <strong className="text-foreground">CERT.br</strong>.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Três referências, três papéis diferentes — currículo, propósito e segurança — que orientam cada
            decisão pedagógica que tomamos.
          </p>
          <div className="mt-6 space-y-4 border-t pt-6">
            {COMMITMENTS.map((c) => (
              <div key={c.title} className="flex items-start gap-4">
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <c.icon className="size-4.5 text-primary" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-foreground">{c.title}</h5>
                  <p className="text-sm leading-relaxed text-muted-foreground">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-8 border-t pt-6">
            <a href="https://brasil.un.org/pt-br/sdgs" target="_blank" rel="noopener" className="opacity-80 transition-opacity hover:opacity-100">
              <img src="/ods.jpg" alt="Logo ODS" className="h-16 w-auto mix-blend-multiply" />
            </a>
            <a href="https://basenacionalcomum.mec.gov.br/" target="_blank" rel="noopener" className="opacity-80 transition-opacity hover:opacity-100">
              <img src="/bncc.jpg" alt="Logo BNCC" className="h-12 w-auto mix-blend-multiply" />
            </a>
            <a href="https://www.cert.br/" target="_blank" rel="noopener" className="opacity-80 transition-opacity hover:opacity-100">
              <img src="/cert-logo.svg" alt="Logo CERT.br" className="h-12 w-auto mix-blend-multiply" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
