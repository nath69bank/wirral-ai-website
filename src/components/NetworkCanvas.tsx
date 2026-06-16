import { useEffect, useRef } from 'react'

interface Particle {
  startX: number
  startY: number
  targetX: number
  targetY: number
  x: number
  y: number
  r: number
  driftFreqX: number
  driftFreqY: number
  driftPhaseX: number
  driftPhaseY: number
  driftAmp: number
}

interface NetworkCanvasProps {
  className?: string
  /** Roughly how many nodes per 10,000px^2 of canvas area */
  density?: number
  /** Max distance (px, at design width ~1200) within which two nodes get a connecting line */
  linkDistance?: number
}

const BLUE: [number, number, number] = [0, 183, 255]
const GREEN: [number, number, number] = [124, 255, 79]

function lerpColor(t: number): string {
  const c = BLUE.map((b, i) => Math.round(b + (GREEN[i] - b) * t))
  return `rgb(${c[0]},${c[1]},${c[2]})`
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export default function NetworkCanvas({ className = '', density = 1, linkDistance = 150 }: NetworkCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = canvas?.parentElement
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let particles: Particle[] = []
    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let rafId = 0
    let startTime = performance.now()
    const LOAD_DURATION = 2200

    function buildParticles() {
      const area = width * height
      const count = Math.max(18, Math.min(140, Math.round((area / 10000) * density)))
      const next: Particle[] = []
      for (let i = 0; i < count; i++) {
        const targetX = Math.random() * width
        const targetY = Math.random() * height
        // chaotic start: scattered further away with extra jitter, biased toward edges
        const angle = Math.random() * Math.PI * 2
        const dist = (Math.min(width, height) * (0.25 + Math.random() * 0.45))
        const startX = Math.min(width, Math.max(0, targetX + Math.cos(angle) * dist))
        const startY = Math.min(height, Math.max(0, targetY + Math.sin(angle) * dist))
        next.push({
          startX,
          startY,
          targetX,
          targetY,
          x: prefersReducedMotion ? targetX : startX,
          y: prefersReducedMotion ? targetY : startY,
          r: 1.4 + Math.random() * 1.8,
          driftFreqX: 0.15 + Math.random() * 0.25,
          driftFreqY: 0.12 + Math.random() * 0.25,
          driftPhaseX: Math.random() * Math.PI * 2,
          driftPhaseY: Math.random() * Math.PI * 2,
          driftAmp: 8 + Math.random() * 10,
        })
      }
      particles = next
    }

    function resize() {
      const rect = container!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildParticles()
    }

    function draw(now: number) {
      const elapsed = now - startTime
      const progress = prefersReducedMotion ? 1 : Math.min(1, elapsed / LOAD_DURATION)
      const eased = easeOutCubic(progress)
      const settleTime = (now - startTime - LOAD_DURATION) / 1000

      ctx!.clearRect(0, 0, width, height)

      for (const p of particles) {
        if (progress < 1) {
          p.x = p.startX + (p.targetX - p.startX) * eased
          p.y = p.startY + (p.targetY - p.startY) * eased
        } else if (!prefersReducedMotion) {
          p.x = p.targetX + Math.sin(settleTime * p.driftFreqX + p.driftPhaseX) * p.driftAmp
          p.y = p.targetY + Math.cos(settleTime * p.driftFreqY + p.driftPhaseY) * p.driftAmp
        } else {
          p.x = p.targetX
          p.y = p.targetY
        }
      }

      // links — only once the network has mostly organised itself
      const linkAlpha = Math.max(0, progress - 0.45) / 0.55
      if (linkAlpha > 0) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i]
            const b = particles[j]
            const dx = a.x - b.x
            const dy = a.y - b.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < linkDistance) {
              const proximity = 1 - dist / linkDistance
              const midT = (a.x / width + b.x / width) / 2
              ctx!.strokeStyle = lerpColor(midT)
              ctx!.globalAlpha = proximity * 0.35 * linkAlpha
              ctx!.lineWidth = 1
              ctx!.beginPath()
              ctx!.moveTo(a.x, a.y)
              ctx!.lineTo(b.x, b.y)
              ctx!.stroke()
            }
          }
        }
      }

      // nodes
      for (const p of particles) {
        const t = p.x / width
        ctx!.globalAlpha = 0.85
        ctx!.fillStyle = lerpColor(t)
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fill()

        ctx!.globalAlpha = 0.18
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2)
        ctx!.fill()
      }
      ctx!.globalAlpha = 1

      rafId = requestAnimationFrame(draw)
    }

    const resizeObserver = new ResizeObserver(() => resize())
    resizeObserver.observe(container)
    resize()
    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
    }
  }, [density, linkDistance])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
