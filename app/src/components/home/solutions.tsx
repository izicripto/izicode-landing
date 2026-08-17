import { Compass, GraduationCap, Wrench } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const SOLUTIONS = [
  {
    icon: Compass,
    color: "text-primary",
    bg: "bg-primary/10",
    title: "Consultoria Estratégica",
    description: "Diagnóstico completo e plano de implementação de laboratórios maker personalizados.",
  },
  {
    icon: GraduationCap,
    color: "text-purple-600",
    bg: "bg-purple-100",
    title: "Formação Docente",
    description: "Capacitação prática para professores dominarem as tecnologias e metodologias ativas.",
  },
  {
    icon: Wrench,
    color: "text-amber-600",
    bg: "bg-amber-100",
    title: "Projetos Maker",
    description: "Implementação de robótica com Arduino, Micro:bit e materiais acessíveis.",
  },
]

export function Solutions() {
  return (
    <section id="solucoes" className="bg-muted/40 py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-balance font-display text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
            Soluções Completas
          </h2>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
            Tudo que sua escola precisa para se tornar referência em ensino de tecnologia.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {SOLUTIONS.map((s) => (
            <Card key={s.title} className="rounded-3xl border-none py-10 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
              <CardHeader>
                <div className={`flex size-16 items-center justify-center rounded-2xl ${s.bg}`}>
                  <s.icon className={`size-8 ${s.color}`} />
                </div>
                <CardTitle className="pt-6 font-display text-2xl">{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed text-muted-foreground">{s.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
