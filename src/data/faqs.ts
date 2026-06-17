export interface FAQ {
  id: string
  question: string
  answer: string
}

export const faqs: FAQ[] = [
  {
    id: 'setup-time',
    question: 'How long does it take to get set up?',
    answer:
      'Most businesses are live within one to two weeks. We start with the systems that will save you the most time first, then build out from there, so you see results early rather than waiting months for a "big launch".',
  },
  {
    id: 'support',
    question: 'What kind of support do I get?',
    answer:
      'You work with a UK-based team who already understand your setup, not a rotating help desk. If something needs changing or a process stops fitting how you work, you message us and we sort it.',
  },
  {
    id: 'customisation',
    question: 'Will this be built around how my business actually works?',
    answer:
      'Yes. We start by mapping how leads, bookings and follow-ups currently move through your business, then build systems around that, rather than forcing you into a rigid template.',
  },
  {
    id: 'pricing',
    question: 'How much does it cost?',
    answer:
      "It's a flat £50 one-off fee to build your website with AI staff and automated marketing set up, then £20 a month to keep it hosted, running and supported. No quotes, no contracts, no surprise invoices later.",
  },
  {
    id: 'industry-fit',
    question: 'Will this work for my industry?',
    answer:
      'We work with trades, healthcare practices, recruitment firms, property businesses, agencies, consultants and other professional and service businesses across Wirral, Liverpool, Manchester and Chester. If you deal with enquiries, bookings or repeat customers, this is built for you.',
  },
  {
    id: 'migration',
    question: 'What happens to the software I already use?',
    answer:
      'In most cases, nothing changes on your end. We connect your existing tools rather than ripping them out, and where a switch genuinely makes things simpler, we handle the migration so nothing gets lost.',
  },
]
