import { MessageCircle, Calendar, Rocket } from 'lucide-react'
import Reveal from './Reveal'
import { useChat } from '../lib/chatContext'

const steps = [
  {
    icon: MessageCircle,
    step: '01',
    title: 'Chat with Aria',
    text: 'Tell our AI assistant about your business in a couple of minutes. She works out exactly what you need and which path makes sense.',
  },
  {
    icon: Calendar,
    step: '02',
    title: 'Book a strategy call',
    text: 'Grab a free 20-minute slot at masterclass.wirral.ai. We show you exactly how it would work for your specific business — no fluff, no hard sell.',
  },
  {
    icon: Rocket,
    step: '03',
    title: 'Go live',
    text: 'Your website gets built for a flat £50. Most businesses are live within a week. AI Staff and automated marketing can be added any time after.',
  },
]

export default function HowItWorksSection() {
  const { openChat } = useChat()

  return (
    <section className="relative bg-navy-deep py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-12 sm:mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-3">How it works</p>
          <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white">
            From first message to live website
          </h2>
          <p className="mt-3 text-mist max-w-xl mx-auto">
            The whole thing takes less than 20 minutes of your time — Wirral AI handles the rest.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 90}>
              <div className="h-full glass-panel rounded-2xl p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center shrink-0">
                    <step.icon className="w-5 h-5 text-navy" strokeWidth={1.75} />
                  </div>
                  <span className="font-mono text-xs text-mist">{step.step}</span>
                </div>
                <h3 className="text-white font-medium text-[15px] mb-2">{step.title}</h3>
                <p className="text-mist text-sm leading-relaxed flex-1">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={280} className="mt-10 text-center">
          <button
            onClick={() => openChat('pricing')}
            className="inline-flex items-center gap-2 bg-brand-gradient text-navy text-sm font-semibold px-7 py-3.5 rounded-full hover:opacity-90 hover:shadow-glow-green transition-all"
          >
            Get Started — Book Your Call
          </button>
          <p className="mt-3 text-mist text-xs">We keep capacity limited so every build gets our full attention</p>
        </Reveal>
      </div>
    </section>
  )
}
