// The contact form's rules, shared by the form and the server action that checks everything again.
// The choices, their lines and every message are botpro's (src/lib/contact.ts, src/components/contact/contact-set.tsx);
// the prices are the ones the Solutions menu shows.

export const NEEDS = [
  {id: 'website', label: 'A website', line: 'Core, Ascend and Apex', price: 'From $2,500'},
  {id: 'web-app', label: 'A web app', line: 'From a scoping sprint to a full build', price: 'Scoping $1,500'},
  {id: 'care', label: 'Care for a site I already have', line: 'Hosting, updates and small edits', price: 'From $99/month'},
  {id: 'assistant', label: 'An AI assistant for my site', line: 'Answers visitors, day and night', price: '$2,500 one-time'},
  {id: 'custom', label: 'A custom AI or automation solution', line: 'Automation and document processing', price: ''},
  {id: 'not-sure', label: 'Not sure yet', line: 'We’ll help you choose', price: ''},
] as const;

export type NeedId = (typeof NEEDS)[number]['id'];
export const isNeed = (v: string): v is NeedId => NEEDS.some((n) => n.id === v);

export type ContactField = 'brief' | 'need' | 'name' | 'email' | 'company';
export type ContactValues = Record<ContactField, string>;
export type FieldErrors = Partial<Record<ContactField, string>>;

/** Bots fill the hidden field, or send faster than anyone can type. Both are dropped without telling them. */
export const HONEYPOT = 'website_url';
export const MIN_FILL_MS = 3000;

/** Every problem with the answers, one message a field. Empty when the brief can be sent. */
export function check(v: ContactValues): FieldErrors {
  const out: FieldErrors = {};
  const brief = v.brief.trim();
  const name = v.name.trim();
  const email = v.email.trim();
  if (brief.length < 20) out.brief = 'A sentence or two, please: what is it, and who is it for?';
  else if (brief.length > 4000) out.brief = 'That’s a lot. Keep it under 4,000 characters; we can go deeper on a call.';
  if (!isNeed(v.need)) out.need = 'Choose the closest one. "Not sure yet" is fine.';
  if (!name) out.name = 'What should we call you?';
  else if (name.length > 80) out.name = 'That name is a little long.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) out.email = 'That email doesn’t look right.';
  if (v.company.trim().length > 120) out.company = 'That name is a little long.';
  return out;
}
