import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { HomePage } from "@/pages/home"
import { AuthProvider } from "@/lib/auth-context"
import { RequireAuth } from "@/components/dashboard/require-auth"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { RoleHome } from "@/pages/app/role-home"
import { EstudioPage } from "@/pages/app/estudio"
import { ProjetosPage } from "@/pages/app/projetos"
import { AcademiaPage } from "@/pages/app/academia"
import { ArduinoPage } from "@/pages/app/arduino"
import { BibliotecaPage } from "@/pages/app/biblioteca"
import { NetworkingPage } from "@/pages/app/networking"
import { AlunoPage } from "@/pages/app/aluno"
import { EscolaPage } from "@/pages/app/escola"

/** Site institucional público: header e footer da landing. */
function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <SiteLayout>
                <HomePage />
              </SiteLayout>
            }
          />

          {/* Painel logado: a sidebar fica montada e só o <Outlet/> troca,
              sem recarregar a página a cada item do menu. */}
          <Route element={<RequireAuth />}>
            <Route path="/app" element={<DashboardLayout />}>
              <Route index element={<RoleHome />} />
              <Route path="estudio" element={<EstudioPage />} />
              <Route path="projetos" element={<ProjetosPage />} />
              <Route path="academia" element={<AcademiaPage />} />
              <Route path="arduino" element={<ArduinoPage />} />
              <Route path="biblioteca" element={<BibliotecaPage />} />
              <Route path="networking" element={<NetworkingPage />} />
              <Route path="aluno" element={<AlunoPage />} />
              <Route path="escola" element={<EscolaPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
