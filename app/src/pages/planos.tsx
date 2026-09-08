import { useState } from "react"
import {
  Check,
  Minus,
  Sparkles,
  Cpu,
  School,
  Video,
  ArrowRight,
  Package,
  ChevronDown,
  ShieldCheck,
} from "lucide-react"
import {
  PLANOS_PROFESSOR,
  PLANOS_AULAS,
  PLANO_ESCOLA,
  KIT_ARDUINO,
  COMPARATIVO,
  FAQ_PLANOS,
  AULAS_NOTA,
  calcularEscola,
  formatarPreco,
  type Plano,
} from "@/lib/planos"
import { Button } from "@/components/ui/button"
import { useSeo, SEO_PAGINAS } from "@/lib/seo"

const PLANO_FREE = PLANOS_PROFESSOR.find((p) => p.id === "free")!
const PRO_MENSAL = PLANOS_PROFESSOR.find((p) => p.id === "pro_mensal")!
const PRO_ANUAL = PLANOS_PROFESSOR.find((p) => p.id === "pro_anual")!

/** Quanto o anual economiza em relação a doze mensalidades. */
const ECONOMIA_ANUAL = PRO_MENSAL.precoCentavos * 12 - PRO_ANUAL.precoCentavos

function PrecoTag({ plano }: { plano: Plano }) {
  if (plano.precoCentavos === 0) {
    return <p className="font-display text-4xl font-extrabold">Grátis</p>
  }
  // No anual, o número que importa para comparar é o mensal equivalente —
  // R$ 397 ao lado de R$ 39,90 parece caro até a pessoa fazer a divisão.
  const mensal = plano.periodo === "ano" ? Math.round(plano.precoCentavos / 12) : plano.precoCentavos
  return (
    <>
      <p className="flex items-baseline gap-1.5">
        <span className="font-display text-4xl font-extrabold tabular-nums">
          {formatarPreco(mensal)}
        </span>
        <span className="text-sm text-muted-foreground">/mês</span>
      </p>
      {plano.periodo === "ano" && (
        <p className="mt-1 text-sm text-muted-foreground">
          cobrados {formatarPreco(plano.precoCentavos)} uma vez por ano
        </p>
      )}
    </>
  )
}

function CardPlano({ plano, destaque }: { plano: Plano; destaque?: boolean }) {
  const realce = destaque ?? plano.popular
  return (
    <div
      className={`relative flex flex-col rounded-3xl border bg-card p-7 shadow-sm transition-shadow hover:shadow-lg ${
        realce ? "border-primary ring-2 ring-primary/20" : ""
      }`}
    >
      {realce && (
        <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-primary-foreground">
          {plano.periodo === "ano" ? "Melhor custo-benefício" : "Mais escolhido"}
        </span>
      )}

      <p className="text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground">
        {plano.publico}
      </p>
      <h3 className="mt-1 font-display text-2xl font-bold">{plano.nome}</h3>

      <div className="mt-4">
        <PrecoTag plano={plano} />
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{plano.resumo}</p>

      <ul className="mt-6 flex-1 space-y-2.5">
        {plano.features.map((f) => (
          <li key={f.texto} className="flex items-start gap-2.5 text-sm">
            <Check
              className={`mt-0.5 h-4 w-4 shrink-0 ${f.destaque ? "text-primary" : "text-emerald-600"}`}
            />
            <span className={f.destaque ? "font-semibold" : ""}>{f.texto}</span>
          </li>
        ))}
      </ul>

      {plano.nota && <p className="mt-4 text-xs text-muted-foreground">{plano.nota}</p>}

      <Button className="mt-6 w-full" variant={realce ? "default" : "outline"} asChild>
        <a href={plano.ctaHref}>
          {plano.cta}
          <ArrowRight className="h-4 w-4" />
        </a>
      </Button>
    </div>
  )
}

/**
 * Tabela do que muda entre gratuito e PRO.
 *
 * Em telas estreitas vira uma lista por recurso, porque uma tabela de três
 * colunas em 360px ou estoura a largura ou fica ilegível.
 */
function Comparativo() {
  return (
    <div className="mt-12 overflow-hidden rounded-3xl border bg-card shadow-sm">
      <div className="border-b bg-muted/40 px-6 py-5">
        <h3 className="font-display text-xl font-bold">Onde está o limite do plano gratuito</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          O gratuito não é uma amostra com prazo — é a plataforma inteira com um teto de IA.
        </p>
      </div>

      {/* Telas largas: tabela */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-6 py-3 font-semibold">Recurso</th>
              <th className="w-44 px-6 py-3 font-semibold">Gratuito</th>
              <th className="w-52 bg-primary/5 px-6 py-3 font-semibold text-primary">
                Professor PRO
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARATIVO.map((linha) => (
              <tr key={linha.recurso} className="border-b last:border-0">
                <td className="px-6 py-3.5">{linha.recurso}</td>
                <td className="px-6 py-3.5 text-muted-foreground">
                  {linha.free === "—" ? (
                    <Minus className="h-4 w-4" aria-label="não incluído" />
                  ) : (
                    linha.free
                  )}
                </td>
                <td className="bg-primary/5 px-6 py-3.5 font-medium">{linha.pro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Telas estreitas: uma linha por recurso */}
      <div className="divide-y sm:hidden">
        {COMPARATIVO.map((linha) => (
          <div key={linha.recurso} className="px-6 py-4">
            <p className="font-medium">{linha.recurso}</p>
            <dl className="mt-2 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
                  Gratuito
                </dt>
                <dd className="text-muted-foreground">{linha.free}</dd>
              </div>
              <div>
                <dt className="text-[0.65rem] font-bold uppercase tracking-wider text-primary">
                  PRO
                </dt>
                <dd className="font-medium">{linha.pro}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </div>
  )
}

function SimuladorEscola() {
  const [professores, setProfessores] = useState(5)
  const [alunos, setAlunos] = useState(120)
  const total = calcularEscola(professores, alunos)
  // Preço por aluno é o número que a direção da escola usa para decidir:
  // ele revela que a conta melhora conforme a escola cresce.
  const porAluno = alunos > 0 ? Math.round(total / alunos) : 0

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
        <p className="mt-1 text-sm text-muted-foreground">
          dá <strong className="tabular-nums text-foreground">{formatarPreco(porAluno)}</strong> por
          aluno por mês
        </p>
        <p className="mt-3 border-t pt-3 text-xs text-muted-foreground">
          Base {formatarPreco(PLANO_ESCOLA.baseCentavos)} · professor extra{" "}
          {formatarPreco(PLANO_ESCOLA.professorExtraCentavos)} · aluno extra{" "}
          {formatarPreco(PLANO_ESCOLA.alunoExtraCentavos)}
        </p>
      </div>

      {/* A escola tem dois caminhos, e o gratuito vem primeiro de propósito:
          nenhuma direção contrata antes de ver a plataforma funcionando. */}
      <Button className="mt-5 w-full" asChild>
        <a href="/contato?plano=escola">
          Pedir código de demonstração
          <ArrowRight className="h-4 w-4" />
        </a>
      </Button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Sem cartão e sem compromisso — a escola navega por tudo antes de decidir.
      </p>

      <div className="mt-5 border-t pt-5">
        <Button variant="outline" className="w-full" asChild>
          <a href={`/app/assinatura?plano=escola&professores=${professores}&alunos=${alunos}`}>
            Gerar cobrança de {formatarPreco(total)}
          </a>
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          A cobrança sai com esses assentos. Depois do pagamento, nossa equipe valida a instituição e
          libera a chave de acesso da escola — é nessa validação que a gestão de turmas é aberta.
        </p>
      </div>
    </div>
  )
}

function Faq() {
  return (
    <div className="mx-auto mt-12 max-w-3xl divide-y rounded-3xl border bg-card shadow-sm">
      {FAQ_PLANOS.map((item) => (
        // <details> em vez de estado em React: abre e fecha sem JavaScript,
        // é acessível por teclado de fábrica e o navegador já encontra o
        // texto fechado no Ctrl+F.
        <details key={item.pergunta} className="group px-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-semibold [&::-webkit-details-marker]:hidden">
            {item.pergunta}
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
          </summary>
          <p className="pb-5 text-sm leading-relaxed text-muted-foreground">{item.resposta}</p>
        </details>
      ))}
    </div>
  )
}

const ATALHOS = [
  { href: "#professor", texto: "Professor autônomo" },
  { href: "#escola", texto: "Escola" },
  { href: "#aulas", texto: "Aulas online" },
]

export function PlanosPage() {
  useSeo(SEO_PAGINAS.planos)

  const [anual, setAnual] = useState(false)
  const proAtivo = anual ? PRO_ANUAL : PRO_MENSAL

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

          {/* A página atende três públicos diferentes; sem atalho, cada um
              rola por duas seções que não são para ele. */}
          <nav aria-label="Seções de planos" className="mt-8 flex flex-wrap justify-center gap-2">
            {ATALHOS.map((a) => (
              <a
                key={a.href}
                href={a.href}
                className="rounded-full border bg-background px-4 py-2 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
              >
                {a.texto}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Professor autônomo */}
      <section id="professor" className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight">Professor autônomo</h2>
            <p className="mt-3 text-muted-foreground">
              Planeje aulas com IA, aprenda as ferramentas e leve projetos prontos para a turma.
            </p>
          </div>

          {/* Mensal x anual */}
          <div className="mb-10 flex justify-center">
            <div
              role="group"
              aria-label="Periodicidade da cobrança"
              className="inline-flex items-center rounded-full border bg-card p-1 shadow-sm"
            >
              <button
                type="button"
                aria-pressed={!anual}
                onClick={() => setAnual(false)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  !anual ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Mensal
              </button>
              <button
                type="button"
                aria-pressed={anual}
                onClick={() => setAnual(true)}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  anual ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Anual
                <span
                  className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${
                    anual ? "bg-primary-foreground/20" : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  economize {formatarPreco(ECONOMIA_ANUAL)}
                </span>
              </button>
            </div>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            <CardPlano plano={PLANO_FREE} destaque={false} />
            <CardPlano plano={proAtivo} destaque />
          </div>

          <Comparativo />

          {/* Kit do plano anual */}
          <div
            className={`mt-10 grid items-center gap-8 rounded-3xl border bg-card p-8 shadow-sm transition-colors lg:grid-cols-[auto_1fr] ${
              anual ? "border-amber-300 ring-2 ring-amber-200" : ""
            }`}
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-orange-600 text-white">
              <Package className="h-12 w-12" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="flex flex-wrap items-center gap-2 font-display text-xl font-bold">
                <Cpu className="h-5 w-5 text-amber-600" />
                O que vem no Kit Arduino Básico
                {anual && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-amber-800">
                    incluído no seu plano
                  </span>
                )}
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
      <section id="escola" className="scroll-mt-20 border-y bg-muted/30 py-20">
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
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-dashed p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold">Antes de contratar</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    A escola recebe um código de demonstração e navega por toda a plataforma. A
                    gestão de turmas é liberada na contratação.
                  </p>
                </div>
              </div>
            </div>

            <SimuladorEscola />
          </div>
        </div>
      </section>

      {/* Aulas online */}
      <section id="aulas" className="scroll-mt-20 py-20">
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

      {/* Dúvidas */}
      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight">Dúvidas frequentes</h2>
            <p className="mt-3 text-muted-foreground">
              O que as pessoas costumam perguntar antes de escolher um plano.
            </p>
          </div>
          <Faq />
        </div>
      </section>

      {/* Fechamento */}
      <section className="border-t py-20">
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
              <a href={PLANO_FREE.ctaHref}>Criar conta grátis</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/contato">Falar com a equipe</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
