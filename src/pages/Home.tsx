import Seo from '../components/Seo'
import Hero from '../components/Hero'
import PillarsSection from '../components/PillarsSection'
import ProblemSection from '../components/ProblemSection'
import SolutionSection from '../components/SolutionSection'
import ServicesSection from '../components/ServicesSection'
import BenefitsSection from '../components/BenefitsSection'
import PricingSection from '../components/PricingSection'
import HowItWorksSection from '../components/HowItWorksSection'
import SocialProofSection from '../components/SocialProofSection'
import FAQSection from '../components/FAQSection'
import FinalCTASection from '../components/FinalCTASection'
import { faqs } from '../data/faqs'

export default function Home() {
  return (
    <>
      <Seo
        title="AI Staff & Automated Marketing Websites"
        description="Websites built and kept live from £50 for businesses across Wirral, Liverpool, Manchester and Chester, with AI staff and automated marketing available as add-ons."
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }}
      />
      <Hero />
      <PillarsSection />
      <ProblemSection />
      <SolutionSection />
      <ServicesSection />
      <BenefitsSection />
      <PricingSection />
      <HowItWorksSection />
      <SocialProofSection />
      <FAQSection />
      <FinalCTASection />
    </>
  )
}
