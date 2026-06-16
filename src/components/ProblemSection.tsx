import { painPoints } from '../data/painPoints'
import Reveal from './Reveal'

const tilts = ['-rotate-[0.6deg]', 'rotate-[0.8deg]', 'rotate-[0.3deg]', 'rotate-[0.7deg]', '-rotate-[0.4deg]', 'rotate-[0.5deg]']

export default function ProblemSection() {
  return (
    <section className="relative bg-navy-deep dot-grid py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-12 sm:mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-3">The day-to-day reality</p>
          <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white">Does any of this sound familiar?</h2>
          <p className="mt-3 text-mist max-w-xl mx-auto">
            None of these are your fault. Most businesses run into the same problems once enquiries start coming in
            faster than one person can handle them.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {painPoints.map((point, i) => (
            <Reveal key={point.id} delay={i * 70} className={tilts[i % tilts.length]}>
              <div className="h-full glass-panel rounded-2xl p-5 sm:p-6 hover:border-white/20 transition-colors">
                <point.icon className="w-5 h-5 text-blue mb-3.5" strokeWidth={1.75} />
                <h3 className="text-white font-medium text-[15px] mb-1.5">{point.label}</h3>
                <p className="text-mist text-sm leading-relaxed">{point.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
