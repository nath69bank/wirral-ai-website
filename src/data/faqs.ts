export interface FAQ {
  id: string
  question: string
  answer: string
}

export const faqs: FAQ[] = [
  {
    id: 'what-exactly',
    question: 'What exactly do I get for £50?',
    answer:
      "A complete, professionally built website tailored to your business. Nathan builds it, hosts it, and maintains it. The £50 is a one-off build fee. The £20 a month covers hosting, updates, security and support. No hidden extras.",
  },
  {
    id: 'setup-time',
    question: 'How long does it take to go live?',
    answer:
      "Most businesses are live within one week. Nathan starts with a 20-minute strategy call to understand your business, then builds around what he learns. You review it, he makes any changes, and it goes live.",
  },
  {
    id: 'ai-staff-what',
    question: 'What does AI Staff actually do day to day?',
    answer:
      "It acts like a receptionist that never clocks off. When someone messages your website at 11pm asking for a quote, it replies straight away, asks the right questions, and notifies you with a proper lead summary. It handles booking requests, common questions, and follow-ups automatically.",
  },
  {
    id: 'marketing-what',
    question: 'What does Automated Marketing actually send?',
    answer:
      "Typically: win-back messages to customers who have not booked in a while, appointment reminders that cut no-shows, review requests sent automatically after a completed job, and re-engagement offers when stock or availability changes. Nathan sets it up once and it runs in the background.",
  },
  {
    id: 'limited-spots',
    question: 'Why are spots limited?',
    answer:
      "Nathan builds every website himself rather than outsourcing it. That means the quality is consistent but the capacity is finite. He takes on a set number of new builds each month so every client gets his full attention.",
  },
  {
    id: 'masterclass',
    question: 'What is the Masterclass and who is it for?',
    answer:
      "The free Friday Masterclass is for business owners who want to understand how AI and automated marketing work before committing to anything. Nathan builds a real system live on screen in 90 minutes. No slides, no pitch. Most people leave knowing exactly what their business needs.",
  },
  {
    id: 'contracts',
    question: 'What happens if I want to stop?',
    answer:
      "You cancel and that is it. No notice period, no exit fees, no awkward conversations. Your website files belong to you and Nathan will hand them over if you want to take hosting elsewhere.",
  },
  {
    id: 'industry-fit',
    question: 'Does this work for my type of business?',
    answer:
      "If you deal with enquiries, bookings or repeat customers, it works. Wirral AI builds for trades, restaurants and cafes, clinics and salons, recruitment, property and professional services across Wirral, Liverpool, Manchester and Chester. If you are not sure, open the chat and Aria will tell you honestly whether it is a fit.",
  },
]
