/* ==========================================================================
   wirral.ai — "Build With Us" project enquiry wizard
   A data-driven, multi-step, conditionally-branching questionnaire that
   replaces a single long contact form. Six services, each with its own
   relevant questions, plus shared timescale / budget / contact steps.
   ========================================================================== */

(() => {
  'use strict';

  const mount = document.getElementById('bwApp');
  if (!mount) return;

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const esc = (str) =>
    String(str == null ? '' : str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[c]));

  const STORAGE_KEY = 'wirralai_bw_progress_v1';
  const API_BASE = (window.wirralAI && window.wirralAI.apiBase) || '';

  /* ------------------------------------------------------------- icons */

  const ICONS = {
    website: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
    app: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/></svg>',
    seo: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="10" cy="10" r="6"/><path d="M20 20l-5.5-5.5"/></svg>',
    ai: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"/><circle cx="12" cy="12" r="3"/></svg>',
    consultancy: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 21h8M12 17v4M4 4h16v10H4z"/><path d="M9 9l2 2 4-4"/></svg>',
    training: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12.5V17c0 1.5 3 3 6 3s6-1.5 6-3v-4.5"/></svg>',
    check: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>',
  };

  const SERVICES = [
    { key: 'website', label: 'Website', desc: 'A new site, redesign or online shop.', icon: ICONS.website },
    { key: 'app', label: 'Mobile App', desc: 'An iOS or Android app for your business.', icon: ICONS.app },
    { key: 'seo', label: 'SEO', desc: 'Get found and rank for what matters.', icon: ICONS.seo },
    { key: 'ai', label: 'Artificial Intelligence', desc: 'Chatbots, call agents, automation.', icon: ICONS.ai },
    { key: 'consultancy', label: 'Consultancy', desc: 'Advice on a specific challenge.', icon: ICONS.consultancy },
    { key: 'training', label: 'Training', desc: 'Upskill your team or organisation.', icon: ICONS.training },
  ];

  const YESNO = ['Yes', 'No'];
  const YESNO_UNSURE = ['Yes', 'No', 'Not sure'];

  /* ------------------------------------------------------------- flows */

  const FLOWS = {
    /* ==================================================== 1. WEBSITE === */
    website: [
      {
        key: 'siteFields1', type: 'fields', section: 'About the business',
        q: 'Tell us about the business', help: 'A couple of lines is plenty.',
        fields: [
          { id: 'siteBizName', label: 'Company / business name', type: 'text', placeholder: 'Doyle & Co' },
          { id: 'siteBizAbout', label: 'What does the business do?', type: 'textarea', placeholder: 'e.g. independent dental practice in Birkenhead' },
        ],
      },
      {
        key: 'hasWebsite', type: 'cards', section: 'About the business',
        q: 'Do you currently have a website?', options: YESNO.map((l) => ({ label: l })),
      },
      {
        key: 'currentUrl', type: 'text', section: 'About the business',
        q: "What's the current website address?", placeholder: 'https://example.com',
        condition: (a) => a.hasWebsite === 'Yes',
      },
      {
        key: 'websiteType', type: 'cards', section: 'Type of website',
        q: 'What do you need?',
        options: [
          { label: 'Business / Portfolio Website' }, { label: 'E-commerce Website' },
          { label: 'Landing Page' }, { label: 'Website Redesign' }, { label: 'Other', other: true },
        ],
      },
      {
        key: 'domainHosting', type: 'groups', section: 'Domain & hosting',
        q: 'Do you already have these?',
        groups: [
          { key: 'domainStatus', label: 'Domain', options: YESNO_UNSURE },
          { key: 'hostingStatus', label: 'Hosting', options: YESNO_UNSURE },
        ],
      },
      {
        key: 'arrangeDomainHosting', type: 'cards', section: 'Domain & hosting',
        q: 'Would you like us to arrange this for you?', options: YESNO.map((l) => ({ label: l })),
        condition: (a) => a.domainStatus === 'No' || a.hostingStatus === 'No' || a.domainStatus === 'Not sure' || a.hostingStatus === 'Not sure',
      },
      /* ---- e-commerce branch ---- */
      {
        key: 'ecomProductCount', type: 'cards', section: 'Your online shop',
        q: 'Approximately how many products?',
        options: ['1–50', '50–99', '100–249', '250–499', '500+'].map((l) => ({ label: l })),
        condition: (a) => a.websiteType === 'E-commerce Website',
      },
      {
        key: 'ecomVariations', type: 'cards', section: 'Your online shop',
        q: 'Do products have variations, such as sizes or colours?', options: YESNO.map((l) => ({ label: l })),
        condition: (a) => a.websiteType === 'E-commerce Website',
      },
      {
        key: 'ecomPayments', type: 'cards', section: 'Your online shop',
        q: 'Do you need online payments?', options: YESNO.map((l) => ({ label: l })),
        condition: (a) => a.websiteType === 'E-commerce Website',
      },
      {
        key: 'ecomShipping', type: 'cards', section: 'Your online shop',
        q: 'Do you need delivery / shipping functionality?', options: YESNO.map((l) => ({ label: l })),
        condition: (a) => a.websiteType === 'E-commerce Website',
      },
      {
        key: 'ecomInventory', type: 'cards', section: 'Your online shop',
        q: 'Do you need stock / inventory management?', options: YESNO.map((l) => ({ label: l })),
        condition: (a) => a.websiteType === 'E-commerce Website',
      },
      {
        key: 'ecomAssets', type: 'cards', section: 'Your online shop',
        q: 'Do you already have product images and descriptions?', options: YESNO_UNSURE.map((l) => ({ label: l })),
        condition: (a) => a.websiteType === 'E-commerce Website',
      },
      {
        key: 'ecomOther', type: 'textarea', section: 'Your online shop', optional: true,
        q: 'Any other functionality required?', placeholder: 'Optional — anything else the shop needs to do',
        condition: (a) => a.websiteType === 'E-commerce Website',
      },
      /* ---- business / portfolio branch ---- */
      {
        key: 'sitePurpose', type: 'multi', section: 'Purpose of the website',
        q: 'What is the main purpose of the website?',
        options: [
          { label: 'Generate enquiries' }, { label: 'Generate phone calls' }, { label: 'Book appointments' },
          { label: 'Showcase our work' }, { label: 'Explain our services' }, { label: 'Build credibility' },
          { label: 'Other', other: true },
        ],
        condition: (a) => a.websiteType && a.websiteType !== 'E-commerce Website',
      },
      {
        key: 'siteCTA', type: 'cards', section: 'Purpose of the website',
        q: 'What should the main call to action be?',
        options: [
          { label: 'Call us' }, { label: 'Get a quote' }, { label: 'Book now' },
          { label: 'Contact us' }, { label: 'Request consultation' }, { label: 'Other', other: true },
        ],
        condition: (a) => a.websiteType && a.websiteType !== 'E-commerce Website',
      },
      /* ---- design (always) ---- */
      {
        key: 'hasBranding', type: 'cards', section: 'Design',
        q: 'Do you already have branding / a logo?', options: YESNO_UNSURE.map((l) => ({ label: l })),
      },
      {
        key: 'stylePref', type: 'cards', section: 'Design',
        q: 'Style preference?',
        options: ['Modern', 'Minimal', 'Corporate', 'Luxury', 'Bold', 'Creative', 'Not sure — advise me'].map((l) => ({ label: l })),
      },
      {
        key: 'colourScheme', type: 'text', section: 'Design', optional: true,
        q: 'Preferred colour scheme?', placeholder: 'Optional — e.g. navy and gold',
      },
      {
        key: 'likedSites', type: 'textarea', section: 'Design', optional: true,
        q: 'Are there any websites you like?', placeholder: 'Optional — one URL per line',
      },
      /* ---- SEO ---- */
      {
        key: 'needSEO', type: 'cards', section: 'SEO',
        q: 'Will you require SEO?',
        options: ['Yes, immediately', 'Yes, in the near future', "Possibly — I'd like advice", 'No'].map((l) => ({ label: l })),
      },
      {
        key: 'seoFields', type: 'fields', section: 'SEO', optional: true,
        q: 'A little more on that',
        condition: (a) => a.needSEO === 'Yes, immediately',
        fields: [
          { id: 'siteSeoImportant', label: 'Which services / products are most important?', type: 'text' },
          { id: 'siteSeoLocations', label: 'Which locations do you want to target?', type: 'text' },
          { id: 'siteSeoDoingNow', label: 'Are you currently doing any SEO?', type: 'text' },
        ],
      },
      /* ---- AI ---- */
      {
        key: 'wantAI', type: 'cards', section: 'AI functionality',
        q: 'Would you be interested in adding AI functionality?',
        options: ['Yes', "Maybe — show me what's possible", 'Not right now'].map((l) => ({ label: l })),
      },
      {
        key: 'aiFeatures', type: 'multi', section: 'AI functionality',
        q: "What sort of thing?", help: "We'll keep this in plain terms.",
        options: [
          { label: 'AI website chatbot' }, { label: 'AI telephone / call agent' }, { label: 'AI lead qualification' },
          { label: 'AI booking assistant' }, { label: 'AI customer support' }, { label: 'AI recommendations' },
          { label: 'Other / not sure', other: true },
        ],
        condition: (a) => a.wantAI === 'Yes' || a.wantAI === "Maybe — show me what's possible",
      },
    ],

    /* ==================================================== 2. MOBILE APP === */
    app: [
      {
        key: 'appFields1', type: 'fields', section: 'Project',
        q: 'Tell us about the project',
        fields: [
          { id: 'appBizName', label: 'Business / company name', type: 'text' },
          { id: 'appIdea', label: 'Briefly describe the app idea', type: 'textarea' },
        ],
      },
      {
        key: 'appType', type: 'cards', section: 'Project',
        q: 'Is this…',
        options: ['A brand-new app', 'Replacing an existing app', 'Adding to an existing product'].map((l) => ({ label: l })),
      },
      {
        key: 'appPlatform', type: 'cards', section: 'Platform',
        q: 'Where should it work?',
        options: ['iPhone / iOS', 'Android', 'Both', 'Not sure'].map((l) => ({ label: l })),
      },
      {
        key: 'appUsers', type: 'multi', section: 'Users',
        q: 'Who will use the app?',
        options: [
          { label: 'Customers' }, { label: 'Employees' }, { label: 'Businesses' },
          { label: 'Members' }, { label: 'General public' }, { label: 'Other', other: true },
        ],
      },
      {
        key: 'appFeatures', type: 'multi', section: 'Features',
        q: 'Which features do you need?', help: 'Select as many as apply.',
        options: [
          { label: 'User accounts / login' }, { label: 'Payments' }, { label: 'Subscriptions' },
          { label: 'Booking' }, { label: 'Messaging / chat' }, { label: 'Push notifications' },
          { label: 'Maps / location' }, { label: 'Camera / uploads' }, { label: 'E-commerce' },
          { label: 'Loyalty / rewards' }, { label: 'Dashboard' }, { label: 'AI functionality' },
          { label: 'Other', other: true },
        ],
      },
      {
        key: 'appAIDetail', type: 'textarea', section: 'Features',
        q: 'What would you like AI to do within the app?',
        condition: (a) => Array.isArray(a.appFeatures) && a.appFeatures.includes('AI functionality'),
      },
      {
        key: 'appIntegrations', type: 'multi', section: 'Existing systems',
        q: 'Does the app need to connect to any existing systems?',
        options: [
          { label: 'Existing website' }, { label: 'CRM' }, { label: 'Booking system' },
          { label: 'Payment system' }, { label: 'API' }, { label: 'Other software', other: true },
          { label: 'None of these' },
        ],
      },
      {
        key: 'appBranding', type: 'cards', section: 'Design',
        q: 'Do you already have branding?', options: YESNO_UNSURE.map((l) => ({ label: l })),
      },
      {
        key: 'appDesigns', type: 'cards', section: 'Design',
        q: 'Do you already have app designs or wireframes?', options: YESNO.map((l) => ({ label: l })),
      },
      {
        key: 'appLikeExamples', type: 'textarea', section: 'Design', optional: true,
        q: 'Are there any apps you would like yours to look or behave like?', placeholder: 'Optional — app names and/or URLs',
      },
    ],

    /* ==================================================== 3. SEO === */
    seo: [
      {
        key: 'seoFields1', type: 'fields', section: 'About the business',
        q: 'Tell us about the business',
        fields: [
          { id: 'seoBizName', label: 'Company / business name', type: 'text' },
          { id: 'seoUrl', label: 'Website URL', type: 'text' },
          { id: 'seoAbout', label: 'What does the business do?', type: 'textarea' },
        ],
      },
      {
        key: 'seoFields2', type: 'fields', section: 'Targeting',
        q: 'What are you targeting?',
        fields: [
          { id: 'seoImportant', label: 'Which products / services matter most?', type: 'text' },
          { id: 'seoTargetLocations', label: 'Which locations do you want to target?', type: 'text' },
        ],
      },
      {
        key: 'seoDoingNow', type: 'cards', section: 'Current SEO',
        q: 'Are you currently doing any SEO?', options: YESNO_UNSURE.map((l) => ({ label: l })),
      },
      {
        key: 'seoPrevAgency', type: 'cards', section: 'Current SEO',
        q: 'Have you worked with an SEO agency previously?', options: YESNO.map((l) => ({ label: l })),
      },
      {
        key: 'seoFields3', type: 'fields', section: 'Current SEO', optional: true,
        q: 'Anything specific in mind?',
        fields: [
          { id: 'seoKeywords', label: 'Keywords you want to rank for', type: 'text', placeholder: "Optional — or leave blank and we'll advise" },
          { id: 'seoCompetitors', label: 'Your main competitors', type: 'text', placeholder: 'Optional' },
        ],
      },
      {
        key: 'seoGoals', type: 'multi', section: 'Goals',
        q: 'What do you want to achieve?',
        options: [
          { label: 'More website traffic' }, { label: 'More enquiries / leads' }, { label: 'More phone calls' },
          { label: 'More online sales' }, { label: 'Better local Google visibility' }, { label: 'Improve existing rankings' },
          { label: 'Recover lost rankings' }, { label: 'Not sure — advise me' },
        ],
      },
      {
        key: 'seoNeeds', type: 'multi', section: 'Goals',
        q: 'Do you know which of these you need?',
        options: [
          { label: 'Local SEO' }, { label: 'National SEO' }, { label: 'E-commerce SEO' }, { label: 'Technical SEO' },
          { label: 'Content strategy' }, { label: 'Link building' }, { label: 'Google Business Profile optimisation' },
          { label: 'Full SEO management' }, { label: 'Not sure' },
        ],
      },
    ],

    /* ==================================================== 4. AI === */
    ai: [
      {
        key: 'aiGoal', type: 'cards', section: 'What would you like AI to help with?',
        q: 'What would you like AI to help with?',
        options: [
          { label: 'Answering phone calls' }, { label: 'Customer support' }, { label: 'Website enquiries' },
          { label: 'Generating leads' }, { label: 'Qualifying leads' }, { label: 'Booking appointments' },
          { label: 'Automating repetitive admin' }, { label: 'Processing documents / data' },
          { label: 'Internal knowledge / search' }, { label: 'Content generation' },
          { label: 'Improving an existing AI system' }, { label: 'Reducing AI / API / token costs' },
          { label: "I'm not sure — show me what's possible" }, { label: 'Something else', other: true },
        ],
      },
      /* ---- call agent ---- */
      {
        key: 'callFields', type: 'fields', section: 'AI call agent',
        q: 'A little about your calls',
        condition: (a) => a.aiGoal === 'Answering phone calls',
        fields: [
          { id: 'callVolume', label: 'Approximately how many calls do you receive?', type: 'text' },
          { id: 'callHandle', label: 'What should the AI handle?', type: 'textarea' },
        ],
      },
      {
        key: 'callDirection', type: 'cards', section: 'AI call agent',
        q: 'Inbound, outbound, or both?', options: ['Inbound', 'Outbound', 'Both'].map((l) => ({ label: l })),
        condition: (a) => a.aiGoal === 'Answering phone calls',
      },
      {
        key: 'callCurrent', type: 'textarea', section: 'AI call agent',
        q: 'What happens to these calls currently?',
        condition: (a) => a.aiGoal === 'Answering phone calls',
      },
      {
        key: 'callNeeds', type: 'multi', section: 'AI call agent',
        q: 'Do you need any of the following?',
        options: [
          { label: 'Appointment booking' }, { label: 'Call transfers' }, { label: 'Lead qualification' },
          { label: 'CRM integration' }, { label: 'Out-of-hours handling' }, { label: 'Multiple languages' },
        ],
        condition: (a) => a.aiGoal === 'Answering phone calls',
      },
      /* ---- chatbot ---- */
      {
        key: 'chatWhere', type: 'cards', section: 'AI chatbot',
        q: 'Where should it operate?',
        options: ['Website', 'Internal system', 'WhatsApp', 'Other'].map((l) => ({ label: l })),
        condition: (a) => ['Customer support', 'Website enquiries', 'Generating leads', 'Qualifying leads', 'Booking appointments'].includes(a.aiGoal),
      },
      {
        key: 'chatQuestions', type: 'textarea', section: 'AI chatbot',
        q: 'What questions should it be able to answer?',
        condition: (a) => ['Customer support', 'Website enquiries', 'Generating leads', 'Qualifying leads', 'Booking appointments'].includes(a.aiGoal),
      },
      {
        key: 'chatNeeds', type: 'multi', section: 'AI chatbot',
        q: 'Should it also be able to…',
        options: [
          { label: 'Generate leads' }, { label: 'Book appointments' }, { label: 'Access company documents / knowledge' },
          { label: 'Escalate conversations to a human' }, { label: 'Connect to a CRM or other systems' },
        ],
        condition: (a) => ['Customer support', 'Website enquiries', 'Generating leads', 'Qualifying leads', 'Booking appointments'].includes(a.aiGoal),
      },
      /* ---- automation ---- */
      {
        key: 'autoProcesses', type: 'textarea', section: 'AI automation', large: true,
        q: 'Which processes take up the most time in your business?',
        condition: (a) => ['Automating repetitive admin', 'Processing documents / data'].includes(a.aiGoal),
      },
      {
        key: 'autoFields', type: 'fields', section: 'AI automation',
        q: 'A little more detail',
        condition: (a) => ['Automating repetitive admin', 'Processing documents / data'].includes(a.aiGoal),
        fields: [
          { id: 'autoCurrent', label: 'How is this handled currently?', type: 'textarea' },
          { id: 'autoHours', label: 'Roughly how many hours a week does it take?', type: 'text' },
          { id: 'autoEmployees', label: 'How many employees are involved?', type: 'text' },
        ],
      },
      {
        key: 'autoFields2', type: 'fields', section: 'AI automation',
        q: 'Systems and outcome',
        condition: (a) => ['Automating repetitive admin', 'Processing documents / data'].includes(a.aiGoal),
        fields: [
          { id: 'autoSystems', label: 'Which software / systems are currently used?', type: 'text' },
          { id: 'autoOutcome', label: 'What would the ideal outcome be?', type: 'textarea' },
        ],
      },
      /* ---- existing AI optimisation ---- */
      {
        key: 'existingSystem', type: 'text', section: 'Improving an existing AI system',
        q: 'What AI system are you currently using?',
        condition: (a) => a.aiGoal === 'Improving an existing AI system' || a.aiGoal === 'Reducing AI / API / token costs',
      },
      {
        key: 'existingProblem', type: 'textarea', section: 'Improving an existing AI system',
        q: 'What problem are you experiencing?',
        condition: (a) => a.aiGoal === 'Improving an existing AI system' || a.aiGoal === 'Reducing AI / API / token costs',
      },
      {
        key: 'existingIssues', type: 'multi', section: 'Improving an existing AI system',
        q: 'Which of these apply?',
        options: [
          { label: 'High costs' }, { label: 'Too many tokens / API calls' }, { label: 'Poor responses' },
          { label: 'Slow performance' }, { label: 'Reliability' }, { label: 'Integration problems' }, { label: 'Other', other: true },
        ],
        condition: (a) => a.aiGoal === 'Improving an existing AI system' || a.aiGoal === 'Reducing AI / API / token costs',
      },
      /* ---- catch-all ---- */
      {
        key: 'aiOther', type: 'textarea', section: 'Tell us more', large: true,
        q: 'Tell us a bit more about what you need',
        condition: (a) => ['Internal knowledge / search', 'Content generation', "I'm not sure — show me what's possible", 'Something else'].includes(a.aiGoal),
      },
    ],

    /* ==================================================== 5. CONSULTANCY === */
    consultancy: [
      {
        key: 'consHelp', type: 'cards', section: 'What do you need help with?',
        q: 'What do you need help with?',
        options: [
          { label: 'Digital transformation' }, { label: 'AI strategy' }, { label: 'Business process improvement' },
          { label: 'Technology selection' }, { label: 'Automation' }, { label: 'Data / analytics' },
          { label: 'Existing project review' }, { label: 'Cost optimisation' }, { label: 'Technical / business analysis' },
          { label: 'Not sure — I need advice' },
        ],
      },
      {
        key: 'consFields1', type: 'fields', section: 'About the organisation',
        q: 'A little about the organisation',
        fields: [
          { id: 'consBizName', label: 'Company / business name', type: 'text' },
          { id: 'consSize', label: 'Company size', type: 'text', placeholder: 'e.g. 25 staff' },
          { id: 'consIndustry', label: 'Industry', type: 'text' },
        ],
      },
      {
        key: 'consChallenge', type: 'textarea', section: 'The challenge', large: true,
        q: 'Describe the current challenge',
      },
      {
        key: 'consGoal', type: 'textarea', section: 'The challenge',
        q: 'What are you trying to achieve?',
      },
      {
        key: 'consTried', type: 'textarea', section: 'The challenge', optional: true,
        q: 'What have you already tried?', placeholder: 'Optional',
      },
      {
        key: 'consFields2', type: 'fields', section: 'Scope',
        q: 'Scope',
        fields: [
          { id: 'consSystems', label: 'Which systems / tools are involved?', type: 'text' },
          { id: 'consAffected', label: 'Who is affected by the problem?', type: 'text' },
        ],
      },
      {
        key: 'consCost', type: 'text', section: 'Scope', optional: true,
        q: 'Roughly how much time or money is this costing?', placeholder: 'Optional',
      },
      {
        key: 'consTechTeam', type: 'cards', section: 'Scope',
        q: 'Do you already have an internal technical team?', options: YESNO.map((l) => ({ label: l })),
      },
      {
        key: 'consSuccess', type: 'textarea', section: 'Outcome',
        q: 'What would a successful outcome look like?',
      },
    ],

    /* ==================================================== 6. TRAINING === */
    training: [
      {
        key: 'trainTopic', type: 'cards', section: 'What would you like training on?',
        q: 'What would you like training on?',
        options: [
          { label: 'AI fundamentals' }, { label: 'Using ChatGPT / LLMs effectively' }, { label: 'AI for business' },
          { label: 'AI automation' }, { label: 'AI for specific departments' }, { label: 'SEO' },
          { label: 'Digital skills' }, { label: 'Data / analytics' }, { label: 'Bespoke training' }, { label: 'Not sure' },
        ],
      },
      {
        key: 'trainFields1', type: 'fields', section: 'About the training',
        q: 'A little about the group',
        fields: [
          { id: 'trainOrg', label: 'Company / organisation name', type: 'text' },
          { id: 'trainAttendees', label: 'Number of attendees', type: 'text' },
        ],
      },
      {
        key: 'trainAudience', type: 'multi', section: 'About the training',
        q: 'Who is the training for?',
        options: [
          { label: 'Leadership' }, { label: 'Managers' }, { label: 'Technical teams' }, { label: 'Sales' },
          { label: 'Marketing' }, { label: 'Customer service' }, { label: 'Operations' },
          { label: 'Whole organisation' }, { label: 'Individuals' },
        ],
      },
      {
        key: 'trainLevel', type: 'cards', section: 'About the training',
        q: 'Current skill level?', options: ['Beginner', 'Intermediate', 'Advanced', 'Mixed'].map((l) => ({ label: l })),
      },
      {
        key: 'trainFormat', type: 'cards', section: 'Format',
        q: 'Preferred format?', options: ['In-person', 'Remote', 'Hybrid', 'Not sure'].map((l) => ({ label: l })),
      },
      {
        key: 'trainType', type: 'cards', section: 'Format',
        q: 'One-off workshop, or ongoing training?', options: ['One-off workshop', 'Ongoing training', 'Not sure'].map((l) => ({ label: l })),
      },
      {
        key: 'trainOutcome', type: 'textarea', section: 'Outcome',
        q: 'What would you like attendees to be able to do after the training?',
      },
      {
        key: 'trainExamples', type: 'textarea', section: 'Outcome', optional: true,
        q: 'Are there particular business processes or examples you would like incorporated?', placeholder: 'Optional',
      },
    ],
  };

  /* -------------------------------------------------- shared final steps */

  const BUDGETS = {
    website: ['Under £1,000', '£1,000 – £2,500', '£2,500 – £5,000', '£5,000 – £10,000', '£10,000+'],
    app: ['Under £5,000', '£5,000 – £15,000', '£15,000 – £30,000', '£30,000 – £60,000', '£60,000+'],
    seo: ['Under £300 / month', '£300 – £750 / month', '£750 – £1,500 / month', '£1,500+ / month'],
    ai: ['Under £1,000', '£1,000 – £3,000', '£3,000 – £8,000', '£8,000 – £20,000', '£20,000+'],
    consultancy: ['Under £1,000', '£1,000 – £3,000', '£3,000 – £7,500', '£7,500+'],
    training: ['Under £500', '£500 – £1,500', '£1,500 – £3,500', '£3,500+'],
  };

  function universalSteps(serviceKey) {
    const budgetOptions = (BUDGETS[serviceKey] || BUDGETS.website).map((l) => ({ label: l }));
    budgetOptions.push({ label: "Not sure — I'd like guidance" });
    return [
      {
        key: 'timescale', type: 'cards', section: 'Timescale',
        q: 'When would you like to get started?',
        options: ['ASAP', 'Within 1 month', '1–3 months', '3–6 months', 'Just exploring'].map((l) => ({ label: l })),
      },
      {
        key: 'budget', type: 'cards', section: 'Budget',
        q: 'Do you have a budget in mind?', options: budgetOptions,
      },
      {
        key: 'contactFields', type: 'fields', section: 'Final details',
        q: "Last thing — who are we speaking to?",
        fields: [
          { id: 'contactName', label: 'Name', type: 'text', autocomplete: 'name' },
          { id: 'contactCompany', label: 'Company', type: 'text', autocomplete: 'organization' },
          { id: 'contactEmail', label: 'Email', type: 'text', autocomplete: 'email' },
          { id: 'contactPhone', label: 'Telephone number', type: 'text', autocomplete: 'tel' },
        ],
      },
      {
        key: 'contactMethod', type: 'cards', section: 'Final details',
        q: 'Preferred contact method?', options: ['Email', 'Phone', 'WhatsApp'].map((l) => ({ label: l })),
      },
      {
        key: 'contactNote', type: 'textarea', section: 'Final details', optional: true,
        q: 'Anything else we should know?', placeholder: 'Optional',
      },
    ];
  }

  function buildSteps(serviceKey) {
    return [...(FLOWS[serviceKey] || []), ...universalSteps(serviceKey)];
  }

  /* ------------------------------------------------------------- state */

  const state = {
    phase: 'intro', // intro | flow | review | submitting | done | error
    service: null,
    steps: [],
    cursor: -1,
    answers: {},
  };

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        phase: state.phase === 'flow' ? 'flow' : 'intro',
        service: state.service,
        cursor: state.cursor,
        answers: state.answers,
      }));
    } catch (e) { /* storage unavailable — non-fatal */ }
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const saved = JSON.parse(raw);
      if (!saved || !saved.service || !FLOWS[saved.service]) return false;
      state.service = saved.service;
      state.steps = buildSteps(saved.service);
      state.answers = saved.answers || {};
      state.cursor = typeof saved.cursor === 'number' ? saved.cursor : 0;
      state.phase = 'flow';
      return true;
    } catch (e) {
      return false;
    }
  }

  function clearProgress() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* noop */ }
  }

  function resetAll() {
    clearProgress();
    state.phase = 'intro';
    state.service = null;
    state.steps = [];
    state.cursor = -1;
    state.answers = {};
    render();
  }

  /* ------------------------------------------------------------- nav */

  function isVisible(step, answers) {
    return !step.condition || step.condition(answers);
  }

  function visibleList() {
    return state.steps.filter((s) => isVisible(s, state.answers));
  }

  function currentStep() {
    return state.cursor >= 0 && state.cursor < state.steps.length ? state.steps[state.cursor] : null;
  }

  function goto(dir) {
    let i = state.cursor + dir;
    while (i >= 0 && i < state.steps.length) {
      if (isVisible(state.steps[i], state.answers)) {
        state.cursor = i;
        saveProgress();
        render();
        return;
      }
      i += dir;
    }
    if (dir > 0) {
      state.phase = 'review';
      saveProgress();
      render();
    } else {
      resetAll();
    }
  }

  function selectService(key) {
    state.service = key;
    state.steps = buildSteps(key);
    state.answers = { service: key };
    state.cursor = -1;
    state.phase = 'flow';
    goto(1);
  }

  /* ------------------------------------------------------------- render helpers */

  function progressInfo() {
    const list = visibleList();
    const total = list.length;
    const step = currentStep();
    const pos = step ? list.indexOf(step) + 1 : total;
    return { pos, total };
  }

  function stepLabelFor(service) {
    const s = SERVICES.find((x) => x.key === service);
    return s ? s.label : 'Project';
  }

  /* ------------------------------------------------------------- renderers */

  function render() {
    if (state.phase === 'intro') return renderIntro();
    if (state.phase === 'flow') return renderStep();
    if (state.phase === 'review') return renderReview();
    if (state.phase === 'submitting') return renderSubmitting();
    if (state.phase === 'done') return renderDone();
    if (state.phase === 'error') return renderError();
  }

  function renderIntro() {
    mount.innerHTML = `
      <div class="bw-shell">
        <div class="bw-intro-grid">
          ${SERVICES.map((s) => `
            <button type="button" class="bw-service-card" data-service="${s.key}">
              <span class="bw-service-icon">${s.icon}</span>
              <strong>${esc(s.label)}</strong>
              <span>${esc(s.desc)}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    $$('.bw-service-card', mount).forEach((btn) => {
      btn.addEventListener('click', () => selectService(btn.dataset.service));
    });
  }

  function fieldValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function renderOtherInput(key, currentDetail) {
    return `<div class="field bw-other-field"><label for="${key}_detail">Please specify</label><input id="${key}_detail" value="${esc(currentDetail || '')}" /></div>`;
  }

  function renderStep() {
    const step = currentStep();
    if (!step) return renderReview();
    const { pos, total } = progressInfo();
    const a = state.answers;

    let body = '';

    if (step.type === 'cards') {
      const selected = a[step.key];
      body = `
        <div class="q-options">
          ${step.options.map((opt) => `
            <button type="button" class="q-opt ${selected === opt.label ? 'is-selected' : ''}" data-opt="${esc(opt.label)}" data-other="${opt.other ? '1' : ''}">
              <span>${esc(opt.label)}${opt.sub ? `<small>${esc(opt.sub)}</small>` : ''}</span>
            </button>
          `).join('')}
        </div>
        ${selected && selected.startsWith('Other') ? renderOtherInput(step.key, a[step.key + '_detail']) : ''}
        <div class="q-nav">
          ${selected ? '<button type="button" class="btn btn--primary btn--sm" id="bwContinue">Continue</button>' : ''}
        </div>
      `;
    } else if (step.type === 'multi') {
      const selArr = Array.isArray(a[step.key]) ? a[step.key] : [];
      body = `
        <div class="q-options bw-multi">
          ${step.options.map((opt) => `
            <button type="button" class="q-opt ${selArr.includes(opt.label) ? 'is-selected' : ''}" data-opt="${esc(opt.label)}" data-other="${opt.other ? '1' : ''}">
              <span>${esc(opt.label)}</span>
            </button>
          `).join('')}
        </div>
        ${selArr.some((l) => l.startsWith('Other')) ? renderOtherInput(step.key, a[step.key + '_detail']) : ''}
        <div class="q-nav"><button type="button" class="btn btn--primary btn--sm" id="bwContinue">Continue</button></div>
      `;
    } else if (step.type === 'groups') {
      body = `
        <div class="bw-groups">
          ${step.groups.map((g) => `
            <div>
              <span class="bw-group-label">${esc(g.label)}</span>
              <div class="bw-group-opts" data-gkey="${g.key}">
                ${g.options.map((o) => `<button type="button" class="bw-chip ${a[g.key] === o ? 'is-selected' : ''}" data-gopt="${esc(o)}">${esc(o)}</button>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        <div class="q-nav"><button type="button" class="btn btn--primary btn--sm" id="bwContinue">Continue</button></div>
      `;
    } else if (step.type === 'text') {
      body = `
        <div class="field"><input id="bwInput" value="${esc(a[step.key] || '')}" placeholder="${esc(step.placeholder || '')}" /></div>
        <div class="q-nav"><button type="button" class="btn btn--primary btn--sm" id="bwContinue">Continue</button></div>
      `;
    } else if (step.type === 'textarea') {
      body = `
        <div class="field ${step.large ? 'bw-textarea-lg' : ''}"><textarea id="bwInput" placeholder="${esc(step.placeholder || '')}">${esc(a[step.key] || '')}</textarea></div>
        <div class="q-nav"><button type="button" class="btn btn--primary btn--sm" id="bwContinue">Continue</button></div>
      `;
    } else if (step.type === 'fields') {
      body = `
        <div class="field-row">
          ${step.fields.map((f) => `
            <div class="field${f.type === 'textarea' ? ' bw-full' : ''}" style="${f.type === 'textarea' ? 'grid-column:1/-1' : ''}">
              <label for="${f.id}">${esc(f.label)}</label>
              ${f.type === 'textarea'
                ? `<textarea id="${f.id}" placeholder="${esc(f.placeholder || '')}">${esc(a[f.id] || '')}</textarea>`
                : `<input id="${f.id}" autocomplete="${f.autocomplete || 'off'}" value="${esc(a[f.id] || '')}" placeholder="${esc(f.placeholder || '')}" />`}
            </div>
          `).join('')}
        </div>
        <div class="q-nav"><button type="button" class="btn btn--primary btn--sm" id="bwContinue">Continue</button></div>
      `;
    }

    mount.innerHTML = `
      <div class="bw-shell">
        <div class="bw-topline">
          <span class="bw-step-label">${esc(stepLabelFor(state.service))} · Step ${pos} of ${total}</span>
          <a href="#" class="bw-restart" id="bwRestart">Start over</a>
        </div>
        <div class="q-progress">${Array.from({ length: total }).map((_, i) => `<i class="${i < pos ? 'done' : ''}"></i>`).join('')}</div>
        <div class="q-step is-active">
          <p class="q-q">${esc(step.q)}</p>
          ${step.help ? `<p class="q-help">${esc(step.help)}</p>` : ''}
          ${body}
          <div class="q-nav"><button type="button" class="q-back" id="bwBack">Back</button></div>
        </div>
      </div>
    `;

    $('#bwBack', mount).addEventListener('click', () => goto(-1));
    $('#bwRestart', mount).addEventListener('click', (e) => { e.preventDefault(); resetAll(); });

    const continueBtn = $('#bwContinue', mount);

    if (step.type === 'cards') {
      $$('.q-opt', mount).forEach((btn) => {
        btn.addEventListener('click', () => {
          a[step.key] = btn.dataset.opt;
          render();
        });
      });
      if (continueBtn) continueBtn.addEventListener('click', () => {
        if (a[step.key] && a[step.key].startsWith('Other')) a[step.key + '_detail'] = fieldValue(step.key + '_detail');
        goto(1);
      });
    } else if (step.type === 'multi') {
      $$('.q-opt', mount).forEach((btn) => {
        btn.addEventListener('click', () => {
          const arr = Array.isArray(a[step.key]) ? a[step.key].slice() : [];
          const label = btn.dataset.opt;
          const idx = arr.indexOf(label);
          if (idx >= 0) arr.splice(idx, 1); else arr.push(label);
          a[step.key] = arr;
          render();
        });
      });
      continueBtn.addEventListener('click', () => {
        const arr = a[step.key] || [];
        if (arr.some((l) => l.startsWith('Other'))) a[step.key + '_detail'] = fieldValue(step.key + '_detail');
        goto(1);
      });
    } else if (step.type === 'groups') {
      $$('.bw-group-opts', mount).forEach((grp) => {
        const gkey = grp.dataset.gkey;
        $$('.bw-chip', grp).forEach((chip) => {
          chip.addEventListener('click', () => {
            a[gkey] = chip.dataset.gopt;
            render();
          });
        });
      });
      continueBtn.addEventListener('click', () => goto(1));
    } else if (step.type === 'text' || step.type === 'textarea') {
      continueBtn.addEventListener('click', () => {
        a[step.key] = fieldValue('bwInput');
        goto(1);
      });
    } else if (step.type === 'fields') {
      continueBtn.addEventListener('click', () => {
        step.fields.forEach((f) => { a[f.id] = fieldValue(f.id); });
        goto(1);
      });
    }
  }

  /* ------------------------------------------------------------- review */

  function summaryRows() {
    const list = visibleList();
    const bySection = [];
    const seen = new Set();
    list.forEach((step) => {
      const section = step.section || 'Project';
      let bucket = bySection.find((b) => b.section === section);
      if (!bucket) { bucket = { section, rows: [] }; bySection.push(bucket); }
      if (step.type === 'fields') {
        step.fields.forEach((f) => {
          const v = state.answers[f.id];
          if (v) bucket.rows.push({ q: f.label, a: v, editKey: step.key });
        });
      } else if (step.type === 'groups') {
        step.groups.forEach((g) => {
          const v = state.answers[g.key];
          if (v) bucket.rows.push({ q: g.label, a: v, editKey: step.key });
        });
      } else {
        let v = state.answers[step.key];
        if (Array.isArray(v)) v = v.join(', ');
        if (v && state.answers[step.key + '_detail']) v += ` (${state.answers[step.key + '_detail']})`;
        if (v) bucket.rows.push({ q: step.q, a: v, editKey: step.key });
      }
    });
    return bySection.filter((b) => b.rows.length);
  }

  function renderReview() {
    const sections = summaryRows();
    mount.innerHTML = `
      <div class="bw-shell">
        <div class="bw-topline">
          <span class="bw-step-label">${esc(stepLabelFor(state.service))} · Review</span>
          <a href="#" class="bw-restart" id="bwRestart">Start over</a>
        </div>
        <p class="q-q">Here's what you've told us</p>
        <p class="q-help">Check it over — you can jump back and change anything before sending.</p>
        ${sections.map((s) => `
          <div class="bw-review-section">
            <p class="bw-review-heading">${esc(s.section)}</p>
            <dl>
              ${s.rows.map((r) => `<div class="bw-review-row"><dt>${esc(r.q)}</dt><dd>${esc(r.a)}</dd></div>`).join('')}
            </dl>
          </div>
        `).join('')}
        <div class="q-nav" style="margin-top: var(--space-6)">
          <button type="button" class="q-back" id="bwEditBack">Back to edit</button>
          <button type="button" class="btn btn--primary" id="bwSend">Send My Project</button>
        </div>
        <div id="bwErrorSlot"></div>
      </div>
    `;
    $('#bwRestart', mount).addEventListener('click', (e) => { e.preventDefault(); resetAll(); });
    $('#bwEditBack', mount).addEventListener('click', () => {
      state.phase = 'flow';
      render();
    });
    $('#bwSend', mount).addEventListener('click', submit);
  }

  function renderSubmitting() {
    mount.innerHTML = `<div class="bw-shell"><p class="q-q">Sending…</p><p class="q-help">Just a moment.</p></div>`;
  }

  function renderDone() {
    clearProgress();
    mount.innerHTML = `
      <div class="bw-shell bw-done">
        <div class="bw-done-icon">${ICONS.check}</div>
        <h2>We've got it.</h2>
        <p>We'll review what you need and get back to you with the best way forward.</p>
        <a class="btn btn--primary" href="/">Back to homepage</a>
      </div>
    `;
  }

  function renderError() {
    mount.innerHTML = `
      <div class="bw-shell">
        <p class="q-q">Something went wrong sending that.</p>
        <p class="q-help">Your answers are still saved — please try again, or message us on WhatsApp instead.</p>
        <div class="q-nav">
          <button type="button" class="btn btn--primary btn--sm" id="bwRetry">Try again</button>
          <a class="btn btn--wa btn--sm" href="https://wa.me/447368349702" target="_blank" rel="noopener noreferrer">Message on WhatsApp</a>
        </div>
      </div>
    `;
    $('#bwRetry', mount).addEventListener('click', submit);
  }

  /* ------------------------------------------------------------- submit */

  async function submit() {
    state.phase = 'submitting';
    render();
    try {
      const res = await fetch(`${API_BASE}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: state.service,
          serviceLabel: stepLabelFor(state.service),
          answers: state.answers,
          summary: summaryRows(),
          submittedAt: new Date().toISOString(),
          page: window.location.href,
        }),
      });
      if (!res.ok) throw new Error('bad_status');
      state.phase = 'done';
      render();
    } catch (e) {
      state.phase = 'error';
      render();
    }
  }

  /* ------------------------------------------------------------- boot */

  if (!loadProgress()) {
    state.phase = 'intro';
  }
  mount.removeAttribute('data-loading');
  render();
})();
