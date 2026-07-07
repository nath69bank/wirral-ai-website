import { ArrowRight, Calendar } from 'lucide-react'
import NetworkCanvas from './NetworkCanvas'
import PainPill from './PainPill'
import OperationsSnapshot from './OperationsSnapshot'
import { useChat } from '../lib/chatContext'

export default function Hero() {
  const { openChat } = useChat()

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden bg-navy flex flex-col">
      <div className="absolute inset-0">
        <NetworkCanvas className="absolute inset-0 w-full h-full" density={1.1} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/0 via-navy/10 to-navy pointer-events-none" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex-1 min-h-24 sm:min-h-28 shrink-0" />

        <div className="text-center px-5 sm:px-8 max-w-4xl mx-auto">
          <p className="animate-fade-up font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-mist mb-4">
            Built for Wirral &middot; Liverpool &middot; Manchester &middot; Chester
          </p>

          <h1 className="font-display text-white font-semibold leading-[1.05] tracking-tight text-[38px] min-[400px]:text-[42px] sm:text-6xl lg:text-7xl">
            <span className="block animate-fade-up">A proper website</span>
            <span className="block animate-fade-up [animation-delay:100ms]">for <span className="text-gradient">£50.</span></span>
            <span className="block animate-fade-up text-white/70 text-[28px] min-[400px]:text-[32px] sm:text-4xl lg:text-5xl [animation-delay:200ms] mt-2">
              AI staff & marketing when you're ready.
            </span>
          </h1>

          <p className="animate-fade-up [animation-delay:320ms] mt-6 sm:mt-7 text-mist text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            We build, host and maintain your website for a flat £50 then £20 a month.
            AI staff, automated marketing and intelligent systems ready to layer on when you are.
            No contracts. Capacity is intentionally limited — we only take on what we can do properly.
          </p>

          <div className="animate-fade-up [animation-delay:440ms] mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => openChat('pricing')}
              className="inline-flex items-center gap-2 bg-brand-gradient text-navy text-sm font-semibold px-6 py-3.5 rounded-full hover:opacity-90 hover:shadow-glow-green transition-all"
            >
              Get My Website Built
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="https://masterclass.wirral.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white text-sm font-medium px-6 py-3.5 rounded-full ring-1 ring-white/20 hover:bg-white/5 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Book a free strategy call
            </a>
          </div>

          <div className="animate-fade-up [animation-delay:560ms]">
            <PainPill />
          </div>
        </div>

        <div className="flex-1 min-h-16 sm:min-h-20 shrink-0" />

        <div className="animate-rise [animation-delay:700ms] relative z-0 w-[92%] sm:w-[84%] lg:w-[68%] max-w-4xl mx-auto shrink-0 -mb-1">
          <OperationsSnapshot />
        </div>
      </div>
    </section>
  )
}
