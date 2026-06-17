import PillarHero from '../components/PillarHero'
import NicheExamples from '../components/NicheExamples'
import ServiceCardGrid from '../components/ServiceCardGrid'
import PricingSection from '../components/PricingSection'
import FinalCTASection from '../components/FinalCTASection'
import Reveal from '../components/Reveal'
import { getPillar } from '../data/pillars'

export default function AutomatedMarketingPage() {
  const pillar = getPillar('automated-marketing')

  return (
    <>
      <PillarHero pillar={pillar} />

      <NicheExamples
        field="marketingExample"
        eyebrow="In practice"
        heading="What automated marketing actually sends"
      />

      <section className="relative bg-navy py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-12 sm:mb-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-3">Everything included</p>
            <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white">
              What's covered under Automated Marketing
            </h2>
          </Reveal>
          <ServiceCardGrid services={pillar.services} />
        </div>
      </section>

      <PricingSection />
      <FinalCTASection />
    </>
  )
}
