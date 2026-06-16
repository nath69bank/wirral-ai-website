import { serviceStages } from '../data/services'
import Reveal from './Reveal'

export default function ServicesSection() {
  return (
    <section id="services" className="relative bg-navy-deep py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14 sm:mb-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-3">What we build</p>
          <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white">
            Built around how a customer actually moves through your business
          </h2>
          <p className="mt-3 text-mist max-w-xl mx-auto">
            From the first enquiry to the tenth repeat booking, every stage is covered.
          </p>
        </Reveal>

        <div className="space-y-14 sm:space-y-20">
          {serviceStages.map((stageGroup, stageIndex) => (
            <Reveal key={stageGroup.stage}>
              <div className="grid lg:grid-cols-[260px_1fr] gap-6 lg:gap-10">
                <div className="lg:sticky lg:top-28 self-start">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs text-navy bg-brand-gradient rounded-full w-7 h-7 flex items-center justify-center font-semibold shrink-0">
                      {stageIndex + 1}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-blue">
                      {stageGroup.stage}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white mb-2">{stageGroup.label}</h3>
                  <p className="text-mist text-sm leading-relaxed">{stageGroup.description}</p>
                </div>

                <div
                  className={`grid sm:grid-cols-2 gap-4 ${
                    stageGroup.services.length === 3 ? 'lg:grid-cols-3' : ''
                  }`}
                >
                  {stageGroup.services.map((service) => (
                    <div key={service.id} className="glass-panel rounded-2xl p-5 sm:p-6">
                      <service.icon className="w-5 h-5 text-green mb-3.5" strokeWidth={1.75} />
                      <h4 className="text-white font-medium text-[15px] mb-1.5">{service.name}</h4>
                      <p className="text-mist text-sm leading-relaxed">{service.benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
