import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

/**
 * Abertura do site.
 *
 * A versão anterior vendia só consultoria — um único botão "Contratar
 * Consultoria" — enquanto o produto virou uma plataforma que o professor
 * assina sozinho, a escola contrata por assentos e a família usa para
 * aulas online. Quem chegava aqui não tinha como descobrir que existe um
 * plano gratuito, nem caminho para entrar sem falar com um vendedor.
 *
 * A consultoria continua, mas como um dos caminhos e não como o único.
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
            Plataforma de robótica educacional
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

          <p className="mt-6 text-sm text-muted-foreground">
            Sua escola quer implantar um laboratório maker?{" "}
            <a href="/contato" className="font-semibold text-primary underline-offset-4 hover:underline">
              Fale sobre consultoria
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
