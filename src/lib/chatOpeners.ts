import type { ChatTopic } from './chatContext'

// These openers are ONLY shown to Done For You (agency) customers.
// Masterclass / strategy call visitors go directly to masterclass.wirral.ai.
export const CHAT_OPENERS: Record<ChatTopic, string> = {
  general:
    "What kind of business are we building a website for?",
  'ai-staff':
    "Good choice — AI Staff is one of the most popular things we build. What kind of business is it for?",
  'automated-marketing':
    "Automated marketing works best when it is built around how the business already works. What kind of business is it?",
  pricing:
    "£50 to build, £20 a month to keep it live. What kind of business are we building for?",
  restaurants:
    "Restaurants and cafes are one of our specialities. What is it called, and are you starting fresh or replacing an existing site?",
  trades:
    "Trades businesses are a great fit for what we do. What is the business called?",
  'clinics-salons':
    "Clinics and salons are one of our most popular niches. What is the business called?",
}
