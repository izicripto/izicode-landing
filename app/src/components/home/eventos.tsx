import { ArrowRight, Boxes, Medal, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Trilha Maker: a oferta de eventos, dentro da linha de consultoria.
 *
 * Escola não compra "consultoria" — compra um evento com ano escolar,
 * duração e entrega. São esses três dados em cada cartão, e nada além.
 *
 * A primeira versão desta seção tinha 251 palavras e ocupava 1,3 tela: o
 * argumento de venda inteiro, o bloco do "problema que a trilha resolve" e
 * dois CTAs concorrendo. Era a maior seção da home. Quem precisa do
 * argumento clica na metodologia, que está aberta; quem está decidindo
 * precisa saber o que é, para quem e quanto dura.
 */

const ETAPAS = [
  {
    icon: Boxes,
    anos: "1º ao 3º ano",
    titulo: "Oficinas em Rotação",
    formato: "Meio período",
    resumo: "Quatro estações, sem tela e sem competição.",
    href: "/guias/oficinas-rotacao-maker/",
    cor: "bg-sky-100 text-sky-700",
  },
  {
    icon: Medal,
    anos: "4º ao 6º ano",
    titulo: "Feira de Soluções",
    formato: "Dia inteiro",
    resumo: "Um problema real da escola, resolvido com material reaproveitado.",
    href: "/guias/feira-solucoes-maker/",
    cor: "bg-amber-100 text-amber-700",
  },
  {
    icon: Rocket,
    anos: "8º e 9º ano",
    titulo: "Hackathon Escolar",
    formato: "Dois dias",
    resumo: "Protótipo funcional, mentoria e pitch diante de um júri.",
    href: "/guias/hackathon-escolar/",
    cor: "bg-indigo-100 text-indigo-700",
  },
]

export function Eventos() {
  return (
    <section id="eventos" className="border-y bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Consultoria · Eventos maker
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">
            Trilha Maker: do 1º ao 9º ano
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Três programas encadeados, que a escola contrata juntos ou um de cada vez.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {ETAPAS.map((e) => (
            <a
              key={e.titulo}
              href={e.href}
              className="group flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${e.cor}`}>
                <e.icon className="h-5 w-5" />
              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-primary">{e.anos}</p>
              <h3 className="mt-1 font-display text-xl font-bold">{e.titulo}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{e.formato}</p>

              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {e.resumo}
              </p>

              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Ver a metodologia
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild size="lg">
            <a href="/contato">Falar sobre a trilha na sua escola</a>
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">
            Para começar, a sugestão é um piloto de meio período, em uma turma só.
          </p>
        </div>
      </div>
    </section>
  )
}
