import { Link } from 'react-router-dom'
import { ArrowRight, Headset, Mail, AlertCircle } from 'lucide-react'
import NetworkCanvas from '../components/NetworkCanvas'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import PricingSection from '../components/PricingSection'
import FinalCTASection from '../components/FinalCTASection'
import { getNiche } from '../data/niches'
import { buildWhatsAppLink } from '../lib/whatsapp'

export default function NichePage({ slug }: { slug: string }) {
  const niche = getNiche(slug)
  if (!niche) return null

  return (
    <>
      <Seo
        title={niche.seoTitle}
        description={niche.seoDescription}
        path={`/${niche.slug}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: niche.seoTitle,
          description: niche.seoDescription,
          provider: {
            '@type': 'ProfessionalService',
            name: 'Wirral AI',
            areaServed: ['Wirral', 'Liverpool', 'Manchester', 'Chester'],
          },
          serviceType: niche.name,
        }}
      />

      <section className="relative overflow-hidden bg-navy px-5 sm:px-8 pt-32 sm:pt-40 pb-20 sm:pb-28">
        <div className="absolute inset-0">
          <NetworkCanvas className="absolute inset-0 w-full h-full" density={0.75} />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/0 via-navy/20 to-navy pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="animate-fade-up w-14 h-14 rounded-full bg-brand-gradient flex items-center justify-center mx-auto mb-6">
            <niche.icon className="w-7 h-7 text-navy" strokeWidth={1.75} />
          </div>
          <p className="animate-fade-up [animation-delay:80ms] font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-4">
            {niche.name}
          </p>
          <h1 className="animate-fade-up [animation-delay:160ms] font-display text-3xl sm:text-5xl font-semibold text-white leading-tight">
            {niche.heroLine}
          </h1>
          <p className="animate-fade-up [animation-delay:260ms] mt-5 text-mist text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            {niche.intro}
          </p>
          <div className="animate-fade-up [animation-delay:360ms] mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={buildWhatsAppLink(
                `Hi Wirral AI — I run a ${niche.name.toLowerCase()} business and I'd like to get a website built for £50.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-gradient text-navy text-sm font-semibold px-6 py-3 rounded-full hover:opacity-90 hover:shadow-glow-green transition-all"
            >
              Get Started for £50
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 text-white text-sm font-medium px-6 py-3 rounded-full ring-1 ring-white/20 hover:bg-white/5 transition-colors"
            >
              See pricing
            </a>
          </div>
        </div>
      </section>

      <section className="relative bg-navy-deep py-16 sm:py-24 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <Reveal className="text-center mb-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-3">Sound familiar?</p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">
              The day-to-day reality for {niche.name.toLowerCase()}
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-3">
            {niche.painPoints.map((point, i) => (
              <Reveal key={point} delay={i * 70}>
                <div className="flex items-start gap-2.5 glass-panel rounded-xl px-4 py-3.5">
                  <AlertCircle className="w-4 h-4 text-blue shrink-0 mt-0.5" strokeWidth={1.75} />
                  <span className="text-sm text-white/85">{point}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-navy py-16 sm:py-24 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto space-y-12 sm:space-y-16">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center shrink-0">
                <Headset className="w-5 h-5 text-navy" strokeWidth={1.75} />
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-white">
                AI Staff for {niche.name.toLowerCase()}
              </h2>
            </div>
            <p className="text-mist leading-relaxed mb-4">{niche.aiStaffDetail}</p>
            <Link
              to="/ai-staff"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-green hover:opacity-80 transition-opacity"
            >
              See everything AI Staff includes
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-navy" strokeWidth={1.75} />
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-white">
                Automated Marketing for {niche.name.toLowerCase()}
              </h2>
            </div>
            <p className="text-mist leading-relaxed mb-4">{niche.marketingDetail}</p>
            <Link
              to="/automated-marketing"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-green hover:opacity-80 transition-opacity"
            >
              See everything Automated Marketing includes
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      <PricingSection />
      <FinalCTASection />
    </>
  )
}
