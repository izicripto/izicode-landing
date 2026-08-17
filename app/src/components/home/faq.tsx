import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQS = [
  {
    question: "Quais são os serviços específicos da Izicode?",
    answer:
      "Três frentes, não uma coisa só: a plataforma (biblioteca de projetos, gerador de aulas com IA e gamificação) é gratuita para qualquer professor. Para a escola que quer implementação de verdade, vendemos formação docente e consultoria completa de laboratório maker. E para quem quer começar sozinho, sem depender da escola, tem o Kit Missão Maker.",
  },
  {
    question: "A Izicode ajuda na adequação à BNCC?",
    answer:
      "Sim! Todo nosso material é alinhado à Base Nacional Comum Curricular, focando especificamente nas competências de Cultura Digital, Pensamento Científico e Argumentação — e isso vale tanto para o conteúdo gratuito da plataforma quanto para a consultoria.",
  },
  {
    question: "Preciso de um laboratório caro para começar?",
    answer:
      'Não! A plataforma em si é 100% gratuita, e nossa metodologia é flexível. Começamos com "Robótica Desplugada" e materiais acessíveis (sucata, papelão) e evoluímos para kits eletrônicos conforme o orçamento da escola ou da família permite.',
  },
  {
    question: "Vocês oferecem suporte aos professores?",
    answer:
      "Totalmente. O grande diferencial da Izicode é a Formação Docente continuada, contratada à parte da plataforma gratuita. Não é só entregar o kit — é ensinar o professor a virar um mentor maker confiante.",
  },
  {
    question: "A robótica atrapalha as aulas tradicionais?",
    answer:
      "Pelo contrário! Ela potencializa. Alunos que aprendem lógica e programação melhoram significativamente o desempenho em Matemática e Ciências.",
  },
]

export function Faq() {
  return (
    <section id="faq" className="bg-background py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-balance font-display text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
            Dúvidas Frequentes
          </h2>
        </div>
        <Accordion type="single" collapsible defaultValue="item-0" className="space-y-4">
          {FAQS.map((faq, i) => (
            <AccordionItem
              key={faq.question}
              value={`item-${i}`}
              className="rounded-2xl border bg-card px-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <AccordionTrigger className="py-6 text-left text-lg font-bold text-foreground hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-base leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
