import type { ChatTopic } from './chatContext'

export const CHAT_OPENERS: Record<ChatTopic, string> = {
  general:
    "Hi! I'm here to help get your website sorted with Wirral AI. Mind if I ask a couple of quick questions so Nathan has everything he needs?",
  'ai-staff':
    "Hi! Looks like you're interested in AI Staff. Let's get a few quick details sorted so Nathan can give you the full picture — what kind of business do you run?",
  'automated-marketing':
    "Hi! Looks like you're interested in Automated Marketing. Let's grab a few quick details so Nathan can give you the full picture — what kind of business do you run?",
  pricing:
    "Hi! Ready to get your website built for £50? Let's grab a few quick details first so Nathan has everything he needs to get started.",
  restaurants:
    "Hi! Looks like you're after a website for a restaurant or café. What's it called, and is this your first website or are you replacing one?",
  trades:
    "Hi! Looks like you're after a website for a trade or home service business. What's it called, and is this your first website or are you replacing one?",
  'clinics-salons':
    "Hi! Looks like you're after a website for a clinic or salon. What's it called, and is this your first website or are you replacing one?",
}
