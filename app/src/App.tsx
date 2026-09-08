import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { HomePage } from "@/pages/home"
import { PlanosPage } from "@/pages/planos"
import { ContatoPage } from "@/pages/contato"
import { OnboardingPage } from "@/pages/onboarding"
import { AuthProvider } from "@/lib/auth-context"
import { ToastProvider } from "@/components/ui/toast"
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
import { AssistentePage } from "@/pages/app/assistente"
import { ConteudoPage } from "@/pages/app/conteudo"
import { CursoPage } from "@/pages/app/curso"
import { ProjetoPage } from "@/pages/app/projeto"
import { NaoEncontradaPage } from "@/pages/app/nao-encontrada"
import { TutorPage } from "@/pages/app/tutor"
import { RankingPage } from "@/pages/app/ranking"
import { TurmasPage } from "@/pages/app/turmas"
import { QuizPage } from "@/pages/app/quiz"
import { FilhosPage } from "@/pages/app/filhos"
import { AssinaturaPage } from "@/pages/app/assinatura"
import { AdminLayout } from "@/components/dashboard/admin-layout"
import { AdminVisaoPage } from "@/pages/app/admin/visao"
import { AdminUsuariosPage } from "@/pages/app/admin/usuarios"
import { AdminEscolasPage } from "@/pages/app/admin/escolas"
import { AdminVendasPage } from "@/pages/app/admin/vendas"
import { AdminSuportePage } from "@/pages/app/admin/suporte"
import { AdminCopilotoPage } from "@/pages/app/admin/copiloto"

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
      <ToastProvider>
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

          <Route
            path="/planos"
            element={
              <SiteLayout>
                <PlanosPage />
              </SiteLayout>
            }
          />

          <Route
            path="/contato"
            element={
              <SiteLayout>
                <ContatoPage />
              </SiteLayout>
            }
          />

          {/* Sem header/footer do site: a pessoa acabou de entrar e a única
              coisa a fazer aqui é concluir a configuração. */}
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* Painel logado: a sidebar fica montada e só o <Outlet/> troca,
              sem recarregar a página a cada item do menu. */}
          <Route element={<RequireAuth />}>
            <Route path="/app" element={<DashboardLayout />}>
              <Route index element={<RoleHome />} />
              <Route path="estudio" element={<EstudioPage />} />
              <Route path="assistente" element={<AssistentePage />} />
              <Route path="conteudo" element={<ConteudoPage />} />
              <Route path="projetos" element={<ProjetosPage />} />
              <Route path="academia" element={<AcademiaPage />} />
              <Route path="academia/:courseId" element={<CursoPage />} />
              <Route path="arduino" element={<ArduinoPage />} />
              <Route path="projeto/:projectId" element={<ProjetoPage />} />
              <Route path="biblioteca" element={<BibliotecaPage />} />
              <Route path="networking" element={<NetworkingPage />} />
              <Route path="aluno" element={<AlunoPage />} />
              <Route path="tutor" element={<TutorPage />} />
              <Route path="ranking" element={<RankingPage />} />
              <Route path="quiz" element={<QuizPage />} />
              <Route path="filhos" element={<FilhosPage />} />
              <Route path="assinatura" element={<AssinaturaPage />} />
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminVisaoPage />} />
                <Route path="usuarios" element={<AdminUsuariosPage />} />
                <Route path="escolas" element={<AdminEscolasPage />} />
                <Route path="vendas" element={<AdminVendasPage />} />
                <Route path="suporte" element={<AdminSuportePage />} />
                <Route path="copiloto" element={<AdminCopilotoPage />} />
              </Route>
              <Route path="escola" element={<EscolaPage />} />
              <Route path="turmas" element={<TurmasPage />} />
              {/* Qualquer /app/* desconhecido cai aqui, mantendo a sidebar. */}
              <Route path="*" element={<NaoEncontradaPage />} />
            </Route>
          </Route>

          {/*
            Curinga do nível público.

            Sem ele, qualquer caminho fora da lista acima não casava com
            rota nenhuma e o React renderizava NADA — tela branca, sem erro
            e sem mensagem, que é a pior falha possível porque não dá nem
            para a pessoa entender que se perdeu.

            Foi o que aconteceu com /index.html: várias páginas estáticas
            apontavam para lá (o endereço da home é "/"), e quem clicava na
            logo do portal caía numa tela em branco.
          */}
          <Route path="*" element={<NaoEncontradaPage />} />
        </Routes>
      </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
