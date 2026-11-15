import Link from 'next/link';
import {Button} from '@astryxdesign/core/Button';

import {ArrowDown, ArrowRight, ArrowUpRight, Check} from '@/components/icons';
import {SiteFooter} from '@/components/site/site-footer';
import {SiteHeader} from '@/components/site/site-header';
import {APPS, FOUNDING, money} from '@/lib/pricing';

import {ProductAnatomy} from './product-anatomy';

// The full product build. Facts from the price book (src/lib/pricing.ts): from $18,000, the timeline set during
// scoping, "Launching a production product", the five inclusions, the sprint and its credit, and the Founding
// Ten. "App builds are priced after scoping" is the pricing page's answer. Headlines and the example app are ours.
const CONTACT = '/contact?need=web-app';
const [SPRINT, MVP, FULL] = APPS;
const pct = Math.round(FOUNDING.discount * 100);
const timeline = FULL.specs?.find(([k]) => k === 'Timeline')?.[1] ?? '';

const FACTS: [string, string][] = [
  [`${money(FULL.amount)}+`, 'One-time build'],
  ['After scoping', 'Priced and planned'],
  [`${pct}% off`, 'For the Founding Ten'],
];

const ASKED: [string, string][] = [
  ['Why “from” $18,000?', `App builds are priced after scoping. A ${FULL.name.toLowerCase()} starts at ${money(FULL.amount)}; the scoping sprint ends with a fixed quote and the timeline for yours.`],
  ['Do we need an MVP first?', `Not necessarily. ${MVP.name} is for ${lower(MVP.bestFor)} A ${FULL.name.toLowerCase()} is for ${lower(FULL.bestFor)} Scoping is where you decide which you need.`],
  ['Does the scoping sprint cost extra?', `No. The sprint fee of ${money(SPRINT.amount)} is credited towards your build if you go ahead.`],
  ['Does the Founding Ten apply?', `Yes. Our first ${FOUNDING.places} clients get ${pct}% off website and app builds, until ${FOUNDING.ends} or until the places are taken.`],
];

/** The full product build: a production app, taken apart part by part. */
export function FullProductPage() {
  return (
    <div className="apx wa fp">
      <div className="apx-open">
        <SiteHeader />
        <main className="wrap apx-hero">
          <p className="mono apx-tag fade-up"><Link href="/web-apps">Web apps</Link><span aria-hidden>/</span>{FULL.name}<i aria-hidden />From {money(FULL.amount)}</p>

          <div className="care-hero-grid">
            <h1 className="apx-title fp-title">
              <span className="line"><span className="rise" style={{'--i': 0} as React.CSSProperties}>Built to</span></span>
              <span className="line"><span className="rise" style={{'--i': 1} as React.CSSProperties}>go <em>live.</em></span></span>
            </h1>
            <LaunchCard />
          </div>

          <div className="apx-lead fade-up" style={{'--i': 2} as React.CSSProperties}>
            <div className="apx-say">
              <p>For launching a production product: a complete, secure app with accounts and roles, payments if you need them, an admin panel, and testing and launch support.</p>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button label="Start with scoping" variant="primary" size="lg" href={CONTACT}>
                  <span className="inline-flex items-center gap-2.5">Start with scoping <ArrowUpRight /></span>
                </Button>
                <Button label="Look inside" variant="ghost" size="lg" href="#inside">
                  <span className="inline-flex items-center gap-2.5">Look inside <ArrowDown /></span>
                </Button>
              </div>
            </div>
            <dl className="apx-facts">
              {FACTS.map(([value, label]) => <div key={label}><dd>{value}</dd><dt className="mono">{label}</dt></div>)}
            </dl>
          </div>
        </main>
      </div>

      <section id="inside" aria-labelledby="inside-title" className="wrap apx-block">
        <header className="apx-head">
          <p className="mono">Inside a full product</p>
          <h2 id="inside-title">Five parts. Pick one.</h2>
        </header>
        <ProductAnatomy />
      </section>

      <section aria-labelledby="fits-title" className="wrap apx-block">
        <header className="apx-head">
          <p className="mono">Where it fits</p>
          <h2 id="fits-title">The last of three stages.</h2>
        </header>
        <ol className="fp-stages">
          {APPS.map((p, i) => (
            <li key={p.id} data-here={p.id === FULL.id || undefined}>
              <span className="mono num-badge">0{i + 1}</span>
              <h3>{p.name}</h3>
              <p className="mono fp-stage-price">{p.from ? 'From ' : ''}{money(p.amount)}</p>
              <p>{p.bestFor}</p>
              {p.id === FULL.id && <p className="mono fp-here">You are here · Timeline {timeline.toLowerCase()}</p>}
              {p.id === SPRINT.id && <p className="fp-credit"><Check size={14} />{SPRINT.terms}</p>}
            </li>
          ))}
        </ol>
        <Link href="/web-apps" className="apx-more fp-all">See all three stages <ArrowRight size={14} /></Link>
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
        <p className="mono">{FULL.name} · From</p>
        <h2 id="price-title">{money(FULL.amount)}</h2>
        <div className="apx-close-row">
          <p>Priced after a {money(SPRINT.amount)} scoping sprint, credited towards the build. Tell us what you’re launching.</p>
          <div className="apx-close-go">
            <Button label="Start with scoping" variant="primary" size="lg" href={CONTACT}>
              <span className="inline-flex items-center gap-2.5">Start with scoping <ArrowUpRight /></span>
            </Button>
            <Link href="/solutions#web-apps" className="apx-more">See all pricing <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

/** The five inclusions as a launch board that ticks itself off, ending on "Ready to launch". */
function LaunchCard() {
  return (
    <figure className="fp-launch fade-up" style={{'--i': 2} as React.CSSProperties} aria-label={`What a ${FULL.name.toLowerCase()} includes`}>
      <div className="fp-launch-head">
        <span className="mono">Northstar · launch</span>
        <span className="mono fp-launch-tag">Example</span>
      </div>
      <ul>
        {FULL.includes!.map((x, i) => (
          <li key={x} style={{'--k': i} as React.CSSProperties}>
            <span className="pa-tick"><Check size={12} /></span>{x}
          </li>
        ))}
      </ul>
      <div className="fp-launch-go" style={{'--k': FULL.includes!.length} as React.CSSProperties}>
        <span className="fp-rocket" aria-hidden />
        Ready to launch
      </div>
    </figure>
  );
}

function lower(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}
