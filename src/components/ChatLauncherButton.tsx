import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useChat } from '../lib/chatContext'

export default function ChatLauncherButton() {
  const { isOpen, openChat } = useChat()
  const [hovered, setHovered] = useState(false)

  if (isOpen) return null

  return (
    <button
      onClick={() => openChat('general')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 flex items-center gap-2.5 bg-brand-gradient text-navy rounded-full shadow-glow-green pl-3.5 pr-3.5 py-3.5 hover:scale-105 transition-transform"
      aria-label="Chat with the Wirral AI assistant"
    >
      <MessageCircle className="w-5 h-5" strokeWidth={2} />
      <span
        className={`text-sm font-semibold overflow-hidden whitespace-nowrap transition-all duration-300 ${
          hovered ? 'max-w-[140px] opacity-100' : 'max-w-0 opacity-0'
        }`}
      >
        Chat with us
      </span>
    </button>
  )
}
