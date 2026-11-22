import {headers} from 'next/headers';
import {regionForHostname} from '@/lib/regional-pricing';
import {Suspense} from 'react';
import type {Metadata} from 'next';

import {BriefForm} from '@/components/contact/brief-form';
import {SiteFooter} from '@/components/site/site-footer';
import {SiteHeader} from '@/components/site/site-header';
import {isNeed} from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Start a project · botLane',
  description: 'Tell us what you’re building. We read every brief ourselves and reply with honest advice.',
};

// What happens after the brief is sent, as botpro's contact page gives it (src/app/contact/page.tsx). The first
// line said "Four quick steps" there; the brief here is three questions on one sheet, so it says that instead.
const AFTER = [
  {title: 'Send your brief', body: 'Three short questions. Two minutes.'},
  {title: 'A call and a written scope', body: 'We talk it through, then send the scope, the timeline and the price.'},
  {title: 'We build it', body: 'Design, build and launch, with progress shared as we go.'},
];

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

type Query = Promise<Record<string, string | string[] | undefined>>;

// A brief can arrive pre-filled, from the homepage's brief box or a "Start a project" link on a package. The
// address is only known per request, so this part streams in while the rest of the page is served ready-made.
async function Brief({searchParams}: {searchParams: Query}) {
  const q = await searchParams;
  const need = one(q.need);
  return <BriefForm initial={{brief: one(q.brief).slice(0, 4000), need: isNeed(need) ? need : ''}} />;
}

export default async function ContactPage({searchParams}: {searchParams: Query}) {
  const region = regionForHostname((await headers()).get('host')?.split(':')[0] ?? 'botlane.io');
  return (
    <div className="ct">
      <SiteHeader />
      <main className="wrap ct-main">
        <div className="ct-lead">
          <p className="mono ct-kicker"><i aria-hidden />Send us a brief</p>
          <h1 className="ct-title">
            <span className="line"><span className="rise" style={{'--i': 0} as React.CSSProperties}>Start a</span></span>
            <span className="line"><span className="rise" style={{'--i': 1} as React.CSSProperties}>project.</span></span>
          </h1>
          <p className="ct-lede fade-up">Tell us about your project. We read every brief ourselves and reply with honest advice.</p>
          {region === 'in' && <p className="ct-lede fade-up">India projects are quoted in INR, with GST additional where applicable. Payments are arranged only after an agreed proposal and invoice. Razorpay online checkout is not yet enabled.</p>}

          <section aria-labelledby="next-title" className="ct-next fade-up" style={{'--i': 1} as React.CSSProperties}>
            <h2 id="next-title" className="mono">What happens next</h2>
            <ol>
              {AFTER.map((s, i) => (
                <li key={s.title}>
                  <span className="mono">0{i + 1}</span>
                  <b>{s.title}</b>
                  <span>{s.body}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="ct-sheet fade-up" style={{'--i': 2} as React.CSSProperties}>
          <Suspense fallback={<div className="ct-wait" />}><Brief searchParams={searchParams} /></Suspense>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
