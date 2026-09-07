import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { doc, getDoc, increment, updateDoc } from "firebase/firestore"
import {
  Heart,
  KeyRound,
  Trophy,
  Loader2,
  Check,
  X,
  Sparkles,
  RotateCcw,
  AlertCircle,
  Play,
} from "lucide-react"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { loadQuizQuestions, type QuizQuestion } from "@/lib/legacy-data"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"

const QUESTIONS_PER_ROUND = 5
const STARTING_LIVES = 3
const ENTRY_COST = 2
const DEFAULT_KEYS = 10

type Phase = "carregando" | "pronto" | "jogando" | "fim" | "sem-chaves"

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function QuizPage() {
  const { user } = useAuth()

  const [phase, setPhase] = useState<Phase>("carregando")
  const [pool, setPool] = useState<QuizQuestion[]>([])
  const [round, setRound] = useState<QuizQuestion[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [lives, setLives] = useState(STARTING_LIVES)
  const [score, setScore] = useState(0)
  const [hits, setHits] = useState(0)
  const [keys, setKeys] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Carrega perguntas e o saldo de chaves. As chaves só são debitadas
  // quando a partida começa de fato — o legado descontava já na abertura
  // da página, então fechar a aba antes de jogar custava chaves à toa.
  useEffect(() => {
    async function boot() {
      const questions = await loadQuizQuestions()
      setPool(questions)

      if (!user) {
        setPhase("pronto")
        return
      }
      try {
        const snap = await getDoc(doc(db, "users", user.uid))
        const current = snap.exists() ? snap.data().keys : undefined
        setKeys(typeof current === "number" ? current : DEFAULT_KEYS)
      } catch (err) {
        console.error("Erro ao carregar chaves:", err)
        setKeys(DEFAULT_KEYS)
      }
      setPhase("pronto")
    }
    boot()
  }, [user])

  const start = useCallback(async () => {
    if (pool.length === 0) {
      setError("Não foi possível carregar as perguntas. Recarregue a página.")
      return
    }
    if (keys !== null && keys < ENTRY_COST) {
      setPhase("sem-chaves")
      return
    }

    setError(null)
    setRound(shuffle(pool).slice(0, QUESTIONS_PER_ROUND))
    setIndex(0)
    setSelected(null)
    setRevealed(false)
    setLives(STARTING_LIVES)
    setScore(0)
    setHits(0)
    setPhase("jogando")

    if (user && keys !== null) {
      try {
        await updateDoc(doc(db, "users", user.uid), { keys: increment(-ENTRY_COST) })
        setKeys(keys - ENTRY_COST)
      } catch (err) {
        // Falha ao debitar não deve impedir a partida: o aluno já está
        // jogando e o custo é só da economia interna.
        console.error("Erro ao debitar chaves:", err)
      }
    }
  }, [pool, keys, user])

  const question = round[index]

  function answer(optionIndex: number) {
    if (revealed || !question) return
    setSelected(optionIndex)
    setRevealed(true)

    if (optionIndex === question.correct) {
      setScore((s) => s + (question.xp ?? 10))
      setHits((h) => h + 1)
    } else {
      setLives((l) => l - 1)
    }
  }

  async function next() {
    const isLastQuestion = index >= round.length - 1
    const outOfLives = lives <= 0

    if (isLastQuestion || outOfLives) {
      await finish()
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setRevealed(false)
  }

  async function finish() {
    setPhase("fim")
    if (!user || score === 0) return

    const perfect = hits === round.length
    setSaving(true)
    try {
      const updates: Record<string, unknown> = {
        xp: increment(score),
        quizzesCompleted: increment(1),
      }
      // Acerto perfeito devolve uma chave — mantém a economia do legado.
      if (perfect) {
        updates.keys = increment(1)
        updates.perfectQuizzes = increment(1)
      }
      await updateDoc(doc(db, "users", user.uid), updates)
      if (perfect) setKeys((k) => (k === null ? k : k + 1))
    } catch (err) {
      console.error("Erro ao salvar resultado do quiz:", err)
      setError("Sua pontuação não pôde ser salva. O XP desta partida pode não aparecer no ranking.")
    } finally {
      setSaving(false)
    }
  }

  if (phase === "carregando") {
    return (
      <div className="flex items-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Preparando a arena...
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Arena de Quiz"
        subtitle="Responda, ganhe XP e suba no ranking da turma."
        action={
          <div className="flex items-center gap-3">
            {keys !== null && (
              <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-800">
                <KeyRound className="h-4 w-4" />
                {keys}
              </span>
            )}
            {phase === "jogando" && (
              <span className="flex items-center gap-1">
                {Array.from({ length: STARTING_LIVES }).map((_, i) => (
                  <Heart
                    key={i}
                    className={`h-5 w-5 ${i < lives ? "fill-rose-500 text-rose-500" : "text-muted-foreground/30"}`}
                  />
                ))}
              </span>
            )}
          </div>
        }
      />

      {error && (
        <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {phase === "sem-chaves" && (
        <div className="rounded-3xl border-2 border-amber-200 bg-amber-50 p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <KeyRound className="h-8 w-8" />
          </div>
          <h2 className="font-display text-2xl font-bold text-amber-900">Você ficou sem chaves</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-amber-900/80">
            Cada partida custa {ENTRY_COST} chaves. Complete desafios e projetos para ganhar mais — e
            um acerto perfeito no quiz devolve uma chave.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/app/aluno">Voltar ao meu painel</Link>
          </Button>
        </div>
      )}

      {phase === "pronto" && (
        <div className="rounded-3xl border-2 border-sky-100 bg-gradient-to-br from-sky-50 to-violet-50 p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-violet-600 text-white">
            <Sparkles className="h-8 w-8" />
          </div>
          <h2 className="font-display text-2xl font-bold">Pronto para jogar?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            {QUESTIONS_PER_ROUND} perguntas sobre lógica, programação e robótica. Você tem{" "}
            {STARTING_LIVES} vidas e cada partida custa {ENTRY_COST} chaves.
          </p>
          <Button size="lg" className="mt-6" onClick={start}>
            <Play className="h-4 w-4" />
            Começar partida
          </Button>
        </div>
      )}

      {phase === "jogando" && question && (
        <>
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span>
                Pergunta {index + 1} de {round.length}
                {question.category && ` · ${question.category}`}
              </span>
              <span className="text-primary">{score} XP</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{ width: `${((index + (revealed ? 1 : 0)) / round.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="font-display text-xl font-bold text-balance sm:text-2xl">
              {question.question}
            </h2>

            <div className="mt-6 grid gap-3">
              {question.options.map((option, i) => {
                const isCorrect = i === question.correct
                const isPicked = i === selected

                let tone = "border-border hover:border-primary hover:bg-primary/5"
                if (revealed && isCorrect) tone = "border-emerald-500 bg-emerald-50"
                else if (revealed && isPicked) tone = "border-rose-500 bg-rose-50"
                else if (revealed) tone = "border-border opacity-60"

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => answer(i)}
                    disabled={revealed}
                    className={`flex items-center justify-between gap-3 rounded-2xl border-2 p-4 text-left text-sm font-medium transition-all disabled:cursor-default ${tone}`}
                  >
                    <span>{option}</span>
                    {revealed && isCorrect && <Check className="h-5 w-5 shrink-0 text-emerald-600" />}
                    {revealed && isPicked && !isCorrect && <X className="h-5 w-5 shrink-0 text-rose-600" />}
                  </button>
                )
              })}
            </div>

            {revealed && (
              <div
                className={`mt-6 rounded-2xl border p-4 ${
                  selected === question.correct
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-rose-200 bg-rose-50"
                }`}
              >
                <p className="font-display font-bold">
                  {selected === question.correct
                    ? `Boa! +${question.xp ?? 10} XP`
                    : lives <= 0
                      ? "Suas vidas acabaram"
                      : "Quase!"}
                </p>
                {question.explanation && (
                  <p className="mt-1 text-sm text-muted-foreground">{question.explanation}</p>
                )}
                <Button className="mt-4" onClick={next}>
                  {index >= round.length - 1 || lives <= 0 ? "Ver resultado" : "Próxima pergunta"}
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      {phase === "fim" && (
        <div className="rounded-3xl border-2 border-sky-100 bg-gradient-to-br from-sky-50 to-violet-50 p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white">
            <Trophy className="h-8 w-8" />
          </div>
          <h2 className="font-display text-2xl font-bold">
            {hits === round.length ? "Perfeito! 🎉" : lives <= 0 ? "Fim de jogo" : "Partida concluída"}
          </h2>
          <p className="mt-2 text-muted-foreground">
            Você acertou <strong>{hits}</strong> de {round.length} e ganhou{" "}
            <strong className="text-primary">{score} XP</strong>.
            {hits === round.length && " Acerto perfeito devolveu 1 chave!"}
          </p>

          {saving && (
            <p className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Salvando sua pontuação...
            </p>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button onClick={start}>
              <RotateCcw className="h-4 w-4" />
              Jogar de novo
            </Button>
            <Button variant="outline" asChild>
              <Link to="/app/ranking">Ver ranking</Link>
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
