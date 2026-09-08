import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

/**
 * Abertura do site.
 *
 * A Izicode tem duas linhas de negócio, e as duas precisam aparecer aqui:
 * a **plataforma**, que a pessoa contrata sozinha (professor autônomo,
 * escola por assentos, família com aulas online), e a **consultoria**,
 * em que a equipe vai até a escola implantar o laboratório e formar os
 * professores.
 *
 * A versão original vendia só consultoria — o único botão da página era
 * "Contratar Consultoria" — e quem chegava não descobria que existe um
 * plano gratuito. A correção não é inverter o erro: promover só a
 * plataforma e rebaixar a consultoria a um link solto também desalinha o
 * site do negócio. Por isso a etiqueta anuncia as duas, os botões levam
 * ao caminho sem atrito, e a consultoria tem seu próprio bloco logo
 * abaixo, com metade da seção "Duas formas de trabalhar com a gente".
 */

const GARANTIAS = [
  "Plano gratuito para sempre",
  "Sem cartão de crédito",
  "Alinhado à BNCC",
]

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="text-center lg:text-left">
          <Badge className="mb-6 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-primary hover:bg-primary/10">
            <span className="mr-2 size-2 animate-pulse rounded-full bg-primary" />
            Plataforma + consultoria em robótica educacional
          </Badge>

          <h1 className="text-balance font-display text-5xl font-extrabold leading-tight tracking-tight text-foreground lg:text-6xl">
            Robótica e Inovação para Você ou sua Escola
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-xl font-light leading-relaxed text-muted-foreground lg:mx-0">
            Planeje aulas com IA, aprenda as ferramentas e leve{" "}
            <strong className="font-semibold text-foreground">projetos maker prontos</strong> para a
            turma — com metodologia alinhada à BNCC. Comece de graça hoje.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Button asChild size="lg" className="h-14 rounded-2xl px-8 text-base font-bold shadow-xl shadow-primary/25">
              <a href="/login.html">
                Começar grátis
                <ArrowRight className="size-5" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 rounded-2xl px-8 text-base font-bold">
              <a href="/planos">Ver planos e preços</a>
            </Button>
          </div>

          {/* As três objeções que aparecem antes de qualquer cadastro:
              vai me cobrar? preciso do cartão? serve para a minha escola? */}
          <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 lg:justify-start">
            {GARANTIAS.map((g) => (
              <li key={g} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Check className="size-4 shrink-0 text-emerald-600" />
                {g}
              </li>
            ))}
          </ul>

          {/* A consultoria e a segunda linha de negocio, nao um resquicio
              do posicionamento antigo: aparece aqui e ganha metade da
              secao "Duas formas de trabalhar com a gente", logo abaixo. */}
          <p className="mt-6 rounded-2xl border bg-muted/40 p-4 text-sm text-muted-foreground">
            <strong className="text-foreground">Sua escola quer ir além da plataforma?</strong>{" "}
            Montamos o laboratório maker, formamos a equipe docente e acompanhamos a implantação.{" "}
            <a href="/contato" className="font-semibold text-primary underline-offset-4 hover:underline">
              Falar sobre consultoria
            </a>
          </p>
        </div>

        <div className="group relative hidden lg:block">
          <div className="absolute -inset-4 -z-10 rotate-3 rounded-[2.5rem] bg-primary/20 opacity-60 blur-lg transition-all group-hover:rotate-1" />
          {/* Altura limitada de propósito: sem o teto, a imagem estica a
              linha do grid e empurra os botões para fora da primeira tela
              num notebook de 768px — justamente onde está a conversão. */}
          <img
            src="/hero-lab.jpg"
            alt="Alunos trabalhando em laboratório de robótica"
            fetchPriority="high"
            className="max-h-[30rem] w-full rounded-[2rem] object-cover shadow-2xl transition-transform group-hover:scale-[1.01]"
          />
        </div>
      </div>
    </section>
  )
}
