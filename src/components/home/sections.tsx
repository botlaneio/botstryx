import Link from 'next/link';
import {siGmail, siGooglecalendar, siGooglemeet, siHubspot, siNotion, siStripe, siZoom, type SimpleIcon} from 'simple-icons';

import {BotMark} from '@/components/brand/bot-mark';
import {DotField} from '@/components/hero/dot-field';
import {NanoAssemble} from '@/components/hero/nano-assemble';
import {ArrowRight, ArrowUpRight, Check} from '@/components/icons';
import {Cover} from '@/components/insights/cover';
import {postsByDate, summary} from '@/lib/insights';
import {AFTER, APPS, FOUNDING, PER, WEBSITES, money} from '@/lib/pricing';

import {BuildSequence} from './build-sequence';
import {ScrollProgress} from './scroll-progress';

// Everything on the homepage below the first screen. The words are botpro's homepage (src/app/page.tsx,
// src/lib/home-copy.ts, src/components/home/principle-keys.tsx); the figures come from the price book
// (src/lib/pricing.ts). Only slotLane is shown under products, as in this site's menus.

const css = (vars: Record<string, string | number>) => vars as React.CSSProperties;
const pct = Math.round(FOUNDING.discount * 100);

/** A section's heading: a small label, then two short sentences, the second set quieter. */
function Head({id, kicker, first, second, children}: {id: string; kicker: string; first: string; second: string; children?: React.ReactNode}) {
  return (
    <header className="hm-head hm-in">
      <p className="mono hm-kicker"><i aria-hidden />{kicker}</p>
      <h2 id={id}>{first} <span>{second}</span></h2>
      {children}
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* 1. How we build: four principles that ink in as the page scrolls            */
/* -------------------------------------------------------------------------- */

const PRINCIPLES: [string, string][] = [
  ['Considered.', 'Custom design, no templates.'],
  ['Purposeful.', 'The right build for your goals.'],
  ['Connected.', 'Your tools. Your way of working.'],
  ['Supported.', 'Care that continues after launch.'],
];

function Principles() {
  let i = 0;
  const lines = PRINCIPLES.map(([key, body]) => ({key, at: i++, words: body.split(' ').map((w) => ({w, at: i++}))}));
  return (
    <section aria-labelledby="hm-principles" className="wrap hm-block hm-creed">
      <div className="hm-creed-side hm-in">
        <p className="mono hm-kicker"><i aria-hidden />How we build</p>
        <h2 id="hm-principles">Aesthetic polish. <span>Technical permanence.</span></h2>
      </div>
      <ScrollProgress from={0.82} to={0.52} className="hm-ink">
        <p style={css({'--n': i})}>
          {lines.map((line) => (
            <span key={line.key} className="hm-ink-line">
              <b className="w" style={css({'--i': line.at})}>{line.key}</b>{' '}
              {line.words.map(({w, at}) => <span key={at}><span className="w" style={css({'--i': at})}>{w}</span>{' '}</span>)}
            </span>
          ))}
        </p>
      </ScrollProgress>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. What we build: four tiles, each drawn from the price book                */
/* -------------------------------------------------------------------------- */

const care = AFTER.find((p) => p.id === 'care')!;
const assistant = AFTER.find((p) => p.id === 'ai-assistant')!;

/** Three website packages as stacked browser windows. */
function SitesArt() {
  return (
    <div className="hm-art hm-sites" aria-hidden>
      {WEBSITES.map((p, i) => (
        <div key={p.id} className="hm-sheet" style={css({'--k': i})}>
          <div className="hm-sheet-bar"><i /><i /><i /><b>{p.name}</b><span className="mono">{money(p.amount)}</span></div>
          <div className="hm-sheet-body">
            <u style={css({'--w': '62%'})} /><u style={css({'--w': '44%'})} />
            <div><s /><s /><s /></div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** The three stages of an app build, as steps going up. */
function AppsArt() {
  return (
    <div className="hm-art hm-stages" aria-hidden>
      {APPS.map((p, i) => (
        <div key={p.id} className="hm-stage-row" style={css({'--k': i})}>
          <span className="mono">0{i + 1}</span>
          <b>{p.name}</b>
          <span className="mono">{p.from ? 'From ' : ''}{money(p.amount)}</span>
        </div>
      ))}
    </div>
  );
}

/** Care as a month of uptime checks, and what the plan looks after. */
function CareArt() {
  return (
    <div className="hm-art hm-care" aria-hidden>
      <div className="hm-uptime">{Array.from({length: 30}, (_, i) => <i key={i} style={css({'--k': i})} />)}</div>
      <ul>
        {care.includes!.slice(1, 4).map((x) => <li key={x}><Check size={13} />{x}</li>)}
      </ul>
    </div>
  );
}

/** A conversation in outline: a visitor asks, the assistant answers, and hands over when a person is needed. */
function AssistantArt() {
  return (
    <div className="hm-art hm-chat" aria-hidden>
      <div className="hm-bubble"><u style={css({'--w': '9rem'})} /></div>
      <div className="hm-bubble me"><u style={css({'--w': '12rem'})} /><u style={css({'--w': '7rem'})} /></div>
      <div className="hm-bubble"><u style={css({'--w': '6rem'})} /></div>
      <div className="hm-bubble me typing"><i /><i /><i /></div>
      <p className="hm-handover"><ArrowUpRight size={13} />{assistant.includes![2]}</p>
    </div>
  );
}

const BUILDS = [
  {name: 'Websites', href: '/websites', price: `From ${money(WEBSITES[0].amount)}`, body: 'A considered first impression. A clear next step. Custom-designed around your business.', art: <SitesArt />, wide: true},
  {name: 'Web Apps', href: '/web-apps', price: `Scoping ${money(APPS[0].amount)}`, body: 'From a first working version to a full product. Planned and priced in stages.', art: <AppsArt />},
  {name: 'Care', href: '/care', price: `From ${money(care.amount)}/month`, body: 'Hosting, security updates, and small edits. The everyday upkeep, taken care of.', art: <CareArt />},
  {name: 'AI Assistant', href: '/custom-solutions/ai-assistant', price: `${money(assistant.amount)} ${PER[assistant.per]}`, body: 'Help visitors find answers, with an assistant trained on your business.', art: <AssistantArt />, wide: true},
];

function Builds() {
  return (
    <section aria-labelledby="hm-build" className="wrap hm-block">
      <Head id="hm-build" kicker="What we build" first="The right build." second="For where you’re headed.">
        <p>Custom websites, web apps, and ongoing support. A clear scope and an agreed price before each project begins.</p>
        <Link href="/solutions" className="apx-more">Explore services &amp; pricing <ArrowRight size={14} /></Link>
      </Head>
      <div className="hm-builds">
        {BUILDS.map((b, i) => (
          <Link key={b.href} href={b.href} className="hm-tile hm-in" data-wide={b.wide} style={css({'--d': i % 2})}>
            {b.art}
            <div className="hm-tile-say">
              <span className="mono">0{i + 1}</span>
              <h3>{b.name}</h3>
              <p>{b.body}</p>
              <span className="hm-tile-foot"><b>{b.price}</b><ArrowUpRight size={18} /></span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. Works with your tools: the apps on one line, your site in the middle     */
/* -------------------------------------------------------------------------- */

// Only apps botpro's work really connects to (src/components/home/stack-orbit.tsx). The marks are from Simple
// Icons, each in its owner's colour; each mark belongs to its owner.
const TOOLS_ABOVE: [string, SimpleIcon][] = [['Gmail', siGmail], ['Stripe', siStripe], ['HubSpot', siHubspot], ['Google Calendar', siGooglecalendar]];
const TOOLS_BELOW: [string, SimpleIcon][] = [['Notion', siNotion], ['Zoom', siZoom], ['Google Meet', siGooglemeet]];

/** An app's mark in its own colour. A black mark follows the text colour instead, so it shows in the dark theme. */
function Mark({icon}: {icon: SimpleIcon}) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden fill={icon.hex === '000000' ? 'currentColor' : '#' + icon.hex}>
      <path d={icon.path} />
    </svg>
  );
}

function Tools() {
  return (
    <section aria-labelledby="hm-tools" className="wrap hm-block">
      <Head id="hm-tools" kicker="Works with your tools" first="A new website." second="A familiar way of working.">
        <p>Keep the tools your team knows. We connect your website or app to your calendar, payments, CRM, and other business systems, so information gets where it needs to go.</p>
        <Link href="/custom-solutions" className="apx-more">Explore custom solutions <ArrowRight size={14} /></Link>
      </Head>
      <div className="hm-bus hm-in">
        <ul className="hm-bus-row up">{TOOLS_ABOVE.map(([t, icon], i) => <li key={t} title={t} style={css({'--k': i})}><Mark icon={icon} /><span className="hm-tool-name">{t}</span></li>)}</ul>
        <div className="hm-bus-line" aria-hidden>
          <span className="hm-hub"><BotMark size={34} animated={false} />Your website</span>
        </div>
        <ul className="hm-bus-row down">{TOOLS_BELOW.map(([t, icon], i) => <li key={t} title={t} style={css({'--k': i + 4})}><Mark icon={icon} /><span className="hm-tool-name">{t}</span></li>)}</ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. Our own products: slotLane                                               */
/* -------------------------------------------------------------------------- */

const SLOT_FEATURES = ['A booking page on your own domain', 'Google Calendar, with Meet or Zoom links', 'Team scheduling, polls and routing forms'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
// Which times each day offers in the drawing; the picked one is marked in the markup below.
const TIMES = ['09:00', '10:30', '13:00', '14:30', '16:00'];
const OPEN = [[0, 2, 3], [1, 2, 4], [0, 1, 3, 4], [2, 3], [0, 1, 4]];

function Products() {
  return (
    <section aria-labelledby="hm-products" className="wrap hm-block">
      <Head id="hm-products" kicker="Our own products" first="Our ideas." second="Out in the world.">
        <p>We also design and build our own software.</p>
      </Head>
      <Link href="/products/slotlane" className="hm-lane hm-in">
        <div className="hm-lane-say">
          <p className="mono"><i aria-hidden />slotLane<span>30 days free</span></p>
          <h3>A time that works. Without the back-and-forth.</h3>
          <p>Share your link. Let people choose a time. Find the meeting in your calendar.</p>
          <ul>{SLOT_FEATURES.map((f) => <li key={f}><Check size={14} />{f}</li>)}</ul>
          <span className="hm-lane-go">See slotLane <ArrowRight size={14} /></span>
        </div>
        <div className="hm-cal" aria-hidden>
          {DAYS.map((d, di) => (
            <div key={d} className="hm-cal-day">
              <span className="mono">{d}</span>
              {TIMES.map((t, ti) => (
                <i key={t} data-open={OPEN[di].includes(ti)} data-pick={di === 2 && ti === 1 ? 'a' : di === 3 && ti === 3 ? 'b' : di === 0 && ti === 2 ? 'c' : undefined}>{t}</i>
              ))}
            </div>
          ))}
        </div>
      </Link>
      <p className="hm-note mono">More lanes opening up soon.</p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. How we work: five steps down a line that fills as you read               */
/* -------------------------------------------------------------------------- */

const PROCESS = [
  {title: 'Start with a brief', body: 'Tell us what you need and what you want to achieve. We’ll review it and work through the questions with you.', tags: ['Goals', 'Requirements', 'Fit']},
  {title: 'Agree on the plan', body: 'A written scope, a timeline, and a fixed quote. You know what’s included before we begin.', tags: ['Scope', 'Timeline', 'Price']},
  {title: 'See the design', body: 'Your content. Your brand. A design you can review and refine before we build.', tags: ['Content', 'Design', 'Feedback']},
  {title: 'Follow the build', body: 'See the progress as your project comes together, with testing and opportunities to review along the way.', tags: ['Development', 'Updates', 'Testing']},
  {title: 'Make it live', body: 'Launch, handover, and the information you need to take ownership. Add Care for ongoing upkeep.', tags: ['Launch', 'Handover', 'Support']},
];

function Process() {
  return (
    <section aria-labelledby="hm-process" className="wrap hm-block hm-how">
      <div className="hm-how-side">
        <Head id="hm-process" kicker="How we work" first="A clear process." second="Room for your input.">
          <Link href="/contact" className="apx-more">Start with a brief <ArrowRight size={14} /></Link>
        </Head>
      </div>
      <ScrollProgress from={0.62} to={0.62} className="hm-steps-wrap">
        <ol className="hm-steps" style={css({'--n': PROCESS.length})}>
          {PROCESS.map((s, i) => (
            <li key={s.title} style={css({'--i': i})}>
              <span className="hm-step-no mono">0{i + 1}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <ul>{s.tags.map((t) => <li key={t} className="mono">{t}</li>)}</ul>
              </div>
            </li>
          ))}
        </ol>
      </ScrollProgress>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 6. A few true numbers                                                       */
/* -------------------------------------------------------------------------- */

const NUMBERS: {value: number; suffix?: string; label: string}[] = [
  {value: 0, label: 'templates. Every design is custom.'},
  {value: WEBSITES.length, label: 'website packages, each at a fixed price'},
  {value: PROCESS.length, label: 'steps from first brief to launch'},
  {value: pct, suffix: '%', label: `off for our first ${FOUNDING.places} clients`},
];

function Numbers() {
  return (
    <section aria-label="In numbers" className="wrap hm-numbers">
      <dl>
        {NUMBERS.map((n, i) => (
          <div key={n.label} className="hm-in">
            <dt>{n.label}</dt>
            <dd><NanoAssemble delay={i * 160}>{n.value}{n.suffix}</NanoAssemble></dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 7. From the journal                                                         */
/* -------------------------------------------------------------------------- */

function Journal() {
  const notes = postsByDate().slice(0, 3).map(summary);
  return (
    <section aria-labelledby="hm-journal" className="wrap hm-block">
      <Head id="hm-journal" kicker="Insights" first="Thought through." second="Written down.">
        <Link href="/blog" className="apx-more">Read all insights <ArrowRight size={14} /></Link>
      </Head>
      <div className="hm-notes">
        {notes.map((n, i) => (
          <Link key={n.slug} href={`/blog/${n.slug}`} className="hm-entry hm-in" style={css({'--d': i})}>
            <span className="hm-entry-art"><Cover kind={n.cover} seed={n.slug} /></span>
            <span className="mono">{n.topic} · {n.minutes} min read</span>
            <h3>{n.title}</h3>
            <span className="hm-entry-date">{n.date}<ArrowUpRight size={15} /></span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 8. The close                                                                */
/* -------------------------------------------------------------------------- */

function Close() {
  return (
    <section aria-labelledby="hm-close" className="wrap hm-end">
      <div className="hm-close hm-in">
        <DotField />
        <div className="hm-close-say">
          <Link href="/solutions" className="hm-offer">
            <span className="mono">Founding Ten</span>{pct}% off for our first {FOUNDING.places} clients <ArrowRight size={14} />
          </Link>
          <h2 id="hm-close"><NanoAssemble>Let’s make it <br />happen.</NanoAssemble></h2>
          <p>Tell us what you have in mind. We’ll help you find the right place to start.</p>
          <div className="hm-close-go">
            <Link href="/contact" className="hm-go">Start a project <ArrowRight /></Link>
            <Link href="/solutions" className="hm-go quiet">Explore services &amp; pricing</Link>
          </div>
        </div>
        <div className="hm-close-bot"><BotMark size={300} title="The botLane bot" /></div>
      </div>
    </section>
  );
}

export function HomeSections() {
  return (
    <div className="hm">
      <BuildSequence />
      <Principles />
      <Builds />
      <Tools />
      <Products />
      <Process />
      <Numbers />
      <Journal />
      <Close />
    </div>
  );
}
