import { useCallback, useEffect, useState } from "react"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore"
import { Loader2, TicketPercent, Plus, Power } from "lucide-react"
import { db } from "@/lib/firebase"
import { NOMES_PLANO, formatarPreco } from "@/lib/planos"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

/**
 * Cupons de desconto. O desconto é calculado e aplicado no servidor
 * (functions/cupons.js); aqui só se cria e liga/desliga o cupom. Não há
 * botão de apagar de propósito: desativar mantém o histórico de usos.
 */

interface Cupom {
  id: string
  ativo: boolean
  tipo: "percentual" | "valor"
  valor: number
  planos: string[]
  validoAte: Timestamp | null
  usosMax: number | null
  usos?: number
}

const PLANOS_COBRAVEIS = ["pro_mensal", "pro_anual", "aulas_turma", "aulas_individual", "escola"]
const FORMATO_CODIGO = /^[A-Z0-9_-]{3,30}$/

function descreverDesconto(c: Cupom) {
  return c.tipo === "percentual" ? `${c.valor}% de desconto` : `${formatarPreco(c.valor)} de desconto`
}

export function AdminCuponsPage() {
  const toast = useToast()
  const [cupons, setCupons] = useState<Cupom[]>([])
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)

  const [codigo, setCodigo] = useState("")
  const [tipo, setTipo] = useState<"percentual" | "valor">("percentual")
  const [valor, setValor] = useState("")
  const [planos, setPlanos] = useState<string[]>([])
  const [validade, setValidade] = useState("")
  const [usosMax, setUsosMax] = useState("")

  const carregar = useCallback(async () => {
    setCarregando(true)
    try {
      const snap = await getDocs(collection(db, "coupons"))
      const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Cupom)
      lista.sort((a, b) => Number(b.ativo) - Number(a.ativo) || a.id.localeCompare(b.id))
      setCupons(lista)
    } catch {
      toast.erro("Não foi possível carregar os cupons", "Confira a conexão e tente de novo.")
    } finally {
      setCarregando(false)
    }
  }, [toast])

  useEffect(() => {
    carregar()
  }, [carregar])

  async function criar(e: React.FormEvent) {
    e.preventDefault()
    const id = codigo.trim().toUpperCase()
    const numero = Number(valor.replace(",", "."))

    if (!FORMATO_CODIGO.test(id)) {
      toast.erro("Código inválido", "Use de 3 a 30 letras, números, hífen ou sublinhado, sem espaços.")
      return
    }
    if (tipo === "percentual" && !(numero > 0 && numero <= 100)) {
      toast.erro("Percentual inválido", "Informe um número entre 1 e 100.")
      return
    }
    if (tipo === "valor" && !(numero > 0)) {
      toast.erro("Valor inválido", "Informe o desconto em reais, por exemplo 10 ou 9,90.")
      return
    }

    setSalvando(true)
    try {
      const ref = doc(db, "coupons", id)
      if ((await getDoc(ref)).exists()) {
        toast.erro("Esse código já existe", "Escolha outro ou reative o cupom na lista.")
        return
      }
      await setDoc(ref, {
        ativo: true,
        tipo,
        // Percentual guarda o número; valor fixo guarda centavos.
        valor: tipo === "percentual" ? Math.round(numero) : Math.round(numero * 100),
        planos,
        // Vale até o fim do dia escolhido, no horário local.
        validoAte: validade ? Timestamp.fromDate(new Date(`${validade}T23:59:59`)) : null,
        usosMax: usosMax ? Math.max(1, Math.floor(Number(usosMax))) : null,
        usos: 0,
        criadoEm: serverTimestamp(),
      })
      toast.sucesso("Cupom criado", `${id} já pode ser usado na página de assinatura.`)
      setCodigo("")
      setValor("")
      setPlanos([])
      setValidade("")
      setUsosMax("")
      await carregar()
    } catch {
      toast.erro("Não foi possível criar o cupom", "Tente de novo em instantes.")
    } finally {
      setSalvando(false)
    }
  }

  async function alternar(c: Cupom) {
    try {
      await updateDoc(doc(db, "coupons", c.id), { ativo: !c.ativo })
      setCupons((lista) => lista.map((x) => (x.id === c.id ? { ...x, ativo: !c.ativo } : x)))
    } catch {
      toast.erro("Não foi possível alterar o cupom", "Tente de novo em instantes.")
    }
  }

  const campo =
    "w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"

  return (
    <>
      <PageHeader
        title="Cupons"
        subtitle="Descontos aplicados no checkout Pix. O servidor confere validade, plano e limite de usos."
      />

      <div className="grid items-start gap-6 lg:grid-cols-[380px_1fr]">
        <form onSubmit={criar} className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold">
            <Plus className="h-5 w-5" />
            Novo cupom
          </h2>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Código</span>
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              placeholder="VOLTA-AS-AULAS"
              maxLength={30}
              className={`${campo} font-mono uppercase`}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Tipo</span>
              <select value={tipo} onChange={(e) => setTipo(e.target.value as Cupom["tipo"])} className={campo}>
                <option value="percentual">Percentual (%)</option>
                <option value="valor">Valor fixo (R$)</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">
                {tipo === "percentual" ? "Desconto (%)" : "Desconto (R$)"}
              </span>
              <input
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                inputMode="decimal"
                placeholder={tipo === "percentual" ? "20" : "10,00"}
                className={campo}
              />
            </label>
          </div>

          <fieldset>
            <legend className="mb-1.5 text-sm font-semibold">Planos</legend>
            <p className="mb-2 text-xs text-muted-foreground">Nenhum marcado = vale para todos.</p>
            <div className="space-y-1.5">
              {PLANOS_COBRAVEIS.map((id) => (
                <label key={id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={planos.includes(id)}
                    onChange={(e) =>
                      setPlanos((p) => (e.target.checked ? [...p, id] : p.filter((x) => x !== id)))
                    }
                  />
                  {NOMES_PLANO[id] ?? id}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Válido até</span>
              <input type="date" value={validade} onChange={(e) => setValidade(e.target.value)} className={campo} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Limite de usos</span>
              <input
                value={usosMax}
                onChange={(e) => setUsosMax(e.target.value.replace(/\D/g, ""))}
                inputMode="numeric"
                placeholder="sem limite"
                className={campo}
              />
            </label>
          </div>

          <p className="rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground">
            O preço com desconto nunca fica abaixo de R$ 1,00. Para cortesia total, libere o plano
            pela tela de Usuários.
          </p>

          <Button type="submit" className="w-full" disabled={salvando}>
            {salvando ? <Loader2 className="h-4 w-4 animate-spin" /> : <TicketPercent className="h-4 w-4" />}
            Criar cupom
          </Button>
        </form>

        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-display text-lg font-bold">Cupons cadastrados</h2>
          {carregando ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando...
            </div>
          ) : cupons.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum cupom ainda. Crie o primeiro ao lado.</p>
          ) : (
            <div className="divide-y">
              {cupons.map((c) => {
                const expirado = c.validoAte ? c.validoAte.toMillis() < Date.now() : false
                const esgotado = c.usosMax != null && (c.usos ?? 0) >= c.usosMax
                return (
                  <div key={c.id} className={`flex flex-wrap items-center gap-3 py-3 ${c.ativo ? "" : "opacity-60"}`}>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-sm font-bold">{c.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {descreverDesconto(c)} ·{" "}
                        {c.planos?.length ? c.planos.map((p) => NOMES_PLANO[p] ?? p).join(", ") : "todos os planos"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {c.usos ?? 0} uso(s){c.usosMax != null ? ` de ${c.usosMax}` : ""}
                        {c.validoAte ? ` · até ${c.validoAte.toDate().toLocaleDateString("pt-BR")}` : ""}
                        {expirado ? " · expirado" : ""}
                        {esgotado ? " · esgotado" : ""}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${
                        c.ativo ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {c.ativo ? "ativo" : "desativado"}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => alternar(c)}>
                      <Power className="h-4 w-4" />
                      {c.ativo ? "Desativar" : "Reativar"}
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
