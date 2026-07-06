import { Calendar, Users, ArrowRight, Clock, Lock } from 'lucide-react'
import Reveal from './Reveal'

const perks = [
  { icon: Clock, text: 'Nathan builds a real AI system live on screen — start to finish in 90 minutes' },
  { icon: Users, text: 'Limited to 100 seats per session — sells out most weeks' },
  { icon: Calendar, text: 'Every Friday at 10PM · Free · Hosted live on Zoom' },
]

export default function MasterclassBridge() {
  return (
    <section className="relative bg-navy-deep py-20 sm:py-28 px-5 sm:px-8 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] bg-green/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        <Reveal>
          <div className="glass-panel-strong rounded-3xl p-8 sm:p-12 text-center">
            <div className="inline-flex items-center gap-2 bg-brand-gradient rounded-full px-4 py-1.5 mb-6">
              <Lock className="w-3.5 h-3.5 text-navy" />
              <span className="text-navy text-xs font-semibold uppercase tracking-wider">
                Free Weekly Masterclass — Limited Seats
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-[38px] font-semibold text-white leading-tight mb-4">
              Not ready to hand it over?
              <span className="block text-gradient">Come and see how it's done first.</span>
            </h2>

            <p className="text-mist text-base sm:text-lg max-w-2xl mx-auto mb-3 leading-relaxed">
              Every Friday, Nathan runs a free 90-minute live Zoom session where he builds a real AI 
              business system from scratch — on screen, in real time. No slides, no theory. 
              Just the actual process most agencies charge thousands to keep secret.
            </p>

            <p className="text-white/70 text-sm max-w-lg mx-auto mb-8">
              Most people leave knowing exactly what they need to do next. Some book a call with Nathan 
              to get it built for them. Either way, you leave with more than you came with.
            </p>

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

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://masterclass.wirral.ai"
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
                Find out what's covered
              </a>
            </div>

            <p className="mt-5 text-mist text-xs">
              Free forever · No credit card · Seats released every Monday for that Friday's session
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
