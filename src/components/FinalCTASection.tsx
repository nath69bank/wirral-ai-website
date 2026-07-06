import { ArrowRight, Calendar } from 'lucide-react'
import NetworkCanvas from './NetworkCanvas'
import Reveal from './Reveal'
import { useChat } from '../lib/chatContext'

export default function FinalCTASection() {
  const { openChat } = useChat()

  return (
    <section className="relative bg-navy py-24 sm:py-32 px-5 sm:px-8 overflow-hidden">
      <div className="absolute inset-0 opacity-60">
        <NetworkCanvas className="absolute inset-0 w-full h-full" density={0.5} linkDistance={120} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy/60 to-navy" />

      <Reveal className="relative z-10 max-w-2xl mx-auto text-center">
        <h2 className="font-display text-3xl sm:text-5xl font-semibold text-white leading-tight">
          Your next customer is already looking.<br />
          <span className="text-gradient">Will they find you?</span>
        </h2>
        <p className="mt-5 text-mist text-base sm:text-lg max-w-lg mx-auto">
          Nathan takes on a limited number of new websites each month. 
          If you're thinking about it, now is the time.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => openChat('pricing')}
            className="inline-flex items-center gap-2 bg-brand-gradient text-navy text-sm sm:text-base font-semibold px-8 py-4 rounded-full hover:opacity-90 hover:shadow-glow-green transition-all"
          >
            Claim My Spot
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="https://masterclass.wirral.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white text-sm font-medium px-6 py-4 rounded-full ring-1 ring-white/20 hover:bg-white/5 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            See the free Masterclass first
          </a>
        </div>
        <p className="mt-4 text-mist/70 text-xs">No contracts · Spots released monthly · Takes two minutes to get started</p>
      </Reveal>
    </section>
  )
}
