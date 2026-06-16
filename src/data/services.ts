import type { LucideIcon } from 'lucide-react'
import { Target, Megaphone, MessageCircle, GitBranch, CalendarCheck, Repeat2, Star, Zap, Share2, BarChart3 } from 'lucide-react'

export interface Service {
  id: string
  name: string
  benefit: string
  icon: LucideIcon
}

export interface ServiceStage {
  stage: string
  label: string
  description: string
  services: Service[]
}

export const serviceStages: ServiceStage[] = [
  {
    stage: 'Capture',
    label: 'Win the opportunity',
    description: 'Get seen by the right people and catch every enquiry that comes in.',
    services: [
      {
        id: 'lead-management',
        name: 'Lead Management',
        benefit: 'Never lose track of a potential customer again. Every enquiry is captured, organised and followed up automatically, so nothing slips through the cracks.',
        icon: Target,
      },
      {
        id: 'marketing',
        name: 'Marketing',
        benefit: 'Reach the right people without burning your budget. Campaigns run consistently and get measured properly, so you always know what is working.',
        icon: Megaphone,
      },
    ],
  },
  {
    stage: 'Convert',
    label: 'Turn enquiries into customers',
    description: 'Respond fast, stay organised, and make it effortless for people to say yes.',
    services: [
      {
        id: 'customer-communication',
        name: 'Customer Communication',
        benefit: 'Reply to enquiries in minutes, not days. Customers get fast, consistent answers whenever they get in touch, even outside office hours.',
        icon: MessageCircle,
      },
      {
        id: 'sales-pipelines',
        name: 'Sales Pipelines',
        benefit: 'See exactly where every opportunity stands. A clear, visual pipeline means nothing gets forgotten and nobody has to chase their own notes.',
        icon: GitBranch,
      },
      {
        id: 'appointment-booking',
        name: 'Appointment Booking',
        benefit: 'Let customers book themselves in, day or night. Fewer phone calls, fewer no-shows, and a calendar that fills itself.',
        icon: CalendarCheck,
      },
    ],
  },
  {
    stage: 'Retain',
    label: 'Keep them coming back',
    description: 'Stay front of mind, protect your reputation, and build loyalty without the manual chasing.',
    services: [
      {
        id: 'customer-retention',
        name: 'Customer Retention',
        benefit: 'Turn one-time buyers into repeat customers. Automated check-ins and follow-ups keep your business front of mind long after the first sale.',
        icon: Repeat2,
      },
      {
        id: 'reputation-management',
        name: 'Reputation Management',
        benefit: 'Build trust before a customer even calls. Happy customers are prompted to leave reviews, and feedback gets handled before it becomes a problem.',
        icon: Star,
      },
    ],
  },
  {
    stage: 'Optimise',
    label: 'Run leaner every month',
    description: 'Cut the admin, connect your tools, and see what is actually driving results.',
    services: [
      {
        id: 'automation',
        name: 'Automation',
        benefit: 'Take repetitive admin off your plate for good. The routine tasks that eat your day run quietly in the background, freeing you up for the work that matters.',
        icon: Zap,
      },
      {
        id: 'workflow-automation',
        name: 'Workflow Automation',
        benefit: 'Connect the tools you already use so they finally talk to each other. Information flows between systems automatically, with no manual re-typing.',
        icon: Share2,
      },
      {
        id: 'analytics',
        name: 'Analytics',
        benefit: 'Know what is working and what is not, at a glance. Clear reporting shows you where leads come from and where your money is best spent.',
        icon: BarChart3,
      },
    ],
  },
]
