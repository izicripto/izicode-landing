import { useState } from "react"
import { Check, Sparkles, Cpu, School, Video, ArrowRight, Package } from "lucide-react"
import {
  PLANOS_PROFESSOR,
  PLANOS_AULAS,
  PLANO_ESCOLA,
  KIT_ARDUINO,
  AULAS_NOTA,
  calcularEscola,
  formatarPreco,
  type Plano,
} from "@/lib/planos"
import { Button } from "@/components/ui/button"

function PrecoTag({ plano }: { plano: Plano }) {
  if (plano.precoCentavos === 0) {
    return <p className="font-display text-4xl font-extrabold">Grátis</p>
  }
  return (
    <p className="flex items-baseline gap-1.5">
      <span className="font-display text-4xl font-extrabold tabular-nums">
        {formatarPreco(plano.precoCentavos)}
      </span>
      <span className="text-sm text-muted-foreground">
        {plano.periodo === "ano" ? "/ano" : "/mês"}
      </span>
    </p>
  )
}

function CardPlano({ plano }: { plano: Plano }) {
  return (
    <div
      className={`relative flex flex-col rounded-3xl border bg-card p-7 shadow-sm transition-shadow hover:shadow-lg ${
        plano.popular ? "border-primary ring-2 ring-primary/20" : ""
      }`}
    >
      {plano.popular && (
        <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-primary-foreground">
          Mais escolhido
        </span>
      )}

      <p className="text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground">
        {plano.publico}
      </p>
      <h3 className="mt-1 font-display text-2xl font-bold">{plano.nome}</h3>

      <div className="mt-4">
        <PrecoTag plano={plano} />
        {plano.periodo === "ano" && plano.precoCentavos > 0 && (
          <p className="mt-1 text-sm text-muted-foreground">
            equivale a {formatarPreco(Math.round(plano.precoCentavos / 12))} por mês
          </p>
        )}
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{plano.resumo}</p>

      <ul className="mt-6 flex-1 space-y-2.5">
        {plano.features.map((f) => (
          <li key={f.texto} className="flex items-start gap-2.5 text-sm">
            <Check
              className={`mt-0.5 h-4 w-4 shrink-0 ${
                f.destaque ? "text-primary" : "text-emerald-600"
              }`}
            />
            <span className={f.destaque ? "font-semibold" : ""}>{f.texto}</span>
          </li>
        ))}
      </ul>

      {plano.nota && <p className="mt-4 text-xs text-muted-foreground">{plano.nota}</p>}

      <Button
        className="mt-6 w-full"
        variant={plano.popular || plano.periodo === "ano" ? "default" : "outline"}
        asChild
      >
        <a href={plano.ctaHref}>
          {plano.cta}
          <ArrowRight className="h-4 w-4" />
        </a>
      </Button>
    </div>
  )
}

function SimuladorEscola() {
  const [professores, setProfessores] = useState(5)
  const [alunos, setAlunos] = useState(120)
  const total = calcularEscola(professores, alunos)

  return (
    <div className="rounded-3xl border bg-card p-7 shadow-sm">
      <h3 className="font-display text-xl font-bold">Simule a mensalidade da sua escola</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        A base já inclui {PLANO_ESCOLA.professoresInclusos} professores e{" "}
        {PLANO_ESCOLA.alunosInclusos} alunos. Acima disso, você paga só pelos assentos a mais.
      </p>

      <div className="mt-6 space-y-6">
        <label className="block">
          <div className="mb-2 flex items-center justify-between text-sm font-semibold">
            <span>Professores</span>
            <span className="tabular-nums text-primary">{professores}</span>
          </div>
          <input
            type="range"
            min={1}
            max={40}
            value={professores}
            onChange={(e) => setProfessores(Number(e.target.value))}
            className="w-full accent-[var(--primary)]"
          />
        </label>

        <label className="block">
          <div className="mb-2 flex items-center justify-between text-sm font-semibold">
            <span>Alunos</span>
            <span className="tabular-nums text-primary">{alunos}</span>
          </div>
          <input
            type="range"
            min={10}
            max={800}
            step={10}
            value={alunos}
            onChange={(e) => setAlunos(Number(e.target.value))}
            className="w-full accent-[var(--primary)]"
          />
        </label>
      </div>

      <div className="mt-6 rounded-2xl bg-muted/60 p-5">
        <p className="text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground">
          Mensalidade estimada
        </p>
        <p className="font-display text-3xl font-extrabold tabular-nums">
          {formatarPreco(total)}
          <span className="ml-1 text-sm font-normal text-muted-foreground">/mês</span>
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Base {formatarPreco(PLANO_ESCOLA.baseCentavos)} · professor extra{" "}
          {formatarPreco(PLANO_ESCOLA.professorExtraCentavos)} · aluno extra{" "}
          {formatarPreco(PLANO_ESCOLA.alunoExtraCentavos)}
        </p>
      </div>

      <Button className="mt-5 w-full" asChild>
        <a href="/contact.html?plano=escola">
          Falar com a equipe
          <ArrowRight className="h-4 w-4" />
        </a>
      </Button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Toda escola começa com um código de demonstração gratuito.
      </p>
    </div>
  )
}

export function PlanosPage() {
  return (
    <>
      {/* Abertura */}
      <section className="border-b bg-muted/30 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Planos e preços
          </span>
          <h1 className="mt-6 text-balance font-display text-4xl font-extrabold tracking-tight lg:text-5xl">
            Escolha como levar robótica para a sua sala de aula
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Para o professor que dá aula sozinho, para a escola inteira ou para famílias que querem
            aulas ao vivo. Comece de graça e mude de plano quando fizer sentido.
          </p>
        </div>
      </section>

      {/* Professor autônomo */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight">Professor autônomo</h2>
            <p className="mt-3 text-muted-foreground">
              Planeje aulas com IA, aprenda as ferramentas e leve projetos prontos para a turma.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {PLANOS_PROFESSOR.map((plano) => (
              <CardPlano key={plano.id} plano={plano} />
            ))}
          </div>

          {/* Kit do plano anual */}
          <div className="mt-10 grid items-center gap-8 rounded-3xl border bg-card p-8 shadow-sm lg:grid-cols-[auto_1fr]">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-orange-600 text-white">
              <Package className="h-12 w-12" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="flex items-center gap-2 font-display text-xl font-bold">
                <Cpu className="h-5 w-5 text-amber-600" />
                O que vem no Kit Arduino Básico
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Incluído no plano anual, com frete para todo o Brasil. É o mesmo material usado na
                trilha <strong>Arduino do Zero para Professores</strong>.
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {KIT_ARDUINO.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Escola */}
      <section className="border-y bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <School className="h-3.5 w-3.5" />
              Para instituições
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight">Pacote Escola</h2>
            <p className="mt-3 text-muted-foreground">
              Você paga uma base pela plataforma e o resto por assento — cresce junto com a escola,
              sem contrato que não cabe no orçamento.
            </p>
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border bg-card p-7 shadow-sm">
              <h3 className="font-display text-xl font-bold">O que a escola recebe</h3>
              <ul className="mt-5 space-y-2.5">
                {PLANO_ESCOLA.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-2xl border border-dashed p-4">
                <p className="text-sm font-semibold">Antes de contratar</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  A escola recebe um código de demonstração e navega por toda a plataforma. A gestão
                  de turmas é liberada na contratação.
                </p>
              </div>
            </div>

            <SimuladorEscola />
          </div>
        </div>
      </section>

      {/* Aulas online */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Video className="h-3.5 w-3.5" />
              Novo
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight">Aulas online</h2>
            <p className="mt-3 text-muted-foreground">
              Para famílias que querem robótica e programação para os filhos, com professor de
              verdade ao vivo — sem depender da escola oferecer.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {PLANOS_AULAS.map((plano) => (
              <CardPlano key={plano.id} plano={plano} />
            ))}
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-muted-foreground">
            {AULAS_NOTA}
          </p>
        </div>
      </section>

      {/* Fechamento */}
      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold tracking-tight">
            Ainda em dúvida sobre qual plano?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Crie a conta gratuita e use a plataforma sem prazo para decidir. Se preferir conversar
            antes, a gente responde rápido.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <a href="/login.html">Criar conta grátis</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/contact.html">Falar com a equipe</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
