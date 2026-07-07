import { Check, X } from 'lucide-react'
import Reveal from './Reveal'
import { useChat } from '../lib/chatContext'

const compare = [
  { label: 'Typical local agency', price: '£2,000–£8,000', monthly: '£0 then £200+ extras', contract: true, maintenance: false, speed: '6–12 weeks' },
  { label: 'DIY (Wix / Squarespace)', price: '£0 upfront', monthly: '£15–£40/mo + your time', contract: false, maintenance: false, speed: 'Whenever you get to it' },
  { label: 'Wirral AI — Starter', price: '£50', monthly: '£20/mo — everything in', contract: false, maintenance: true, speed: 'Within a week' },
]

const starterIncludes = [
  'Professional website built for your business',
  'Mobile-optimised and fast-loading',
  'Locally SEO-optimised from day one',
  'Hosting, security and updates included',
  'Support whenever you need changes',
  'No contracts — leave any time',
]

export default function PricingPhilosophy() {
  const { openChat } = useChat()

  return (
    <section id="pricing" className="relative bg-navy-deep py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-12 sm:mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-3">Pricing</p>
          <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white">
            Transparent. Fixed. No surprises.
          </h2>
          <p className="mt-3 text-mist max-w-xl mx-auto">
            Most agencies hide their prices because they quote differently based on how much they think
            you will pay. We do not do that.
          </p>
        </Reveal>

        {/* Starter pricing card */}
        <Reveal>
          <div className="glass-panel-strong rounded-3xl p-7 sm:p-10 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green/5 rounded-full blur-3xl pointer-events-none" />
            <div className="grid sm:grid-cols-2 gap-8 items-start">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-blue mb-3">Starter Website</p>
                <div className="flex items-end gap-3 mb-2">
                  <span className="font-display text-5xl sm:text-6xl font-semibold text-white">£50</span>
                  <span className="text-mist pb-2">one-off build fee</span>
                </div>
                <p className="text-mist text-sm mb-6">
                  then <span className="text-white font-medium">£20/month</span> — hosting, maintenance, support, everything
                </p>
                <button
                  onClick={() => openChat('starter')}
                  className="inline-flex items-center gap-2 bg-brand-gradient text-navy text-sm font-semibold px-6 py-3.5 rounded-full hover:opacity-90 transition-all"
                >
                  Get started
                </button>
                <p className="text-mist/60 text-xs mt-3">No contract. Cancel any time.</p>
              </div>
              <ul className="space-y-3">
                {starterIncludes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-white/85">
                    <Check className="w-4 h-4 text-green shrink-0 mt-0.5" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* Advanced pricing note */}
        <Reveal delay={120}>
          <div className="glass-panel rounded-2xl p-6 sm:p-7 mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-white font-medium mb-1">Advanced Website — custom projects</p>
                <p className="text-mist text-sm">Quoted individually after a discovery call. Fixed price agreed before work starts. No hourly billing, no scope creep.</p>
              </div>
              <button
                onClick={() => openChat('advanced')}
                className="shrink-0 text-sm font-medium text-green hover:opacity-80 transition-opacity whitespace-nowrap underline underline-offset-2"
              >
                Discuss your project
              </button>
            </div>
          </div>
        </Reveal>

        {/* Comparison table */}
        <Reveal delay={160}>
          <p className="font-mono text-[11px] uppercase tracking-wider text-mist mb-5 text-center">How we compare</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-mist font-medium pb-3 pr-6"></th>
                  <th className="text-left text-mist font-medium pb-3 pr-6">Build cost</th>
                  <th className="text-left text-mist font-medium pb-3 pr-6">Monthly</th>
                  <th className="text-left text-mist font-medium pb-3 pr-6">Ongoing support</th>
                  <th className="text-left text-mist font-medium pb-3">Time to live</th>
                </tr>
              </thead>
              <tbody>
                {compare.map((row, i) => (
                  <tr key={row.label} className={`border-b border-white/5 ${i === 2 ? 'text-white' : 'text-white/60'}`}>
                    <td className={`py-3.5 pr-6 font-medium ${i === 2 ? 'text-gradient font-semibold' : ''}`}>{row.label}</td>
                    <td className="py-3.5 pr-6">{row.price}</td>
                    <td className="py-3.5 pr-6">{row.monthly}</td>
                    <td className="py-3.5 pr-6">
                      {row.maintenance
                        ? <Check className="w-4 h-4 text-green" strokeWidth={2.5} />
                        : <X className="w-4 h-4 text-white/30" />}
                    </td>
                    <td className="py-3.5">{row.speed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
