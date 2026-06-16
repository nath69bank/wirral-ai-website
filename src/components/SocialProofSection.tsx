import { Building2 } from 'lucide-react'
import { caseStudies, retentionStat } from '../data/caseStudies'
import Reveal from './Reveal'

export default function SocialProofSection() {
  return (
    <section id="proof" className="relative bg-navy py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-12 sm:mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-3">Real businesses, real systems</p>
          <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white">
            Trusted by businesses across the region
          </h2>
        </Reveal>

        <Reveal className="mb-10 sm:mb-12">
          <div className="glass-panel-strong rounded-2xl px-8 py-7 text-center max-w-sm mx-auto">
            <p className="font-display text-4xl sm:text-5xl font-semibold text-gradient">{retentionStat.value}</p>
            <p className="text-white font-medium text-sm mt-1.5">{retentionStat.label}</p>
            <p className="text-mist text-xs mt-2 leading-relaxed">{retentionStat.description}</p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
          {caseStudies.map((study, i) => (
            <Reveal key={study.id} delay={i * 90}>
              <div className="h-full glass-panel rounded-2xl p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
                    <Building2 className="w-[18px] h-[18px] text-blue" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{study.client}</p>
                    <p className="text-mist text-xs">{study.industry}</p>
                  </div>
                </div>
                <p className="text-mist text-sm leading-relaxed">{study.summary}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
