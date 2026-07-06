import { useEffect, useRef, useState } from 'react'
import { Zap, Users, Star, TrendingUp } from 'lucide-react'
import Reveal from './Reveal'

interface Stat {
  icon: React.ElementType
  display: string
  animateTo: number
  suffix: string
  prefix?: string
  label: string
  sublabel: string
  color: string
}

const stats: Stat[] = [
  {
    icon: Users,
    display: '40+',
    animateTo: 40,
    suffix: '+',
    label: 'Businesses served',
    sublabel: 'across the North West',
    color: 'text-blue',
  },
  {
    icon: Star,
    display: '5.0',
    animateTo: 5,
    suffix: '.0',
    label: 'Google rating',
    sublabel: '8 verified five-star reviews',
    color: 'text-green',
  },
  {
    icon: Zap,
    display: '< 30s',
    animateTo: 28,
    suffix: 's',
    label: 'AI response time',
    sublabel: 'average first reply to enquiries',
    color: 'text-blue',
  },
  {
    icon: TrendingUp,
    display: '£50',
    animateTo: 50,
    suffix: '',
    prefix: '£',
    label: 'To get your site live',
    sublabel: 'then just £20 a month',
    color: 'text-green',
  },
]

function AnimatedNumber({ to, suffix, prefix = '', duration = 1800 }: {
  to: number; suffix: string; prefix?: string; duration?: number
}) {
  const [current, setCurrent] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true) },
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

  if (to === 5) return <span ref={ref}>{started ? (current >= 5 ? '5.0' : `${current}.0`) : '0.0'}</span>
  if (to === 28) return <span ref={ref}>{started ? `< ${current}s` : '< 0s'}</span>
  return <span ref={ref}>{prefix}{current}{suffix}</span>
}

export default function AIStatsBar() {
  return (
    <section className="relative bg-navy-deep border-y border-white/5 py-10 sm:py-12 px-5 sm:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue/5 via-transparent to-green/5 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80}>
              <div className="glass-panel rounded-2xl p-5 text-center">
                <div className={`flex justify-center mb-3 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <p className={`font-display text-2xl sm:text-3xl font-semibold ${stat.color} mb-1`}>
                  <AnimatedNumber to={stat.animateTo} suffix={stat.suffix} prefix={stat.prefix} />
                </p>
                <p className="text-white text-xs font-medium">{stat.label}</p>
                <p className="text-mist text-[10px] mt-0.5">{stat.sublabel}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
