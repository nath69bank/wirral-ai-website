import { useEffect, useRef, useState } from 'react'
import { X, Send, ArrowRight, MessageCircle, Calendar } from 'lucide-react'
import wirralW from '../assets/wirral-w.webp'
import { useChat } from '../lib/chatContext'
import { CHAT_OPENERS } from '../lib/chatOpeners'
import { parseAssistantReply } from '../lib/chatSummary'
import { buildWhatsAppLink } from '../lib/whatsapp'

// ── IMPORTANT: paste your GHL calendar booking link here once you have it ──
const GHL_CALENDAR_URL = 'https://link.gohighlevel.com/widget/booking/REPLACE_WITH_YOUR_GHL_CALENDAR_LINK'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatWidget() {
  const { isOpen, topic, closeChat } = useChat()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const [showBooking, setShowBooking] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const initializedTopic = useRef<string | null>(null)

  useEffect(() => {
    if (isOpen && initializedTopic.current !== topic && messages.length === 0) {
      initializedTopic.current = topic
      setMessages([{ role: 'assistant', content: CHAT_OPENERS[topic] }])
    }
  }, [isOpen, topic, messages.length])

  // Reset state when chat closes
  useEffect(() => {
    if (!isOpen) {
      setMessages([])
      setInput('')
      setLoading(false)
      setError(false)
      setSummary(null)
      setShowBooking(false)
      initializedTopic.current = null
    }
  }, [isOpen])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading, showBooking])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [isOpen])

  async function sendMessage(text: string) {
    if (!text.trim() || loading || summary || showBooking) return
    const next: Message[] = [...messages, { role: 'user', content: text.trim() }]
    setMessages(next)
    setInput('')
    setLoading(true)
    setError(false)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()
      const { displayText, summaryForWhatsApp, showBooking: doShowBooking } = parseAssistantReply(
        data.reply || '',
        { showBooking: data.showBooking, summaryRaw: data.summaryRaw }
      )
      setMessages((prev) => [...prev, { role: 'assistant', content: displayText }])
      if (summaryForWhatsApp) setSummary(summaryForWhatsApp)
      if (doShowBooking) setShowBooking(true)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  // Expanded height when showing the booking calendar
  const widgetHeight = showBooking ? 'h-[95vh] sm:h-[780px]' : 'h-[88vh] sm:h-[640px]'

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeChat} />

      <div className={`relative z-10 w-full sm:max-w-md ${widgetHeight} bg-navy-deep sm:rounded-3xl rounded-t-3xl ring-1 ring-white/10 shadow-2xl flex flex-col overflow-hidden animate-fade-up transition-all duration-300`}>

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-navy-panel shrink-0">
          <img src={wirralW} alt="" className="w-7 h-7 object-contain" />
          <div className="flex-1">
            <p className="text-white text-sm font-semibold">Wirral AI — Aria</p>
            <p className="text-mist text-xs">
              {showBooking ? 'Pick a time that suits you' : 'Usually replies in seconds'}
            </p>
          </div>
          <button
            onClick={closeChat}
            className="w-8 h-8 flex items-center justify-center rounded-full text-mist hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Booking calendar view */}
        {showBooking ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 py-3 glass-panel border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-green" />
                <p className="text-white text-sm font-semibold">Book your free strategy call</p>
              </div>
              <p className="text-mist text-xs">20 minutes with Nathan — no fluff, no hard sell. Pick a time below.</p>
            </div>
            <iframe
              src={GHL_CALENDAR_URL}
              className="flex-1 w-full border-0 bg-white"
              title="Book a strategy call with Nathan"
              loading="lazy"
            />
            <div className="px-4 py-3 border-t border-white/10 bg-navy-panel shrink-0 flex justify-between items-center">
              <p className="text-mist text-xs">Prefer WhatsApp instead?</p>
              <a
                href={buildWhatsAppLink(
                  "Hi Nathan — I've just been chatting with Aria on wirral.ai and I'd like to book a strategy call."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-green hover:opacity-80 transition-opacity"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Message Nathan
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-brand-gradient text-navy font-medium'
                        : 'glass-panel text-white/90'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="glass-panel rounded-2xl px-4 py-3 flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-mist animate-pulse-slow" />
                    <span className="w-1.5 h-1.5 rounded-full bg-mist animate-pulse-slow [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-mist animate-pulse-slow [animation-delay:300ms]" />
                  </div>
                </div>
              )}

              {error && (
                <div className="glass-panel rounded-2xl px-4 py-3 text-[13px] text-white/80">
                  Something went wrong on our end. You can message Nathan directly instead:{' '}
                  <a
                    href={buildWhatsAppLink("Hi Wirral AI — I'd like to find out more about getting a website built.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green underline"
                  >
                    open WhatsApp
                  </a>
                  .
                </div>
              )}

              {summary && !showBooking && (
                <div className="glass-panel-strong rounded-2xl p-4 mt-2">
                  <p className="text-white text-sm font-medium mb-3">
                    Everything Nathan needs is ready to send.
                  </p>
                  <a
                    href={buildWhatsAppLink(summary)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-brand-gradient text-navy text-sm font-semibold px-5 py-3 rounded-full hover:opacity-90 transition-opacity w-full justify-center"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Send to Nathan on WhatsApp
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            {/* Input */}
            {!summary && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  sendMessage(input)
                }}
                className="flex items-center gap-2 px-4 py-3 border-t border-white/10 bg-navy-panel shrink-0"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your reply..."
                  disabled={loading}
                  className="flex-1 bg-white/5 rounded-full px-4 py-2.5 text-sm text-white placeholder-mist outline-none ring-1 ring-white/10 focus:ring-white/25 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center disabled:opacity-40 transition-opacity shrink-0"
                  aria-label="Send"
                >
                  <Send className="w-4 h-4 text-navy" />
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}
