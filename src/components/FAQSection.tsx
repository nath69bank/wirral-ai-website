import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { faqs } from '../data/faqs'
import Reveal from './Reveal'

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null)

  return (
    <section id="faq" className="relative bg-navy-deep py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <Reveal className="text-center mb-12 sm:mb-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist mb-3">Common questions</p>
          <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white">Frequently asked questions</h2>
        </Reveal>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openId === faq.id
            return (
              <Reveal key={faq.id} delay={i * 50}>
                <div className="glass-panel rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-4 sm:py-5"
                    aria-expanded={isOpen}
                  >
                    <span className="text-white font-medium text-[15px]">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-mist shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-green' : ''
                      }`}
                    />
                  </button>
                  <div
                    className="grid transition-all duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <p className="text-mist text-sm leading-relaxed px-5 sm:px-6 pb-5">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
