import { Link } from "react-router-dom"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const NAV_LINKS = [
  { href: "#solucoes", label: "Soluções" },
  { href: "#sobre", label: "Sobre" },
  { href: "#metodologia", label: "Metodologia" },
  { href: "#ferramentas", label: "Ferramentas" },
  { href: "/portal", label: "Portal" },
  { href: "#faq", label: "FAQ" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-lg">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="rounded-2xl border bg-card p-1.5 shadow-sm transition-all group-hover:border-primary/30 group-hover:shadow-primary/10">
            <img
              src="/izicode-logo.png"
              alt="Izicode Edu"
              className="h-11 w-11 object-contain transition-transform group-hover:rotate-6"
            />
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-base font-bold text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
          <Button asChild size="lg" className="rounded-2xl font-bold shadow-lg shadow-primary/20">
            <a href="/login.html">Acessar Plataforma</a>
          </Button>
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle className="font-display text-xl">Izicode Edu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2 px-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-xl p-4 text-lg font-bold text-foreground transition-colors hover:bg-accent"
                >
                  {link.label}
                </a>
              ))}
              <Button asChild size="lg" className="mt-4 rounded-2xl font-bold">
                <a href="/login.html">Acessar Plataforma</a>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
