import { Button } from "@/components/ui/button"

export function ContactCta() {
  return (
    <section id="contato" className="relative overflow-hidden bg-primary py-24 text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-6 text-center sm:px-6 lg:px-8">
        <h2 className="text-balance font-display text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
          Transforme sua Escola em um Polo de Inovação
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-xl font-medium text-primary-foreground/90">
          Comece hoje pelo plano gratuito, ou fale com a gente sobre implantação na sua instituição.
        </p>
        {/* Dois caminhos: quem já se convenceu lendo a página não deveria
            precisar agendar uma reunião para começar a usar. */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="h-14 rounded-2xl bg-white px-10 text-base font-black text-primary hover:bg-white/90"
          >
            <a href="/login.html">Criar conta grátis</a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-14 rounded-2xl border-white/40 bg-transparent px-10 text-base font-bold text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
          >
            <a href="/contato">Falar com especialista</a>
          </Button>
        </div>
        <p className="mt-5 text-sm text-primary-foreground/80">
          Sem cartão de crédito. O plano gratuito não expira.
        </p>
      </div>
    </section>
  )
}
