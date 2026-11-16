import Link from 'next/link';
import {Button} from '@astryxdesign/core/Button';

import {ArrowRight, ArrowUpRight, Check} from '@/components/icons';
import {SiteFooter} from '@/components/site/site-footer';
import {SiteHeader} from '@/components/site/site-header';
import {AFTER, money} from '@/lib/pricing';

// Custom Solutions. The headline, the "quoted after a short call" line, the three steps and the closing call to
// action are botpro's custom solutions hub (src/app/custom-solutions/page.tsx and the category in
// src/lib/catalog.ts). botpro also lists workflow automation and document processing there; they are built on
// products this site doesn't show, so they are left out and the AI Assistant is the one packaged offer.
// The AI Assistant's facts come from the price book (src/lib/pricing.ts).
const CONTACT = '/contact?need=custom';
const AI = AFTER.find((p) => p.id === 'ai-assistant')!;

const HOW: [string, string][] = [
  ['A strategy call', 'We learn how your team works today and where the time goes.'],
  ['A written scope and quote', 'What we’ll build, what it should save, and one price.'],
  ['Build and handover', 'Set up, tuned to your data, and handed over so your team can run it.'],
];

const FACTS: [string, string][] = [
  [money(AI.amount), `${AI.name}, one-time`],
  ['Quoted', 'Everything else, after a call'],
];

/** The Custom Solutions hub: the AI Assistant, then how a project of your own runs. */
export function CustomSolutionsPage() {
  return (
    <div className="apx hub">
      <div className="apx-open">
        <SiteHeader />
        <main className="wrap apx-hero">
          <p className="mono apx-tag fade-up">Solutions<span aria-hidden>/</span>Custom solutions<i aria-hidden />Quoted</p>

          <h1 className="apx-title hub-title">
            <span className="line"><span className="rise" style={{'--i': 0} as React.CSSProperties}>AI and automation,</span></span>
            <span className="line"><span className="rise" style={{'--i': 1} as React.CSSProperties}>built around how</span></span>
            <span className="line"><span className="rise" style={{'--i': 2} as React.CSSProperties}>you <em>work.</em></span></span>
          </h1>

          <div className="apx-lead fade-up" style={{'--i': 2} as React.CSSProperties}>
            <div className="apx-say">
              <p>Every business works differently, so we scope and quote after a short call.</p>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button label="Schedule a strategy call" variant="primary" size="lg" href={CONTACT}>
                  <span className="inline-flex items-center gap-2.5">Schedule a strategy call <ArrowUpRight /></span>
                </Button>
              </div>
            </div>
            <dl className="apx-facts">
              {FACTS.map(([value, label]) => <div key={label}><dd>{value}</dd><dt className="mono">{label}</dt></div>)}
            </dl>
          </div>
        </main>
      </div>

      <section aria-labelledby="ai-title" className="wrap apx-block">
        <header className="apx-head">
          <p className="mono">Ready to go</p>
          <h2 id="ai-title">An assistant that knows your business.</h2>
        </header>
        <div className="cs-offer">
          <div className="cs-offer-say">
            <p className="cs-pain">Visitors ask the same questions at all hours, and the ones nobody answers go elsewhere.</p>
            <p>{AI.bestFor}</p>
            <Link href={AI.href} className="apx-more">About the {AI.name} <ArrowRight size={14} /></Link>
          </div>
          <div className="cs-offer-card">
            <p className="mono">{AI.name}</p>
            <p className="ws-price"><b>{money(AI.amount)}</b> <span className="mono">one-time</span></p>
            <ul>
              {(AI.includes ?? []).map((x) => <li key={x}><Check size={15} />{x}</li>)}
            </ul>
            <Button label="See it working" variant="secondary" href={AI.href}>
              <span className="inline-flex items-center gap-2">See it working <ArrowRight size={14} /></span>
            </Button>
          </div>
        </div>
      </section>

      <section aria-labelledby="how-title" className="wrap apx-block">
        <header className="apx-head">
          <p className="mono">Something of your own</p>
          <h2 id="how-title">From a short call to a working system.</h2>
        </header>
        <ol className="apx-run cs-run">
          {HOW.map(([title, body], i) => (
            <li key={title}>
              <span className="mono num-badge">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="close-title" className="wrap apx-block">
        <div className="hub-pair">
          <div className="hub-card hub-card-ink">
            <p className="mono">Start with a call</p>
            <h2 id="close-title">Tell us where the time goes.</h2>
            <p>A short call to understand how you work, then a written scope and a quote.</p>
            <Button label="Schedule a strategy call" variant="primary" size="lg" href={CONTACT}>
              <span className="inline-flex items-center gap-2.5">Schedule a strategy call <ArrowUpRight /></span>
            </Button>
          </div>
          <Link href="/solutions" className="hub-card">
            <p className="mono">Everything else</p>
            <p className="hub-card-title">Websites, web apps and Care, at fixed prices.</p>
            <p>Every price is fixed before we start.</p>
            <span className="apx-more">See all pricing <ArrowRight size={14} /></span>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
