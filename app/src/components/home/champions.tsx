import { Rocket, Zap, Bot, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const CHAMPIONS = [
  {
    icon: Rocket,
    title: "Olimpíadas Científicas",
    description: "Preparação intensiva para OBR, OBI e torneios acadêmicos.",
  },
  {
    icon: Zap,
    title: "Hackathons",
    description: "Maratonas de programação para resolver problemas reais.",
  },
  {
    icon: Bot,
    title: "Robótica",
    description: "Mentoria técnica para equipes de FLL, FRC e competições locais.",
  },
]

const COMPETITIONS = [
  { name: "OBT", logo: "/comp-obt.png" },
  { name: "OBES", logo: "/comp-obes.jpg" },
  { name: "OBA", logo: "/comp-oba.png" },
  { name: "OBAFOG", logo: "/comp-obafog.jpg" },
  { name: "OBR", logo: "/comp-obr.png" },
  { name: "FMR", logo: "/comp-fmr.jpg" },
  { name: "FCPUCPR", logo: "/comp-fcpucpr.png" },
  { name: "Hackathon Programar", logo: "/comp-programar.jpg" },
  { name: "Eventos Maker", logo: "/comp-maker.png" },
  { name: "Conecta Startup SEBRAE", logo: "/comp-sebrae.png" },
]

export function Champions() {
  return (
    <section className="relative overflow-hidden bg-background py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#0000_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <span className="mb-8 inline-flex items-center gap-2 rounded-full border bg-muted/60 px-5 py-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Nossos alunos vão além
        </span>
        <h2 className="font-display text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
          Apoio a <span className="text-primary">Campeões</span>
        </h2>
        <p className="mx-auto mb-16 mt-6 max-w-3xl text-xl font-light leading-relaxed text-muted-foreground">
          Apoiamos ativamente a participação de nossos alunos e escolas parceiras nos maiores eventos de tecnologia do
          Brasil e do mundo.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {CHAMPIONS.map((c) => (
            <Card
              key={c.title}
              className="rounded-[2rem] bg-muted/40 py-8 text-left shadow-none transition-all hover:-translate-y-1 hover:bg-muted/70 hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                  <c.icon className="size-7 text-primary" />
                </div>
                <CardTitle className="pt-6 font-display text-2xl text-foreground">{c.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground">{c.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20">
          <p className="mb-8 text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Eventos e competições em que já mentoramos equipes
          </p>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
            {COMPETITIONS.map((comp) => (
              <div
                key={comp.name}
                className="flex flex-col items-center justify-center gap-3 rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex h-12 items-center justify-center">
                  <img src={comp.logo} alt={comp.name} loading="lazy" className="h-full max-w-16 object-contain" />
                </div>
                <span className="text-center text-xs font-bold text-muted-foreground">{comp.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-6">
          <p className="text-lg font-medium uppercase tracking-wide text-muted-foreground">
            Apoiamos para ver nossos alunos vencerem
          </p>
          <Button asChild size="lg" className="rounded-2xl px-8 py-6 text-base font-bold shadow-lg shadow-primary/20">
            <a href="/olimpiadas.html">
              Ver todas as olimpíadas e competições
              <ArrowRight className="ml-2 size-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
