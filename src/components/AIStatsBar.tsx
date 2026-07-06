import { useEffect, useRef, useState } from 'react'
import { Zap, Users, Star, Clock } from 'lucide-react'
import Reveal from './Reveal'

interface Stat {
  icon: React.ElementType
  value: string
  animateTo: number
  suffix: string
  prefix?: string
  label: string
  color: string
}

const stats: Stat[] = [
  {
    icon: Clock,
    value: '< 30s',
    animateTo: 28,
    suffix: 's',
    prefix: '',
    label: 'Average AI response time',
    color: 'text-blue',
  },
  {
    icon: Users,
    value: '40+',
    animateTo: 40,
    suffix: '+',
    prefix: '',
    label: 'Businesses automated',
    color: 'text-green',
  },
  {
    icon: Star,
    value: '5.0',
    animateTo: 5,
    suffix: '.0',
    prefix: '',
    label: 'Google rating · 8 reviews',
    color: 'text-blue',
  },
  {
    icon: Zap,
    value: '94%',
    animateTo: 94,
    suffix: '%',
    prefix: '',
    label: 'Lead response rate',
    color: 'text-green',
  },
]

function AnimatedNumber({
  to,
  suffix,
  prefix = '',
  duration = 1800,
}: {
  to: number
  suffix: string
  prefix?: string
  duration?: number
}) {
  const [current, setCurrent] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    const start = performance.now()
    const frame = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(eased * to))
      if (progress < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [started, to, duration])

  // Special display for 5.0 rating
  if (to === 5) {
    return (
      <span ref={ref}>
        {started ? (current >= 5 ? '5.0' : `${current}.0`) : '0.0'}
      </span>
    )
  }

  return (
    <span ref={ref}>
      {prefix}{current}{suffix}
    </span>
  )
}

export default function AIStatsBar() {
  return (
    <section className="relative bg-navy-deep border-y border-white/5 py-10 sm:py-12 px-5 sm:px-8 overflow-hidden">
      {/* Subtle gradient sweep */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue/5 via-transparent to-green/5 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <Reveal className="text-center mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist">
            AI working right now
          </p>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80}>
              <div className="glass-panel rounded-2xl p-5 text-center group hover:glass-panel-strong transition-all">
                <div className={`flex justify-center mb-3 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <p className={`font-display text-2xl sm:text-3xl font-semibold ${stat.color} mb-1`}>
                  <AnimatedNumber
                    to={stat.animateTo}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                  />
                </p>
                <p className="text-mist text-[11px] leading-snug">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
