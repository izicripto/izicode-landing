import { GraduationCap, School, Users, ArrowRight } from "lucide-react"

/**
 * Três caminhos, três públicos.
 *
 * A página falava com a escola do início ao fim. Mas hoje o produto atende
 * também o professor que paga sozinho e a família que quer aula ao vivo —
 * e nenhum dos dois encontrava para onde ir: o único botão do site era
 * "Contratar Consultoria".
 *
 * Cada cartão leva ao lugar certo para aquele público, e não a um
 * formulário genérico: o professor cria a conta e usa na hora; a escola
 * pede a demonstração antes de decidir; a família fala sobre horários,
 * porque aula ao vivo depende de combinar agenda com uma pessoa.
 */
const PUBLICOS = [
  {
    icon: GraduationCap,
    cor: "text-primary",
    fundo: "bg-primary/10",
    titulo: "Sou professor(a)",
    descricao:
      "Planeje aulas com IA, faça as trilhas da Academia e leve roteiros prontos para a turma. Comece no plano gratuito, sem cartão.",
    itens: ["3 planos de aula com IA de graça", "Biblioteca com 37 roteiros", "Trilhas de Arduino e Scratch"],
    cta: "Criar conta grátis",
    href: "/login.html",
    destaque: true,
  },
  {
    icon: School,
    cor: "text-violet-600",
    fundo: "bg-violet-100",
    titulo: "Represento uma escola",
    descricao:
      "A plataforma para gerir turmas e acompanhar alunos — e, se a escola quiser, a nossa equipe implantando o laboratório maker junto.",
    itens: [
      "Código de demonstração gratuito",
      "Preço por professores e alunos",
      "Consultoria e formação docente à parte",
    ],
    cta: "Pedir demonstração",
    href: "/contato?plano=escola",
  },
  {
    icon: Users,
    cor: "text-amber-600",
    fundo: "bg-amber-100",
    titulo: "Sou pai, mãe ou responsável",
    descricao:
      "Aulas ao vivo de robótica e programação no contraturno, com professor de verdade e turmas pequenas.",
    itens: ["4 aulas por mês, ao vivo", "Turmas de até 8 alunos", "Relatório de evolução"],
    cta: "Ver aulas online",
    href: "/planos#aulas",
  },
]

export function Audiences() {
  return (
    <section id="para-quem" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-balance font-display text-4xl font-bold tracking-tight lg:text-5xl">
            Por onde você quer começar?
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            A mesma plataforma atende quem dá aula sozinho, a escola inteira e as famílias. Cada um
            entra por um caminho diferente.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {PUBLICOS.map((p) => (
            <a
              key={p.titulo}
              href={p.href}
              className={`group flex flex-col rounded-3xl border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${
                p.destaque ? "border-primary ring-2 ring-primary/20" : ""
              }`}
            >
              <div className={`flex size-14 items-center justify-center rounded-2xl ${p.fundo}`}>
                <p.icon className={`size-7 ${p.cor}`} />
              </div>

              <h3 className="mt-6 font-display text-2xl font-bold">{p.titulo}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{p.descricao}</p>

              <ul className="mt-5 flex-1 space-y-2">
                {p.itens.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className={`mt-2 size-1.5 shrink-0 rounded-full ${p.fundo} ${p.cor}`} />
                    {i}
                  </li>
                ))}
              </ul>

              <span className="mt-7 inline-flex items-center gap-2 font-bold text-primary">
                {p.cta}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
