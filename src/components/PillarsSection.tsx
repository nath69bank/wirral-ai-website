import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { pillars } from '../data/pillars'
import Reveal from './Reveal'

export default function PillarsSection() {
  return (
    <section className="relative bg-navy py-16 sm:py-20 px-5 sm:px-8 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-10 sm:mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-3">Optional add-ons</p>
          <h2 className="font-display text-2xl sm:text-[34px] font-semibold text-white">
            Add these to your website whenever you're ready
          </h2>
          <p className="mt-3 text-mist max-w-lg mx-auto">
            Your website stands on its own for £50 + £20/month. Either of these can be layered on
            top later as a separate retainer.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-5">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.id} delay={i * 100}>
              <Link
                to={pillar.path}
                className="group block h-full glass-panel-strong rounded-2xl p-7 sm:p-8 hover:shadow-glow-blue transition-shadow"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-full bg-brand-gradient flex items-center justify-center">
                    <pillar.icon className="w-6 h-6 text-navy" strokeWidth={1.75} />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-mist ring-1 ring-white/15 rounded-full px-2.5 py-1">
                    Add-on
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-white mb-2">{pillar.name}</h3>
                <p className="text-mist text-sm leading-relaxed mb-5">{pillar.tagline}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white group-hover:text-green transition-colors">
                  See examples for your industry
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
