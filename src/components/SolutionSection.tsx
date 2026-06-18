import { ArrowRight, Phone, Globe, MessageSquare, Repeat, Zap, GitBranch, Send, BarChart3 } from 'lucide-react'
import Reveal from './Reveal'
import wirralW from '../assets/wirral-w.webp'

const inputs = [
  { label: 'Phone calls & enquiries', icon: Phone },
  { label: 'Website visitors', icon: Globe },
  { label: 'Social media messages', icon: MessageSquare },
  { label: 'Repeat customers', icon: Repeat },
]

const outputs = [
  { label: 'Faster replies', icon: Zap },
  { label: 'Organised pipeline', icon: GitBranch },
  { label: 'Automatic follow-up', icon: Send },
  { label: 'Clear reporting', icon: BarChart3 },
]

function ColumnList({ items, align }: { items: typeof inputs; align: 'left' | 'right' }) {
  return (
    <div className="flex flex-col gap-2.5 w-full">
      {items.map((item) => (
        <div
          key={item.label}
          className={`flex items-center gap-2.5 glass-panel rounded-xl px-4 py-3 ${
            align === 'right' ? 'sm:flex-row-reverse sm:text-right' : ''
          }`}
        >
          <item.icon className="w-4 h-4 text-blue shrink-0" strokeWidth={1.75} />
          <span className="text-sm text-white/85">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function SolutionSection() {
  return (
    <section id="solution" className="relative bg-navy py-20 sm:py-28 px-5 sm:px-8 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-12 sm:mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-3">How it comes together</p>
          <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white">
            One system. Every part of your business connected.
          </h2>
          <p className="mt-3 text-mist max-w-xl mx-auto">
            Wirral AI works quietly in the background, joining up every enquiry, conversation and customer so
            nothing depends on someone remembering to follow up.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-[1fr_auto_auto_auto_1fr] items-center gap-4 sm:gap-3">
          <Reveal className="order-1">
            <ColumnList items={inputs} align="left" />
          </Reveal>

          <ArrowRight className="hidden sm:block w-5 h-5 text-mist/50 order-2 rotate-90 sm:rotate-0" />

          <Reveal delay={150} className="order-3 flex flex-col items-center justify-self-center">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full glass-panel-strong flex items-center justify-center shadow-glow-blue">
              <img src={wirralW} alt="Wirral AI" className="w-12 h-12 sm:w-14 sm:h-14 object-contain" />
            </div>
            <p className="mt-3 text-xs text-mist text-center max-w-[9rem]">
              Runs quietly in the background, all day, every day
            </p>
          </Reveal>

          <ArrowRight className="hidden sm:block w-5 h-5 text-mist/50 order-4 rotate-90 sm:rotate-0" />

          <Reveal delay={300} className="order-5">
            <ColumnList items={outputs} align="right" />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
