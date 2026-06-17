import type { LucideIcon } from 'lucide-react'
import {
  Target,
  Megaphone,
  MessageCircle,
  GitBranch,
  CalendarCheck,
  Repeat2,
  Star,
  Zap,
  Share2,
  BarChart3,
  Headset,
  Mail,
} from 'lucide-react'

export interface Service {
  id: string
  name: string
  benefit: string
  icon: LucideIcon
}

export interface Pillar {
  id: 'ai-staff' | 'automated-marketing'
  path: string
  name: string
  shortName: string
  tagline: string
  description: string
  heroLine: string
  icon: LucideIcon
  services: Service[]
}

export const pillars: Pillar[] = [
  {
    id: 'ai-staff',
    path: '/ai-staff',
    name: 'AI Staff',
    shortName: 'AI Staff',
    tagline: 'Receptionists and chat assistants that never clock off',
    description:
      'An AI member of staff answers your calls and messages, books appointments, and handles the questions you get asked every day, so a real enquiry never goes unanswered just because everyone was busy.',
    heroLine: 'Your phones and messages, answered every single time.',
    icon: Headset,
    services: [
      {
        id: 'lead-management',
        name: 'Lead Management',
        benefit: 'Never lose track of a potential customer again. Every enquiry is captured, organised and followed up automatically, so nothing slips through the cracks.',
        icon: Target,
      },
      {
        id: 'customer-communication',
        name: 'Customer Communication',
        benefit: 'Reply to enquiries in minutes, not days. Customers get fast, consistent answers whenever they get in touch, even outside office hours.',
        icon: MessageCircle,
      },
      {
        id: 'appointment-booking',
        name: 'Appointment Booking',
        benefit: 'Let customers book themselves in, day or night. Fewer phone calls, fewer no-shows, and a calendar that fills itself.',
        icon: CalendarCheck,
      },
      {
        id: 'sales-pipelines',
        name: 'Sales Pipelines',
        benefit: 'See exactly where every opportunity stands. A clear, visual pipeline means nothing gets forgotten and nobody has to chase their own notes.',
        icon: GitBranch,
      },
      {
        id: 'automation',
        name: 'Behind-the-Scenes Automation',
        benefit: 'Take repetitive admin off your plate for good. The routine tasks that eat your day run quietly in the background, freeing you up for the work that matters.',
        icon: Zap,
      },
    ],
  },
  {
    id: 'automated-marketing',
    path: '/automated-marketing',
    name: 'Automated Marketing',
    shortName: 'Marketing',
    tagline: 'Email and WhatsApp campaigns that bring customers back',
    description:
      'Past customers get the right message at the right time automatically, special offers, booking reminders, restock alerts, review requests, without anyone in your business having to remember to send it.',
    heroLine: 'The follow-up that wins back customers, sent automatically.',
    icon: Mail,
    services: [
      {
        id: 'marketing',
        name: 'Email & WhatsApp Campaigns',
        benefit: 'Reach the right people without burning your budget. Campaigns run consistently and get measured properly, so you always know what is working.',
        icon: Megaphone,
      },
      {
        id: 'customer-retention',
        name: 'Customer Retention',
        benefit: 'Turn one-time buyers into repeat customers. Automated check-ins and win-back offers keep your business front of mind long after the first sale.',
        icon: Repeat2,
      },
      {
        id: 'reputation-management',
        name: 'Reputation Management',
        benefit: 'Build trust before a customer even calls. Happy customers are prompted to leave reviews, and feedback gets handled before it becomes a problem.',
        icon: Star,
      },
      {
        id: 'workflow-automation',
        name: 'Workflow Automation',
        benefit: 'Connect the tools you already use so they finally talk to each other, including stock and inventory alerts the moment something is running low.',
        icon: Share2,
      },
      {
        id: 'analytics',
        name: 'Analytics',
        benefit: 'Know what is working and what is not, at a glance. Clear reporting shows you where customers come from and which campaigns earn their keep.',
        icon: BarChart3,
      },
    ],
  },
]

export const getPillar = (id: Pillar['id']) => pillars.find((p) => p.id === id)!
