import { ArrowRight } from 'lucide-react'
import NetworkCanvas from './NetworkCanvas'
import VoiceAgentWidget from './VoiceAgentWidget'
import { useChat } from '../lib/chatContext'

export default function Hero() {
  const { openChat } = useChat()

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden bg-navy flex flex-col justify-center">
      <div className="absolute inset-0">
        <NetworkCanvas className="absolute inset-0 w-full h-full" density={0.9} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/10 via-navy/30 to-navy pointer-events-none" />
      </div>

      <div className="relative z-10 px-5 sm:px-8 max-w-5xl mx-auto w-full pt-28 pb-20 sm:pt-36 sm:pb-28">
        <p className="animate-fade-up font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] text-mist mb-6">
          Web Design Wirral &middot; Liverpool &middot; Manchester &middot; Chester
        </p>

        <h1 className="font-display font-semibold text-white leading-[1.05] tracking-tight text-[38px] min-[420px]:text-[46px] sm:text-6xl lg:text-[72px] max-w-3xl">
          <span className="block animate-fade-up">Your website should</span>
          <span className="block animate-fade-up [animation-delay:80ms]">be your best</span>
          <span className="block animate-fade-up text-gradient [animation-delay:160ms]">salesperson.</span>
        </h1>

        <p className="animate-fade-up [animation-delay:260ms] mt-6 text-mist text-base sm:text-xl leading-relaxed max-w-xl">
          We build websites for UK businesses that generate enquiries, build trust, and keep working
          while you focus on the job. Professional. Fast. Maintained for you.
        </p>

        <div className="animate-fade-up [animation-delay:360ms] mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => openChat('starter')}
            className="inline-flex items-center justify-center gap-2 bg-brand-gradient text-navy text-sm sm:text-base font-semibold px-7 py-4 rounded-full hover:opacity-90 hover:shadow-glow-green transition-all"
          >
            Book a free discovery call
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#services"
            className="inline-flex items-center justify-center gap-2 text-white text-sm sm:text-base font-medium px-7 py-4 rounded-full ring-1 ring-white/20 hover:bg-white/5 transition-colors"
          >
            See what we build
          </a>
        </div>

        <div className="animate-fade-up [animation-delay:460ms] mt-12 flex flex-wrap gap-x-8 gap-y-3">
          {[
            '40+ businesses across the North West',
            '5.0 rating on Google',
            'Live within a week',
          ].map((trust) => (
            <div key={trust} className="flex items-center gap-2 text-mist text-xs sm:text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green shrink-0" />
              {trust}
            </div>
          ))}
        </div>

        {/* ElevenLabs voice agent — prominent third option */}
        <div className="animate-fade-up [animation-delay:560ms] mt-10">
          <div className="inline-flex flex-col items-center gap-3">
            <div className="flex items-center gap-3 text-mist text-xs before:content-[''] before:w-10 before:h-px before:bg-white/20 after:content-[''] after:w-10 after:h-px after:bg-white/20">
              or speak to our AI right now
            </div>
            <VoiceAgentWidget />
          </div>
        </div>
      </div>
    </section>
  )
}
