import type { LucideIcon } from 'lucide-react'
import { UtensilsCrossed, Hammer, Sparkles } from 'lucide-react'

export interface Niche {
  id: string
  slug: string
  name: string
  icon: LucideIcon
  seoTitle: string
  seoDescription: string
  heroLine: string
  intro: string
  painPoints: string[]
  aiStaffExample: string
  aiStaffDetail: string
  marketingExample: string
  marketingDetail: string
}

export const niches: Niche[] = [
  {
    id: 'restaurants',
    slug: 'restaurants',
    name: 'Restaurants & Cafés',
    icon: UtensilsCrossed,
    seoTitle: 'AI Staff & Automated Marketing for Restaurants & Cafés',
    seoDescription:
      'Websites for restaurants and cafés in Wirral, Liverpool, Manchester and Chester from £50, with an AI host to take bookings during the rush and automated marketing to fill quiet nights.',
    heroLine: 'Built for restaurants and cafés that can\u2019t afford a missed booking',
    intro:
      'During service, nobody has a free hand to answer the phone, and that is exactly when most enquiries come in. A website built for hospitality needs to capture the booking anyway, keep regulars coming back on quiet nights, and flag when stock is about to run out, without adding another job to the pass.',
    painPoints: [
      'The phone rings mid-rush and nobody can answer it',
      'Tables go unbooked because enquiries get missed',
      'Tuesday nights are quiet and nobody is doing anything about it',
      'Nobody notices a popular dish is about to run out until it has',
    ],
    aiStaffExample:
      'Your AI host answers the phone when the kitchen is slammed, takes the booking, and confirms it by text, so nobody is left on hold during a Friday dinner rush.',
    aiStaffDetail:
      'When every pair of hands is on the pass, your AI host picks up instead of the call going to voicemail. It takes the booking, asks the questions you would ask (party size, time, allergies), confirms it back by text, and adds it straight to your booking sheet. The same assistant can also answer the questions you get asked ten times a service, opening hours, whether you take walk-ins, where to park, freeing your team to focus on the room in front of them.',
    marketingExample:
      'Customers who have not booked in a while automatically get a "we miss you" offer, and your team gets an email the moment stock on a popular dish is running low.',
    marketingDetail:
      'Quiet Tuesdays stop being a mystery you just accept. Customers who have not been in for a while get a automatic, gentle offer to bring them back, and customers who do book get a follow-up asking how it went, which doubles as a steady stream of reviews. On the operations side, the same automation watches stock levels and emails your team the moment something popular is about to run out, before it becomes a line removed from the specials board mid-service.',
  },
  {
    id: 'trades',
    slug: 'trades',
    name: 'Trades & Home Services',
    icon: Hammer,
    seoTitle: 'AI Staff & Automated Marketing for Trades & Home Services',
    seoDescription:
      'Websites for plumbers, electricians, builders and home service trades across Wirral, Liverpool, Manchester and Chester from £50, with an AI receptionist that captures every missed call.',
    heroLine: 'Built for trades who lose jobs to a missed call, not bad work',
    intro:
      'Most tradespeople lose work for one reason: they were up a ladder, under a sink, or mid-job when the phone rang. A website built for trades needs to catch that enquiry anyway, chase the next service date without you remembering, and ask for the review while the job is still fresh in the customer\u2019s mind.',
    painPoints: [
      'A missed call mid-job is a missed job, simple as that',
      'Quotes go cold because nobody followed up in time',
      'Annual services get forgotten until the customer calls someone else',
      'Jobs finish and nobody asks for a review while it is fresh',
    ],
    aiStaffExample:
      'Missed a call while you were up a ladder? Your AI receptionist answers, takes the job details, and texts you the lead before you are back at the van.',
    aiStaffDetail:
      'Your AI receptionist answers when you physically can\u2019t, takes down what the job is, where, and how urgent it is, and texts you the details straight away so you can call back the second you are free. It can also handle the basic questions (do you cover this postcode, roughly what does a callout cost, are you free this week) so a cold enquiry does not go cold waiting for you to finish the job in front of you.',
    marketingExample:
      'Customers get an automatic reminder when their annual service is due, and a quick WhatsApp message goes out the day after a job is finished asking for a review.',
    marketingDetail:
      'The customers you did a great job for last year are the easiest sale you will make this year, if you remember to ask. Automated reminders go out when an annual service or check is due, before the customer thinks to call a competitor instead. And the day after every job, a quick WhatsApp message goes out asking for a review, while the work is still fresh in their mind, building up the reputation that wins the next quote before you have even priced it.',
  },
  {
    id: 'clinics-salons',
    slug: 'clinics-salons',
    name: 'Clinics & Salons',
    icon: Sparkles,
    seoTitle: 'AI Staff & Automated Marketing for Clinics & Salons',
    seoDescription:
      'Websites for clinics, salons and beauty businesses across Wirral, Liverpool, Manchester and Chester from £50, with AI booking assistants and automated rebooking reminders.',
    heroLine: 'Built for clinics and salons where reception is run off its feet',
    intro:
      'Reception has two jobs at once, looking after the client in the room and answering the phone for the next one, and one of them always loses. A website built for clinics and salons needs to take bookings and answer the routine questions itself, then quietly chase rebookings and no-shows so the calendar stays full without anyone having to think about it.',
    painPoints: [
      'Reception is stuck on the phone instead of greeting the next client',
      'Clients drift away and nobody notices until the chair is empty',
      'No-shows eat into a day that was fully booked the week before',
      'The same five questions get asked on the phone every single day',
    ],
    aiStaffExample:
      'Your AI assistant handles bookings and the questions you get asked every day, around the clock, so reception is not stuck on the phone instead of greeting the next client.',
    aiStaffDetail:
      'Bookings and the questions you answer a dozen times a day (do you take walk-ins, how much is a patch test, what should I do before my appointment) get handled by your AI assistant, day or night, so reception can focus on the client standing in front of them instead of the phone ringing behind the desk.',
    marketingExample:
      'Clients who have not rebooked in a while get a gentle nudge by email or WhatsApp, and no-show reminders go out automatically the day before each appointment.',
    marketingDetail:
      'Clients who used to come in every six weeks and quietly stopped get a gentle nudge to rebook, automatically, before they become a client you have lost for good. And every appointment gets a reminder the day before by text or WhatsApp, cutting down the no-shows that turn a fully booked day into gaps in the calendar.',
  },
]

export const getNiche = (slug: string) => niches.find((n) => n.slug === slug)
