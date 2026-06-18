import { Check, ArrowRight } from 'lucide-react'
import Reveal from './Reveal'
import { useChat } from '../lib/chatContext'
import { pillars } from '../data/pillars'

const included = [
  'A complete website built around your business and your industry',
  'Hosted, updated and supported every month',
  'No contracts, cancel any time',
]

export default function PricingSection() {
  const { openChat } = useChat()

  return (
    <section id="pricing" className="relative bg-navy-deep py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-3">Straightforward pricing</p>
          <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white mb-4">
            One simple price for your website
          </h2>
          <p className="text-mist max-w-xl mx-auto mb-10">
            This covers the website itself. AI Staff and Automated Marketing are optional extras you
            can add on top whenever you're ready, never bundled in without you asking for them.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="glass-panel-strong rounded-3xl px-7 sm:px-12 py-10 sm:py-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-blue mb-4">Your Website</p>
            <div className="flex items-end justify-center gap-2 mb-1">
              <span className="font-display text-5xl sm:text-6xl font-semibold text-white">£50</span>
              <span className="text-mist text-sm sm:text-base pb-2">one-off build</span>
            </div>
            <p className="text-mist text-sm mb-7">
              then just <span className="text-white font-medium">£20/month</span> to keep it live
            </p>

            <ul className="text-left max-w-sm mx-auto space-y-3 mb-8">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-white/85">
                  <Check className="w-4 h-4 text-green shrink-0 mt-0.5" strokeWidth={2.25} />
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={() => openChat('pricing')}
              className="inline-flex items-center gap-2 bg-brand-gradient text-navy text-sm font-semibold px-7 py-3.5 rounded-full hover:opacity-90 hover:shadow-glow-green transition-all"
            >
              Get Started for £50
            </button>
          </div>
        </Reveal>

        <Reveal delay={200} className="mt-12 sm:mt-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-2">Add when you're ready</p>
          <p className="text-mist text-sm max-w-md mx-auto mb-7">
            Layer either of these on top of your website later as a separate monthly retainer, no
            need to decide now.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {pillars.map((pillar) => (
              <div key={pillar.id} className="glass-panel rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-brand-gradient flex items-center justify-center shrink-0">
                    <pillar.icon className="w-[18px] h-[18px] text-navy" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-white font-medium text-[15px]">{pillar.name}</h3>
                </div>
                <p className="text-mist text-sm leading-relaxed mb-4">
                  Added on top of your website on a monthly retainer. {pillar.tagline}.
                </p>
                <button
                  onClick={() => openChat(pillar.id)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-green hover:opacity-80 transition-opacity"
                >
                  Ask about pricing
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
