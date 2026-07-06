import { Check, ArrowRight, AlertCircle } from 'lucide-react'
import Reveal from './Reveal'
import { useChat } from '../lib/chatContext'
import { pillars } from '../data/pillars'

const included = [
  'Professionally built website tailored to your business',
  'Hosted, maintained and updated every month',
  'You own it — no contracts, cancel any time',
  'Strategy call with Nathan included in the process',
]

export default function PricingSection() {
  const { openChat } = useChat()

  return (
    <section id="pricing" className="relative bg-navy-deep py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-3">Straightforward pricing</p>
          <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white mb-4">
            One price. Everything included.
          </h2>
          <p className="text-mist max-w-xl mx-auto mb-10">
            No upsells hidden in the small print. AI Staff and Automated Marketing are optional extras — 
            available when you want them, never pushed on you.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="glass-panel-strong rounded-3xl px-7 sm:px-12 py-10 sm:py-12 relative overflow-hidden">
            {/* Scarcity banner */}
            <div className="flex items-center justify-center gap-2 bg-blue/10 border border-blue/20 rounded-full px-4 py-2 mb-6 text-[12px] text-blue font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              Nathan takes on a limited number of new websites each month
            </div>

            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-blue mb-4">Your Website</p>
            <div className="flex items-end justify-center gap-2 mb-1">
              <span className="font-display text-5xl sm:text-6xl font-semibold text-white">£50</span>
              <span className="text-mist text-sm sm:text-base pb-2">one-off build</span>
            </div>
            <p className="text-mist text-sm mb-7">
              then just <span className="text-white font-medium">£20/month</span> to keep it live, updated and supported
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
              Claim Your Spot
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="mt-3 text-mist/70 text-xs">Takes two minutes to get started</p>
          </div>
        </Reveal>

        <Reveal delay={200} className="mt-12 sm:mt-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-2">Ready to scale further?</p>
          <p className="text-mist text-sm max-w-md mx-auto mb-7">
            Once your website is live, layer either of these on top whenever you're ready. 
            Both priced on enquiry — tell Aria what you're after and she'll get Nathan to walk you through it.
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
                  {pillar.tagline}. Added on top of your website on a monthly retainer.
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
