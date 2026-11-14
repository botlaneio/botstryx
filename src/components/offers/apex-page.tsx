import Link from 'next/link';
import {Button} from '@astryxdesign/core/Button';

import {ArrowDown, ArrowRight, ArrowUpRight} from '@/components/icons';
import {SiteFooter} from '@/components/site/site-footer';
import {SiteHeader} from '@/components/site/site-header';

import {ScaleStage} from './scale-stage';

// This page has a concept and wording of its own, at the owner's request: Apex shown as one website considered
// at five scales. The facts are still botpro's (src/lib/catalog.ts, src/lib/pricing/plans.ts, src/lib/process.ts):
// the price, the timeline, the rounds of revisions, what is included, the five steps and Care after launch.
const CONTACT = '/contact?need=website';
const PRICE = '$7,900';

const FACTS: [string, string][] = [[PRICE, 'One-time project'], ['5–8 weeks', 'First call to launch'], ['4 rounds', 'Of design revisions']];

const LEDGER: [string, string][] = [
  ['Signature motion and interactions', 'A motion language designed for your brand, reviewed as motion studies before it is built.'],
  ['Structured content', 'Case studies, docs and a changelog, each with fields of its own.'],
  ['Advanced SEO', 'Structured data and an architecture built to be found.'],
  ['Multiple languages', 'If you need them, with the scope agreed before we build.'],
  ['A performance budget', 'Limits on page weight and load time, agreed up front and verified before launch.'],
  ['Everything in Ascend', 'Custom design, a design system, a content editor and blog, and integrations for booking, CRM and newsletter.'],
  ['Pages scoped to your needs', 'As many as the story takes, agreed in writing with the content types and languages.'],
];

const STEPS: [string, string][] = [
  ['Intro call', 'You tell us what you need. We tell you honestly whether we’re the right fit.'],
  ['Scope and fixed quote', 'A written scope, a timeline and one price, agreed before any work starts.'],
  ['Design', 'A custom design on real content, reviewed in four rounds, motion included.'],
  ['Build', 'We build it, share progress as we go, and test it on every screen size.'],
  ['Launch', 'We put it live, hand over everything, and stay on with Care if you want us to.'],
];

const ASKED: [string, string][] = [
  ['Who is Apex for?', 'Brands where the website is part of the product: a launch, a premium brand, or a flagship company site that carries a lot of story and still has to feel effortless.'],
  ['How many pages is it?', 'As many as the story needs. We scope pages, content types and languages together and agree them in writing before the build.'],
  ['Can we see the motion first?', 'Yes. Motion studies are part of design, so you review how the site moves, not only how it looks, before we build it.'],
  ['What happens after launch?', 'We hand over everything. Hosting, updates and edits after launch are available through Care, if you want us to stay on.'],
];

/** The Apex website package: one site, considered at five scales. */
export function ApexPage() {
  return (
    <div className="apx">
      <div className="apx-open">
        <SiteHeader />
        <main className="wrap apx-hero">
          <p className="mono apx-tag fade-up"><Link href="/websites">Websites</Link><span aria-hidden>/</span>Apex<i aria-hidden />The flagship</p>

          <h1 className="apx-title">
            <span className="line"><span className="rise" style={{'--i': 0} as React.CSSProperties}>Considered</span></span>
            <span className="line"><span className="rise" style={{'--i': 1} as React.CSSProperties}>at every scale.</span></span>
          </h1>

          <div className="apx-lead fade-up" style={{'--i': 2} as React.CSSProperties}>
            <div className="apx-say">
              <p>Apex is our flagship website: one piece of design and engineering, held to the same standard from how the world finds it down to how a single button answers a touch.</p>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button label="Start with Apex" variant="primary" size="lg" href={CONTACT}>
                  <span className="inline-flex items-center gap-2.5">Start with Apex <ArrowUpRight /></span>
                </Button>
                <Button label="Zoom in" variant="ghost" size="lg" href="#scales">
                  <span className="inline-flex items-center gap-2.5">Zoom in <ArrowDown /></span>
                </Button>
              </div>
            </div>
            <dl className="apx-facts">
              {FACTS.map(([value, label]) => <div key={label}><dd>{value}</dd><dt className="mono">{label}</dt></div>)}
            </dl>
          </div>
        </main>
      </div>

      <div id="scales"><ScaleStage /></div>

      <section aria-labelledby="ledger-title" className="wrap apx-block">
        <header className="apx-head">
          <p className="mono">The whole of it</p>
          <h2 id="ledger-title">Seven things, and nothing left to chance.</h2>
        </header>
        <ol className="apx-ledger">
          {LEDGER.map(([name, note], i) => (
            <li key={name}>
              <span className="mono num-badge">{String(i + 1).padStart(2, '0')}</span>
              <h3>{name}</h3>
              <p>{note}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="run-title" className="wrap apx-block">
        <header className="apx-head">
          <p className="mono">How it runs</p>
          <h2 id="run-title">Five to eight weeks. Four rounds of design. One price.</h2>
        </header>
        <ol className="apx-run">
          {STEPS.map(([title, body], i) => (
            <li key={title}>
              <span className="mono num-badge">Step 0{i + 1}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="asked-title" className="wrap apx-block">
        <header className="apx-head">
          <p className="mono">Asked before signing</p>
          <h2 id="asked-title">Four straight answers.</h2>
        </header>
        <dl className="apx-asked">
          {ASKED.map(([q, a]) => <div key={q}><dt>{q}</dt><dd>{a}</dd></div>)}
        </dl>
      </section>

      <section aria-labelledby="price-title" className="wrap apx-close">
        <p className="mono">Apex · One-time project</p>
        <h2 id="price-title">{PRICE}</h2>
        <div className="apx-close-row">
          <p>Scoped in writing and agreed before any work starts. Tell us what you’re putting into the world.</p>
          <div className="apx-close-go">
            <Button label="Start with Apex" variant="primary" size="lg" href={CONTACT}>
              <span className="inline-flex items-center gap-2.5">Start with Apex <ArrowUpRight /></span>
            </Button>
            <Link href="/websites" className="apx-more">Compare website packages <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
