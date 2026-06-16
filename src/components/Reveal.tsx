import type { ReactNode } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

interface RevealProps {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'li'
}

export default function Reveal({ children, delay = 0, className = '', as = 'div' }: RevealProps) {
  const { ref, visible } = useScrollReveal()
  const Tag = as as any

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </Tag>
  )
}
