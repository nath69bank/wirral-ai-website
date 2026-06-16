export interface CaseStudy {
  id: string
  client: string
  industry: string
  summary: string
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'gene23',
    client: 'Gene23 Health Clinic',
    industry: 'Healthcare',
    summary:
      'Appointment reminders and patient follow-ups now run automatically, freeing up front-of-house time and cutting down on missed bookings.',
  },
  {
    id: 'lahori-lane',
    client: 'Lahori Lane',
    industry: 'Hospitality',
    summary:
      'Customer enquiries and social content are handled consistently, with faster responses even during the busiest service hours.',
  },
  {
    id: 'jc-paint',
    client: 'JC Paint',
    industry: 'Trade Services',
    summary:
      'Quote requests are captured and followed up automatically, so fewer enquiries go quiet after the first message.',
  },
]

export const retentionStat = {
  value: '89%',
  label: 'Client retention rate',
  description: 'Most clients stay with us long after the initial project, because the systems keep proving their worth.',
}
