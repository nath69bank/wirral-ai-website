import type { LucideIcon } from 'lucide-react'
import { Users, TrendingUp, Zap, Smile, PiggyBank, Gauge } from 'lucide-react'

export interface Benefit {
  id: string
  title: string
  description: string
  icon: LucideIcon
}

export const benefits: Benefit[] = [
  {
    id: 'more-leads',
    title: 'More Leads',
    description: 'Every enquiry gets captured and chased, so opportunities that used to disappear now turn into conversations.',
    icon: Users,
  },
  {
    id: 'better-conversions',
    title: 'Better Conversions',
    description: 'A clear pipeline and fast follow-up mean more of the leads you already have turn into paying customers.',
    icon: TrendingUp,
  },
  {
    id: 'faster-response',
    title: 'Faster Response Times',
    description: 'Customers hear back in minutes, not days. Quick replies are one of the biggest drivers of whether someone books.',
    icon: Zap,
  },
  {
    id: 'higher-satisfaction',
    title: 'Higher Customer Satisfaction',
    description: 'Consistent communication and fewer dropped balls mean customers feel looked after from first contact onward.',
    icon: Smile,
  },
  {
    id: 'lower-costs',
    title: 'Lower Operating Costs',
    description: 'Less time spent on admin and chasing means you can grow without adding headcount just to keep up.',
    icon: PiggyBank,
  },
  {
    id: 'improved-productivity',
    title: 'Improved Team Productivity',
    description: 'Your team spends their time on the work that actually moves the business forward, not repetitive busywork.',
    icon: Gauge,
  },
]
