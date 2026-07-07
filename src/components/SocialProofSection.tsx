import { Star, Quote } from 'lucide-react'
import Reveal from './Reveal'
import { useChat } from '../lib/chatContext'

const testimonials = [
  {
    name: 'Tayyab Sarwar',
    role: 'Business Owner',
    badge: 'Google Review',
    stars: 5,
    text: 'Used Wirral AI for my businesses and had great success and improvement on my online platforms. Strongly recommend.',
    initials: 'TS',
  },
  {
    name: 'Jack Clayton',
    role: 'Body Shop Owner',
    badge: 'Google Review',
    stars: 5,
    text: 'Had my website done by these guys for my body shop, would highly recommend.',
    initials: 'JC',
  },
  {
    name: 'Max',
    role: 'E-commerce Brand',
    badge: 'Google Review',
    stars: 5,
    text: 'Recently worked with the Wirral AI team on my ecom brand — they know their stuff about marketing and it has helped me massively. Could not recommend them enough.',
    initials: 'M',
  },
  {
    name: 'Max Holmes',
    role: 'Local Business',
    badge: 'Google Review',
    stars: 5,
    text: 'My brother chose here and recommended them. Absolutely loved it and would recommend them myself.',
    initials: 'MH',
  },
]

const stats = [
  { value: '40+', label: 'Businesses across the North West' },
  { value: '5.0', label: 'Average Google rating' },
  { value: '< 1 week', label: 'Average time to go live' },
]

export default function SocialProofSection() {
  const { openChat } = useChat()

  return (
    <section id="reviews" className="relative bg-navy py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-12 sm:mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-3">Social proof</p>
          <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white">
            Don't take our word for it
          </h2>
        </Reveal>

        {/* Stats row */}
        <Reveal className="grid grid-cols-3 gap-4 mb-12 sm:mb-16">
          {stats.map((s) => (
            <div key={s.label} className="glass-panel rounded-2xl p-5 text-center">
              <p className="font-display text-2xl sm:text-4xl font-semibold text-gradient mb-1">{s.value}</p>
              <p className="text-mist text-xs sm:text-sm">{s.label}</p>
            </div>
          ))}
        </Reveal>

        {/* Testimonials */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 70}>
              <div className="glass-panel rounded-2xl p-6 h-full flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center shrink-0">
                    <span className="text-navy text-xs font-bold">{t.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-medium text-sm">{t.name}</p>
                      <span className="text-[10px] text-mist ring-1 ring-white/15 rounded-full px-2 py-0.5">{t.role}</span>
                    </div>
                    <div className="flex gap-0.5 mt-0.5">
                      {Array.from({ length: t.stars }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-green fill-green" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 flex-1">
                  <Quote className="w-4 h-4 text-mist/30 shrink-0 mt-0.5" />
                  <p className="text-mist text-sm leading-relaxed italic">{t.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 text-center">
          <p className="text-mist text-sm mb-4">
            All reviews are real and unedited —{' '}
            <a href="https://maps.app.goo.gl/wirralai" target="_blank" rel="noopener noreferrer"
               className="text-green underline underline-offset-2 hover:opacity-80 transition-opacity">
              view on Google
            </a>
          </p>
          <button
            onClick={() => openChat('starter')}
            className="inline-flex items-center gap-2 bg-brand-gradient text-navy text-sm font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-all"
          >
            Join them — book a free call
          </button>
        </Reveal>
      </div>
    </section>
  )
}
