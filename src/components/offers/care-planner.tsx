'use client';

import {useId, useState} from 'react';

import {AFTER, money} from '@/lib/pricing';
import {regionalAmount, formatRegionalMoney, type Region} from '@/lib/regional-pricing';

// Which Care plan costs less for the hours of changes a site needs in a month. Every figure comes from the price
// book: each plan's monthly price and included hours, and the hourly rate for work beyond them.
const plan = (id: string) => AFTER.find((p) => p.id === id)!;
const CARE = {name: plan('care').name, price: plan('care').amount, hours: 1};
const PLUS = {name: plan('care-plus').name, price: plan('care-plus').amount, hours: 3};
const RATE = plan('extra-work').amount;
const MAX = 8;

const hrs = (h: number) => `${h % 1 ? h.toFixed(1) : h} ${h === 1 ? 'hour' : 'hours'}`;

/** A slider for the hours of edits a month, and the plan it points to, with the sum shown. */
export function CarePlanner({region = 'us'}: {region?: Region}) {
  const regional = (id: string, amount: number) => regionalAmount(id, amount, region);
  const display = (amount: number) => region === 'in' ? formatRegionalMoney(amount, region) : money(amount);
  const carePlan = {...CARE, price: regional('care', CARE.price)};
  const plusPlan = {...PLUS, price: regional('care-plus', PLUS.price)};
  const rate = regional('extra-work', RATE);
  const [hours, setHours] = useState(1);
  const id = useId();
  const care = carePlan.price + Math.max(0, hours - carePlan.hours) * rate;
  const plus = plusPlan.price + Math.max(0, hours - plusPlan.hours) * rate;
  const pick = care <= plus ? carePlan : plusPlan;
  const extra = Math.max(0, hours - pick.hours);
  const saving = Math.abs(care - plus);

  return (
    <div className="care-planner">
      <div className="care-dial">
        <label htmlFor={id} className="mono">Changes you expect a month</label>
        <output htmlFor={id} className="care-dial-value" aria-live="polite">{hrs(hours)}</output>
        <input
          id={id}
          type="range"
          min={0}
          max={MAX}
          step={0.5}
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          style={{'--fill': `${(hours / MAX) * 100}%`} as React.CSSProperties}
        />
        <div className="care-dial-scale mono" aria-hidden>
          {Array.from({length: MAX + 1}, (_, i) => <span key={i} data-mark={i === CARE.hours || i === PLUS.hours || undefined}>{i}</span>)}
        </div>
      </div>

      <div className="care-verdict" data-plan={pick.name === PLUS.name ? 'plus' : 'care'}>
        <p className="mono">The plan for you</p>
        <h3 key={pick.name}>{pick.name}</h3>
        <p className="care-verdict-sum">
          <strong>{display(pick.price + extra * rate)}</strong> a month
        </p>
        <ul className="care-verdict-lines">
          <li><span>{pick.name}, {hrs(pick.hours)} included</span><span>{display(pick.price)}</span></li>
          {extra > 0 && <li><span>{hrs(extra)} more at {display(rate)} an hour</span><span>{display(extra * rate)}</span></li>}
        </ul>
        <p className="care-verdict-note">
          {saving === 0
            ? `Both plans cost the same here; ${PLUS.name} adds priority support, reports and a design review.`
            : `${display(saving)} a month less than ${pick.name === CARE.name ? PLUS.name : CARE.name} for the same hours.`}
        </p>
      </div>
    </div>
  );
}
