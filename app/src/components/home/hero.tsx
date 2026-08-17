import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="text-center lg:text-left">
          <Badge className="mb-8 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-primary hover:bg-primary/10">
            <span className="mr-2 size-2 animate-pulse rounded-full bg-primary" />
            Consultoria em Tecnologia Educacional
          </Badge>
          <h1 className="text-balance font-display text-5xl font-extrabold leading-tight tracking-tight text-foreground lg:text-6xl">
            Robótica e Inovação para Você ou sua Escola
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-pretty text-xl font-light leading-relaxed text-muted-foreground lg:mx-0 lg:text-2xl">
            Implementamos <strong className="font-semibold text-foreground">Cultura Maker, STEAM e Robótica</strong>{" "}
            integrados à BNCC. Transformamos alunos em criadores de tecnologia.
          </p>
          <div className="mt-12 flex flex-col justify-center gap-6 sm:flex-row lg:justify-start">
            <Button asChild size="lg" className="h-16 rounded-3xl px-10 text-lg font-bold shadow-xl shadow-primary/30">
              <a href="/contact.html">Contratar Consultoria</a>
            </Button>
          </div>
        </div>
        <div className="relative hidden group lg:block">
          <div className="absolute -inset-4 -z-10 rotate-3 rounded-[2.5rem] bg-primary/20 opacity-60 blur-lg transition-all group-hover:rotate-1" />
          <img
            src="/hero-lab.jpg"
            alt="Alunos trabalhando em laboratório de robótica"
            fetchPriority="high"
            className="w-full rounded-[2rem] object-cover shadow-2xl transition-transform group-hover:scale-[1.01]"
          />
        </div>
      </div>
    </section>
  )
}
