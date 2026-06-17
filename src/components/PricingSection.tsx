import { Check } from 'lucide-react'
import Reveal from './Reveal'
import { buildWhatsAppLink } from '../lib/whatsapp'

const included = [
  'A complete website built around your business and your industry',
  'AI staff to answer calls, messages and booking requests',
  'Automated marketing campaigns set up and ready to send',
  'Hosting, updates and support included every month',
]

export default function PricingSection() {
  return (
    <section id="pricing" className="relative bg-navy-deep py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-3">Straightforward pricing</p>
          <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white mb-4">
            One simple price. No surprises.
          </h2>
          <p className="text-mist max-w-xl mx-auto mb-10">
            No quotes that change halfway through, no contracts that lock you in.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="glass-panel-strong rounded-3xl px-7 sm:px-12 py-10 sm:py-12">
            <div className="flex items-end justify-center gap-2 mb-1">
              <span className="font-display text-5xl sm:text-6xl font-semibold text-white">£50</span>
              <span className="text-mist text-sm sm:text-base pb-2">one-off build</span>
            </div>
            <p className="text-mist text-sm mb-7">
              then just <span className="text-white font-medium">£20/month</span> to keep everything running
            </p>

            <ul className="text-left max-w-sm mx-auto space-y-3 mb-8">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-white/85">
                  <Check className="w-4 h-4 text-green shrink-0 mt-0.5" strokeWidth={2.25} />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href={buildWhatsAppLink(
                "Hi Wirral AI — I'd like to get a website built with AI staff and automated marketing for my business.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-gradient text-navy text-sm font-semibold px-7 py-3.5 rounded-full hover:opacity-90 hover:shadow-glow-green transition-all"
            >
              Get Started for £50
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
