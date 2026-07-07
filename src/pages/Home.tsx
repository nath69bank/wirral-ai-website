import Seo from '../components/Seo'
import Hero from '../components/Hero'
import ProblemSection from '../components/ProblemSection'
import ServicesPathways from '../components/ServicesPathways'
import PortfolioSection from '../components/PortfolioSection'
import SocialProofSection from '../components/SocialProofSection'
import ProcessSection from '../components/ProcessSection'
import PricingPhilosophy from '../components/PricingPhilosophy'
import FAQSection from '../components/FAQSection'
import MasterclassBridge from '../components/MasterclassBridge'
import FinalCTASection from '../components/FinalCTASection'
import { faqs } from '../data/faqs'

export default function Home() {
  return (
    <>
      <Seo
        title="Professional Web Design Wirral, Liverpool & Manchester"
        description="Wirral AI builds professional websites for UK businesses that generate enquiries and win customers. Starter sites from £50. Advanced custom builds. Free discovery call."
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        }}
      />
      <Hero />
      <ProblemSection />
      <ServicesPathways />
      <PortfolioSection />
      <SocialProofSection />
      <ProcessSection />
      <PricingPhilosophy />
      <FAQSection />
      <MasterclassBridge />
      <FinalCTASection />
    </>
  )
}
