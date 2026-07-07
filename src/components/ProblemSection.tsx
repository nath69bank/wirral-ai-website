import Reveal from './Reveal'
import { useChat } from '../lib/chatContext'

const problems = [
  {
    stat: '96%',
    label: 'of first impressions are design-related',
    copy: 'Visitors judge your business in under a second. If your site looks outdated, they assume your business is too.',
  },
  {
    stat: '88%',
    label: 'of users never return after a bad experience',
    copy: 'A slow, confusing or mobile-broken website does not just lose a visit. It loses a customer permanently.',
  },
  {
    stat: '70%',
    label: 'of SMEs have no clear call to action',
    copy: 'Most small business websites look like brochures. They inform. They do not convert. There is a difference.',
  },
]

export default function ProblemSection() {
  const { openChat } = useChat()

  return (
    <section className="relative bg-navy-deep py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <Reveal className="mb-12 sm:mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-4">The real problem</p>
          <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white max-w-2xl leading-tight">
            Most business websites are losing you money every day they are live.
          </h2>
          <p className="mt-4 text-mist text-base sm:text-lg max-w-xl leading-relaxed">
            Not because they look ugly. Because they were built without a single thought about what
            a visitor needs to see to pick up the phone or fill in a form.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {problems.map((p, i) => (
            <Reveal key={p.stat} delay={i * 80}>
              <div className="glass-panel rounded-2xl p-6 sm:p-7 h-full">
                <p className="font-display text-4xl sm:text-5xl font-semibold text-gradient mb-2">{p.stat}</p>
                <p className="text-white text-sm font-medium mb-3">{p.label}</p>
                <p className="text-mist text-sm leading-relaxed">{p.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="glass-panel-strong rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="flex-1">
              <p className="text-white font-medium text-base sm:text-lg mb-1">
                If your website was working properly, you would know about it.
              </p>
              <p className="text-mist text-sm">
                You would be getting enquiries regularly. You would not be wondering where your next customer is coming from.
              </p>
            </div>
            <button
              onClick={() => openChat('starter')}
              className="shrink-0 inline-flex items-center gap-2 bg-brand-gradient text-navy text-sm font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-all whitespace-nowrap"
            >
              Fix my website
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
