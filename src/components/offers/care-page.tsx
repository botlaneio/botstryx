import Link from 'next/link';
import {headers} from 'next/headers';
import {regionForHostname, regionalAmount, formatRegionalMoney} from '@/lib/regional-pricing';
import {Button} from '@astryxdesign/core/Button';

import {ArrowDown, ArrowRight, ArrowUpRight, Check} from '@/components/icons';
import {SiteFooter} from '@/components/site/site-footer';
import {SiteHeader} from '@/components/site/site-header';
import {AFTER, FOUNDING, money} from '@/lib/pricing';

import {CarePlanner} from './care-planner';

// Care: looking after a site once it's live. Every fact (the two plans, their prices, what each includes, who each
// is for, the hourly rate beyond a plan's hours, and that the Founding Ten doesn't apply) comes from the price
// book in src/lib/pricing.ts, which follows botpro's. The headlines and the status console are this page's own
// framing; the console is drawn as an example and says so.
const CONTACT = '/contact?need=care';
const plan = (id: string) => AFTER.find((p) => p.id === id)!;
const CARE = plan('care');
const PLUS = plan('care-plus');
const RATE = plan('extra-work').amount;

const FACTS: [string, string][] = [
  [money(CARE.amount), `${CARE.name}, a month`],
  [money(PLUS.amount), `${PLUS.name}, a month`],
  ['1–3 hours', 'Of edits each month'],
];

// Care's six inclusions, in three groups. The wording of each line is the price book's.
const COVERS: {label: string; title: string; icon: React.ReactNode; items: string[]}[] = [
  {label: 'Kept running', title: 'Hosted and watched', icon: <ServerIcon />, items: [CARE.includes![0], CARE.includes![2]]},
  {label: 'Kept safe', title: 'Patched and backed up', icon: <ShieldIcon />, items: [CARE.includes![1], CARE.includes![3]]},
  {label: 'Kept moving', title: 'Changes when you need them', icon: <PenIcon />, items: [CARE.includes![4], CARE.includes![5]]},
];

// Care and Care Plus line by line: true is included, a string is the plan's own amount.
const COMPARE: [string, string | boolean, string | boolean][] = [
  ['Hosting, SSL and deployments managed for you', true, true],
  ['Security and dependency updates', true, true],
  ['Uptime monitoring', true, true],
  ['Monthly backups', true, true],
  ['Small edits each month', 'Up to 1 hour', 'Up to 3 hours'],
  ['Support', 'Email, reply within 2 business days', 'Priority, reply within 1 business day'],
  ['Monthly performance and SEO report', false, true],
  ['A quarterly design review', false, true],
];

const ASKED: [string, string][] = [
  ['Which plan is right for me?', `${CARE.name} is for ${lower(CARE.bestFor)} ${PLUS.name} is for ${lower(PLUS.bestFor)}`],
  ['What if I need more than my monthly hours?', `Changes beyond your plan’s hours are billed as additional work, at ${money(RATE)} an hour. If that happens most months, ${PLUS.name} usually works out cheaper: the planner above does the sum.`],
  ['Does the Founding Ten discount apply to Care?', `No. The Founding Ten is ${FOUNDING.discount * 100}% off website and app builds for our first ${FOUNDING.places} clients. Care plans are charged at their listed price.`],
  ['What does managed hosting cover?', 'Hosting, SSL and deployments. We set them up and look after them, so there’s no server, certificate or release for you to manage.'],
];

/** The Care page: what looking after a live site covers, which plan fits, and what it costs. */
export async function CarePage() {
  const region = regionForHostname((await headers()).get('host')?.split(':')[0] ?? 'botlane.io');
  const regionalMoney = (id: string, amount: number) => region === 'in' ? formatRegionalMoney(regionalAmount(id, amount, region), region) : money(amount);
  const facts: [string, string][] = [[regionalMoney(CARE.id, CARE.amount), `${CARE.name}, a month`], [regionalMoney(PLUS.id, PLUS.amount), `${PLUS.name}, a month`], FACTS[2]];
  const asked = region === 'in' ? ASKED.filter(([q]) => !q.includes('Founding Ten')).map(([q,a]) => q.startsWith('What if I need more') ? [q, `Changes beyond your plan’s hours are billed at ${regionalMoney('extra-work', RATE)} an hour. The planner above compares the costs.`] : [q,a]) : ASKED;
  return (
    <div className="apx care">
      <div className="apx-open care-open">
        <SiteHeader />
        <main className="wrap apx-hero care-hero">
          <p className="mono apx-tag fade-up">After launch<span aria-hidden>/</span>Care<i aria-hidden />From {regionalMoney(CARE.id, CARE.amount)} a month</p>

          <div className="care-hero-grid">
            <h1 className="apx-title care-title">
              <span className="line"><span className="rise" style={{'--i': 0} as React.CSSProperties}>Your site,</span></span>
              <span className="line"><span className="rise" style={{'--i': 1} as React.CSSProperties}>looked after.</span></span>
            </h1>
            <StatusConsole />
          </div>

          <div className="apx-lead fade-up" style={{'--i': 2} as React.CSSProperties}>
            <div className="apx-say">
              <p>Launch is when a website starts its working life. Care keeps it secure, backed up and up to date, with time each month for the small changes a live site always needs.</p>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button label="Start Care" variant="primary" size="lg" href={CONTACT}>
                  <span className="inline-flex items-center gap-2.5">Start Care <ArrowUpRight /></span>
                </Button>
                <Button label="Find your plan" variant="ghost" size="lg" href="#planner">
                  <span className="inline-flex items-center gap-2.5">Find your plan <ArrowDown /></span>
                </Button>
              </div>
            </div>
            <dl className="apx-facts">
              {facts.map(([value, label]) => <div key={label}><dd>{value}</dd><dt className="mono">{label}</dt></div>)}
            </dl>
          </div>
        </main>
      </div>

      <section aria-labelledby="covers-title" className="wrap apx-block">
        <header className="apx-head">
          <p className="mono">What Care covers</p>
          <h2 id="covers-title">Kept running. Kept safe. Kept moving.</h2>
        </header>
        <ol className="care-covers">
          {COVERS.map((c, i) => (
            <li key={c.label} style={{'--k': i} as React.CSSProperties}>
              <div className="care-cover-top">
                <span className="care-icon" aria-hidden>{c.icon}</span>
                <span className="mono num-badge">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <p className="mono">{c.label}</p>
              <h3>{c.title}</h3>
              <ul>{c.items.map((item) => <li key={item}><Check size={14} />{item}</li>)}</ul>
            </li>
          ))}
        </ol>
      </section>

      <section id="planner" aria-labelledby="planner-title" className="wrap apx-block">
        <header className="apx-head">
          <p className="mono">Find your plan</p>
          <h2 id="planner-title">Choose by the hours you’ll need.</h2>
        </header>
        <CarePlanner region={region} />
      </section>

      <section aria-labelledby="compare-title" className="wrap apx-block">
        <header className="apx-head">
          <p className="mono">Side by side</p>
          <h2 id="compare-title">{CARE.name} and {PLUS.name}, line by line.</h2>
        </header>
        <div className="care-compare" role="table" aria-label={`${CARE.name} and ${PLUS.name} compared`}>
          <div className="care-row care-row-head" role="row">
            <span role="columnheader"><span className="sr-only">What’s included</span></span>
            <PlanHead name={CARE.name} price={regionalMoney(CARE.id, CARE.amount)} line={CARE.bestFor} />
            <PlanHead name={PLUS.name} price={regionalMoney(PLUS.id, PLUS.amount)} line={PLUS.bestFor} spotlight />
          </div>
          {COMPARE.map(([label, a, b]) => (
            <div key={label} className="care-row" role="row">
              <span role="rowheader">{label}</span>
              <Cell value={a} plan={CARE.name} />
              <Cell value={b} plan={PLUS.name} spotlight />
            </div>
          ))}
          <div className="care-row care-row-foot" role="row">
            <span role="cell" />
            <span role="cell"><Link href={CONTACT} className="apx-more">Start {CARE.name} <ArrowRight size={14} /></Link></span>
            <span role="cell" data-spotlight><Link href={CONTACT} className="apx-more">Start {PLUS.name} <ArrowRight size={14} /></Link></span>
          </div>
        </div>
      </section>

      <section aria-labelledby="asked-title" className="wrap apx-block">
        <header className="apx-head">
          <p className="mono">Asked before signing up</p>
          <h2 id="asked-title">Four straight answers.</h2>
        </header>
        <dl className="apx-asked">
          {asked.map(([q, a]) => <div key={q}><dt>{q}</dt><dd>{a}</dd></div>)}
        </dl>
      </section>

      <section aria-labelledby="price-title" className="wrap apx-close">
        <p className="mono">{CARE.name} · A month</p>
        <h2 id="price-title">{regionalMoney(CARE.id, CARE.amount)}</h2>
        <div className="apx-close-row">
          <p>{PLUS.name} is {regionalMoney(PLUS.id, PLUS.amount)} a month. Tell us about the site you’d like us to look after.</p>
          <div className="apx-close-go">
            <Button label="Start Care" variant="primary" size="lg" href={CONTACT}>
              <span className="inline-flex items-center gap-2.5">Start Care <ArrowUpRight /></span>
            </Button>
            <Link href="/solutions" className="apx-more">See all pricing <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

/** A small status board for an example site on Care: what the plan watches, drawn as it would read. */
function StatusConsole() {
  return (
    <figure className="care-console fade-up" style={{'--i': 2} as React.CSSProperties} aria-label="An example of a site on Care">
      <div className="care-console-bar">
        <span className="care-live" aria-hidden />
        <span className="care-console-site">yourbusiness.com</span>
        <span className="mono care-console-tag">Example</span>
      </div>
      <div className="care-console-uptime">
        <div className="care-console-row"><span>Uptime monitoring</span><span className="mono">Last 30 days</span></div>
        <div className="care-bars" aria-hidden>
          {Array.from({length: 30}, (_, i) => <i key={i} style={{'--k': i} as React.CSSProperties} />)}
        </div>
      </div>
      <dl className="care-console-list">
        <div><dt>SSL certificate</dt><dd><Dot />Managed</dd></div>
        <div><dt>Security and dependency updates</dt><dd><Dot />Up to date</dd></div>
        <div><dt>Monthly backup</dt><dd><Dot />Taken</dd></div>
        <div className="care-console-hours">
          <dt>Small edits this month</dt>
          <dd>
            <span className="care-meter" aria-hidden><i /></span>
            0.5 of 1 hour
          </dd>
        </div>
      </dl>
      <figcaption className="mono">An example of a site on {CARE.name}</figcaption>
    </figure>
  );
}

function Dot() {
  return <span className="care-dot" aria-hidden />;
}

function PlanHead({name, price, line, spotlight}: {name: string; price: string; line: string; spotlight?: boolean}) {
  return (
    <span role="columnheader" className="care-plan" data-spotlight={spotlight || undefined}>
      {spotlight && <span className="mono care-plan-flag">More hours and reporting</span>}
      <strong>{name}</strong>
      <span className="care-plan-price">{price}<small> a month</small></span>
      <span className="care-plan-line">{line}</span>
    </span>
  );
}

function Cell({value, plan, spotlight}: {value: string | boolean; plan: string; spotlight?: boolean}) {
  return (
    <span role="cell" data-spotlight={spotlight || undefined}>
      <span className="care-cell-plan mono">{plan}</span>
      {value === true ? <span className="care-yes"><Check size={14} /><span className="sr-only">Included</span></span>
        : value === false ? <span className="care-no" aria-label="Not included">—</span>
        : <span className="care-text">{value}</span>}
    </span>
  );
}

function lower(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

function ServerIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="4" width="17" height="6.5" rx="2" /><rect x="3.5" y="13.5" width="17" height="6.5" rx="2" />
      <path d="M7.5 7.25h.01M7.5 16.75h.01M11 7.25h5.5M11 16.75h5.5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3.5 5 6.2v5.3c0 4.3 2.9 7.8 7 9 4.1-1.2 7-4.7 7-9V6.2L12 3.5Z" /><path d="m8.8 12.2 2.2 2.2 4.2-4.4" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 5.5 18.5 9.5M4.5 19.5l1-4.2L15.8 5a2 2 0 0 1 2.8 0l.4.4a2 2 0 0 1 0 2.8L8.7 18.5l-4.2 1Z" />
    </svg>
  );
}
