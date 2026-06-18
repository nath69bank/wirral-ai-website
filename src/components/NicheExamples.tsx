import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { niches } from '../data/niches'
import Reveal from './Reveal'

interface NicheExamplesProps {
  field: 'aiStaffExample' | 'marketingExample'
  eyebrow?: string
  heading?: string
}

export default function NicheExamples({
  field,
  eyebrow = 'In practice',
  heading = 'What this looks like for your industry',
}: NicheExamplesProps) {
  return (
    <section className="relative bg-navy-deep py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-12 sm:mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-3">{eyebrow}</p>
          <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white">{heading}</h2>
          <p className="mt-3 text-mist max-w-xl mx-auto">
            Don't see your industry below? The same idea applies, message us and we'll talk through your business specifically.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
          {niches.map((niche, i) => (
            <Reveal key={niche.id} delay={i * 90}>
              <Link to={`/${niche.slug}`} className="group block h-full glass-panel rounded-2xl p-6 hover:shadow-glow-blue transition-shadow">
                <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center mb-4">
                  <niche.icon className="w-5 h-5 text-navy" strokeWidth={1.75} />
                </div>
                <h3 className="text-white font-medium text-[15px] mb-2.5">{niche.name}</h3>
                <p className="text-mist text-sm leading-relaxed mb-3">{niche[field]}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green group-hover:opacity-80 transition-opacity">
                  More for {niche.name.toLowerCase()}
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
