import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { painPoints } from '../data/painPoints'
import { buildWhatsAppLink } from '../lib/whatsapp'

export default function PainPill() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % painPoints.length)
    }, 3400)
    return () => clearInterval(id)
  }, [paused])

  const current = painPoints[index]

  return (
    <div
      className="mx-auto mt-7 w-full max-w-xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <p className="mb-2 text-center text-[11px] uppercase tracking-[0.18em] text-mist font-mono">
        What's costing you the most right now?
      </p>
      <div className="flex items-center gap-3 rounded-full glass-panel pl-5 pr-1.5 py-1.5 sm:py-2">
        <div className="relative flex-1 min-w-0 h-6 overflow-hidden text-left">
          {painPoints.map((p, i) => (
            <span
              key={p.id}
              className={`absolute inset-0 flex items-center truncate text-[13px] sm:text-[15px] text-white transition-all duration-500 ${
                i === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {p.label}
            </span>
          ))}
        </div>
        <a
          href={buildWhatsAppLink(current.whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-brand-gradient text-navy text-[13px] sm:text-sm font-semibold px-4 sm:px-5 py-2 hover:opacity-90 transition-opacity"
        >
          Fix this
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  )
}
