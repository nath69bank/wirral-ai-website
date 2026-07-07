export interface FAQ {
  id: string
  question: string
  answer: string
}

export const faqs: FAQ[] = [
  {
    id: 'who-is-this-for',
    question: 'What kind of businesses do you work with?',
    answer: "Trades, service businesses, professional firms, clinics, hospitality, retail, and any SME that needs a website that actually wins them work. If you are based across Wirral, Liverpool, Manchester or Chester and your website is either non-existent, embarrassing, or just not doing anything for your business, we can fix that.",
  },
  {
    id: 'starter-vs-advanced',
    question: 'How do I know if I need a Starter or Advanced website?',
    answer: "If you need a professional site that tells people who you are, what you do and how to get in touch — that is a Starter. If you need bookings, payments, a CRM, a members area, a product catalogue, or anything that involves complex functionality — that is Advanced. Not sure? Book a call and we will tell you honestly which one fits.",
  },
  {
    id: 'how-long',
    question: 'How long does it actually take?',
    answer: "Starter websites are typically live within one week of the discovery call. Advanced builds are scoped individually — we give you a realistic timeline before work starts, not after.",
  },
  {
    id: 'starter-price',
    question: 'What does a Starter website cost?',
    answer: "A flat £50 to build, then £20 a month to keep it hosted, maintained and supported. No contracts, no setup fees, no surprise invoices. The £20 covers hosting, security, updates and ongoing support — not just somewhere for the files to live.",
  },
  {
    id: 'advanced-price',
    question: 'What does an Advanced website cost?',
    answer: "Advanced builds are quoted individually based on what you actually need. We scope the project properly on a discovery call, give you a fixed price before we start, and stick to it. No hourly billing, no scope creep invoices.",
  },
  {
    id: 'ai-automation',
    question: 'Do you do AI automation and marketing?',
    answer: "Yes, but not through this website. AI automation — AI receptionists, automated marketing, workflows — is covered in the Wirral AI Masterclass, which runs free every Friday. It is a separate product designed specifically for businesses who want to go deeper into AI. You can register at masterclass.wirral.ai.",
  },
  {
    id: 'what-happens-after',
    question: 'What happens after the site goes live?',
    answer: "We maintain it. Your £20 a month is not just hosting — it covers updates, security patches, performance monitoring, and access to the team whenever something needs changing. Most agencies disappear after launch. We stay.",
  },
  {
    id: 'stop',
    question: 'What if I want to stop?',
    answer: "Cancel any time. No notice period, no exit fees. Your website files belong to you and we will hand them over if you want to take them elsewhere.",
  },
]
