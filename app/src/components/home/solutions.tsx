import { Monitor, Compass, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * As duas linhas de negócio da Izicode, lado a lado.
 *
 * A versão anterior desta seção listava só serviços de consultoria
 * (diagnóstico, formação, projetos maker) — o site inteiro falava como se
 * consultoria fosse a única oferta. Depois eu errei para o outro lado, ao
 * promover só a plataforma e rebaixar a consultoria a um link pequeno.
 *
 * As duas convivem e faturam: a plataforma é a entrada sem atrito, que a
 * pessoa contrata sozinha; a consultoria é o contrato maior, com a escola,
 * que envolve uma pessoa da equipe. Nenhuma substitui nem precede a outra,
 * e é assim que elas aparecem aqui — com o mesmo peso visual.
 */
const LINHAS = [
  {
    icone: Monitor,
    cor: "text-primary",
    fundo: "bg-primary/10",
    etiqueta: "Você contrata sozinho",
    titulo: "A plataforma",
    resumo:
      "Ferramentas para planejar, ensinar e acompanhar — disponíveis no momento em que você cria a conta.",
    itens: [
      "Planos de aula gerados por IA, alinhados à BNCC",
      "Academia do Professor: trilhas de Arduino, Scratch e mais",
      "Biblioteca com 37 roteiros de projeto prontos",
      "Área do aluno, quiz e ranking para a turma",
      "Gestão de turmas e acompanhamento (pacote Escola)",
    ],
    cta: "Começar grátis",
    href: "/login.html",
    secundario: { texto: "Ver planos e preços", href: "/planos" },
    destaque: true,
  },
  {
    icone: Compass,
    cor: "text-violet-600",
    fundo: "bg-violet-100",
    etiqueta: "Com a nossa equipe, na sua escola",
    titulo: "A consultoria",
    resumo:
      "Quando a escola quer montar o laboratório e preparar o corpo docente, a gente vai junto — do diagnóstico à primeira aula.",
    itens: [
      "Diagnóstico e plano de implementação do laboratório maker",
      "Formação docente prática, com as ferramentas em mãos",
      "Projetos maker com Arduino, Micro:bit e materiais acessíveis",
      "Adequação curricular à BNCC e às competências digitais",
      "Acompanhamento durante a implantação",
    ],
    cta: "Falar sobre consultoria",
    href: "/contato",
    secundario: null,
  },
]

export function Solutions() {
  return (
    <section id="solucoes" className="bg-muted/40 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-balance font-display text-4xl font-bold tracking-tight lg:text-5xl">
            Duas formas de trabalhar com a gente
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Use a plataforma por conta própria, traga a nossa equipe para dentro da escola, ou as
            duas coisas — muitas escolas começam por uma e adotam a outra depois.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-2">
          {LINHAS.map((l) => (
            <div
              key={l.titulo}
              className={`flex h-full flex-col rounded-3xl border bg-card p-8 shadow-sm lg:p-10 ${
                l.destaque ? "border-primary ring-2 ring-primary/20" : ""
              }`}
            >
              <div className={`flex size-14 items-center justify-center rounded-2xl ${l.fundo}`}>
                <l.icone className={`size-7 ${l.cor}`} />
              </div>

              <p className="mt-6 text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground">
                {l.etiqueta}
              </p>
              <h3 className="mt-1 font-display text-3xl font-bold">{l.titulo}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{l.resumo}</p>

              <ul className="mt-6 flex-1 space-y-3">
                {l.itens.map((i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className={`mt-0.5 size-5 shrink-0 ${l.cor}`} />
                    <span className="text-muted-foreground">{i}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" variant={l.destaque ? "default" : "outline"} className="rounded-2xl">
                  <a href={l.href}>
                    {l.cta}
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
                {l.secundario && (
                  <Button asChild size="lg" variant="ghost" className="rounded-2xl">
                    <a href={l.secundario.href}>{l.secundario.texto}</a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
