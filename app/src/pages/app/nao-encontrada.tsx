import { Link, useLocation } from "react-router-dom"
import { Compass, ArrowLeft, Home } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { homeForRole } from "@/lib/roles"
import { Button } from "@/components/ui/button"

/**
 * Página para endereços que não existem.
 *
 * Atende dois contextos, e a diferença importa: dentro do painel a pessoa
 * está logada e tem o menu ao lado, então basta apontar para lá. No site
 * público ela pode ter chegado por um link antigo de fora e não conhece
 * nada da estrutura — precisa de caminhos, não de uma seta para trás.
 *
 * Antes, qualquer caminho público desconhecido não casava com rota alguma
 * e o React renderizava uma tela em branco: sem erro, sem mensagem, sem
 * como entender o que aconteceu. Era o caso de /index.html, para onde
 * várias páginas estáticas apontavam.
 */
export function NaoEncontradaPage() {
  const { role } = useAuth()
  const { pathname } = useLocation()
  const noPainel = pathname.startsWith("/app")

  if (noPainel) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card/50 px-6 py-20 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Compass className="h-6 w-6" />
        </div>
        <h1 className="font-display text-2xl font-bold">Página não encontrada</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Esta seção do painel não existe (ou foi movida). Use o menu à esquerda para continuar de
          onde estava.
        </p>
        <Button className="mt-6" asChild>
          <Link to={homeForRole(role)}>
            <ArrowLeft className="h-4 w-4" />
            Voltar para o meu painel
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-muted text-muted-foreground">
        <Compass className="h-7 w-7" />
      </div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight lg:text-4xl">
        Essa página não existe
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        O endereço <code className="rounded bg-muted px-1.5 py-0.5 text-sm">{pathname}</code> não
        leva a lugar nenhum. Pode ser um link antigo — abaixo estão os caminhos principais.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button size="lg" asChild>
          <Link to="/">
            <Home className="h-4 w-4" />
            Ir para o início
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link to="/planos">Ver planos</Link>
        </Button>
        <Button size="lg" variant="ghost" asChild>
          <a href="/guias/">Guias para professores</a>
        </Button>
      </div>
    </div>
  )
}
