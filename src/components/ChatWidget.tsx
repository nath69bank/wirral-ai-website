import { useEffect, useRef, useState } from 'react'
import { X, Send, ArrowRight, MessageCircle } from 'lucide-react'
import wirralW from '../assets/wirral-w.webp'
import { useChat } from '../lib/chatContext'
import { CHAT_OPENERS } from '../lib/chatOpeners'
import { parseAssistantReply } from '../lib/chatSummary'
import { buildWhatsAppLink } from '../lib/whatsapp'

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
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const initializedTopic = useRef<string | null>(null)

  useEffect(() => {
    if (isOpen && initializedTopic.current !== topic && messages.length === 0) {
      initializedTopic.current = topic
      setMessages([{ role: 'assistant', content: CHAT_OPENERS[topic] }])
    }
  }, [isOpen, topic, messages.length])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  async function sendMessage(text: string) {
    if (!text.trim() || loading || summary) return
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
      const { displayText, summaryForWhatsApp } = parseAssistantReply(data.reply || '')
      setMessages((prev) => [...prev, { role: 'assistant', content: displayText }])
      if (summaryForWhatsApp) setSummary(summaryForWhatsApp)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeChat} />

      <div className="relative z-10 w-full sm:max-w-md h-[88vh] sm:h-[640px] bg-navy-deep sm:rounded-3xl rounded-t-3xl ring-1 ring-white/10 shadow-2xl flex flex-col overflow-hidden animate-fade-up">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-navy-panel shrink-0">
          <img src={wirralW} alt="" className="w-7 h-7 object-contain" />
          <div className="flex-1">
            <p className="text-white text-sm font-semibold">Wirral AI Assistant</p>
            <p className="text-mist text-xs">Usually replies in seconds</p>
          </div>
          <button
            onClick={closeChat}
            className="w-8 h-8 flex items-center justify-center rounded-full text-mist hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

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
                href={buildWhatsAppLink("Hi Wirral AI — I'd like to get a website built for my business.")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green underline"
              >
                open WhatsApp
              </a>
              .
            </div>
          )}

          {summary && (
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
      </div>
    </div>
  )
}
