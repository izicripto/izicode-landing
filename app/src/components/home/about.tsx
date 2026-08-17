import { Compass, Eye, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const PILLARS = [
  {
    icon: Compass,
    title: "Missão",
    description:
      "Levar cultura maker, robótica e tecnologia educacional para dentro da sala de aula, com metodologia acessível e alinhada à BNCC — transformando alunos de usuários de tecnologia em criadores de tecnologia.",
  },
  {
    icon: Eye,
    title: "Visão",
    description:
      "Ser referência em tecnologia educacional no Brasil, unindo prática real de sala de aula, formação de professores e uma plataforma gratuita e acessível a qualquer escola ou família.",
  },
  {
    icon: Heart,
    title: "Valores",
    description:
      "Acesso antes de sofisticação: começamos com robótica desplugada e materiais de baixo custo. Segurança e cidadania digital como base, não como extra. E propósito real — cada projeto conectado à BNCC e aos ODS da ONU.",
  },
]

export function About() {
  return (
    <section id="sobre" className="bg-background py-28">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <Badge className="mb-6 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-primary hover:bg-primary/10">
          Sobre a Izicode Edu
        </Badge>
        <h2 className="text-balance font-display text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
          Tecnologia educacional com propósito, não só ferramenta
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Cultura maker, STEAM e robótica integradas à BNCC — para transformar alunos em criadores de tecnologia,
          não só usuários dela.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
        {PILLARS.map((p) => (
          <Card key={p.title} className="rounded-3xl border-none bg-muted/40 py-10 text-left shadow-none">
            <CardHeader>
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                <p.icon className="size-7 text-primary" />
              </div>
              <CardTitle className="pt-6 font-display text-2xl">{p.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed text-muted-foreground">{p.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
