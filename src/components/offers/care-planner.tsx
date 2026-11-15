'use client';

import {useId, useState} from 'react';

import {AFTER, money} from '@/lib/pricing';

// Which Care plan costs less for the hours of changes a site needs in a month. Every figure comes from the price
// book: each plan's monthly price and included hours, and the hourly rate for work beyond them.
const plan = (id: string) => AFTER.find((p) => p.id === id)!;
const CARE = {name: plan('care').name, price: plan('care').amount, hours: 1};
const PLUS = {name: plan('care-plus').name, price: plan('care-plus').amount, hours: 3};
const RATE = plan('extra-work').amount;
const MAX = 8;

const cost = (p: typeof CARE, h: number) => p.price + Math.max(0, h - p.hours) * RATE;
const hrs = (h: number) => `${h % 1 ? h.toFixed(1) : h} ${h === 1 ? 'hour' : 'hours'}`;

/** A slider for the hours of edits a month, and the plan it points to, with the sum shown. */
export function CarePlanner() {
  const [hours, setHours] = useState(1);
  const id = useId();
  const care = cost(CARE, hours);
  const plus = cost(PLUS, hours);
  const pick = care <= plus ? CARE : PLUS;
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

      <div className="care-verdict" data-plan={pick === PLUS ? 'plus' : 'care'}>
        <p className="mono">The plan for you</p>
        <h3 key={pick.name}>{pick.name}</h3>
        <p className="care-verdict-sum">
          <strong>{money(cost(pick, hours))}</strong> a month
        </p>
        <ul className="care-verdict-lines">
          <li><span>{pick.name}, {hrs(pick.hours)} included</span><span>{money(pick.price)}</span></li>
          {extra > 0 && <li><span>{hrs(extra)} more at {money(RATE)} an hour</span><span>{money(extra * RATE)}</span></li>}
        </ul>
        <p className="care-verdict-note">
          {saving === 0
            ? `Both plans cost the same here; ${PLUS.name} adds priority support, reports and a design review.`
            : `${money(saving)} a month less than ${pick === CARE ? PLUS.name : CARE.name} for the same hours.`}
        </p>
      </div>
    </div>
  );
}
