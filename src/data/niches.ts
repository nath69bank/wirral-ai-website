import type { LucideIcon } from 'lucide-react'
import { UtensilsCrossed, Hammer, Sparkles } from 'lucide-react'

export interface Niche {
  id: string
  name: string
  icon: LucideIcon
  aiStaffExample: string
  marketingExample: string
}

export const niches: Niche[] = [
  {
    id: 'restaurants',
    name: 'Restaurants & Cafés',
    icon: UtensilsCrossed,
    aiStaffExample:
      'Your AI host answers the phone when the kitchen is slammed, takes the booking, and confirms it by text, so nobody is left on hold during a Friday dinner rush.',
    marketingExample:
      'Customers who have not booked in a while automatically get a "we miss you" offer, and your team gets an email the moment stock on a popular dish is running low.',
  },
  {
    id: 'trades',
    name: 'Trades & Home Services',
    icon: Hammer,
    aiStaffExample:
      'Missed a call while you were up a ladder? Your AI receptionist answers, takes the job details, and texts you the lead before you are back at the van.',
    marketingExample:
      'Customers get an automatic reminder when their annual service is due, and a quick WhatsApp message goes out the day after a job is finished asking for a review.',
  },
  {
    id: 'clinics-salons',
    name: 'Clinics & Salons',
    icon: Sparkles,
    aiStaffExample:
      'Your AI assistant handles bookings and the questions you get asked every day, around the clock, so reception is not stuck on the phone instead of greeting the next client.',
    marketingExample:
      'Clients who have not rebooked in a while get a gentle nudge by email or WhatsApp, and no-show reminders go out automatically the day before each appointment.',
  },
]
