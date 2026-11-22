import {headers} from 'next/headers';
import {regionForHostname, regionalAmount, formatRegionalMoney} from '@/lib/regional-pricing';
import Link from 'next/link';
import {Button} from '@astryxdesign/core/Button';

import {ArrowDown, ArrowRight, ArrowUpRight} from '@/components/icons';
import {SiteFooter} from '@/components/site/site-footer';
import {SiteHeader} from '@/components/site/site-header';
import {APPS, FOUNDING, money} from '@/lib/pricing';

import {ClickableWireframe} from './clickable-wireframe';
import {StageFits} from './stage-fits';

// The scoping sprint. Facts from the price book (src/lib/pricing.ts): $1,500, 1–2 weeks, who it's for, its four
// deliverables, the credit towards the build, and the Founding Ten. "App builds are priced after scoping" is the
// pricing page's answer. Headlines, the deliverable notes, the quote card and the wireframe are this page's own.
const CONTACT = '/contact?need=web-app';
const [SPRINT, MVP, FULL] = APPS;
const pct = Math.round(FOUNDING.discount * 100);
const time = SPRINT.specs?.find(([k]) => k === 'Timeline')?.[1] ?? '';
const [REQS, WIRES, PLAN, QUOTE] = SPRINT.includes!;

const FACTS: [string, string][] = [
  [money(SPRINT.amount), 'One-time'],
  [time, 'Timeline'],
  ['Credited', 'Towards your build'],
];

// The four deliverables, as the sprint hands them over. Names are the price book's; the notes say what each is.
const PACK: {name: string; note: string; kind: string}[] = [
  {name: REQS, note: 'What the app must do, for whom, and the path each person takes through it.', kind: 'Document'},
  {name: WIRES, note: 'Every key screen in grey, linked together, so you can click through the app before it exists.', kind: 'Prototype'},
  {name: PLAN, note: 'How it will be built: the data, the sign-in, where it runs and what it connects to.', kind: 'Document'},
  {name: QUOTE, note: 'One price and a timeline for the build. You decide with everything above in front of you.', kind: 'Quote'},
];

const ASKED: [string, string][] = [
  ['Who is the scoping sprint for?', `${SPRINT.bestFor}`],
  ['How long does the sprint take?', `${time}. It ends with a fixed quote for the build, so you know the price before you decide.`],
  ['Does the sprint cost extra if we build?', `No. The sprint fee of ${money(SPRINT.amount)} is credited towards your build if you go ahead.`],
  ['What does the build cost after scoping?', `App builds are priced after scoping. ${MVP.name} is ${money(MVP.amount)}, and a ${FULL.name.toLowerCase()} starts at ${money(FULL.amount)}. The sprint ends with a fixed quote for yours.`],
];

/** The scoping sprint: the plan, the wireframes and the price, before anything is built. */
export async function ScopingSprintPage() {
  const region = regionForHostname((await headers()).get('host')?.split(':')[0] ?? 'botlane.io');
  const display = (id: string, amount: number) => region === 'in' ? formatRegionalMoney(regionalAmount(id, amount, region), region) : money(amount);
  const facts = region === 'in' ? FACTS.map(([v,l], i) => i === 0 ? [display(SPRINT.id, SPRINT.amount), l] as [string,string] : [v,l] as [string,string]).filter(([,l]) => !l.includes('Founding Ten')) : FACTS;
  const asked = region === 'in' ? ASKED.filter(([q]) => !q.includes('Founding Ten')).map(([q,a]) => [q, a.replaceAll(money(SPRINT.amount), display(SPRINT.id, SPRINT.amount)).replaceAll(money(MVP.amount), display(MVP.id, MVP.amount)).replaceAll(money(FULL.amount), display(FULL.id, FULL.amount)).replaceAll('$18,000', display(FULL.id, FULL.amount))] as [string,string]) : ASKED;
  return (
    <div className="apx wa">
      <div className="apx-open">
        <SiteHeader />
        <main className="wrap apx-hero">
          <p className="mono apx-tag fade-up"><Link href="/web-apps">Web apps</Link><span aria-hidden>/</span>{SPRINT.name}<i aria-hidden />{display(SPRINT.id, SPRINT.amount)} · {time}</p>

          <div className="care-hero-grid">
            <h1 className="apx-title care-title fp-title">
              <span className="line"><span className="rise" style={{'--i': 0} as React.CSSProperties}>Plan first.</span></span>
              <span className="line"><span className="rise" style={{'--i': 1} as React.CSSProperties}>Then <em>build.</em></span></span>
            </h1>
            <QuoteCard />
          </div>

          <div className="apx-lead fade-up" style={{'--i': 2} as React.CSSProperties}>
            <div className="apx-say">
              <p>For anyone with an app idea who needs a clear plan and a fixed quote. In {time} you get the requirements, clickable wireframes, a technical plan, and one price for the build.</p>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button label="Start the sprint" variant="primary" size="lg" href={CONTACT}>
                  <span className="inline-flex items-center gap-2.5">Start the sprint <ArrowUpRight /></span>
                </Button>
                <Button label="Click through a wireframe" variant="ghost" size="lg" href="#wireframe">
                  <span className="inline-flex items-center gap-2.5">Click through a wireframe <ArrowDown /></span>
                </Button>
              </div>
            </div>
            <dl className="apx-facts">
              {facts.map(([value, label]) => <div key={label}><dd>{value}</dd><dt className="mono">{label}</dt></div>)}
            </dl>
          </div>
        </main>
      </div>

      <section aria-labelledby="pack-title" className="wrap apx-block">
        <header className="apx-head">
          <p className="mono">What you leave with</p>
          <h2 id="pack-title">Four things. One decision.</h2>
        </header>
        <ol className="ss-pack">
          {PACK.map((d, i) => (
            <li key={d.name} style={{'--k': i} as React.CSSProperties} data-quote={i === 3 || undefined}>
              <div className="ss-doc" aria-hidden>
                <span className="mono">{d.kind}</span>
                <i /><i /><i />
              </div>
              <span className="mono num-badge">0{i + 1}</span>
              <h3>{d.name}</h3>
              <p>{d.note}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="wireframe" aria-labelledby="wire-title" className="wrap apx-block">
        <header className="apx-head">
          <p className="mono">{WIRES}</p>
          <h2 id="wire-title">Click through it before it exists.</h2>
        </header>
        <ClickableWireframe />
      </section>

      <section aria-labelledby="fits-title" className="wrap apx-block">
        <header className="apx-head">
          <p className="mono">Where it fits</p>
          <h2 id="fits-title">The first of three stages.</h2>
        </header>
        <StageFits here={SPRINT.id} />
      </section>

      {region === 'us' && <section aria-labelledby="founding-title" className="wrap wa-founding-wrap">
        <div className="wa-founding">
          <p className="mono">The Founding Ten</p>
          <h2 id="founding-title"><span>{pct}% off</span> app builds for our first {FOUNDING.places} clients.</h2>
          <p>Until {FOUNDING.ends}, or sooner if all ten places are taken.</p>
          <Link href={CONTACT} className="wa-founding-go">Claim a place <ArrowUpRight /></Link>
        </div>
      </section>}

      <section aria-labelledby="asked-title" className="wrap apx-block">
        <header className="apx-head">
          <p className="mono">Asked before signing</p>
          <h2 id="asked-title">Four straight answers.</h2>
        </header>
        <dl className="apx-asked">
          {asked.map(([q, a]) => <div key={q}><dt>{q}</dt><dd>{a}</dd></div>)}
        </dl>
      </section>

      <section aria-labelledby="price-title" className="wrap apx-close">
        <p className="mono">{SPRINT.name} · One-time</p>
        <h2 id="price-title">{display(SPRINT.id, SPRINT.amount)}</h2>
        <div className="apx-close-row">
          <p>{SPRINT.terms} Tell us about the app you have in mind.</p>
          <div className="apx-close-go">
            <Button label="Start the sprint" variant="primary" size="lg" href={CONTACT}>
              <span className="inline-flex items-center gap-2.5">Start the sprint <ArrowUpRight /></span>
            </Button>
            <Link href="/solutions#web-apps" className="apx-more">See all pricing <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

/** What the sprint ends with: a quote, drawn as a document with its four parts checked and a stamped price. */
function QuoteCard() {
  return (
    <figure className="ss-quote fade-up" style={{'--i': 2} as React.CSSProperties} aria-label="An example of the quote a scoping sprint ends with">
      <div className="fp-launch-head">
        <span className="mono">Northstar · build quote</span>
        <span className="mono fp-launch-tag">Example</span>
      </div>
      <dl>
        {SPRINT.includes!.slice(0, 3).map((x, i) => (
          <div key={x} style={{'--k': i} as React.CSSProperties}><dt>{x}</dt><dd className="mono">Agreed</dd></div>
        ))}
      </dl>
      <div className="ss-quote-price">
        <span className="mono">Fixed price for the build</span>
        <b>$ <i className="ss-redact" aria-hidden /></b>
        <span className="ss-stamp mono">Fixed</span>
      </div>
      <figcaption className="mono">Your price is set by your scope</figcaption>
    </figure>
  );
}
