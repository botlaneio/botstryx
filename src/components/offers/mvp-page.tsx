import {headers} from 'next/headers';
import {regionForHostname, regionalAmount, formatRegionalMoney} from '@/lib/regional-pricing';
import Link from 'next/link';
import {Button} from '@astryxdesign/core/Button';

import {ArrowDown, ArrowRight, ArrowUpRight, Check} from '@/components/icons';
import {SiteFooter} from '@/components/site/site-footer';
import {SiteHeader} from '@/components/site/site-header';
import {APPS, FOUNDING, money} from '@/lib/pricing';

import {StageFits} from './stage-fits';
import {TryMvp} from './try-mvp';

// MVP development. Facts from the price book (src/lib/pricing.ts): $9,500, 4–6 weeks, who it's for, its three
// inclusions, the sprint and its credit, and the Founding Ten. Headlines, the inclusion notes, the deploy card
// and the working demo are this page's own.
const CONTACT = '/contact?need=web-app';
const [SPRINT, MVP, FULL] = APPS;
const pct = Math.round(FOUNDING.discount * 100);
const time = MVP.specs?.find(([k]) => k === 'Timeline')?.[1] ?? '';
const [WORKFLOW, SIGNIN, DEPLOYED] = MVP.includes!;

const FACTS: [string, string][] = [
  [money(MVP.amount), 'One-time build'],
  [time, 'Timeline'],
  [`${pct}% off`, 'For the Founding Ten'],
];

const PARTS: [string, string][] = [
  [WORKFLOW, 'The one thing your app is for, built properly from the first screen to the last, not a slide or a mock-up.'],
  [SIGNIN, 'People use their own accounts, and what they do is saved for real, so what you learn is real too.'],
  [DEPLOYED, 'Live on the web at its own address, ready to put in front of the people you want to test it with.'],
];

const ASKED: [string, string][] = [
  ['Who is MVP development for?', `It’s for ${MVP.bestFor.charAt(0).toLowerCase()}${MVP.bestFor.slice(1)}`],
  ['How long does it take?', `${time}, from the start of the build to a first version deployed for real users.`],
  ['Do we need a scoping sprint first?', `App builds are priced after scoping. The ${money(SPRINT.amount)} sprint gives you requirements, wireframes, a technical plan and a fixed quote, and its fee is credited towards your build if you go ahead.`],
  ['What comes after the MVP?', `When it’s time to launch a production product, a ${FULL.name.toLowerCase()} adds accounts and roles, payments if you need them, an admin panel, and testing and launch support. It starts at ${money(FULL.amount)}.`],
];

/** MVP development: a first version that works, for real people to use. */
export async function MvpPage() {
  const region = regionForHostname((await headers()).get('host')?.split(':')[0] ?? 'botlane.io');
  const display = (id: string, amount: number) => region === 'in' ? formatRegionalMoney(regionalAmount(id, amount, region), region) : money(amount);
  const facts = region === 'in' ? FACTS.map(([v,l], i) => i === 0 ? [display(MVP.id, MVP.amount), l] as [string,string] : [v,l] as [string,string]).filter(([,l]) => !l.includes('Founding Ten')) : FACTS;
  const asked = region === 'in' ? ASKED.filter(([q]) => !q.includes('Founding Ten')).map(([q,a]) => [q, a.replaceAll(money(SPRINT.amount), display(SPRINT.id, SPRINT.amount)).replaceAll(money(MVP.amount), display(MVP.id, MVP.amount)).replaceAll(money(FULL.amount), display(FULL.id, FULL.amount)).replaceAll('$18,000', display(FULL.id, FULL.amount))] as [string,string]) : ASKED;
  return (
    <div className="apx wa">
      <div className="apx-open">
        <SiteHeader />
        <main className="wrap apx-hero">
          <p className="mono apx-tag fade-up"><Link href="/web-apps">Web apps</Link><span aria-hidden>/</span>{MVP.name}<i aria-hidden />{display(MVP.id, MVP.amount)} · {time}</p>

          <div className="care-hero-grid">
            <h1 className="apx-title care-title fp-title">
              <span className="line"><span className="rise" style={{'--i': 0} as React.CSSProperties}>Test it</span></span>
              <span className="line"><span className="rise" style={{'--i': 1} as React.CSSProperties}>for <em>real.</em></span></span>
            </h1>
            <DeployCard />
          </div>

          <div className="apx-lead fade-up" style={{'--i': 2} as React.CSSProperties}>
            <div className="apx-say">
              <p>For testing the idea with real users or investors: the core workflow working end to end, with sign-in and real data, deployed for real users in {time}.</p>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button label="Start with scoping" variant="primary" size="lg" href={CONTACT}>
                  <span className="inline-flex items-center gap-2.5">Start with scoping <ArrowUpRight /></span>
                </Button>
                <Button label="Try a first version" variant="ghost" size="lg" href="#try">
                  <span className="inline-flex items-center gap-2.5">Try a first version <ArrowDown /></span>
                </Button>
              </div>
            </div>
            <dl className="apx-facts">
              {facts.map(([value, label]) => <div key={label}><dd>{value}</dd><dt className="mono">{label}</dt></div>)}
            </dl>
          </div>
        </main>
      </div>

      <section id="try" aria-labelledby="try-title" className="wrap apx-block">
        <header className="apx-head">
          <p className="mono">A first version, working</p>
          <h2 id="try-title">Don’t picture it. Use it.</h2>
        </header>
        <div className="mv-try">
          <ol className="mv-parts">
            {PARTS.map(([name, note], i) => (
              <li key={name}>
                <span className="mono num-badge">0{i + 1}</span>
                <h3>{name}</h3>
                <p>{note}</p>
              </li>
            ))}
          </ol>
          <div>
            <TryMvp />
            <p className="mono pa-cap">Northstar · a working example · sign in, add a project, move it along</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="fits-title" className="wrap apx-block">
        <header className="apx-head">
          <p className="mono">Where it fits</p>
          <h2 id="fits-title">The middle of three stages.</h2>
        </header>
        <StageFits here={MVP.id} />
      </section>

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
        <p className="mono">{MVP.name} · One-time</p>
        <h2 id="price-title">{display(MVP.id, MVP.amount)}</h2>
        <div className="apx-close-row">
          <p>Planned in a {display(SPRINT.id, SPRINT.amount)} scoping sprint, credited towards the build. Tell us what you want to test.</p>
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

/** A deploy log that ends with the app live: the three inclusions, then the address. */
function DeployCard() {
  return (
    <figure className="mv-deploy fade-up" style={{'--i': 2} as React.CSSProperties} aria-label={`What ${MVP.name.toLowerCase()} delivers`}>
      <div className="fp-launch-head">
        <span className="mono">Northstar · deploy</span>
        <span className="mono fp-launch-tag">Example</span>
      </div>
      <ul>
        {MVP.includes!.map((x, i) => (
          <li key={x} style={{'--k': i} as React.CSSProperties}><span className="pa-tick"><Check size={11} /></span>{x}</li>
        ))}
      </ul>
      <div className="mv-live" style={{'--k': MVP.includes!.length} as React.CSSProperties}>
        <span className="aw-live mono"><i />Live</span>
        <b>app.northstar.com</b>
      </div>
    </figure>
  );
}
