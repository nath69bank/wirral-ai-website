import { useEffect, useRef, useState, type ReactNode } from 'react'

interface ScaledMockupProps {
  designWidth: number
  children: ReactNode
  className?: string
}

/**
 * Renders children at a fixed "design" pixel width, then scales the whole
 * thing down via CSS transform to fit the available container width. This
 * keeps the mockup's internal layout pixel-perfect at every viewport size
 * instead of fighting with responsive breakpoints inside the mockup itself.
 */
export default function ScaledMockup({ designWidth, children, className = '' }: ScaledMockupProps) {
  const outerRef = useRef<HTMLDivElement | null>(null)
  const innerRef = useRef<HTMLDivElement | null>(null)
  const [scale, setScale] = useState(1)
  const [innerHeight, setInnerHeight] = useState(0)

  useEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return

    const update = () => {
      const containerWidth = outer.getBoundingClientRect().width
      const nextScale = containerWidth / designWidth
      setScale(nextScale)
      setInnerHeight(inner.offsetHeight)
    }

    update()
    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(outer)
    return () => resizeObserver.disconnect()
  }, [designWidth])

  return (
    <div ref={outerRef} className={className} style={{ height: innerHeight * scale || undefined }}>
      <div
        ref={innerRef}
        style={{ width: designWidth, transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        {children}
      </div>
    </div>
  )
}
