import Reveal from './Reveal'
import { processSteps } from '../data/process'
import { useChat } from '../lib/chatContext'

export default function ProcessSection() {
  const { openChat } = useChat()

  return (
    <section className="relative bg-navy py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-12 sm:mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-3">Our process</p>
          <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white">
            Simple. Fast. No surprises.
          </h2>
          <p className="mt-3 text-mist max-w-xl mx-auto">
            From the first call to your site going live, here is exactly what happens and when.
          </p>
        </Reveal>

        <div className="relative">
          {/* Vertical connector line on desktop */}
          <div className="hidden sm:block absolute left-[27px] top-8 bottom-8 w-px bg-white/10" />

          <div className="space-y-6 sm:space-y-8">
            {processSteps.map((step, i) => (
              <Reveal key={step.number} delay={i * 90}>
                <div className="flex gap-5 sm:gap-8">
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-full bg-brand-gradient flex items-center justify-center">
                      <span className="font-mono text-xs font-bold text-navy">{step.number}</span>
                    </div>
                  </div>
                  <div className="flex-1 pt-2 pb-6 sm:pb-8">
                    <h3 className="font-display text-lg sm:text-xl font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-white/85 text-base mb-2">{step.description}</p>
                    <p className="text-mist text-sm leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-10 text-center">
          <button
            onClick={() => openChat('starter')}
            className="inline-flex items-center gap-2 bg-brand-gradient text-navy text-sm font-semibold px-7 py-3.5 rounded-full hover:opacity-90 hover:shadow-glow-green transition-all"
          >
            Start with a free discovery call
          </button>
        </Reveal>
      </div>
    </section>
  )
}
