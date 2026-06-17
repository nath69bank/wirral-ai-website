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
