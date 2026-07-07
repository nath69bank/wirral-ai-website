import type { LucideIcon } from 'lucide-react'
import { Globe, Zap, Brain } from 'lucide-react'

export interface ServicePathway {
  id: string
  tag: string
  icon: LucideIcon
  headline: string
  sub: string
  outcomes: string[]
  cta: string
  ctaType: 'chat' | 'external'
  ctaTarget: string
  accent: 'blue' | 'green' | 'purple'
}

export const servicePathways: ServicePathway[] = [
  {
    id: 'starter',
    tag: 'Most Popular',
    icon: Globe,
    headline: 'Starter Website',
    sub: 'For businesses that need a professional online presence that actually wins them work — built fast, maintained for you, and priced so it makes sense from day one.',
    outcomes: [
      'Professional website live within a week',
      'Works perfectly on every device',
      'Built to rank on Google locally',
      'Hosted, updated and supported every month',
      'No contracts — cancel any time',
    ],
    cta: 'Get a Starter Website',
    ctaType: 'chat',
    ctaTarget: 'starter',
    accent: 'blue',
  },
  {
    id: 'advanced',
    tag: 'Custom Build',
    icon: Zap,
    headline: 'Advanced Website',
    sub: 'For businesses that need more than a brochure — booking systems, CRMs, memberships, e-commerce, integrations, or anything bespoke. Built to work the way your business actually works.',
    outcomes: [
      'Booking systems and online payments',
      'CRM and third-party integrations',
      'Membership portals and gated content',
      'E-commerce and product catalogues',
      'Custom functionality built to spec',
    ],
    cta: 'Discuss Your Project',
    ctaType: 'chat',
    ctaTarget: 'advanced',
    accent: 'green',
  },
  {
    id: 'ai',
    tag: 'AI Automation',
    icon: Brain,
    headline: 'AI for Your Business',
    sub: 'Want AI receptionists, automated marketing, or intelligent workflows that run your business in the background? That is what the Wirral AI Masterclass is built for.',
    outcomes: [
      'AI staff that answer enquiries 24/7',
      'Automated email and WhatsApp marketing',
      'Lead qualification and follow-up',
      'Booking and calendar automation',
      'Live training — free every Friday',
    ],
    cta: 'Join the Free Masterclass',
    ctaType: 'external',
    ctaTarget: 'https://masterclass.wirral.ai',
    accent: 'purple',
  },
]
