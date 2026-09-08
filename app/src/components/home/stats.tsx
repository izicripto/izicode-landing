/*
  Números do currículo, somados por período.
  ------------------------------------------
  A conta fica escrita aqui de propósito: são os números que a empresa
  apresenta publicamente, e daqui a um ano ninguém vai lembrar de onde
  saiu "2.902". Com as parcelas à vista, dá para conferir, corrigir uma
  delas e refazer o total sem adivinhação.

  Turmas    26 + 20 + 27 + 38 + 14        = 125  + 15  = 140
  Alunos   540 + 474 + 556 + 689 + 323    = 2582 + 320 = 2902
  Equipes   52 + 47                       = 99   + 7   = 106
  Projetos  38 + 30 + 32 + 45 + 13        = 158  + 12  = 170

  As cinco primeiras parcelas vêm dos anos documentados de 2022 a 2026. A
  última é o levantamento mais recente, ainda sem ano atribuído nos dados
  de origem.

  Equipes tem só duas parcelas porque apenas 2025 e 2026 registram esse
  campo — os anos anteriores não o reportam, então o total reflete o que
  está documentado, e não uma estimativa.
*/
const STATS = [
  { value: "140+", label: "Turmas atendidas" },
  { value: "2.902+", label: "Alunos impactados" },
  { value: "106+", label: "Equipes formadas" },
  { value: "170+", label: "Projetos maker aplicados" },
]

export function Stats() {
  return (
    <section className="border-y bg-card py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Somado desde 2022
        </p>
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-4xl font-black text-primary lg:text-5xl">{stat.value}</p>
              <p className="mt-2 text-sm font-bold uppercase tracking-wide text-muted-foreground lg:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
