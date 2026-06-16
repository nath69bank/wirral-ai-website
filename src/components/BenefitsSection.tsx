import { benefits } from '../data/benefits'
import Reveal from './Reveal'

export default function BenefitsSection() {
  return (
    <section id="benefits" className="relative bg-navy py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-12 sm:mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-3">What changes</p>
          <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white">
            What this actually means for your business
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {benefits.map((benefit, i) => (
            <Reveal key={benefit.id} delay={i * 60}>
              <div className="h-full glass-panel rounded-2xl p-5 sm:p-6 hover:shadow-glow-blue transition-shadow">
                <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center mb-4">
                  <benefit.icon className="w-5 h-5 text-navy" strokeWidth={2} />
                </div>
                <h3 className="text-white font-medium text-[15px] mb-1.5">{benefit.title}</h3>
                <p className="text-mist text-sm leading-relaxed">{benefit.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
