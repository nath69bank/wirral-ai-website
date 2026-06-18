import { MessageCircle, ClipboardCheck, Rocket } from 'lucide-react'
import Reveal from './Reveal'
import { useChat } from '../lib/chatContext'

const steps = [
  {
    icon: MessageCircle,
    title: 'Chat for two minutes',
    text: 'Our assistant asks a few quick questions about your business so Nathan has everything he needs before you even speak.',
  },
  {
    icon: ClipboardCheck,
    title: 'It goes straight to Nathan',
    text: 'No generic enquiry, no waiting around. He gets a clear summary of exactly what you need on WhatsApp.',
  },
  {
    icon: Rocket,
    title: 'We get you live',
    text: 'Nathan follows up to confirm the details, and your website gets built for a flat £50, then £20 a month.',
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
            From chat to live website
          </h2>
          <p className="mt-3 text-mist max-w-xl mx-auto">
            No long forms, no sales calls you didn't ask for. Just a quick chat that gets the right
            information to Nathan straight away.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 90}>
              <div className="h-full glass-panel rounded-2xl p-6 text-center flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center mb-4">
                  <step.icon className="w-5 h-5 text-navy" strokeWidth={1.75} />
                </div>
                <h3 className="text-white font-medium text-[15px] mb-2">{step.title}</h3>
                <p className="text-mist text-sm leading-relaxed">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={280} className="mt-10 text-center">
          <button
            onClick={() => openChat('pricing')}
            className="inline-flex items-center gap-2 bg-brand-gradient text-navy text-sm font-semibold px-7 py-3.5 rounded-full hover:opacity-90 hover:shadow-glow-green transition-all"
          >
            Get My Website Built
          </button>
        </Reveal>
      </div>
    </section>
  )
}
