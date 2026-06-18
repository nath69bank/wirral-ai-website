import { ArrowRight } from 'lucide-react'
import type { Pillar } from '../data/pillars'
import NetworkCanvas from './NetworkCanvas'
import { useChat } from '../lib/chatContext'

interface PillarHeroProps {
  pillar: Pillar
}

export default function PillarHero({ pillar }: PillarHeroProps) {
  const { openChat } = useChat()

  return (
    <section className="relative overflow-hidden bg-navy px-5 sm:px-8 pt-32 sm:pt-40 pb-20 sm:pb-28">
      <div className="absolute inset-0">
        <NetworkCanvas className="absolute inset-0 w-full h-full" density={0.75} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/0 via-navy/20 to-navy pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="animate-fade-up w-14 h-14 rounded-full bg-brand-gradient flex items-center justify-center mx-auto mb-6">
          <pillar.icon className="w-7 h-7 text-navy" strokeWidth={1.75} />
        </div>
        <p className="animate-fade-up [animation-delay:80ms] font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-4">
          {pillar.name} &middot; Website Add-on
        </p>
        <h1 className="animate-fade-up [animation-delay:160ms] font-display text-3xl sm:text-5xl font-semibold text-white leading-tight">
          {pillar.heroLine}
        </h1>
        <p className="animate-fade-up [animation-delay:260ms] mt-5 text-mist text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
          {pillar.description}
        </p>
        <div className="animate-fade-up [animation-delay:360ms] mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => openChat(pillar.id)}
            className="inline-flex items-center gap-2 bg-brand-gradient text-navy text-sm font-semibold px-6 py-3 rounded-full hover:opacity-90 hover:shadow-glow-green transition-all"
          >
            Ask About This Add-on
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 text-white text-sm font-medium px-6 py-3 rounded-full ring-1 ring-white/20 hover:bg-white/5 transition-colors"
          >
            See pricing
          </a>
        </div>
      </div>
    </section>
  )
}
