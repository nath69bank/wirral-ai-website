import { Calendar, Users, ArrowRight, Zap } from 'lucide-react'
import Reveal from './Reveal'

const perks = [
  { icon: Zap, text: 'See Nathan build a real AI system live on screen' },
  { icon: Users, text: 'Limited to 100 seats — fills up every week' },
  { icon: Calendar, text: 'Every Friday at 10PM · 90 minutes on Zoom' },
]

export default function MasterclassBridge() {
  return (
    <section className="relative bg-navy-deep py-20 sm:py-28 px-5 sm:px-8 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] bg-green/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        <Reveal>
          <div className="glass-panel-strong rounded-3xl p-8 sm:p-12 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-gradient rounded-full px-4 py-1.5 mb-6">
              <Calendar className="w-3.5 h-3.5 text-navy" />
              <span className="text-navy text-xs font-semibold uppercase tracking-wider">
                Free Weekly Masterclass
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-[38px] font-semibold text-white leading-tight mb-4">
              Not ready to hand it over yet?
              <span className="block text-gradient">Come and see how it's built.</span>
            </h2>

            <p className="text-mist text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Every Friday at 10PM, Nathan runs a free 90-minute live session showing exactly
              how these AI systems work — from website to automated marketing to AI staff.
              No sales pitch. Just the real process, on screen.
            </p>

            {/* Perks */}
            <div className="grid sm:grid-cols-3 gap-4 mb-10 text-left">
              {perks.map((perk, i) => (
                <div key={i} className="glass-panel rounded-xl p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center shrink-0">
                    <perk.icon className="w-4 h-4 text-navy" strokeWidth={2} />
                  </div>
                  <p className="text-white/85 text-sm leading-snug">{perk.text}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://calendly.com/wirral-ai/masterclass"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-gradient text-navy text-sm font-semibold px-8 py-4 rounded-full hover:opacity-90 hover:shadow-glow-green transition-all"
              >
                Reserve My Free Seat
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="https://masterclass.wirral.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white text-sm font-medium px-6 py-4 rounded-full ring-1 ring-white/20 hover:bg-white/5 transition-colors"
              >
                Learn more about the class
              </a>
            </div>

            <p className="mt-5 text-mist text-xs">
              Free forever · No credit card · Hosted by Nathan on Zoom
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
