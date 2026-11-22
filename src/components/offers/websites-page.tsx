import Link from 'next/link';
import {headers} from 'next/headers';
import {regionForHostname, regionalAmount, formatRegionalMoney} from '@/lib/regional-pricing';
import {Button} from '@astryxdesign/core/Button';

import {ArrowDown, ArrowRight, ArrowUpRight, Check} from '@/components/icons';
import {SiteFooter} from '@/components/site/site-footer';
import {SiteHeader} from '@/components/site/site-header';
import {AFTER, FOUNDING, WEBSITES, money} from '@/lib/pricing';

// The Websites hub. The words are botpro's websites page (src/app/websites/page.tsx): the headline, the lede,
// each package's tagline and "fit" line, the side-by-side rows and the two closing cards. Prices, specs,
// inclusions and "best for" lines come from this site's price book (src/lib/pricing.ts).
const CONTACT = '/contact?need=website';
const CARE = AFTER.find((p) => p.id === 'care')!;
const pct = Math.round(FOUNDING.discount * 100);

const WORDS: Record<string, {tagline: string; fit: string}> = {
  'website-core': {tagline: 'A first website that does the business justice.', fit: 'Getting online properly'},
  'website-ascend': {tagline: 'A complete company site, yours to run.', fit: 'Growing, and the team needs control'},
  'website-apex': {tagline: 'The website as the experience.', fit: 'Launching something exceptional'},
};

type Cell = boolean | string;
const ROWS: [string, [string, Cell, Cell, Cell][]][] = [
  ['Design', [
    ['Custom design, no templates', true, true, true],
    ['Right on every screen, fast-loading', true, true, true],
    ['A design system across every page', false, true, true],
    ['Signature motion and interactions', false, false, true],
  ]],
  ['Content', [
    ['Pages', 'Up to 5', 'Up to 12', 'Scoped to you'],
    ['Who edits it', 'We do', 'Your team', 'Your team'],
    ['Blog', false, true, true],
    ['Structured content: case studies, docs, changelog', false, false, true],
    ['Multiple languages', false, false, 'If needed'],
  ]],
  ['Growth', [
    ['Contact form and analytics', true, true, true],
    ['Search essentials', 'Basic SEO', 'Basic SEO', 'Advanced SEO'],
    ['Booking, CRM and newsletter integrations', false, true, true],
    ['A performance budget', false, false, true],
  ]],
  ['The project', [
    ['Timeline', '2–3 weeks', '3–5 weeks', '5–8 weeks'],
    ['Design revisions', '2 rounds', '3 rounds', '4 rounds'],
  ]],
];

const spec = (id: string, key: string) => WEBSITES.find((p) => p.id === id)?.specs?.find(([k]) => k === key)?.[1] ?? '';

/** The Websites hub: the three packages side by side, every difference row by row, and where to go next. */
export async function WebsitesPage() {
  const region = regionForHostname((await headers()).get('host')?.split(':')[0] ?? 'botlane.io');
  const regionalMoney = (id: string, amount: number) => region === 'in' ? formatRegionalMoney(regionalAmount(id, amount, region), region) : money(amount);
  return (
    <div className="apx hub">
      <div className="apx-open">
        <SiteHeader />
        <main className="wrap apx-hero">
          <p className="mono apx-tag fade-up">Solutions<span aria-hidden>/</span>Websites<i aria-hidden />From {regionalMoney(WEBSITES[0].id, WEBSITES[0].amount)}</p>

          <h1 className="apx-title hub-title">
            <span className="line"><span className="rise" style={{'--i': 0} as React.CSSProperties}>Three ways</span></span>
            <span className="line"><span className="rise" style={{'--i': 1} as React.CSSProperties}>to be <em>seen.</em></span></span>
          </h1>

          <div className="apx-lead fade-up" style={{'--i': 2} as React.CSSProperties}>
            <div className="apx-say">
              <p>Every one designed from a blank page around your business, built to load fast and read beautifully on every screen. The difference is how far it goes.</p>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button label="Start a project" variant="primary" size="lg" href={CONTACT}>
                  <span className="inline-flex items-center gap-2.5">Start a project <ArrowUpRight /></span>
                </Button>
                <Button label="Compare them" variant="ghost" size="lg" href="#compare">
                  <span className="inline-flex items-center gap-2.5">Compare them <ArrowDown /></span>
                </Button>
              </div>
            </div>
            <dl className="apx-facts">
              {WEBSITES.map((p) => <div key={p.id}><dd>{regionalMoney(p.id, p.amount)}</dd><dt className="mono">{p.name}</dt></div>)}
            </dl>
          </div>
        </main>
      </div>

      <section aria-labelledby="packs-title" className="wrap apx-block">
        <header className="apx-head">
          <p className="mono">The packages</p>
          <h2 id="packs-title">Pick where the business is today.</h2>
        </header>
        <ol className="ws-packs">
          {WEBSITES.map((p, i) => {
            const w = WORDS[p.id];
            return (
              <li key={p.id} data-spotlight={p.spotlight || undefined}>
                <p className="mono ws-fit"><span className="num-badge">0{i + 1}</span>{w.fit}</p>
                <h3><Link href={p.href}>{p.name}</Link></h3>
                <p className="ws-tagline">{w.tagline}</p>
                <p className="ws-price"><b>{regionalMoney(p.id, p.amount)}</b> <span className="mono">one-time</span></p>
                <p className="mono ws-meta">{spec(p.id, 'Pages')} pages · {spec(p.id, 'Timeline')}</p>
                <ul>
                  {(p.includes ?? []).slice(0, 4).map((x) => <li key={x}><Check size={15} />{x}</li>)}
                </ul>
                <p className="ws-best">{p.bestFor}</p>
                <Link href={p.href} className="apx-more">About {p.name} <ArrowRight size={14} /></Link>
              </li>
            );
          })}
        </ol>
        <p className="ws-founding">
          <span className="mono">The Founding Ten</span>
          Our first {FOUNDING.places} clients get {pct}% off website builds, until {FOUNDING.ends} or until the places are taken.
        </p>
      </section>

      <section id="compare" aria-labelledby="compare-title" className="wrap apx-block">
        <header className="apx-head">
          <p className="mono">Side by side</p>
          <h2 id="compare-title">Every difference, in one place.</h2>
        </header>
        <div className="ws-table-wrap">
          <table className="ws-table">
            <caption className="sr-only">Core, Ascend and Apex compared</caption>
            <thead>
              <tr>
                <th scope="col"><span className="sr-only">Feature</span></th>
                {WEBSITES.map((p) => (
                  <th key={p.id} scope="col">
                    <Link href={p.href}>{p.name}</Link>
                    <span className="mono">{regionalMoney(p.id, p.amount)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            {ROWS.map(([group, rows]) => (
              <tbody key={group}>
                <tr className="ws-group"><th colSpan={4} scope="colgroup" className="mono">{group}</th></tr>
                {rows.map(([what, ...vals]) => (
                  <tr key={what}>
                    <th scope="row">{what}</th>
                    {vals.map((v, i) => (
                      <td key={i}>
                        {v === true ? <><Check size={17} /><span className="sr-only">Included</span></> : v === false ? <><span className="ws-no" aria-hidden>–</span><span className="sr-only">Not included</span></> : v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </section>

      <section aria-labelledby="next-title" className="wrap apx-block">
        <div className="hub-pair">
          <div className="hub-card hub-card-ink">
            <p className="mono">Not sure yet?</p>
            <h2 id="next-title">Tell us about the business. We’ll point you to the right one.</h2>
            <Button label="Start a project" variant="primary" size="lg" href={CONTACT}>
              <span className="inline-flex items-center gap-2.5">Start a project <ArrowUpRight /></span>
            </Button>
          </div>
          <Link href="/care" className="hub-card">
            <p className="mono">After launch</p>
            <p className="hub-card-title">Care keeps it fast, safe and current.</p>
            <p>Hosting, security updates, backups and small edits, handled every month. Optional, and separate from the build. From {regionalMoney(CARE.id, CARE.amount)} a month.</p>
            <span className="apx-more">About Care <ArrowRight size={14} /></span>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
