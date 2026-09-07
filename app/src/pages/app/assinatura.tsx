import { useCallback, useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  CheckCircle2,
  Loader2,
  Clock,
  ArrowRight,
  Sparkles,
  School,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { isProUser } from "@/lib/roles"
import {
  PLANOS_PROFESSOR,
  PLANOS_AULAS,
  PLANO_ESCOLA,
  NOMES_PLANO,
  calcularEscola,
  formatarPreco,
} from "@/lib/planos"
import {
  criarCheckout,
  confirmarPagamento,
  guardarPagamentoPendente,
  lerPagamentoPendente,
  limparPagamentoPendente,
  descreverFalhaCheckout,
  type StatusPagamento,
} from "@/lib/checkout"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

/** Planos que a própria pessoa contrata sozinha, sem passar pelo comercial. */
const AUTOATENDIMENTO = [
  ...PLANOS_PROFESSOR.filter((p) => p.precoCentavos > 0),
  ...PLANOS_AULAS,
]

/**
 * Quantas vezes tentar confirmar sozinho antes de pedir para a pessoa
 * atualizar. O webhook costuma chegar em segundos; passar disso é sinal de
 * que algo travou e insistir só gasta chamada.
 */
const TENTATIVAS = 6
const INTERVALO_MS = 5000

export function AssinaturaPage() {
  const { userData, role } = useAuth()
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const pro = isProUser(userData)

  const [criando, setCriando] = useState<string | null>(null)
  const [conferindo, setConferindo] = useState(false)
  const [status, setStatus] = useState<StatusPagamento | null>(null)
  const [tentativa, setTentativa] = useState(0)
  // Checkout fora do ar: um toast some em 7 segundos e leva a venda junto.
  // Este aviso fica na tela com um caminho alternativo até a pessoa sair.
  const [indisponivel, setIndisponivel] = useState(false)

  // O id vem da URL de retorno da AbacatePay; o localStorage é a reserva
  // para quando a pessoa volta pelo botão do navegador, sem a query.
  const pagamentoId = params.get("pagamento") ?? lerPagamentoPendente()

  const conferir = useCallback(
    async (id: string, silencioso = false) => {
      setConferindo(true)
      try {
        const resultado = await confirmarPagamento(id)
        setStatus(resultado)
        if (resultado.status === "paid") {
          limparPagamentoPendente()
          if (resultado.tipo === "escola") {
            toast.sucesso(
              "Pagamento confirmado",
              "Nossa equipe entra em contato para validar a escola e liberar a chave de acesso."
            )
          } else {
            toast.sucesso("Plano PRO liberado!", "Todas as ferramentas já estão abertas na sua conta.")
          }
        }
        return resultado
      } catch (err) {
        if (!silencioso) {
          const { titulo, detalhe } = descreverFalhaCheckout(err, "conferir")
          toast.erro(titulo, detalhe)
        }
        return null
      } finally {
        setConferindo(false)
      }
    },
    [toast]
  )

  // Ao voltar do checkout, a tela confere sozinha. O webhook é o caminho
  // principal, mas ele atrasa — e quem acabou de pagar está olhando para
  // esta tela esperando o acesso, não querendo apertar um botão.
  useEffect(() => {
    if (!pagamentoId || status?.status === "paid" || tentativa >= TENTATIVAS) return

    const espera = tentativa === 0 ? 0 : INTERVALO_MS
    const t = setTimeout(async () => {
      const r = await conferir(pagamentoId, true)
      if (r?.status !== "paid") setTentativa((n) => n + 1)
    }, espera)

    return () => clearTimeout(t)
  }, [pagamentoId, tentativa, status, conferir])

  async function assinar(planId: string, assentos?: { professores: number; alunos: number }) {
    setCriando(planId)
    try {
      const r = await criarCheckout({ plan: planId, ...assentos })
      guardarPagamentoPendente(r.paymentId)
      // Sai da página; o retorno cai aqui de novo com ?pagamento=<id>.
      window.location.href = r.checkoutUrl
    } catch (err) {
      const { titulo, detalhe } = descreverFalhaCheckout(err)
      toast.erro(titulo, detalhe)
      if (titulo.includes("indisponíveis")) setIndisponivel(true)
      setCriando(null)
    }
  }

  /** Caminho de saída quando o pagamento automático não está disponível. */
  const avisoIndisponivel = indisponivel && (
    <div className="mb-6 flex flex-wrap items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-5">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">O pagamento automático está fora do ar</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Nada foi cobrado de você. Nossa equipe consegue gerar a cobrança manualmente e liberar seu
          acesso hoje mesmo — é só nos dizer qual plano você quer.
        </p>
        <Button className="mt-4" variant="outline" asChild>
          <Link to={`/contato?plano=${params.get("plano") ?? "pro_mensal"}`}>
            Falar com a equipe
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )

  /* ---------------- Já é PRO ---------------- */
  if (pro && status?.status !== "paid") {
    return (
      <>
        <PageHeader title="Sua assinatura" subtitle="Plano e acesso da sua conta." />
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="mt-0.5 h-7 w-7 shrink-0 text-emerald-600" />
            <div>
              <h2 className="font-display text-xl font-bold">Plano PRO ativo</h2>
              <p className="mt-1 text-muted-foreground">
                {role === "admin" || role === "dev"
                  ? "Sua conta é de administração e tem acesso total à plataforma."
                  : "Todas as ferramentas estão liberadas: IA sem limite, trilhas completas e exportação dos roteiros."}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild>
                  <Link to="/app/estudio">
                    Ir para o Estúdio IA
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/app/academia">Ver a Academia</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  /* ---------------- Voltando de um pagamento ---------------- */
  if (pagamentoId && status?.status !== "paid") {
    const desistiu = tentativa >= TENTATIVAS
    return (
      <>
        <PageHeader title="Confirmando seu pagamento" subtitle="Isso costuma levar poucos segundos." />
        <div className="rounded-3xl border bg-card p-8">
          <div className="flex items-start gap-4">
            {desistiu ? (
              <Clock className="mt-0.5 h-7 w-7 shrink-0 text-amber-600" />
            ) : (
              <Loader2 className="mt-0.5 h-7 w-7 shrink-0 animate-spin text-primary" />
            )}
            <div>
              <h2 className="font-display text-xl font-bold">
                {desistiu ? "Ainda não recebemos a confirmação" : "Conferindo com o banco..."}
              </h2>
              <p className="mt-1 text-muted-foreground">
                {desistiu
                  ? "Pagamentos por Pix costumam cair na hora, mas às vezes demoram alguns minutos. " +
                    "Seu acesso é liberado automaticamente assim que a confirmação chegar — você não " +
                    "precisa pagar de novo."
                  : "Assim que o pagamento for confirmado, o acesso é liberado automaticamente."}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button onClick={() => pagamentoId && conferir(pagamentoId)} disabled={conferindo}>
                  {conferindo ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Conferindo...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Conferir agora
                    </>
                  )}
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/contato?plano=suporte">Falar com a equipe</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  /* ---------------- Pagamento confirmado ---------------- */
  if (status?.status === "paid") {
    const escola = status.tipo === "escola"
    return (
      <>
        <PageHeader title="Pagamento confirmado" subtitle="Obrigado!" />
        <div
          className={`rounded-3xl border p-8 ${
            escola ? "border-sky-200 bg-sky-50" : "border-emerald-200 bg-emerald-50"
          }`}
        >
          <div className="flex items-start gap-4">
            {escola ? (
              <School className="mt-0.5 h-7 w-7 shrink-0 text-sky-600" />
            ) : (
              <Sparkles className="mt-0.5 h-7 w-7 shrink-0 text-emerald-600" />
            )}
            <div>
              <h2 className="font-display text-xl font-bold">
                {escola ? "Recebemos o pagamento da escola" : "Seu plano PRO está ativo"}
              </h2>
              <p className="mt-1 text-muted-foreground">
                {escola
                  ? "Agora nossa equipe confere os dados da instituição e libera a chave de acesso da " +
                    "escola. Entramos em contato pelo e-mail do pagamento em até um dia útil — a gestão " +
                    "de turmas é liberada nessa validação."
                  : "Todas as ferramentas já estão abertas na sua conta: IA sem limite, trilhas completas " +
                    "e exportação dos roteiros."}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {escola ? (
                  <Button asChild>
                    <Link to="/app/escola">
                      Ver o painel da escola
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button asChild>
                    <Link to="/app/estudio">
                      Começar pelo Estúdio IA
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  /* ---------------- Cobrança da escola ---------------- */
  // Vem do simulador da página de planos, com os assentos escolhidos lá.
  // O valor mostrado aqui é recalculado com a mesma fórmula, e o servidor
  // recalcula de novo antes de cobrar — o navegador nunca define o preço.
  if (params.get("plano") === "escola") {
    const professores = Number(params.get("professores")) || PLANO_ESCOLA.professoresInclusos
    const alunos = Number(params.get("alunos")) || PLANO_ESCOLA.alunosInclusos
    const total = calcularEscola(professores, alunos)

    return (
      <>
        <PageHeader
          title="Contratação da escola"
          subtitle="Confira os assentos antes de gerar a cobrança."
        />

        {avisoIndisponivel}

        <div className="max-w-2xl rounded-3xl border bg-card p-7 shadow-sm">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground">
                Professores
              </dt>
              <dd className="font-display text-2xl font-bold tabular-nums">{professores}</dd>
            </div>
            <div>
              <dt className="text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground">
                Alunos
              </dt>
              <dd className="font-display text-2xl font-bold tabular-nums">{alunos}</dd>
            </div>
          </dl>

          <div className="mt-6 rounded-2xl bg-muted/60 p-5">
            <p className="text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground">
              Mensalidade
            </p>
            <p className="font-display text-3xl font-extrabold tabular-nums">
              {formatarPreco(total)}
              <span className="ml-1 text-sm font-normal text-muted-foreground">/mês</span>
            </p>
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm">
            <School className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />
            <p className="text-muted-foreground">
              <strong className="text-foreground">Como funciona depois do pagamento:</strong> a gestão
              de turmas <em>não</em> é liberada automaticamente. Nossa equipe confere os dados da
              instituição, valida a chave de acesso da escola e entra em contato em até um dia útil —
              é nessa conversa que combinamos a implantação com os professores.
            </p>
          </div>

          <Button
            className="mt-6 w-full"
            disabled={criando !== null}
            onClick={() => assinar("escola", { professores, alunos })}
          >
            {criando === "escola" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gerando a cobrança...
              </>
            ) : (
              <>
                Gerar cobrança de {formatarPreco(total)}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Quer ajustar os assentos?{" "}
            <Link to="/planos#escola" className="font-semibold text-primary hover:underline">
              Voltar ao simulador
            </Link>
          </p>
        </div>
      </>
    )
  }

  /* ---------------- Escolher um plano ---------------- */
  const escolhido = params.get("plano")

  return (
    <>
      <PageHeader
        title="Assinar"
        subtitle="Contrate direto por aqui, com Pix. O acesso é liberado assim que o pagamento é confirmado."
      />

      {avisoIndisponivel}

      <div className="grid gap-5 lg:grid-cols-2">
        {AUTOATENDIMENTO.map((plano) => (
          <div
            key={plano.id}
            className={`flex flex-col rounded-3xl border bg-card p-7 shadow-sm ${
              escolhido === plano.id ? "border-primary ring-2 ring-primary/20" : ""
            }`}
          >
            <p className="text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground">
              {plano.publico}
            </p>
            <h3 className="mt-1 font-display text-2xl font-bold">{plano.nome}</h3>
            <p className="mt-3 flex items-baseline gap-1.5">
              <span className="font-display text-3xl font-extrabold tabular-nums">
                {formatarPreco(plano.precoCentavos)}
              </span>
              <span className="text-sm text-muted-foreground">
                {plano.periodo === "ano" ? "/ano" : "/mês"}
              </span>
            </p>
            <p className="mt-3 text-sm text-muted-foreground">{plano.resumo}</p>
            {plano.nota && <p className="mt-2 text-xs text-muted-foreground">{plano.nota}</p>}
            <div className="flex-1" />
            <Button
              className="mt-5 w-full"
              disabled={criando !== null}
              onClick={() => assinar(plano.id)}
            >
              {criando === plano.id ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Abrindo o pagamento...
                </>
              ) : (
                <>
                  Assinar com Pix
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border bg-muted/40 p-5 text-sm">
        <School className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
        <p className="text-muted-foreground">
          <strong className="text-foreground">É uma escola?</strong> O valor depende de quantos
          professores e alunos vão usar. Faça a simulação na{" "}
          <Link to="/planos#escola" className="font-semibold text-primary hover:underline">
            página de planos
          </Link>{" "}
          e gere a cobrança por lá — a liberação da gestão de turmas acontece depois que nossa equipe
          valida a instituição.
        </p>
      </div>

      {params.get("erro") && (
        <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            {NOMES_PLANO[params.get("erro") ?? ""] ?? "O pagamento"} não pôde ser iniciado. Tente
            novamente.
          </p>
          <button
            type="button"
            className="ml-auto shrink-0 font-semibold underline"
            onClick={() => setParams({}, { replace: true })}
          >
            fechar
          </button>
        </div>
      )}
    </>
  )
}
