import { ShieldCheck, Wrench, MessageCircle } from 'lucide-react'
import Reveal from './Reveal'
import { buildWhatsAppLink } from '../lib/whatsapp'

const points = [
  {
    icon: Wrench,
    title: 'We build one system first',
    text: 'Tell us your biggest bottleneck and we set up a working automation around it, free, before you commit to anything.',
  },
  {
    icon: ShieldCheck,
    title: 'No contracts, no pressure',
    text: 'See it running in your own business. If it is not saving you time, you owe us nothing and walk away.',
  },
  {
    icon: MessageCircle,
    title: 'A real conversation, not a form',
    text: 'It starts with a WhatsApp message to a real person on our team, not a sales funnel or a 20-minute signup form.',
  },
]

export default function FreeTrialSection() {
  return (
    <section className="relative bg-navy-deep py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-12 sm:mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-3">Try before you commit</p>
          <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white">
            See it working in your business, risk-free
          </h2>
          <p className="mt-3 text-mist max-w-xl mx-auto">
            We would rather show you results than ask you to take our word for it.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
          {points.map((point, i) => (
            <Reveal key={point.title} delay={i * 90}>
              <div className="h-full glass-panel rounded-2xl p-6 text-center flex flex-col items-center">
                <point.icon className="w-6 h-6 text-green mb-4" strokeWidth={1.75} />
                <h3 className="text-white font-medium text-[15px] mb-2">{point.title}</h3>
                <p className="text-mist text-sm leading-relaxed">{point.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={280} className="mt-10 text-center">
          <a
            href={buildWhatsAppLink(
              "Hi Wirral AI — I'd like to start my free trial. My biggest bottleneck right now is...",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-gradient text-navy text-sm font-semibold px-7 py-3.5 rounded-full hover:opacity-90 hover:shadow-glow-green transition-all"
          >
            Start Your Free Trial
          </a>
        </Reveal>
      </div>
    </section>
  )
}
