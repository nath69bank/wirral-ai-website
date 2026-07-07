import { ArrowRight } from 'lucide-react'
import NetworkCanvas from './NetworkCanvas'
import Reveal from './Reveal'
import { useChat } from '../lib/chatContext'

export default function FinalCTASection() {
  const { openChat } = useChat()

  return (
    <section className="relative bg-navy py-24 sm:py-32 px-5 sm:px-8 overflow-hidden">
      <div className="absolute inset-0 opacity-50">
        <NetworkCanvas className="absolute inset-0 w-full h-full" density={0.5} linkDistance={120} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy/50 to-navy" />

      <Reveal className="relative z-10 max-w-2xl mx-auto text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-4">Ready to start?</p>
        <h2 className="font-display text-3xl sm:text-5xl font-semibold text-white leading-tight mb-5">
          A website that wins you business
          <span className="block text-gradient">starts with one conversation.</span>
        </h2>
        <p className="text-mist text-base sm:text-lg mb-8 max-w-lg mx-auto">
          Book a free 20-minute discovery call. No sales pressure, no commitment.
          Just a straight conversation about what your business needs.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => openChat('starter')}
            className="inline-flex items-center gap-2 bg-brand-gradient text-navy text-base font-semibold px-8 py-4 rounded-full hover:opacity-90 hover:shadow-glow-green transition-all"
          >
            Book my free discovery call
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="https://masterclass.wirral.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-mist text-sm hover:text-white transition-colors"
          >
            Interested in AI automation? →{' '}
            <span className="text-green">Join the Masterclass</span>
          </a>
        </div>
        <p className="mt-5 text-mist/60 text-xs">
          Wirral · Liverpool · Manchester · Chester · No contracts · Free discovery call
        </p>
      </Reveal>
    </section>
  )
}
