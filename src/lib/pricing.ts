// The prices this site shows, as botpro's price book gives them (src/lib/pricing/plans.ts, US dollars). The web
// app stages carry the names botpro's catalog and menus use (src/lib/catalog.ts): the price book calls the
// second and third "Prototype" and "Full build".

export interface Plan {
  id: string;
  name: string;
  href: string;
  /** The amount in US dollars. */
  amount: number;
  /** "From" in front of the amount. */
  from?: boolean;
  per: 'one-time' | 'month' | 'hour';
  bestFor: string;
  specs?: [string, string][];
  includes?: string[];
  terms?: string;
  /** Whether the Founding Ten discount applies. */
  founding?: boolean;
  /** botpro's "spotlight" finish: the plan drawn with more weight. */
  spotlight?: boolean;
}

export const WEBSITES: Plan[] = [
  {
    id: 'website-core', name: 'Core', href: '/websites/business-sites', amount: 2500, per: 'one-time', founding: true,
    bestFor: 'A new business, a consultant or a single product getting online properly.',
    specs: [['Pages', 'Up to 5'], ['Design', 'Custom, no templates'], ['Editing', 'Text changes made by us'], ['Timeline', '2–3 weeks'], ['Revisions', '2 rounds']],
    includes: ['Custom design, no templates', 'Mobile-ready and fast-loading', 'Basic SEO', 'Contact form', 'Analytics'],
  },
  {
    id: 'website-ascend', name: 'Ascend', href: '/websites/company-sites', amount: 4900, per: 'one-time', founding: true, spotlight: true,
    bestFor: 'An established business that needs a full company site it can update itself.',
    specs: [['Pages', 'Up to 12'], ['Design', 'Custom design system across every page'], ['Editing', 'Content editor for pages and blog'], ['Timeline', '3–5 weeks'], ['Revisions', '3 rounds']],
    includes: ['Everything in Core', 'A design system across every page', 'Content editor for pages and blog', 'Integrations: booking, CRM, newsletter'],
  },
  {
    id: 'website-apex', name: 'Apex', href: '/websites/brand-sites', amount: 7900, per: 'one-time', founding: true,
    bestFor: 'A brand where the website is part of the product experience.',
    specs: [['Pages', 'Scoped to your needs'], ['Design', 'Custom, with signature motion and interactions'], ['Editing', 'Content editor with structured content'], ['Timeline', '5–8 weeks'], ['Revisions', '4 rounds']],
    includes: ['Everything in Ascend', 'Signature motion and interactions', 'Structured content: case studies, docs, changelog', 'Advanced SEO', 'Multiple languages if needed', 'A performance budget'],
  },
];

export const APPS: Plan[] = [
  {
    id: 'app-scoping', name: 'Scoping sprint', href: '/web-apps/scoping-sprint', amount: 1500, per: 'one-time', founding: true,
    bestFor: 'Anyone with an app idea who needs a clear plan and a fixed quote.',
    specs: [['Timeline', '1–2 weeks']],
    includes: ['Requirements and user flows', 'Clickable wireframes', 'A technical plan', 'A fixed quote for the build'],
    terms: 'Credited towards your build if you go ahead.',
  },
  {
    id: 'app-prototype', name: 'MVP development', href: '/web-apps/mvp', amount: 9500, per: 'one-time', founding: true, spotlight: true,
    bestFor: 'Testing the idea with real users or investors.',
    specs: [['Timeline', '4–6 weeks']],
    includes: ['The core workflow, working end to end', 'Sign-in and real data', 'Deployed for real users'],
  },
  {
    id: 'app-full', name: 'Full product build', href: '/web-apps/full-product', amount: 18000, from: true, per: 'one-time', founding: true,
    bestFor: 'Launching a production product.',
    specs: [['Timeline', 'Set during scoping']],
    includes: ['A complete, secure app', 'Accounts and roles', 'Payments, if you need them', 'An admin panel', 'Testing and launch support'],
  },
];

export const AFTER: Plan[] = [
  {
    id: 'care', name: 'Care', href: '/care', amount: 99, per: 'month',
    bestFor: 'Keeping a finished site secure, backed up and up to date.',
    includes: ['Hosting, SSL and deployments managed for you', 'Security and dependency updates', 'Uptime monitoring', 'Monthly backups', 'Up to 1 hour of small edits a month', 'Email support, reply within 2 business days'],
  },
  {
    id: 'care-plus', name: 'Care Plus', href: '/care', amount: 199, per: 'month', spotlight: true,
    bestFor: 'A site that keeps changing and needs a team on call.',
    includes: ['Everything in Care', 'Up to 3 hours of edits a month', 'Priority support, reply within 1 business day', 'Monthly performance and SEO report', 'A quarterly design review'],
  },
  {
    id: 'ai-assistant', name: 'AI Assistant', href: '/custom-solutions/ai-assistant', amount: 2500, per: 'one-time',
    bestFor: 'Answering visitors’ questions about your business, day and night.',
    includes: ['An assistant on your website', 'Trained on your website and your business: services, prices, policies, FAQs', 'Hands enquiries to you when a person is needed'],
  },
  {
    id: 'extra-work', name: 'Additional work', href: '/contact', amount: 110, per: 'hour',
    bestFor: 'Changes outside a project’s scope or a Care plan’s monthly hours.',
  },
];

/** The Founding Ten: botpro's offer for its first clients, on website and app builds. */
export const FOUNDING = {discount: 0.2, places: 10, ends: '31 March 2027'};

export const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
export const PER: Record<Plan['per'], string> = {'one-time': 'one-time', month: 'a month', hour: 'an hour'};
