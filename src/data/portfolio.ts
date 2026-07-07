export interface PortfolioItem {
  id: string
  client: string
  category: string
  outcome: string
  tags: string[]
  color: string
  url?: string
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'mobiuk',
    client: 'mobiUK',
    category: 'Retail & Repairs',
    outcome: 'New website generating walk-ins and repair bookings from organic search',
    tags: ['Website Build', 'Local SEO', 'Mobile'],
    color: '#22C55E',
    url: 'https://mobiuk.co.uk',
  },
  {
    id: 'vapouk',
    client: 'Vapo UK',
    category: 'Retail',
    outcome: 'Brand-led site driving in-store footfall and product enquiries',
    tags: ['Website Build', 'Brand', 'E-commerce'],
    color: '#EC008C',
    url: 'https://vapouk.co.uk',
  },
  {
    id: 'nine-dragons',
    client: 'Nine Dragons Martial Arts',
    category: 'Fitness & Sport',
    outcome: 'Members portal with authentication, bookings and class management',
    tags: ['Advanced Build', 'Membership', 'Bookings'],
    color: '#F59E0B',
    url: 'https://ninedragons.co.uk',
  },
  {
    id: 'gene23',
    client: 'Gene23 Health Clinic',
    category: 'Healthcare',
    outcome: 'Appointment bookings up, admin time down with automated reminders',
    tags: ['Advanced Build', 'Bookings', 'Automation'],
    color: '#00B7FF',
  },
  {
    id: 'lahori-lane',
    client: 'Lahori Lane',
    category: 'Hospitality',
    outcome: 'Online presence driving table bookings and handling enquiries automatically',
    tags: ['Website Build', 'Bookings', 'AI'],
    color: '#F97316',
    url: 'https://lahorilane.co.uk',
  },
  {
    id: 'jc-paint',
    client: 'JC Paint',
    category: 'Trade Services',
    outcome: 'Professional website capturing and following up quote requests automatically',
    tags: ['Website Build', 'Lead Gen', 'Trades'],
    color: '#7C3AED',
    url: 'https://jcpainting.co.uk',
  },
]
