import Seo from '../components/Seo'
import Hero from '../components/Hero'
import PillarsSection from '../components/PillarsSection'
import ProblemSection from '../components/ProblemSection'
import SolutionSection from '../components/SolutionSection'
import ServicesSection from '../components/ServicesSection'
import BenefitsSection from '../components/BenefitsSection'
import PricingSection from '../components/PricingSection'
import FreeTrialSection from '../components/FreeTrialSection'
import SocialProofSection from '../components/SocialProofSection'
import FAQSection from '../components/FAQSection'
import FinalCTASection from '../components/FinalCTASection'

export default function Home() {
  return (
    <>
      <Seo
        title="AI Staff & Automated Marketing Websites"
        description="Websites built and kept live from £50 for businesses across Wirral, Liverpool, Manchester and Chester, with AI staff and automated marketing available as add-ons."
        path="/"
      />
      <Hero />
      <PillarsSection />
      <ProblemSection />
      <SolutionSection />
      <ServicesSection />
      <BenefitsSection />
      <PricingSection />
      <FreeTrialSection />
      <SocialProofSection />
      <FAQSection />
      <FinalCTASection />
    </>
  )
}
