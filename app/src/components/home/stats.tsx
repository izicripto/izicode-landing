// Soma de todos os anos documentados no currículo (2022–2026):
// Turmas 26+20+27+38+14=125 · Alunos 540+474+556+689+323=2582
// Projetos 38+30+32+45+13=158 · Equipes 52+47=99 (só 2025 e 2026 reportam
// contagem de equipes nos dados de origem — os demais anos não têm esse
// campo, então a soma reflete só o que está documentado).
const STATS = [
  { value: "125+", label: "Turmas atendidas" },
  { value: "2.582+", label: "Alunos impactados" },
  { value: "99+", label: "Equipes formadas" },
  { value: "158+", label: "Projetos maker aplicados" },
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
