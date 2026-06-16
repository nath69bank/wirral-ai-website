import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProblemSection from './components/ProblemSection'
import SolutionSection from './components/SolutionSection'
import ServicesSection from './components/ServicesSection'
import BenefitsSection from './components/BenefitsSection'
import FreeTrialSection from './components/FreeTrialSection'
import SocialProofSection from './components/SocialProofSection'
import FAQSection from './components/FAQSection'
import FinalCTASection from './components/FinalCTASection'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'

export default function App() {
  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <ServicesSection />
        <BenefitsSection />
        <FreeTrialSection />
        <SocialProofSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
