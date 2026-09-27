import { Boxes, Medal, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Consultoria para eventos maker — prévia comercial.
 *
 * O que esta seção NÃO faz: explicar a metodologia. A Trilha Maker é o que
 * a escola contrata, e o conteúdo dela (roteiros, estações, fichas de
 * observação, critérios) é material de negociação — vive em
 * docs/trilha-maker/ e é entregue dentro do contrato de consultoria, não
 * publicado.
 *
 * Uma versão anterior desta seção linkava os três guias completos, abertos
 * no site. Isso entregava de graça o que a consultoria vende.
 *
 * Aqui fica só o que ajuda a escola a reconhecer que existe algo para ela:
 * a faixa etária, o formato e o que o aluno leva para casa. O resto é
 * conversa.
 */

const FORMATOS = [
  {
    icon: Boxes,
    anos: "1º ao 3º ano",
    titulo: "Oficinas maker",
    formato: "Meio período",
    leva: "Passaporte maker",
    cor: "bg-sky-100 text-sky-700",
  },
  {
    icon: Medal,
    anos: "4º ao 6º ano",
    titulo: "Feira de soluções",
    formato: "Dia inteiro",
    leva: "Certificado e medalha",
    cor: "bg-amber-100 text-amber-700",
  },
  {
    icon: Rocket,
    anos: "8º e 9º ano",
    titulo: "Hackathon escolar",
    formato: "Dois dias",
    leva: "Projeto e premiação",
    cor: "bg-indigo-100 text-indigo-700",
  },
]

export function Eventos() {
  return (
    <section id="eventos" className="border-y bg-background py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Consultoria
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">
            Eventos maker na sua escola
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Organizamos e conduzimos o evento com a sua equipe: metodologia,
            formação dos professores e acompanhamento no dia.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {FORMATOS.map((f) => (
            <div
              key={f.titulo}
              className="rounded-2xl border bg-card p-5 text-center shadow-sm"
            >
              <div
                className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${f.cor}`}
              >
                <f.icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                {f.anos}
              </p>
              <h3 className="mt-1 font-display text-lg font-bold">{f.titulo}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{f.formato}</p>
              <p className="mt-2 text-sm text-muted-foreground">{f.leva}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild size="lg">
            <a href="/contato">Solicitar uma proposta</a>
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">
            Para começar, a sugestão é um piloto de meio período, em uma turma só.
          </p>
        </div>
      </div>
    </section>
  )
}
