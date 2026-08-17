import { Hero } from "@/components/home/hero"
import { Stats } from "@/components/home/stats"
import { Solutions } from "@/components/home/solutions"
import { About } from "@/components/home/about"
import { Tools } from "@/components/home/tools"
import { Methodology } from "@/components/home/methodology"
import { Champions } from "@/components/home/champions"
import { Faq } from "@/components/home/faq"
import { ContactCta } from "@/components/home/contact-cta"

export function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
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
