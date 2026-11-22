import Link from 'next/link';
import {headers} from 'next/headers';
import {regionForHostname, regionalAmount, formatRegionalMoney} from '@/lib/regional-pricing';
import {Button} from '@astryxdesign/core/Button';

import {ArrowDown, ArrowRight, ArrowUpRight} from '@/components/icons';
import {SiteFooter} from '@/components/site/site-footer';
import {SiteHeader} from '@/components/site/site-header';
import {APPS, FOUNDING, money} from '@/lib/pricing';

import {BuildStage, BuildStageStack} from './build-stage';

// Web Apps: one product, planned and priced in stages. The facts are botpro's, through this site's price book
// (src/lib/pricing.ts) and the pricing page's questions (src/app/solutions/page.tsx): the three stages, their
// prices, timelines, inclusions and "best for" lines; that app builds are priced after scoping; that the sprint
// is credited towards the build; and the Founding Ten. The headlines and the example app are this page's own.
const CONTACT = '/contact?need=web-app';
const [SPRINT, MVP, FULL] = APPS;
const pct = Math.round(FOUNDING.discount * 100);

const PROMISES: [string, string][] = [
  ['A fixed quote before the build', 'The scoping sprint ends with requirements, wireframes, a technical plan and one price for the build. You decide with all of it in front of you.'],
  ['Priced stage by stage', 'Start with the sprint, build a first version to test with real people, then go on to the full product. Each stage is agreed before it starts.'],
  ['The sprint counts towards the build', `The ${money(SPRINT.amount)} sprint fee is credited towards your build if you go ahead, so planning first doesn’t cost you extra.`],
];

const ASKED: [string, string][] = [
  ['How is a web app priced?', `App builds are priced after scoping. A scoping sprint is ${money(SPRINT.amount)} one-time, ${lower(MVP.name)} is ${money(MVP.amount)}, and a full product build starts at ${money(FULL.amount)}.`],
  ['Does the scoping sprint cost extra if we go ahead?', `No. The sprint fee of ${money(SPRINT.amount)} is credited towards your build if you go ahead.`],
  ['Which stage should we start with?', `The scoping sprint is for ${lower(SPRINT.bestFor)} ${MVP.name} is for ${lower(MVP.bestFor)} A ${lower(FULL.name)} is for ${lower(FULL.bestFor)}`],
  ['What is the Founding Ten?', `We’re a new company, so our first ${FOUNDING.places} clients get ${pct}% off website and app builds. The offer ends on ${FOUNDING.ends}, or sooner if all ten places are taken.`],
];

/** The Web Apps page: one product, from idea to launch, in three stages. */
export async function WebAppsPage() {
  const region = regionForHostname((await headers()).get('host')?.split(':')[0] ?? 'botlane.io');
  const price = (id: string, amount: number) => region === 'in' ? formatRegionalMoney(regionalAmount(id, amount, region), region) : money(amount);
  const facts: [string, string][] = APPS.map(p => [`${price(p.id, p.amount)}${p.from ? '+' : ''}`, p.name]);
  const promises = PROMISES.map(([title, body]) => [title, title === 'The sprint counts towards the build' ? `The ${price(SPRINT.id, SPRINT.amount)} sprint fee is credited towards your build if you go ahead.` : body] as [string,string]);
  const asked = region === 'in' ? ASKED.filter(([q]) => !q.includes('Founding Ten')).map(([q,a]) => [q, q.startsWith('How is a web app priced') ? `A scoping sprint is ${price(SPRINT.id, SPRINT.amount)}, a prototype is ${price(MVP.id, MVP.amount)}, and full product builds start at ${price(FULL.id, FULL.amount)}.` : q.startsWith('Does the scoping') ? `No. The ${price(SPRINT.id, SPRINT.amount)} sprint fee is credited towards the build.` : a] as [string,string]) : ASKED;
  return (
    <div className="apx wa">
      <div className="apx-open wa-open">
        <SiteHeader />
        <main className="wrap apx-hero wa-hero">
          <p className="mono apx-tag fade-up">Solutions<span aria-hidden>/</span>Web apps<i aria-hidden />Scoping from {price(SPRINT.id, SPRINT.amount)}</p>

          <h1 className="apx-title wa-title">
            <span className="line"><span className="rise" style={{'--i': 0} as React.CSSProperties}>From idea</span></span>
            <span className="line"><span className="rise" style={{'--i': 1} as React.CSSProperties}>to <em>product.</em></span></span>
          </h1>

          {/* The three stages as one line of light: sketch, first version, product. */}
          <div className="wa-path fade-up" style={{'--i': 2} as React.CSSProperties} aria-hidden>
            {APPS.map((p, i) => (
              <span key={p.id} className="wa-path-step" style={{'--k': i} as React.CSSProperties}>
                <i />
                <b>{p.name}</b>
                <small className="mono">{p.specs?.find(([k]) => k === 'Timeline')?.[1]}</small>
              </span>
            ))}
          </div>

          <div className="apx-lead fade-up" style={{'--i': 3} as React.CSSProperties}>
            <div className="apx-say">
              <p>From a first working version to a full product, planned and priced in stages. Every price is fixed before we start.</p>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button label="Start with scoping" variant="primary" size="lg" href={CONTACT}>
                  <span className="inline-flex items-center gap-2.5">Start with scoping <ArrowUpRight /></span>
                </Button>
                <Button label="Watch it build" variant="ghost" size="lg" href="#build">
                  <span className="inline-flex items-center gap-2.5">Watch it build <ArrowDown /></span>
                </Button>
              </div>
            </div>
            <dl className="apx-facts">
              {facts.map(([value, label]) => <div key={label}><dd>{value}</dd><dt className="mono">{label}</dt></div>)}
            </dl>
          </div>
        </main>
      </div>

      <section id="build" aria-labelledby="build-title" className="wa-build">
        <header className="wrap apx-head wa-build-head">
          <p className="mono">Three stages, one product</p>
          <h2 id="build-title">Watch an app get built.</h2>
        </header>
        <div className="wa-build-pinned"><BuildStage region={region} /></div>
        <div className="wrap wa-build-stacked"><BuildStageStack region={region} /></div>
      </section>

      <section aria-labelledby="promise-title" className="wrap apx-block">
        <header className="apx-head">
          <p className="mono">How it’s priced</p>
          <h2 id="promise-title">No surprises, stage by stage.</h2>
        </header>
        <div className="wa-price">
          <ol className="wa-promises">
            {promises.map(([title, body], i) => (
              <li key={title}>
                <span className="mono num-badge">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
          <Receipt region={region} />
        </div>
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
        <h2 id="price-title">{price(SPRINT.id, SPRINT.amount)}</h2>
        <div className="apx-close-row">
          <p>{SPRINT.terms} Tell us what you want to build.</p>
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

/** What going from the sprint to a first version costs in all: the sprint, the build, and the credit back. */
function Receipt({region}: {region: 'us' | 'in'}) {
  const price = (id: string, amount: number) => region === 'in' ? formatRegionalMoney(regionalAmount(id, amount, region), region) : money(amount);
  return (
    <figure className="wa-receipt" aria-label={`From ${SPRINT.name} to ${MVP.name}: ${price(MVP.id, MVP.amount)} in all`}>
      <p className="mono wa-receipt-head">Sprint, then {MVP.name}</p>
      <dl>
        <div><dt>{SPRINT.name}</dt><dd>{price(SPRINT.id, SPRINT.amount)}</dd></div>
        <div><dt>{MVP.name}</dt><dd>{price(MVP.id, MVP.amount)}</dd></div>
        <div className="wa-credit"><dt>Sprint fee, credited</dt><dd>−{price(SPRINT.id, SPRINT.amount)}</dd></div>
        <div className="wa-total"><dt>In all</dt><dd>{price(MVP.id, MVP.amount)}</dd></div>
      </dl>
      <figcaption>Planning first costs nothing extra when you go on to build. {region === 'us' ? `Before any ${pct}% Founding Ten discount.` : 'GST additional where applicable.'}</figcaption>
    </figure>
  );
}

function lower(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}
