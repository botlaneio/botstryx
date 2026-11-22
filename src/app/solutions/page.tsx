import type {Metadata} from 'next';
import {headers} from 'next/headers';
import Link from 'next/link';
import {Button} from '@astryxdesign/core/Button';

import {ArrowDown, ArrowRight, ArrowUpRight} from '@/components/icons';
import {PriceBook} from '@/components/pricing/price-book';
import {SiteFooter} from '@/components/site/site-footer';
import {SiteHeader} from '@/components/site/site-header';
import {FOUNDING, money} from '@/lib/pricing';
import {formatRegionalMoney, regionForHostname, type Region} from '@/lib/regional-pricing';

export const metadata: Metadata = {
  title: 'Pricing · botLane',
  description: 'Websites and web apps, designed and built end to end, and the care after launch. Clear, fixed prices in US dollars.',
};

// The words are botpro's: its Solutions page (src/app/solutions/page.tsx), which the menus call Pricing, the
// questions beside it (src/components/services/services-faq.tsx, src/components/pricing/pricing-faq.tsx) and
// the shared process steps (src/lib/process.ts). Every figure comes from the price book (src/lib/pricing.ts).

// Three things that hold for every project.
const FACTS: [string, string][] = [
  ['Fixed price', 'Agreed in writing before work starts.'],
  ['Yours to keep', 'The site is yours after launch.'],
  ['Straight answers', 'We’ll say so if we’re not the right fit.'],
];

const STEPS: [string, string][] = [
  ['Intro call', 'You tell us what you need. We tell you honestly whether we’re the right fit.'],
  ['Scope and fixed quote', 'A written scope, a timeline and one price, agreed before any work starts.'],
  ['Design', 'A custom design you review in rounds, on real content, not lorem ipsum.'],
  ['Build', 'We build it, share progress as we go, and test it on every screen size.'],
  ['Launch', 'We put it live, hand over everything, and stay on with Care if you want us to.'],
];

const QUESTIONS: [string, string][] = [
  ['You’re new. Why should we trust you with our site?', `We are new, and we won’t pretend otherwise. What we can show you is the software we’re building for ourselves, this website, and a fixed scope and price before any work starts. Our first ${FOUNDING.places} clients also get ${Math.round(FOUNDING.discount * 100)}% off.`],
  ['Are website prices one-time or monthly?', 'One-time. You pay once for the build. Care plans are separate and optional.'],
  ['How is a web app priced?', `App builds are priced after scoping. A scoping sprint is ${money(1500)} one-time, and a full build starts at ${money(18000)}.`],
  ['Does the scoping sprint cost extra if we go ahead with the app?', `No. The sprint fee of ${money(1500)} is credited towards your build if you go ahead.`],
  ['What is the Founding Ten?', `We’re a new company, so our first ${FOUNDING.places} clients get ${Math.round(FOUNDING.discount * 100)}% off website and app builds. The offer ends on ${FOUNDING.ends}, or sooner if all ten places are taken.`],
  ['What happens after launch?', 'The site is yours. If you’d like us to look after it, Care covers hosting, updates, monitoring, backups and an hour of small edits a month. Care Plus adds more hours, faster replies, a monthly report and a quarterly design review.'],
  ['What is the AI Assistant trained on?', 'Your website and your business: your services, prices, policies and common questions. It answers visitors and hands the conversation to you when a person is needed.'],
];

const JUMPS = [['Websites', `From ${money(2500)}`, '#websites'], ['Web Apps', `Scoping ${money(1500)}`, '#web-apps'], ['After launch', `From ${money(99)}/month`, '#after-launch']];

export default async function PricingPage() {
  const requestHeaders = await headers();
  const region: Region = regionForHostname(requestHeaders.get('host')?.split(':')[0] ?? 'botlane.io');
  const inIndia = region === 'in';
  const price = (us: number, indian: number) => inIndia ? formatRegionalMoney(indian, region) : money(us);
  const jumps = [['Websites', `From ${price(2500, 39900)}`, '#websites'], ['Web Apps', `Scoping ${price(1500, 24900)}`, '#web-apps'], ['After launch', `From ${price(99, 2999)}/month`, '#after-launch']];
  const questions = inIndia ? QUESTIONS.filter(([question]) => !question.includes('Founding Ten')).map(([question, answer]) => {
    if (question.startsWith('You’re new.')) return [question, 'We are new, and we won’t pretend otherwise. We show you our own software and agree a fixed scope and price before starting.'];
    if (question.startsWith('How is a web app priced?')) return [question, `App builds are priced after scoping. A scoping sprint is ${price(1500, 24900)} one-time, and a full build starts at ${price(18000, 699900)}.`];
    if (question.startsWith('Does the scoping sprint')) return [question, `No. The sprint fee of ${price(1500, 24900)} is credited towards your build if you go ahead.`];
    return [question, answer];
  }) : QUESTIONS;
  return (
    <div className="pr">
      <SiteHeader />
      <main>
        <div className="wrap pr-hero">
          <div className="pr-hero-top">
            <div className="pr-say">
              <p className="mono pr-kicker"><i aria-hidden />Pricing</p>
              <h1 className="pr-title">Websites and web apps, built properly.</h1>
              <p className="pr-lede">We design and build every project end to end, to the standard of the best software companies. <strong>Every price is fixed before we start.</strong></p>
            </div>

            {/* The price list at a glance: one row a lane, each jumping to its section. */}
            <nav aria-label="Price list" className="pr-index">
              <p className="mono">Clear, fixed prices in {inIndia ? 'Indian rupees' : 'US dollars'}</p>
              {jumps.map(([name, price, href]) => (
                <a key={href} href={href}>
                  <b>{name}</b>
                  <span className="mono">{price}</span>
                  <ArrowDown size={15} />
                </a>
              ))}
            </nav>
          </div>

          <dl className="pr-facts">
            {FACTS.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>

        <PriceBook region={region} />
        {inIndia && <p className="wrap mono">GST additional where applicable.</p>}

        <section aria-labelledby="pr-process" className="wrap pr-block">
          <header className="pr-head">
            <p className="mono">How we work</p>
            <h2 id="pr-process">From first call to launch.</h2>
          </header>
          <ol className="apx-run">
            {STEPS.map(([title, body], i) => (
              <li key={title}>
                <span className="mono">Step 0{i + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="pr-faq" className="wrap pr-block pr-asks">
          <header className="pr-head">
            <p className="mono">Questions</p>
            <h2 id="pr-faq">What people ask before they hire us.</h2>
            <p>Open a question for the straight answer. Anything else, ask us in your brief.</p>
          </header>
          <div className="faq">
            {questions.map(([q, a]) => (
              <details key={q}>
                <summary>{q}<i aria-hidden /></summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="pr-close" className="wrap pr-block pr-close">
          <p className="mono">Start a project</p>
          <h2 id="pr-close">Tell us what you’re building.</h2>
          <p>We read every brief ourselves and reply with honest advice.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Button label="Start a project" variant="primary" size="lg" href="/contact">
              <span className="inline-flex items-center gap-2.5">Start a project <ArrowUpRight /></span>
            </Button>
            <Link href="/contact?need=not-sure" className="apx-more">Not sure yet? We’ll help you choose <ArrowRight size={14} /></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
