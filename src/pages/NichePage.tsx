import { Link } from 'react-router-dom'
import { ArrowRight, Globe, Zap, Brain, AlertCircle } from 'lucide-react'
import NetworkCanvas from '../components/NetworkCanvas'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import PricingPhilosophy from '../components/PricingPhilosophy'
import FinalCTASection from '../components/FinalCTASection'
import { getNiche } from '../data/niches'
import { useChat } from '../lib/chatContext'

export default function NichePage({ slug }: { slug: string }) {
  const niche = getNiche(slug)
  const { openChat } = useChat()
  if (!niche) return null

  return (
    <>
      <Seo
        title={`Web Design for ${niche.name} | Wirral AI`}
        description={`Professional websites for ${niche.name.toLowerCase()} across Wirral, Liverpool, Manchester and Chester. Starter sites from £50. Advanced builds with bookings, CRM and automation.`}
        path={`/${niche.slug}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: `Web Design for ${niche.name}`,
          provider: { '@type': 'ProfessionalService', name: 'Wirral AI',
            areaServed: ['Wirral', 'Liverpool', 'Manchester', 'Chester'] },
          serviceType: niche.name,
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy px-5 sm:px-8 pt-32 sm:pt-40 pb-20 sm:pb-28">
        <div className="absolute inset-0">
          <NetworkCanvas className="absolute inset-0 w-full h-full" density={0.75} />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/0 via-navy/20 to-navy pointer-events-none" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="animate-fade-up w-14 h-14 rounded-full bg-brand-gradient flex items-center justify-center mx-auto mb-6">
            <niche.icon className="w-7 h-7 text-navy" strokeWidth={1.75} />
          </div>
          <p className="animate-fade-up [animation-delay:60ms] font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-4">
            Web Design for {niche.name}
          </p>
          <h1 className="animate-fade-up [animation-delay:140ms] font-display text-3xl sm:text-5xl font-semibold text-white leading-tight">
            {niche.heroLine}
          </h1>
          <p className="animate-fade-up [animation-delay:240ms] mt-5 text-mist text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            {niche.intro}
          </p>
          <div className="animate-fade-up [animation-delay:340ms] mt-8 flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => openChat('starter')}
              className="inline-flex items-center gap-2 bg-brand-gradient text-navy text-sm font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-all">
              Get a Starter Website — £50
              <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => openChat('advanced')}
              className="inline-flex items-center gap-2 text-white text-sm font-medium px-6 py-3 rounded-full ring-1 ring-white/20 hover:bg-white/5 transition-colors">
              Discuss a custom build
            </button>
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="relative bg-navy-deep py-16 sm:py-24 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <Reveal className="text-center mb-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-3">Sound familiar?</p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">
              What we hear from {niche.name.toLowerCase()} owners
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-3">
            {niche.painPoints.map((point, i) => (
              <Reveal key={point} delay={i * 60}>
                <div className="flex items-start gap-2.5 glass-panel rounded-xl px-4 py-3.5">
                  <AlertCircle className="w-4 h-4 text-blue shrink-0 mt-0.5" strokeWidth={1.75} />
                  <span className="text-sm text-white/85">{point}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3 pathways */}
      <section className="relative bg-navy py-16 sm:py-24 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-3">How we can help</p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">
              Three ways to work with Wirral AI
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: Globe, accent: 'text-blue border-blue/30 bg-blue/10', title: 'Starter Website',
                body: niche.aiStaffExample.replace('AI host', 'professional website').replace('AI receptionist', 'website').replace('AI assistant', 'website'),
                cta: 'Get started — £50', action: () => openChat('starter'),
              },
              {
                icon: Zap, accent: 'text-green border-green/30 bg-green/10', title: 'Advanced Website',
                body: `Need bookings, payments, or custom integrations built specifically for your ${niche.name.toLowerCase()} business? We scope and build it to fit how you actually operate.`,
                cta: 'Discuss your project', action: () => openChat('advanced'),
              },
              {
                icon: Brain, accent: 'text-[#a78bfa] border-[#a78bfa]/30 bg-[#a78bfa]/10', title: 'AI Automation',
                body: niche.marketingExample,
                cta: 'Join the free Masterclass', action: () => window.open('https://masterclass.wirral.ai', '_blank'),
              },
            ].map((card, i) => (
              <Reveal key={card.title} delay={i * 80}>
                <div className="glass-panel rounded-2xl p-5 h-full flex flex-col">
                  <div className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider border rounded-full px-3 py-1 mb-4 w-fit ${card.accent}`}>
                    <card.icon className="w-3 h-3" strokeWidth={2.5} />
                    {card.title}
                  </div>
                  <p className="text-mist text-sm leading-relaxed flex-1 mb-4">{card.body}</p>
                  <button onClick={card.action}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-green hover:opacity-80 transition-opacity">
                    {card.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <PricingPhilosophy />
      <FinalCTASection />
    </>
  )
}
