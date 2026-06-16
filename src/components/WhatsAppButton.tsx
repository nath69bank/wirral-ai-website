import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { buildWhatsAppLink, WHATSAPP_DEFAULT_MESSAGE } from '../lib/whatsapp'

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={buildWhatsAppLink(WHATSAPP_DEFAULT_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 flex items-center gap-2.5 bg-brand-gradient text-navy rounded-full shadow-glow-green pl-3.5 pr-3.5 py-3.5 hover:scale-105 transition-transform"
      aria-label="Chat with Wirral AI on WhatsApp"
    >
      <MessageCircle className="w-5 h-5" strokeWidth={2} />
      <span
        className={`text-sm font-semibold overflow-hidden whitespace-nowrap transition-all duration-300 ${
          hovered ? 'max-w-[140px] opacity-100' : 'max-w-0 opacity-0'
        }`}
      >
        Chat on WhatsApp
      </span>
    </a>
  )
}
