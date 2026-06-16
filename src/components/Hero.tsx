import { ArrowRight, PlayCircle } from 'lucide-react'
import NetworkCanvas from './NetworkCanvas'
import PainPill from './PainPill'
import OperationsSnapshot from './OperationsSnapshot'
import { buildWhatsAppLink, WHATSAPP_DEFAULT_MESSAGE } from '../lib/whatsapp'

export default function Hero() {
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

          <h1 className="font-display text-white font-semibold leading-[1.05] tracking-tight text-[40px] min-[400px]:text-[44px] sm:text-6xl lg:text-7xl">
            <span className="block animate-fade-up">Save Time.</span>
            <span className="block animate-fade-up [animation-delay:100ms]">Reduce Costs.</span>
            <span className="block animate-fade-up text-gradient [animation-delay:200ms]">Increase Revenue.</span>
          </h1>

          <p className="animate-fade-up [animation-delay:320ms] mt-5 sm:mt-6 text-mist text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Wirral AI helps businesses streamline operations, capture more leads and convert more
            customers with intelligent systems built around the way you already work.
          </p>

          <div className="animate-fade-up [animation-delay:440ms] mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href={buildWhatsAppLink(WHATSAPP_DEFAULT_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-gradient text-navy text-sm font-semibold px-6 py-3 rounded-full hover:opacity-90 hover:shadow-glow-green transition-all"
            >
              Start Your Free Trial
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#solution"
              className="inline-flex items-center gap-2 text-white text-sm font-medium px-6 py-3 rounded-full ring-1 ring-white/20 hover:bg-white/5 transition-colors"
            >
              <PlayCircle className="w-4 h-4" />
              See It In Action
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
