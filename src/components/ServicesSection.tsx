import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { pillars } from '../data/pillars'
import Reveal from './Reveal'
import ServiceCardGrid from './ServiceCardGrid'

export default function ServicesSection() {
  return (
    <section id="services" className="relative bg-navy-deep py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14 sm:mb-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-3">What we build</p>
          <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white">
            Two things. Done properly.
          </h2>
          <p className="mt-3 text-mist max-w-xl mx-auto">
            No long list of buzzwords, just AI staff to handle the conversations and automated marketing
            to bring customers back.
          </p>
        </Reveal>

        <div className="space-y-14 sm:space-y-20">
          {pillars.map((pillar, pillarIndex) => (
            <Reveal key={pillar.id}>
              <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-10">
                <div className="lg:sticky lg:top-28 self-start">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-xs text-navy bg-brand-gradient rounded-full w-7 h-7 flex items-center justify-center font-semibold shrink-0">
                      {pillarIndex + 1}
                    </span>
                    <pillar.icon className="w-5 h-5 text-blue" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white mb-2">{pillar.name}</h3>
                  <p className="text-mist text-sm leading-relaxed mb-4">{pillar.description}</p>
                  <Link
                    to={pillar.path}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-green hover:opacity-80 transition-opacity"
                  >
                    See how it works for your business
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <ServiceCardGrid services={pillar.services} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
