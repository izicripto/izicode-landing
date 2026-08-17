import { Button } from "@/components/ui/button"

export function ContactCta() {
  return (
    <section id="contato" className="relative overflow-hidden bg-primary py-24 text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-6 text-center sm:px-6 lg:px-8">
        <h2 className="text-balance font-display text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
          Transforme sua Escola em um Polo de Inovação
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-xl font-medium text-primary-foreground/90">
          Invista no futuro da sua instituição
        </p>
        <Button
          asChild
          size="lg"
          variant="secondary"
          className="mt-12 h-16 rounded-3xl bg-white px-12 text-lg font-black text-primary hover:bg-white/90"
        >
          <a href="/contact.html">Falar com Especialista</a>
        </Button>
      </div>
    </section>
  )
}
