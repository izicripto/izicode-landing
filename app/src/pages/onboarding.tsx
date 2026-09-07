import { useEffect, useState } from "react"
import { collection, doc, getDocs, limit, query, serverTimestamp, setDoc, where } from "firebase/firestore"
import {
  School,
  Sparkles,
  Users,
  KeyRound,
  Loader2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { homeForRole } from "@/lib/roles"
import { Button } from "@/components/ui/button"

const inputClass =
  "w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"

/**
 * Perfis que a pessoa pode escolher sozinha.
 *
 * "Aluno" não está aqui de propósito: uma criança não cria a própria
 * conta. Quem cria é o responsável, que vira titular dos dados e
 * cadastra o perfil dela — é o que a LGPD exige para tratamento de dados
 * de menores, e o que evita a plataforma coletar dado de criança sem
 * consentimento de quem responde por ela. Aluno de escola entra pelo
 * código da instituição, onde o consentimento é responsabilidade da escola.
 */
const PERFIS = [
  {
    valor: "school_admin",
    titulo: "Gestor Escolar",
    descricao: "Administro uma escola ou instituição.",
    icone: School,
    cor: "bg-sky-500",
  },
  {
    valor: "freelance_teacher",
    titulo: "Professor Autônomo",
    descricao: "Dou aulas particulares ou cursos livres.",
    icone: Sparkles,
    cor: "bg-violet-600",
  },
  {
    valor: "parent",
    titulo: "Sou Responsável",
    descricao: "Quero cadastrar meu filho(a) para aprender.",
    icone: Users,
    cor: "bg-emerald-600",
  },
]

const SERIES = [
  "Educação Infantil",
  "1º ao 3º ano (Fund. I)",
  "4º e 5º ano (Fund. I)",
  "6º e 7º ano (Fund. II)",
  "8º e 9º ano (Fund. II)",
  "Ensino Médio",
]

export function OnboardingPage() {
  // Usa o mesmo contexto de autenticação do resto do app em vez de
  // assinar o auth por conta própria: uma fonte só de verdade sobre quem
  // está logado, e a tela fica testável como as demais.
  const { user, loading } = useAuth()
  const [passo, setPasso] = useState<1 | 2>(1)
  const [perfil, setPerfil] = useState<string | null>(null)

  // Vínculo com escola, quando a pessoa entra por código.
  const [codigo, setCodigo] = useState("")
  const [validandoCodigo, setValidandoCodigo] = useState(false)
  const [erroCodigo, setErroCodigo] = useState<string | null>(null)
  const [escola, setEscola] = useState<{ id: string; nome: string } | null>(null)

  // Campos por perfil
  const [instituicao, setInstituicao] = useState("")
  const [cargo, setCargo] = useState("")
  const [especialidade, setEspecialidade] = useState("")
  const [cidade, setCidade] = useState("")
  const [disciplina, setDisciplina] = useState("")
  const [idade, setIdade] = useState("")
  const [nomeCrianca, setNomeCrianca] = useState("")
  const [idadeCrianca, setIdadeCrianca] = useState("")
  const [consentimento, setConsentimento] = useState(false)

  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  // Sem sessão não há o que configurar: manda para o login guardando o destino.
  useEffect(() => {
    if (!loading && !user) {
      sessionStorage.setItem("redirect_after_login", window.location.href)
      window.location.href = "/login.html"
    }
  }, [user, loading])

  async function validarCodigo() {
    const cod = codigo.trim().toUpperCase()
    if (!cod) return
    setValidandoCodigo(true)
    setErroCodigo(null)
    try {
      const alunos = await getDocs(
        query(collection(db, "schools"), where("studentCode", "==", cod), limit(1))
      )
      if (!alunos.empty) {
        const d = alunos.docs[0]
        setEscola({ id: d.id, nome: (d.data().name as string) ?? "sua escola" })
        setPerfil("student")
        setPasso(2)
        return
      }

      const profs = await getDocs(
        query(collection(db, "schools"), where("teacherCode", "==", cod), limit(1))
      )
      if (!profs.empty) {
        const d = profs.docs[0]
        setEscola({ id: d.id, nome: (d.data().name as string) ?? "sua escola" })
        setPerfil("teacher")
        setPasso(2)
        return
      }

      setErroCodigo("Código não encontrado. Confira com a sua escola.")
    } catch (e) {
      console.error("Erro ao validar código:", e)
      setErroCodigo("Não foi possível validar o código agora. Tente novamente.")
    } finally {
      setValidandoCodigo(false)
    }
  }

  async function concluir() {
    if (!user || !perfil) return

    setErro(null)

    if (perfil === "parent") {
      if (!nomeCrianca.trim()) {
        setErro("Informe o nome da criança para continuar.")
        return
      }
      if (!consentimento) {
        setErro(
          "É necessário confirmar que você é o responsável legal e autorizar o uso dos dados (LGPD)."
        )
        return
      }
    }

    setSalvando(true)
    try {
      const extra: Record<string, unknown> = {}
      if (perfil === "school_admin") {
        extra.institution = instituicao.trim()
        extra.adminRole = cargo.trim()
      } else if (perfil === "freelance_teacher") {
        extra.specialty = especialidade.trim()
        extra.location = cidade.trim()
      } else if (perfil === "teacher") {
        extra.subject = disciplina.trim()
      } else if (perfil === "student") {
        extra.age = idade.trim() || null
      }

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          displayName: user.displayName ?? "Usuário",
          email: user.email ?? null,
          photoURL: user.photoURL ?? null,
          role: perfil,
          ...extra,
          schoolId: escola?.id ?? null,
          isInstitutional: Boolean(escola),
          onboardingCompleted: true,
          status: "approved",
          createdAt: serverTimestamp(),
        },
        { merge: true }
      )

      // O perfil da criança vive numa subcoleção do responsável: ela não
      // tem login nem e-mail próprios, e o titular dos dados é quem
      // responde por ela.
      if (perfil === "parent") {
        await setDoc(doc(collection(db, "users", user.uid, "children")), {
          name: nomeCrianca.trim(),
          age: idadeCrianca.trim() || null,
          xp: 0,
          badges: [],
          challengesCompleted: 0,
          createdAt: serverTimestamp(),
        })
      }

      window.location.href = homeForRole(perfil, user.email)
    } catch (e) {
      console.error("Erro ao concluir configuração:", e)
      setErro("Não foi possível salvar seu perfil agora. Tente novamente em instantes.")
      setSalvando(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-sm">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <span>Passo {passo} de 2</span>
          <span>{passo === 1 ? "50%" : "100%"}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: passo === 1 ? "50%" : "100%" }}
          />
        </div>
      </div>

      {passo === 1 && (
        <>
          <div className="mb-8 text-center">
            <h1 className="text-balance font-display text-3xl font-extrabold tracking-tight">
              Como você vai usar a Izicode?
            </h1>
            <p className="mt-2 text-muted-foreground">
              Isso define o painel que você verá e as ferramentas liberadas.
            </p>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {PERFIS.map((p) => {
              const Icon = p.icone
              const ativo = perfil === p.valor
              return (
                <button
                  key={p.valor}
                  type="button"
                  onClick={() => {
                    setPerfil(p.valor)
                    setEscola(null)
                  }}
                  className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-6 text-center transition ${
                    ativo ? "border-primary bg-primary/5" : "hover:border-primary/40"
                  }`}
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white ${p.cor}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold">{p.titulo}</h2>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.descricao}</p>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mb-8 rounded-2xl border bg-muted/40 p-6 text-center">
            <p className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider">
              <KeyRound className="h-4 w-4" />
              Sou de uma escola parceira
            </p>
            <p className="mx-auto mt-1.5 max-w-md text-xs text-muted-foreground">
              Professor ou aluno de instituição: use o código que a escola forneceu e sua conta já
              entra vinculada a ela.
            </p>
            <div className="mx-auto mt-4 flex max-w-sm gap-2">
              <input
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && validarCodigo()}
                placeholder="SEU CÓDIGO"
                className={`${inputClass} text-center font-bold uppercase tracking-[0.2em]`}
              />
              <Button onClick={validarCodigo} disabled={validandoCodigo || !codigo.trim()}>
                {validandoCodigo ? <Loader2 className="h-4 w-4 animate-spin" /> : "Acessar"}
              </Button>
            </div>
            {erroCodigo && (
              <p className="mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-destructive">
                <AlertCircle className="h-3.5 w-3.5" />
                {erroCodigo}
              </p>
            )}
          </div>

          <div className="text-center">
            <Button size="lg" disabled={!perfil} onClick={() => setPasso(2)}>
              Continuar
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}

      {passo === 2 && (
        <div className="rounded-3xl border bg-card p-7 shadow-sm sm:p-9">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 mb-4"
            onClick={() => {
              setPasso(1)
              setErro(null)
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>

          {escola && (
            <div className="mb-6 flex items-start gap-2.5 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
              <p className="text-sky-900">
                Você está entrando vinculado a <strong>{escola.nome}</strong> como{" "}
                {perfil === "teacher" ? "professor(a)" : "aluno(a)"}.
              </p>
            </div>
          )}

          {perfil === "school_admin" && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold">Sobre sua escola</h2>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Nome da instituição</span>
                <input
                  value={instituicao}
                  onChange={(e) => setInstituicao(e.target.value)}
                  placeholder="Ex: Colégio Izicode"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Seu cargo</span>
                <input
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  placeholder="Ex: Diretor, Coordenador Pedagógico"
                  className={inputClass}
                />
              </label>
            </div>
          )}

          {perfil === "freelance_teacher" && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold">Seu perfil autônomo</h2>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Área de especialidade</span>
                <input
                  value={especialidade}
                  onChange={(e) => setEspecialidade(e.target.value)}
                  placeholder="Ex: Robótica Arduino, Programação Python"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Cidade ou remoto</span>
                <input
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder="Ex: São Paulo - SP / Remoto"
                  className={inputClass}
                />
              </label>
            </div>
          )}

          {perfil === "teacher" && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold">Perfil do docente</h2>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Disciplina principal</span>
                <input
                  value={disciplina}
                  onChange={(e) => setDisciplina(e.target.value)}
                  placeholder="Ex: Ciências, Tecnologia, Física"
                  className={inputClass}
                />
              </label>
            </div>
          )}

          {perfil === "student" && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold">Perfil do maker</h2>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Série ou ano</span>
                <select value={idade} onChange={(e) => setIdade(e.target.value)} className={inputClass}>
                  <option value="">Selecione...</option>
                  {SERIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {perfil === "parent" && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold">Cadastro do seu filho(a)</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">Nome da criança *</span>
                  <input
                    value={nomeCrianca}
                    onChange={(e) => setNomeCrianca(e.target.value)}
                    placeholder="Ex: Maria"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">Idade</span>
                  <input
                    value={idadeCrianca}
                    onChange={(e) => setIdadeCrianca(e.target.value)}
                    inputMode="numeric"
                    placeholder="Ex: 10"
                    className={inputClass}
                  />
                </label>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border-2 border-amber-200 bg-amber-50 p-4">
                <input
                  type="checkbox"
                  checked={consentimento}
                  onChange={(e) => setConsentimento(e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[var(--primary)]"
                />
                <span className="text-xs leading-relaxed text-amber-900">
                  <strong>Declaro ser responsável legal</strong> pela criança acima e autorizo o
                  tratamento dos seus dados pela Izicode Edu para fins educacionais, conforme a{" "}
                  <strong>LGPD (Lei 13.709/2018, Art. 14)</strong>. O perfil da criança fica
                  vinculado à minha conta — sem e-mail ou senha próprios — e posso excluí-lo quando
                  quiser.
                </span>
              </label>

              <p className="flex items-start gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                Depois você poderá cadastrar outras crianças e acompanhar o progresso de cada uma.
              </p>
            </div>
          )}

          {erro && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{erro}</p>
            </div>
          )}

          <Button className="mt-7 w-full" size="lg" onClick={concluir} disabled={salvando}>
            {salvando ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Configurando...
              </>
            ) : (
              <>
                Acessar a plataforma
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </section>
  )
}
