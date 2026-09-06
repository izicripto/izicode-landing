import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export function RequireAuth() {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      // login.html ainda é a tela de entrada (legada). Guardamos o destino
      // para o login devolver o usuário exatamente onde ele tentou entrar.
      sessionStorage.setItem("redirect_after_login", window.location.href)
      window.location.href = "/login.html"
    }
  }, [user, loading])

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-sm">Carregando seu painel...</p>
        </div>
      </div>
    )
  }

  return <Outlet />
}
