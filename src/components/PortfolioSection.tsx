import { ArrowUpRight } from 'lucide-react'
import Reveal from './Reveal'
import { portfolioItems } from '../data/portfolio'
import { useChat } from '../lib/chatContext'

export default function PortfolioSection() {
  const { openChat } = useChat()

  return (
    <section id="portfolio" className="relative bg-navy-deep py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-3">Our work</p>
            <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white">
              Real businesses. Real results.
            </h2>
            <p className="mt-3 text-mist max-w-lg">
              Every site in this portfolio is live, maintained, and generating enquiries for the business behind it.
            </p>
          </div>
          <button
            onClick={() => openChat('starter')}
            className="shrink-0 inline-flex items-center gap-2 text-white text-sm font-medium px-6 py-3 rounded-full ring-1 ring-white/20 hover:bg-white/5 transition-colors whitespace-nowrap"
          >
            Start your project
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {portfolioItems.map((item, i) => (
            <Reveal key={item.id} delay={i * 60}>
              <div className="glass-panel rounded-2xl p-6 sm:p-7 h-full flex flex-col hover:border-white/20 transition-colors group">
                {/* Colour accent bar */}
                <div
                  className="w-8 h-1 rounded-full mb-5"
                  style={{ background: item.color }}
                />
                <p className="font-mono text-[10px] uppercase tracking-widest mb-2"
                   style={{ color: item.color }}>
                  {item.category}
                </p>
                <h3 className="text-white font-semibold text-lg mb-3">{item.client}</h3>
                <p className="text-mist text-sm leading-relaxed flex-1">{item.outcome}</p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono uppercase tracking-wider glass-panel rounded-full px-2.5 py-1 text-white/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Social nudge */}
        <Reveal className="mt-10 text-center">
          <p className="text-mist text-sm">
            Your business could be next.{' '}
            <button
              onClick={() => openChat('starter')}
              className="text-green hover:opacity-80 transition-opacity underline underline-offset-2"
            >
              Book a free call to discuss your project
            </button>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
