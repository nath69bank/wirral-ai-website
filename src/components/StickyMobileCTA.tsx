import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useChat } from '../lib/chatContext'

/**
 * Shows a sticky CTA bar at the bottom of mobile screens once the user has
 * scrolled past the hero (300px). Hidden on desktop since the nav CTA covers it.
 * Hidden when the chat widget is open to avoid visual clash.
 */
export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false)
  const { isOpen, openChat } = useChat()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible || isOpen) return null

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-navy-deep/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 safe-bottom">
      <button
        onClick={() => openChat('starter')}
        className="w-full inline-flex items-center justify-center gap-2 bg-brand-gradient text-navy text-sm font-semibold px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity"
      >
        Book a free discovery call
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}
