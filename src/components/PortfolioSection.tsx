import { ArrowUpRight, ExternalLink } from 'lucide-react'
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
              Every site in this portfolio is live, maintained, and generating enquiries right now.
            </p>
          </div>
          <button
            onClick={() => openChat('starter')}
            className="shrink-0 inline-flex items-center gap-2 text-white text-sm font-medium px-6 py-3 rounded-full ring-1 ring-white/20 hover:bg-white/5 transition-colors whitespace-nowrap"
          >
            Start your project <ArrowUpRight className="w-4 h-4" />
          </button>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {portfolioItems.map((item, i) => (
            <Reveal key={item.id} delay={i * 60}>
              <div className="glass-panel rounded-2xl overflow-hidden h-full flex flex-col group hover:border-white/20 transition-colors">
                {/* Browser chrome mockup */}
                <div className="bg-[#0C2740] px-3 py-2 flex items-center gap-2 border-b border-white/5 shrink-0">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="flex-1 bg-navy/60 rounded text-[10px] text-white/40 px-2.5 py-1 font-mono truncate">
                    {item.url ? item.url.replace('https://', '') : `${item.client.toLowerCase().replace(/\s+/g, '')}.co.uk`}
                  </div>
                </div>

                {/* Preview area — colour-themed placeholder, kept clean */}
                <div
                  className="h-36 sm:h-40 flex items-center justify-center relative overflow-hidden shrink-0"
                  style={{ background: `linear-gradient(135deg, ${item.color}18 0%, #071A2E 60%)` }}
                >
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{ background: `radial-gradient(circle at 30% 50%, ${item.color} 0%, transparent 60%)` }}
                  />
                  <span className="font-display text-4xl font-bold relative z-10 opacity-30 select-none"
                        style={{ color: item.color }}>
                    {item.client.charAt(0)}
                  </span>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-3 right-3 w-8 h-8 glass-panel rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-white" />
                    </a>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                    <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: item.color }}>
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-base mb-2">{item.client}</h3>
                  <p className="text-mist text-sm leading-relaxed flex-1">{item.outcome}</p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {item.tags.map((tag) => (
                      <span key={tag}
                        className="text-[10px] font-mono uppercase tracking-wider glass-panel rounded-full px-2.5 py-1 text-white/55">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <p className="text-mist text-sm">
            Your business could be next.{' '}
            <button onClick={() => openChat('starter')}
              className="text-green hover:opacity-80 transition-opacity underline underline-offset-2">
              Book a free call to discuss your project
            </button>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
