import { createContext, useContext, useState, type ReactNode } from 'react'

export type ChatTopic =
  | 'general'
  | 'ai-staff'
  | 'automated-marketing'
  | 'pricing'
  | 'restaurants'
  | 'trades'
  | 'clinics-salons'

interface ChatContextValue {
  isOpen: boolean
  topic: ChatTopic
  openChat: (topic?: ChatTopic) => void
  closeChat: () => void
}

const ChatContext = createContext<ChatContextValue | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [topic, setTopic] = useState<ChatTopic>('general')

  const openChat = (newTopic: ChatTopic = 'general') => {
    setTopic(newTopic)
    setIsOpen(true)
  }
  const closeChat = () => setIsOpen(false)

  return (
    <ChatContext.Provider value={{ isOpen, topic, openChat, closeChat }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used within a ChatProvider')
  return ctx
}
