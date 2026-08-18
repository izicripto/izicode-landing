type Tool = { name: string; logo: string; url: string; internal?: boolean }

const TOOLS: Tool[] = [
  { name: "Scratch", logo: "/scratch.png", url: "https://scratch.mit.edu" },
  { name: "Arduino", logo: "/arduino.png", url: "https://www.arduino.cc" },
  { name: "Micro:bit", logo: "/microbit.png", url: "https://makecode.microbit.org/" },
  { name: "Code.org", logo: "/code.png", url: "https://code.org" },
  { name: "Tinkercad", logo: "/tinkercad.jpg", url: "https://www.tinkercad.com" },
  { name: "Open Roberta", logo: "/openroberta.png", url: "https://lab.open-roberta.org/" },
  { name: "LEGO SPIKE", logo: "/spikelego.jpg", url: "https://education.lego.com/en-us/products/lego-education-spike-prime-set/45678/" },
  { name: "LEGO WeDo 2.0", logo: "/lego-wedo2.png", url: "https://education.lego.com/" },
  { name: "Raspberry Pi", logo: "/raspberry-pi.png", url: "https://www.raspberrypi.org" },
  { name: "Bambu Lab", logo: "/bambulab.png", url: "https://bambulab.com" },
  { name: "MakeyMakey", logo: "/makeymakey.png", url: "https://makeymakey.com" },
  { name: "App Inventor", logo: "/appinventor.png", url: "https://appinventor.mit.edu" },
  { name: "Python", logo: "/python-logo.jpg", url: "https://www.python.org" },
  { name: "RPG Maker", logo: "/rpgmaker.jpeg", url: "https://izicodeedurpg.vercel.app/", internal: true },
]

export function Tools() {
  return (
    <section id="ferramentas" className="bg-background py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="text-balance font-display text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
            Ferramentas Reais, Não Genéricas
          </h2>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
            Cada projeto linka para a ferramenta de verdade — as mesmas usadas em sala de aula todo dia.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {TOOLS.map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener"
              className={`group relative flex flex-col items-center justify-center gap-3 rounded-3xl border p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg ${
                tool.internal
                  ? "border-primary/30 bg-primary/5 hover:border-primary/50"
                  : "bg-card hover:border-primary/30"
              }`}
            >
              {tool.internal && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary-foreground">
                  Ferramenta Interna
                </span>
              )}
              <div className="flex h-14 items-center justify-center">
                <img
                  src={tool.logo}
                  alt={tool.name}
                  loading="lazy"
                  className="h-12 max-w-14 object-contain grayscale transition-all group-hover:grayscale-0"
                />
              </div>
              <span className="text-sm font-bold text-foreground">{tool.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
