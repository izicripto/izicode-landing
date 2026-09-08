import { Hero } from "@/components/home/hero"
import { Stats } from "@/components/home/stats"
import { Audiences } from "@/components/home/audiences"
import { Solutions } from "@/components/home/solutions"
import { About } from "@/components/home/about"
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
      <About />
      <Tools />
      <Methodology />
      <Champions />
      <Faq />
      <ContactCta />
    </>
  )
}
