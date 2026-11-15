import Link from 'next/link';

import {ArrowRight, Check} from '@/components/icons';
import {APPS, money} from '@/lib/pricing';

/** The three web app stages as cards, with the current one lifted and marked. Shared by the stage pages. */
export function StageFits({here}: {here: string}) {
  const sprint = APPS[0];
  return (
    <>
      <ol className="fp-stages">
        {APPS.map((p, i) => {
          const time = p.specs?.find(([k]) => k === 'Timeline')?.[1] ?? '';
          const isHere = p.id === here;
          return (
            <li key={p.id} data-here={isHere || undefined}>
              <span className="mono num-badge">0{i + 1}</span>
              <h3>{isHere ? p.name : <Link href={p.href}>{p.name}</Link>}</h3>
              <p className="mono fp-stage-price">{p.from ? 'From ' : ''}{money(p.amount)}</p>
              <p>{p.bestFor}</p>
              {isHere && <p className="mono fp-here">You are here · {/^\d/.test(time) ? time : `Timeline ${time.toLowerCase()}`}</p>}
              {p.id === sprint.id && <p className="fp-credit"><Check size={14} />{sprint.terms}</p>}
            </li>
          );
        })}
      </ol>
      <Link href="/web-apps" className="apx-more fp-all">See all three stages <ArrowRight size={14} /></Link>
    </>
  );
}
