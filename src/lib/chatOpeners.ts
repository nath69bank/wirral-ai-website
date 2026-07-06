import type { ChatTopic } from './chatContext'

export const CHAT_OPENERS: Record<ChatTopic, string> = {
  general:
    "What kind of business are you looking to get a website for?",
  'ai-staff':
    "Good choice — AI Staff is one of our most popular add-ons. What kind of business do you run? I'll explain exactly how it would work for you.",
  'automated-marketing':
    "Automated marketing is a game changer when it's set up right. What kind of business do you run?",
  pricing:
    "At £50 to build and £20 a month to keep live, it's the most straightforward offer we have. What kind of business are we building for?",
  restaurants:
    "Restaurants and cafés are one of our specialities. What's it called, and are you starting fresh or replacing an existing site?",
  trades:
    "Trades businesses are a great fit for what we do — missed calls cost real money. What's the business called?",
  'clinics-salons':
    "Clinics and salons are one of our most popular niches. What's the business called, and is this a new website or a replacement?",
}
