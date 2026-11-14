'use client';

import {useState} from 'react';
import Link from 'next/link';

import {ArrowRight, ArrowUpRight, Check} from '@/components/icons';
import {AFTER, APPS, FOUNDING, PER, WEBSITES, money, type Plan} from '@/lib/pricing';

const pct = Math.round(FOUNDING.discount * 100);

/** A plan's price. With the Founding Ten switched on, a plan it covers shows the reduced price and the full one struck through. */
function Price({plan, founding}: {plan: Plan; founding: boolean}) {
  const off = founding && plan.founding;
  return (
    <p className="pr-price" data-off={off}>
      {plan.from && <span className="pr-from">From</span>}
      <b>{money(off ? plan.amount * (1 - FOUNDING.discount) : plan.amount)}</b>
      {off && <s aria-label={`was ${money(plan.amount)}`}>{money(plan.amount)}</s>}
      <span className="mono">{PER[plan.per]}</span>
    </p>
  );
}

/** One plan as a column. Its rows line up with the plans beside it. */
function PlanCard({plan, founding, step}: {plan: Plan; founding: boolean; step?: number}) {
  return (
    <article className="pr-plan" data-spot={plan.spotlight}>
      <header>
        <h3>{step !== undefined && <span className="mono">Stage 0{step + 1}</span>}{plan.name}</h3>
        <Price plan={plan} founding={founding} />
      </header>
      <p className="pr-best">{plan.bestFor}</p>
      <dl className="pr-specs">
        {plan.specs?.map(([k, v]) => <div key={k}><dt className="mono">{k}</dt><dd>{v}</dd></div>)}
      </dl>
      <ul className="pr-list">
        {plan.includes?.map((x) => <li key={x}><Check size={14} />{x}</li>)}
      </ul>
      <footer>
        {plan.terms && <p className="pr-terms">{plan.terms}</p>}
        <Link href={plan.href} className="pr-link">See {plan.name} <ArrowRight size={14} /></Link>
      </footer>
    </article>
  );
}

/** Every price on one page: websites, web apps by stage, and what comes after launch. */
export function PriceBook() {
  const [founding, setFounding] = useState(false);

  return (
    <>
      <div className="wrap"><div className="pr-offer">
        <div>
          <p className="mono"><i aria-hidden />Founding Ten</p>
          <p>{pct}% off website and app builds for our first {FOUNDING.places} clients, until {FOUNDING.ends} or until the places are taken.</p>
        </div>
        <button type="button" role="switch" aria-checked={founding} className="pr-switch" onClick={() => setFounding((v) => !v)}>
          <span className="pr-track" aria-hidden><i /></span>
          Show Founding Ten prices
        </button>
      </div></div>

      <section aria-labelledby="pr-websites" className="wrap pr-block" id="websites">
        <header className="pr-head">
          <p className="mono">01 · Websites</p>
          <h2 id="pr-websites">Three packages, one standard.</h2>
          <p>Core, Ascend and Apex. Custom design, no templates. Website prices are one-time.</p>
        </header>
        <div className="pr-plans">
          {WEBSITES.map((p) => <PlanCard key={p.id} plan={p} founding={founding} />)}
        </div>
      </section>

      <section aria-labelledby="pr-apps" className="wrap pr-block" id="web-apps">
        <header className="pr-head">
          <p className="mono">02 · Web Apps</p>
          <h2 id="pr-apps">Plan it, prove it, then build it.</h2>
          <p>Apps are priced by stage: plan, prove, then build. Fixed price per stage.</p>
        </header>
        <div className="pr-plans pr-stages">
          {APPS.map((p, i) => <PlanCard key={p.id} plan={p} founding={founding} step={i} />)}
        </div>
      </section>

      <section aria-labelledby="pr-after" className="wrap pr-block" id="after-launch">
        <header className="pr-head">
          <p className="mono">03 · After launch</p>
          <h2 id="pr-after">Looked after, if you want it.</h2>
          <p>Hosting, security updates and small edits, handled. Care plans are separate and optional.</p>
        </header>
        <ul className="pr-rows">
          {AFTER.map((p) => (
            <li key={p.id} data-spot={p.spotlight}>
              <div className="pr-row-name">
                <h3>{p.name}</h3>
                <p>{p.bestFor}</p>
              </div>
              <ul className="pr-list">
                {p.includes?.map((x) => <li key={x}><Check size={14} />{x}</li>)}
              </ul>
              <div className="pr-row-price">
                <Price plan={p} founding={false} />
                <Link href={p.href} className="pr-link">{p.id === 'extra-work' ? 'Ask us' : `See ${p.name}`} <ArrowUpRight size={14} /></Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
