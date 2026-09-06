import { NavLink, Outlet, Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { LogOut, Menu, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { navForRole } from "@/components/dashboard/dashboard-nav"
import { ROLE_LABELS, isProUser, homeForRole } from "@/lib/roles"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function Initials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
      {initials || "?"}
    </div>
  )
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, userData, role, signOut } = useAuth()
  const groups = navForRole(role)
  const displayName = userData?.displayName || user?.displayName || user?.email || "Usuário"
  const planLabel = isProUser(userData) ? "Plano PRO" : ROLE_LABELS[role] || "Plano Gratuito"

  return (
    <div className="flex h-full flex-col">
      <Link
        to={homeForRole(role)}
        onClick={onNavigate}
        className="flex items-center gap-3 border-b px-6 py-5"
      >
        <img src="/izicode-logo.png" alt="Izicode Edu" className="h-9 w-9 object-contain" />
        <div className="leading-tight">
          <strong className="block text-base font-bold">Izicode</strong>
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Edu Platform
          </span>
        </div>
      </Link>

      <div className="mx-4 mt-4 flex items-center gap-3 rounded-2xl border bg-muted/40 p-3">
        {userData?.photoURL || user?.photoURL ? (
          <img
            src={(userData?.photoURL || user?.photoURL) as string}
            alt=""
            className="h-10 w-10 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <Initials name={displayName} />
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{displayName}</p>
          <p className="truncate text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
            {planLabel}
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {groups.map((group) => (
          <div key={group.group} className="mb-5">
            <p className="px-3 pb-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {group.group}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon
                const classes = ({ isActive }: { isActive: boolean }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground/75 hover:bg-muted hover:text-foreground"
                  )

                // Páginas ainda não migradas continuam sendo navegação
                // normal do navegador; as migradas usam o router e trocam
                // só o conteúdo, sem recarregar a página.
                if (item.external) {
                  return (
                    <a
                      key={item.to}
                      href={item.to}
                      onClick={onNavigate}
                      className={classes({ isActive: false })}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" />
                      <span>{item.label}</span>
                    </a>
                  )
                }

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/app"}
                    onClick={onNavigate}
                    className={classes}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t p-3">
        <button
          type="button"
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-[18px] w-[18px]" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  )
}

export function DashboardLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()

  // Fecha o menu mobile a cada troca de rota — sem isso o drawer fica
  // aberto por cima do conteúdo recém-renderizado.
  useEffect(() => setDrawerOpen(false), [location.pathname])

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r bg-card lg:block">
        <SidebarContent />
      </aside>

      <div className="flex min-h-screen min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setDrawerOpen(true)} aria-label="Abrir menu">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <img src="/izicode-logo.png" alt="" className="h-7 w-7 object-contain" />
            <strong className="text-sm">Izicode Edu</strong>
          </div>
          <div className="w-9" />
        </header>

        {drawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Fechar menu"
              className="absolute inset-0 bg-foreground/40"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-[280px] bg-card shadow-xl">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-3 z-10"
                onClick={() => setDrawerOpen(false)}
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </Button>
              <SidebarContent onNavigate={() => setDrawerOpen(false)} />
            </div>
          </div>
        )}

        <main className="mx-auto w-full max-w-[1280px] flex-1 px-5 py-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
