import Link from 'next/link';
import {Button} from '@astryxdesign/core/Button';

import {ArrowDown, ArrowRight, ArrowUpRight} from '@/components/icons';
import {AFTER, APPS, FOUNDING, WEBSITES, money} from '@/lib/pricing';
import {CONTACT_EMAIL} from '@/lib/site';

import {SiteFooter} from './site-footer';
import {SiteHeader} from './site-header';

// The knowledge base: the questions this site already answers, gathered by topic in one place. Each answer is
// taken from the page that owns it (pricing, Web Apps, Care, AI Assistant, slotLane, terms, privacy) or from the
// price book (src/lib/pricing.ts), so the two never disagree. Nothing here is new information.
const [CORE, ASCEND, APEX] = WEBSITES;
const [SPRINT, MVP, FULL] = APPS;
const plan = (id: string) => AFTER.find((p) => p.id === id)!;
const CARE = plan('care');
const PLUS = plan('care-plus');
const AI = plan('ai-assistant');
const RATE = plan('extra-work').amount;
const pct = Math.round(FOUNDING.discount * 100);
const spec = (p: (typeof WEBSITES)[number], key: string) => p.specs?.find(([k]) => k === key)?.[1] ?? '';

type QA = {q: string; a: React.ReactNode};
type Topic = {id: string; title: string; line: string; items: QA[]};

const TOPICS: Topic[] = [
  {
    id: 'start',
    title: 'Starting a project',
    line: 'Briefs, intro calls and choosing a package.',
    items: [
      {q: 'How do I start?', a: <>Send a brief through the <Link href="/contact">contact form</Link>: what you’re building and what you need from us. We read every brief ourselves and reply with honest advice. You can also ask Lane, in the corner of the page, to fill in the brief for you or book a free 20-minute intro call.</>},
      {q: 'You’re new. Why should we trust you with our site?', a: `We are new, and we won’t pretend otherwise. What we can show you is the software we’re building for ourselves, this website, and a fixed scope and price before any work starts. Our first ${FOUNDING.places} clients also get ${pct}% off.`},
      {q: 'Which website package is right for us?', a: <>{CORE.name} is for {lower(CORE.bestFor)} {ASCEND.name} is for {lower(ASCEND.bestFor)} {APEX.name} is for {lower(APEX.bestFor)} <Link href="/websites#compare">Compare them side by side</Link>.</>},
      {q: 'We’re not sure what we need.', a: <>That’s fine. Choose “Not sure yet” on the <Link href="/contact?need=not-sure">contact form</Link> and we’ll help you choose. We’ll say so if we’re not the right fit.</>},
    ],
  },
  {
    id: 'prices',
    title: 'Prices and payment',
    line: 'What’s fixed, what’s one-time, and the Founding Ten.',
    items: [
      {q: 'Are website prices one-time or monthly?', a: 'One-time. You pay once for the build. Care plans are separate and optional.'},
      {q: 'How is a web app priced?', a: `App builds are priced after scoping. A scoping sprint is ${money(SPRINT.amount)} one-time, ${lower(MVP.name)} is ${money(MVP.amount)}, and a ${lower(FULL.name)} starts at ${money(FULL.amount)}.`},
      {q: 'Does the scoping sprint cost extra if we go ahead?', a: `No. The sprint fee of ${money(SPRINT.amount)} is credited towards your build if you go ahead.`},
      {q: 'What is the Founding Ten?', a: `We’re a new company, so our first ${FOUNDING.places} clients get ${pct}% off website and app builds. The offer ends on ${FOUNDING.ends}, or sooner if all ten places are taken.`},
      {q: 'Is anything extra?', a: 'Taxes, and third-party costs you choose, such as domains, paid plugins or stock images, are extra unless your scope says otherwise. Your price is fixed in your written scope before work starts.'},
    ],
  },
  {
    id: 'process',
    title: 'How a project runs',
    line: 'From the first call to launch.',
    items: [
      {q: 'What are the steps?', a: 'Intro call, then a written scope and fixed quote, then design, build and launch. You review the design in rounds, on real content, and we share progress as we build.'},
      {q: 'How long does a website take?', a: `${CORE.name} takes ${spec(CORE, 'Timeline')}, ${ASCEND.name} ${spec(ASCEND, 'Timeline')} and ${APEX.name} ${spec(APEX, 'Timeline')}.`},
      {q: 'How many design revisions do we get?', a: `${spec(CORE, 'Revisions')} with ${CORE.name}, ${spec(ASCEND, 'Revisions')} with ${ASCEND.name} and ${spec(APEX, 'Revisions')} with ${APEX.name}.`},
      {q: 'Who owns the site when it’s done?', a: 'You do. The site is yours after launch, and we hand over everything.'},
    ],
  },
  {
    id: 'after',
    title: 'After launch',
    line: 'Care, Care Plus and changes later on.',
    items: [
      {q: 'What happens after launch?', a: `The site is yours. If you’d like us to look after it, ${CARE.name} covers hosting, updates, monitoring, backups and an hour of small edits a month. ${PLUS.name} adds more hours, faster replies, a monthly report and a quarterly design review.`},
      {q: 'Which Care plan is right for me?', a: `${CARE.name} (${money(CARE.amount)} a month) is for ${lower(CARE.bestFor)} ${PLUS.name} (${money(PLUS.amount)} a month) is for ${lower(PLUS.bestFor)}`},
      {q: 'What if I need more than my monthly hours?', a: `Changes beyond your plan’s hours are billed as additional work, at ${money(RATE)} an hour.`},
      {q: 'Does the Founding Ten discount apply to Care?', a: `No. The Founding Ten is ${pct}% off website and app builds. Care plans are charged at their listed price.`},
    ],
  },
  {
    id: 'assistant',
    title: 'The AI Assistant',
    line: 'An assistant on your website, trained on your business.',
    items: [
      {q: 'What is the AI Assistant trained on?', a: 'Your website and your business: your services, prices, policies and common questions. It answers visitors and hands the conversation to you when a person is needed.'},
      {q: 'Is it a subscription?', a: `No. The ${AI.name} is ${money(AI.amount)}, one-time.`},
      {q: 'Can I try one first?', a: <>Yes. Lane, in the corner of this page, is the assistant on our own site. <Link href={AI.href}>See the {AI.name} page</Link>.</>},
    ],
  },
  {
    id: 'slotlane',
    title: 'slotLane',
    line: 'Our booking and scheduling app.',
    items: [
      {q: 'What is slotLane?', a: <>A booking page on your own domain. Your guests pick a time, and slotLane takes care of the invitation, the calendar and the reminders. <Link href="/products/slotlane">About slotLane</Link>.</>},
      {q: 'What does it cost?', a: 'Try everything free for 30 days, no card needed. Then it’s free for one person, or $10 a month for each person on your team ($8 billed yearly).'},
      {q: 'Where do I learn how to use it?', a: <>The <Link href="/docs">documentation</Link> walks through booking pages, availability, calendars and reminders.</>},
    ],
  },
  {
    id: 'lane',
    title: 'Lane and your information',
    line: 'The guide on this site, and what happens to what you send.',
    items: [
      {q: 'Who is Lane?', a: 'Lane is an AI that answers questions about botLane, by text or by voice. It can be wrong, so treat what it says as a guide, not a promise. Prices, scope and timelines are agreed only in writing.'},
      {q: 'What happens to what I send?', a: <>We use it to reply and to do the work. We don’t sell it, add you to a mailing list or track you. The <Link href="/privacy">privacy policy</Link> lists every company that handles it for us.</>},
      {q: 'How do I have my information deleted?', a: <>Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> from the address you used. We’ll answer within 30 days.</>},
    ],
  },
];

/** The knowledge base: every topic as a jump link, then the questions under each, open one at a time. */
export function HelpPage() {
  const count = TOPICS.reduce((n, t) => n + t.items.length, 0);
  return (
    <div className="apx hub">
      <div className="apx-open">
        <SiteHeader />
        <main className="wrap apx-hero">
          <p className="mono apx-tag fade-up">Resources<span aria-hidden>/</span>Knowledge base<i aria-hidden />{count} answers</p>
          <h1 className="apx-title hub-title">
            <span className="line"><span className="rise" style={{'--i': 0} as React.CSSProperties}>Straight</span></span>
            <span className="line"><span className="rise" style={{'--i': 1} as React.CSSProperties}><em>answers.</em></span></span>
          </h1>
          <nav aria-label="Topics" className="kb-topics fade-up" style={{'--i': 2} as React.CSSProperties}>
            {TOPICS.map((t) => (
              <a key={t.id} href={`#${t.id}`}>
                <b>{t.title}</b>
                <span>{t.line}</span>
                <ArrowDown size={15} />
              </a>
            ))}
          </nav>
        </main>
      </div>

      {TOPICS.map((t) => (
        <section key={t.id} id={t.id} aria-labelledby={`${t.id}-title`} className="wrap kb-topic">
          <header>
            <p className="mono">{t.items.length} questions</p>
            <h2 id={`${t.id}-title`}>{t.title}</h2>
          </header>
          <div className="faq">
            {t.items.map((x) => (
              <details key={x.q}>
                <summary>{x.q}<i aria-hidden /></summary>
                <p>{x.a}</p>
              </details>
            ))}
          </div>
        </section>
      ))}

      <section aria-labelledby="kb-close" className="wrap apx-block">
        <div className="hub-pair">
          <div className="hub-card hub-card-ink">
            <p className="mono">Still have a question?</p>
            <h2 id="kb-close">Ask us in your brief.</h2>
            <p>We read every brief ourselves and reply with honest advice.</p>
            <Button label="Start a project" variant="primary" size="lg" href="/contact">
              <span className="inline-flex items-center gap-2.5">Start a project <ArrowUpRight /></span>
            </Button>
          </div>
          <Link href="/solutions" className="hub-card">
            <p className="mono">Pricing</p>
            <p className="hub-card-title">Every price, in one place.</p>
            <p>Websites, web apps and the care after launch. Clear, fixed prices in US dollars.</p>
            <span className="apx-more">See all pricing <ArrowRight size={14} /></span>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function lower(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}
