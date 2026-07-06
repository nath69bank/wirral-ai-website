import { Star, Quote, ExternalLink } from 'lucide-react'
import Reveal from './Reveal'

// Only showing reviews with substantive content — short/ambiguous ones hurt trust more than help
const reviews = [
  {
    name: 'Tayyab Sarwar',
    initials: 'TS',
    badge: 'Local Guide',
    text: 'Used Nathan for my businesses and had great success and improvement on my online platforms. Strongly recommend.',
  },
  {
    name: 'Jack Clayton',
    initials: 'JC',
    text: 'Had my website done by these guys for my body shop, would highly recommend.',
  },
  {
    name: 'Max',
    initials: 'M',
    text: 'Recently worked with Nathan and his team on my ecom brand, he knows his stuff about marketing which has helped me massively. Couldn\'t recommend Wirral AI enough.',
  },
  {
    name: 'Max Holmes',
    initials: 'MH',
    text: 'My brother chose here and recommended them. Absolutely loved it and would recommend them myself.',
  },
]

function StarRow({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 text-green fill-green" />
      ))}
    </div>
  )
}

export default function ReviewsSection() {
  return (
    <section id="reviews" className="relative bg-navy py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-12 sm:mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-3">
            What clients say
          </p>
          <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white">
            5.0 on Google · 8 five-star reviews
          </h2>
          <p className="mt-3 text-mist max-w-md mx-auto text-sm">
            Every review is real and unedited. You can read them yourself on Google.
          </p>
        </Reveal>

        {/* Rating callout */}
        <Reveal className="mb-10 sm:mb-12">
          <a
            href="https://maps.app.goo.gl/wirralai"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel-strong rounded-2xl px-8 py-7 text-center max-w-sm mx-auto flex flex-col items-center gap-2 hover:shadow-glow-blue transition-shadow block"
          >
            <p className="font-display text-5xl sm:text-6xl font-semibold text-gradient">5.0</p>
            <StarRow />
            <p className="text-white font-medium text-sm mt-1">Perfect rating on Google</p>
            <div className="inline-flex items-center gap-1 text-mist text-xs mt-1">
              View all 8 reviews
              <ExternalLink className="w-3 h-3" />
            </div>
          </a>
        </Reveal>

        {/* Review cards */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          {reviews.map((review, i) => (
            <Reveal key={review.name} delay={i * 80}>
              <div className="h-full glass-panel rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-gradient flex items-center justify-center shrink-0">
                    <span className="text-navy text-xs font-bold">{review.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-medium text-sm">{review.name}</p>
                      {review.badge && (
                        <span className="text-[10px] font-mono uppercase tracking-wider text-blue ring-1 ring-blue/30 rounded-full px-2 py-0.5 shrink-0">
                          {review.badge}
                        </span>
                      )}
                    </div>
                    <StarRow />
                  </div>
                </div>
                <div className="flex-1 flex items-start gap-2">
                  <Quote className="w-4 h-4 text-mist/40 shrink-0 mt-0.5" />
                  <p className="text-mist text-sm leading-relaxed italic">{review.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Nudge to leave a review */}
        <Reveal className="mt-8 text-center">
          <p className="text-mist text-xs">
            A Wirral AI client?{' '}
            <a
              href="https://g.page/r/wirralai/review"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green hover:opacity-80 transition-opacity underline underline-offset-2"
            >
              Leave us a review on Google
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
