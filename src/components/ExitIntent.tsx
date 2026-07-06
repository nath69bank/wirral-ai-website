import { useEffect, useState } from 'react'
import { X, Calendar, ArrowRight } from 'lucide-react'
import { useChat } from '../lib/chatContext'

/**
 * Shows once per session when the user's cursor leaves the viewport toward
 * the top of the screen (classic exit intent). On mobile, fires after 45s
 * of idle time instead, since there's no cursor to track.
 */
export default function ExitIntent() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const { openChat } = useChat()

  useEffect(() => {
    if (dismissed || sessionStorage.getItem('exit-intent-shown')) return

    const isMobile = window.innerWidth < 768

    if (isMobile) {
      // On mobile: show after 50 seconds if still on the page
      const t = setTimeout(() => {
        if (!sessionStorage.getItem('exit-intent-shown')) {
          setShow(true)
          sessionStorage.setItem('exit-intent-shown', '1')
        }
      }, 50000)
      return () => clearTimeout(t)
    } else {
      // On desktop: show on mouse-leave toward the top
      const handler = (e: MouseEvent) => {
        if (e.clientY <= 10 && !sessionStorage.getItem('exit-intent-shown')) {
          setShow(true)
          sessionStorage.setItem('exit-intent-shown', '1')
        }
      }
      document.addEventListener('mouseleave', handler)
      return () => document.removeEventListener('mouseleave', handler)
    }
  }, [dismissed])

  function dismiss() {
    setShow(false)
    setDismissed(true)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-5">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={dismiss} />

      <div className="relative z-10 w-full max-w-md glass-panel-strong rounded-3xl p-7 sm:p-9 animate-fade-up text-center shadow-2xl">
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-mist hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-full bg-brand-gradient flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-6 h-6 text-navy" />
        </div>

        <h3 className="font-display text-xl sm:text-2xl font-semibold text-white mb-2">
          Before you go —
        </h3>
        <p className="text-mist text-sm leading-relaxed mb-6">
          The free Friday Masterclass takes 90 minutes and most people leave knowing exactly 
          what their business needs. It costs nothing and you can ask Nathan anything live.
        </p>

        <div className="flex flex-col gap-3">
          <a
            href="https://masterclass.wirral.ai"
            target="_blank"
            rel="noopener noreferrer"
            onClick={dismiss}
            className="inline-flex items-center justify-center gap-2 bg-brand-gradient text-navy text-sm font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-all"
          >
            Reserve a free seat for Friday
            <ArrowRight className="w-4 h-4" />
          </a>
          <button
            onClick={() => { dismiss(); openChat('pricing') }}
            className="text-mist text-sm hover:text-white transition-colors py-2"
          >
            I'd rather just get my website built →
          </button>
        </div>
      </div>
    </div>
  )
}
