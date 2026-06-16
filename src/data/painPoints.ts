import type { LucideIcon } from 'lucide-react'
import { TrendingDown, MailWarning, ClipboardX, Unplug, Clock, Wallet } from 'lucide-react'

export interface PainPoint {
  id: string
  label: string
  detail: string
  icon: LucideIcon
  whatsappMessage: string
}

export const painPoints: PainPoint[] = [
  {
    id: 'leads-slipping',
    label: 'Leads slipping through the cracks',
    detail: 'Enquiries come in but nobody follows them up in time, so they go quiet.',
    icon: TrendingDown,
    whatsappMessage:
      "Hi Wirral AI — leads keep slipping through the cracks before we follow up. Can you show me how to fix this?",
  },
  {
    id: 'missed-enquiries',
    label: 'Missed enquiries after hours',
    detail: 'Calls and messages outside office hours just go unanswered until tomorrow.',
    icon: MailWarning,
    whatsappMessage:
      "Hi Wirral AI — we miss enquiries that come in after hours. Can you show me how to fix this?",
  },
  {
    id: 'manual-admin',
    label: 'Manual admin eating your evenings',
    detail: 'Hours each week go on data entry, chasing paperwork and repeating yourself.',
    icon: ClipboardX,
    whatsappMessage:
      "Hi Wirral AI — manual admin is eating up our evenings. Can you show me how to fix this?",
  },
  {
    id: 'disconnected-software',
    label: 'Software that does not talk to itself',
    detail: 'Your booking system, CRM and inbox all live in separate worlds.',
    icon: Unplug,
    whatsappMessage:
      "Hi Wirral AI — our software doesn't talk to itself, everything's disconnected. Can you show me how to fix this?",
  },
  {
    id: 'slow-follow-up',
    label: 'Slow follow-up losing you sales',
    detail: 'By the time someone gets back to a lead, they have already gone elsewhere.',
    icon: Clock,
    whatsappMessage:
      "Hi Wirral AI — slow follow-up keeps costing us sales. Can you show me how to fix this?",
  },
  {
    id: 'wasted-marketing-spend',
    label: 'Marketing spend with no clear return',
    detail: 'You are paying for ads and posts but cannot say what they actually bring in.',
    icon: Wallet,
    whatsappMessage:
      "Hi Wirral AI — I can't tell if our marketing spend is actually paying off. Can you show me how to fix this?",
  },
]
