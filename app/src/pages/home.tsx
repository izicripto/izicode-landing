/*
 * SECOES DA HOME
 *
 * A pagina tinha 11,1 telas e 1.257 palavras antes da primeira decisao —
 * o dobro do que uma pagina comercial sustenta. O corte seguiu um
 * criterio: fica o que ajuda a decidir, sai o que so informa.
 *
 * <About /> saiu por isso. Missao, visao e principios sao texto
 * institucional: escola nenhuma contrata porque leu que a nossa visao e
 * ser referencia. O componente continua no projeto, so nao e montado
 * aqui — se voltar a fazer sentido, e uma linha.
 */
import { Hero } from "@/components/home/hero"
import { Stats } from "@/components/home/stats"
import { Audiences } from "@/components/home/audiences"
import { Solutions } from "@/components/home/solutions"
import { Eventos } from "@/components/home/eventos"
import { Tools } from "@/components/home/tools"
import { Methodology } from "@/components/home/methodology"
import { Champions } from "@/components/home/champions"
import { Faq } from "@/components/home/faq"
import { ContactCta } from "@/components/home/contact-cta"
import { useSeo, SEO_PAGINAS } from "@/lib/seo"

export function HomePage() {
  useSeo(SEO_PAGINAS.home)

  return (
    <>
      <Hero />
      <Stats />
      <Audiences />
      <Solutions />
      <Eventos />
      <Tools />
      <Methodology />
      <Champions />
      <Faq />
      <ContactCta />
    </>
  )
}
