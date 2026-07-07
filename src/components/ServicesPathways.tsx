import { ArrowRight, Check } from 'lucide-react'
import Reveal from './Reveal'
import { servicePathways } from '../data/services'
import { useChat } from '../lib/chatContext'
import type { ChatTopic } from '../lib/chatContext'

const accentMap = {
  blue: 'text-blue border-blue/30 bg-blue/10',
  green: 'text-green border-green/30 bg-green/10',
  purple: 'text-[#a78bfa] border-[#a78bfa]/30 bg-[#a78bfa]/10',
}

const glowMap = {
  blue: 'hover:shadow-glow-blue',
  green: 'hover:shadow-glow-green',
  purple: 'hover:shadow-[0_0_40px_rgba(167,139,250,0.25)]',
}

const btnMap = {
  blue: 'bg-brand-gradient text-navy',
  green: 'bg-brand-gradient text-navy',
  purple: 'bg-[linear-gradient(90deg,#a78bfa_0%,#7CFF4F_100%)] text-navy',
}

export default function ServicesPathways() {
  const { openChat } = useChat()

  return (
    <section id="services" className="relative bg-navy py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-12 sm:mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-3">What we build</p>
          <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white">
            Choose the right path for your business
          </h2>
          <p className="mt-3 text-mist max-w-xl mx-auto">
            Three distinct services. One clear next step each time.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-3 gap-5 sm:gap-6">
          {servicePathways.map((pathway, i) => (
            <Reveal key={pathway.id} delay={i * 100}>
              <div className={`h-full glass-panel-strong rounded-3xl p-7 sm:p-8 flex flex-col transition-shadow duration-300 ${glowMap[pathway.accent]}`}>
                {/* Tag */}
                <div className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider border rounded-full px-3 py-1 mb-5 w-fit ${accentMap[pathway.accent]}`}>
                  <pathway.icon className="w-3 h-3" strokeWidth={2.5} />
                  {pathway.tag}
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-semibold text-white mb-3">
                  {pathway.headline}
                </h3>

                <p className="text-mist text-sm leading-relaxed mb-6 flex-1">
                  {pathway.sub}
                </p>

                <ul className="space-y-2.5 mb-8">
                  {pathway.outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-2.5 text-sm text-white/80">
                      <Check className="w-4 h-4 text-green shrink-0 mt-0.5" strokeWidth={2.5} />
                      {o}
                    </li>
                  ))}
                </ul>

                {pathway.ctaType === 'chat' ? (
                  <button
                    onClick={() => openChat(pathway.ctaTarget as ChatTopic)}
                    className={`inline-flex items-center justify-center gap-2 ${btnMap[pathway.accent]} text-sm font-semibold px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity w-full`}
                  >
                    {pathway.cta}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <a
                    href={pathway.ctaTarget}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 ${btnMap[pathway.accent]} text-sm font-semibold px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity w-full`}
                  >
                    {pathway.cta}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
