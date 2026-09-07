import { useState } from "react"
import {
  UserPlus,
  Check,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Users,
} from "lucide-react"
import { useChildren, type ChildProfile } from "@/lib/use-children"
import { PageHeader, EmptyState } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

const inputClass =
  "w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"

function ChildForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: ChildProfile
  submitLabel: string
  onSubmit: (data: { name: string; age?: string }) => Promise<void>
  onCancel?: () => void
}) {
  const [name, setName] = useState(initial?.name ?? "")
  const [age, setAge] = useState(initial?.age != null ? String(initial.age) : "")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError("Informe o nome da criança.")
      return
    }
    setBusy(true)
    setError(null)
    try {
      await onSubmit({ name, age })
    } catch (err) {
      console.error("Erro ao salvar perfil:", err)
      setError("Não foi possível salvar agora. Tente novamente.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Nome *</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Maria" className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Idade</span>
          <input
            value={age}
            onChange={(e) => setAge(e.target.value)}
            inputMode="numeric"
            placeholder="Ex: 10"
            className={inputClass}
          />
        </label>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Button type="submit" disabled={busy}>
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            submitLabel
          )}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}

export function FilhosPage() {
  const kids = useChildren()
  const toast = useToast()
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  if (!kids.isParent) {
    return (
      <>
        <PageHeader title="Perfis" subtitle="Gestão dos perfis vinculados à sua conta." />
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="Disponível para contas de responsável"
          description="Esta área é usada por pais e responsáveis para gerenciar os perfis das crianças vinculadas à conta."
        />
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Perfis das crianças"
        subtitle="Cada criança tem seu próprio progresso, dentro da sua conta."
        action={
          !adding && (
            <Button onClick={() => setAdding(true)}>
              <UserPlus className="h-4 w-4" />
              Adicionar criança
            </Button>
          )
        }
      />

      <div className="mb-6 flex items-start gap-3 rounded-2xl border bg-muted/40 p-4 text-sm">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <p className="text-muted-foreground">
          Você é o titular desta conta e responsável pelos dados das crianças vinculadas. As crianças
          não têm login nem e-mail próprios — usam o perfil dentro da sua sessão. Você pode excluir
          um perfil e todo o progresso dele a qualquer momento, aqui mesmo.
        </p>
      </div>

      {kids.error && (
        <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{kids.error}</p>
        </div>
      )}

      {adding && (
        <div className="mb-6">
          <h2 className="mb-3 font-display text-lg font-bold">Nova criança</h2>
          <ChildForm
            submitLabel="Adicionar"
            onCancel={() => setAdding(false)}
            onSubmit={async (data) => {
              await kids.addChild(data)
              toast.sucesso("Perfil criado", `${data.name} já pode usar a plataforma.`)
              setAdding(false)
            }}
          />
        </div>
      )}

      {kids.loading ? (
        <div className="grid gap-3">
          {[0, 1].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl border bg-muted/40" />
          ))}
        </div>
      ) : kids.error ? (
        // Falha de carregamento não é o mesmo que lista vazia: afirmar
        // "nenhuma criança cadastrada" aqui seria dizer algo que não
        // sabemos, ainda mais numa tela com botão de excluir.
        <Button variant="outline" onClick={() => kids.reload()}>
          Tentar carregar novamente
        </Button>
      ) : kids.children.length === 0 && !adding ? (
        <EmptyState
          icon={<UserPlus className="h-6 w-6" />}
          title="Nenhuma criança cadastrada"
          description="Adicione o primeiro perfil para acompanhar o progresso dela na plataforma."
          action={<Button onClick={() => setAdding(true)}>Adicionar criança</Button>}
        />
      ) : (
        <div className="grid gap-3">
          {kids.children.map((child) => {
            const isActive = child.id === kids.activeId

            if (editing === child.id) {
              return (
                <div key={child.id}>
                  <ChildForm
                    initial={child}
                    submitLabel="Salvar alterações"
                    onCancel={() => setEditing(null)}
                    onSubmit={async (data) => {
                      await kids.renameChild(child.id, data)
                      toast.sucesso("Perfil atualizado")
                      setEditing(null)
                    }}
                  />
                </div>
              )
            }

            return (
              <div
                key={child.id}
                className={`rounded-2xl border bg-card p-5 transition-colors ${
                  isActive ? "border-primary ring-2 ring-primary/20" : ""
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-violet-500 font-display text-lg font-bold text-white">
                      {(child.name ?? "?").slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 font-semibold">
                        {child.name || "Sem nome"}
                        {isActive && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-primary">
                            Ativo
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {child.age ? `${child.age} anos · ` : ""}
                        {(child.xp ?? 0).toLocaleString("pt-BR")} XP ·{" "}
                        {child.challengesCompleted ?? 0} desafios
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {!isActive && (
                      <Button variant="outline" size="sm" onClick={() => kids.selectChild(child.id)}>
                        <Check className="h-4 w-4" />
                        Usar este perfil
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditing(child.id)}
                      aria-label={`Editar ${child.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => setConfirmDelete(child.id)}
                      aria-label={`Excluir ${child.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {confirmDelete === child.id && (
                  <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                    <p className="text-sm font-semibold text-destructive">
                      Excluir o perfil de {child.name}?
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Isso apaga o perfil e todo o progresso registrado (XP, badges e desafios). A
                      ação não pode ser desfeita.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deleting}
                        onClick={async () => {
                          setDeleting(true)
                          try {
                            await kids.removeChild(child.id)
                            toast.sucesso("Perfil excluído", "Os dados da criança foram removidos.")
                            setConfirmDelete(null)
                          } catch {
                            toast.erro("Não foi possível excluir", "Tente novamente em instantes.")
                          } finally {
                            setDeleting(false)
                          }
                        }}
                      >
                        {deleting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Excluindo...
                          </>
                        ) : (
                          "Excluir definitivamente"
                        )}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(null)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
