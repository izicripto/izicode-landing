import { useState } from "react"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { Users, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"

export function NetworkingPage() {
  const { user, userData } = useAuth()
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  async function requestAccess() {
    if (!user) return
    setStatus("sending")
    try {
      await addDoc(collection(db, "leads"), {
        name: userData?.displayName || user.displayName || "Professor",
        email: user.email,
        role: userData?.role ?? "freelance_teacher",
        goal: "Entrada na comunidade de professores makers",
        message: "Solicitação de acesso ao grupo de networking via dashboard.",
        source: "app_networking",
        status: "new",
        createdAt: serverTimestamp(),
      })
      setStatus("sent")
    } catch (error) {
      console.error("Erro ao solicitar acesso ao networking:", error)
      setStatus("error")
    }
  }

  return (
    <>
      <PageHeader
        title="Networking"
        subtitle="A comunidade de professores makers da Izicode Edu."
      />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <section className="rounded-2xl border bg-card p-7 shadow-sm">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500 text-white">
            <Users className="h-6 w-6" />
          </div>
          <h2 className="font-display text-xl font-bold">Grupo de professores makers</h2>
          <p className="mt-2 text-muted-foreground">
            Um espaço para trocar planos de aula que deram certo, tirar dúvidas de montagem e
            combinar projetos entre escolas. A entrada é feita por convite, para manter o grupo
            focado em quem realmente dá aula com robótica.
          </p>

          <ul className="mt-5 space-y-2.5">
            {[
              "Troca de planos de aula e roteiros já testados em sala",
              "Suporte entre professores para montagem e depuração de projetos",
              "Avisos de olimpíadas, feiras e prazos de inscrição",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            {status === "sent" ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <p>
                  Pedido registrado. Nossa equipe envia o convite para <strong>{user?.email}</strong>{" "}
                  assim que a próxima turma do grupo abrir.
                </p>
              </div>
            ) : (
              <>
                <Button onClick={requestAccess} disabled={status === "sending"}>
                  {status === "sending" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Solicitar convite"
                  )}
                </Button>
                {status === "error" && (
                  <p className="mt-3 flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    Não foi possível registrar seu pedido. Tente novamente em instantes.
                  </p>
                )}
              </>
            )}
          </div>
        </section>

        <aside className="rounded-2xl border border-dashed bg-muted/30 p-6">
          <h3 className="font-display font-bold">Em construção</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            O mural de discussões e o diretório de professores ainda estão sendo construídos. Por
            enquanto a comunidade funciona por convite, e quem pede acesso aqui entra na fila da
            próxima turma.
          </p>
        </aside>
      </div>
    </>
  )
}
