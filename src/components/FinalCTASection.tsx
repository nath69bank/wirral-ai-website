import { ArrowRight } from 'lucide-react'
import NetworkCanvas from './NetworkCanvas'
import Reveal from './Reveal'
import { buildWhatsAppLink, WHATSAPP_DEFAULT_MESSAGE } from '../lib/whatsapp'

export default function FinalCTASection() {
  return (
    <section className="relative bg-navy py-24 sm:py-32 px-5 sm:px-8 overflow-hidden">
      <div className="absolute inset-0 opacity-60">
        <NetworkCanvas className="absolute inset-0 w-full h-full" density={0.5} linkDistance={120} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy/60 to-navy" />

      <Reveal className="relative z-10 max-w-2xl mx-auto text-center">
        <h2 className="font-display text-3xl sm:text-5xl font-semibold text-white leading-tight">
          Ready to see what your business could achieve?
        </h2>
        <p className="mt-4 text-mist text-base sm:text-lg">Start your free trial today.</p>
        <a
          href={buildWhatsAppLink(WHATSAPP_DEFAULT_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 bg-brand-gradient text-navy text-sm sm:text-base font-semibold px-8 py-4 rounded-full hover:opacity-90 hover:shadow-glow-green transition-all"
        >
          Start Your Free Trial
          <ArrowRight className="w-4 h-4" />
        </a>
        <p className="mt-4 text-mist/70 text-xs">No contracts. No forms. Just a conversation on WhatsApp.</p>
      </Reveal>
    </section>
  )
}
