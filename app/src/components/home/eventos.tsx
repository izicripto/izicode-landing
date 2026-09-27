import { ArrowRight, Boxes, Medal, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Trilha Maker: a oferta de eventos dentro da linha de consultoria.
 *
 * A seção de Soluções apresenta as duas linhas de negócio em termos gerais.
 * Esta desce um nível e mostra o produto que a escola contrata de fato —
 * três programas encadeados, com ano escolar, formato e o que o aluno leva
 * para casa.
 *
 * Fica logo depois de Soluções de propósito: quem leu "a consultoria" em
 * uma frase encontra aqui o que isso significa na prática, sem precisar
 * clicar. Escola não compra "consultoria"; compra um evento com data,
 * duração e entrega.
 */

const ETAPAS = [
  {
    icon: Boxes,
    anos: "1º ao 3º ano",
    titulo: "Oficinas em Rotação",
    formato: "Meio período · 4 estações",
    resumo:
      "Construir, Mover, Desenhar e Desmontar. Vinte minutos em cada, sem tela e sem competição.",
    leva: "Passaporte maker carimbado",
    href: "/guias/oficinas-rotacao-maker/",
    cor: "bg-sky-100 text-sky-700",
  },
  {
    icon: Medal,
    anos: "4º ao 6º ano",
    titulo: "Feira de Soluções",
    formato: "Dia inteiro · equipes de 4",
    resumo:
      "A equipe encontra um problema real da escola e constrói a solução só com material que ia para o lixo.",
    leva: "Certificado e medalha por categoria",
    href: "/guias/feira-solucoes-maker/",
    cor: "bg-amber-100 text-amber-700",
  },
  {
    icon: Rocket,
    anos: "8º e 9º ano",
    titulo: "Hackathon Escolar",
    formato: "Dois dias · equipes de 4 a 5",
    resumo:
      "Protótipo funcional, mentoria técnica com checkpoints e pitch de cinco minutos diante de um júri.",
    leva: "Projeto próprio e premiação",
    href: "/guias/hackathon-escolar/",
    cor: "bg-indigo-100 text-indigo-700",
  },
]

export function Eventos() {
  return (
    <section id="eventos" className="border-y bg-background py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            Consultoria · Eventos maker
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Trilha Maker: do 1º ao 9º ano
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Três programas encadeados que levam o aluno da coordenação motora ao
            hackathon. Não são eventos avulsos — cada um entrega a base de que o
            seguinte precisa.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {ETAPAS.map((e) => (
            <article
              key={e.titulo}
              className="flex flex-col rounded-2xl border bg-card p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${e.cor}`}
              >
                <e.icon className="h-6 w-6" />
              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                {e.anos}
              </p>
              <h3 className="mt-1 font-display text-2xl font-bold">{e.titulo}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{e.formato}</p>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                {e.resumo}
              </p>

              <p className="mt-5 border-t pt-4 text-sm">
                <span className="font-semibold">O aluno leva: </span>
                <span className="text-muted-foreground">{e.leva}</span>
              </p>

              <a
                href={e.href}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                Ver a metodologia
                <ArrowRight className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>

        {/*
          O argumento que sustenta a venda fica DEPOIS dos três cartões, e
          não antes: quem chega aqui já viu o que é, e é nesse momento que a
          pergunta "por que não um evento só?" aparece.
        */}
        <div className="mx-auto mt-14 max-w-3xl rounded-2xl border-l-4 border-primary bg-muted/40 p-7">
          <p className="text-base leading-relaxed">
            Escola que contrata um hackathon avulso costuma ver as equipes
            travarem sempre nos mesmos pontos: ninguém transforma um incômodo em
            pergunta de pesquisa, a equipe constrói sem desenhar e a falha só
            aparece no palco.{" "}
            <strong>
              Nenhum desses é problema de tecnologia — são hábitos de projeto, e
              hábito não se instala em dois dias.
            </strong>
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <a href="/contato">Falar sobre a trilha na sua escola</a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="/kits/trilha-maker.html">Ver a apresentação completa</a>
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          A metodologia dos três programas está publicada por inteiro, sem
          cadastro. Para quem está começando, a sugestão é sempre a mesma: um
          piloto de meio período, em uma turma só.
        </p>
      </div>
    </section>
  )
}
