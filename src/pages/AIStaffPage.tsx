import PillarHero from '../components/PillarHero'
import NicheExamples from '../components/NicheExamples'
import ServiceCardGrid from '../components/ServiceCardGrid'
import PricingSection from '../components/PricingSection'
import FinalCTASection from '../components/FinalCTASection'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import { getPillar } from '../data/pillars'

export default function AIStaffPage() {
  const pillar = getPillar('ai-staff')

  return (
    <>
      <Seo
        title="AI Staff — Receptionists & Chat Assistants"
        description="An AI member of staff that answers calls and messages, books appointments and handles everyday questions for your business. Available as an add-on to any Wirral AI website."
        path="/ai-staff"
      />
      <PillarHero pillar={pillar} />

      <NicheExamples
        field="aiStaffExample"
        eyebrow="In practice"
        heading="What an AI member of staff actually does"
      />

      <section className="relative bg-navy py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-12 sm:mb-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-3">Everything included</p>
            <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white">
              What's covered under AI Staff
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
