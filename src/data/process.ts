export interface ProcessStep {
  number: string
  title: string
  description: string
  detail: string
}

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Discovery call',
    description: 'We spend 20 minutes understanding your business, your customers, and what you actually need the website to do.',
    detail: 'No lengthy briefs. No forms. Just a straight conversation about where you are, where you want to be, and what is stopping you.',
  },
  {
    number: '02',
    title: 'We build it',
    description: 'We design and build your website around your business, your customers, and the outcomes you told us matter most.',
    detail: 'Most Starter sites are live within a week. Advanced builds are scoped properly before we start so there are no surprises on timeline or cost.',
  },
  {
    number: '03',
    title: 'You review it',
    description: 'You see the site before it goes live. We make any changes until it is exactly right.',
    detail: 'We do not disappear after launch. Your site is maintained, updated and supported every month as part of your subscription.',
  },
  {
    number: '04',
    title: 'It works for you',
    description: 'Your website is live, ranked locally, and actively bringing in enquiries while you focus on running your business.',
    detail: 'We monitor performance, make updates, and are on hand whenever something needs changing. You are never left alone with a website that has stopped working.',
  },
]
