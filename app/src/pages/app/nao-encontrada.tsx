import { Link } from "react-router-dom"
import { Compass, ArrowLeft } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { homeForRole } from "@/lib/roles"
import { Button } from "@/components/ui/button"

/**
 * 404 dentro do painel: cai aqui qualquer /app/* que não exista (link
 * antigo, URL digitada errada). Antes disso, a rota sem correspondência
 * renderizava uma tela em branco sem sidebar — parecia a aplicação ter
 * quebrado.
 */
export function NaoEncontradaPage() {
  const { role } = useAuth()

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
