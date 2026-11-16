import Link from 'next/link';
import {Button} from '@astryxdesign/core/Button';

import {ArrowDown, ArrowRight, ArrowUpRight, Check} from '@/components/icons';
import {SiteFooter} from '@/components/site/site-footer';
import {SiteHeader} from '@/components/site/site-header';

// slotLane, botLane's booking and scheduling app. Every line comes from the product itself (botlaneio/slotlane):
// its homepage (landing/app/landing-sections.jsx: the headline, lede, steps, plan and questions), its README
// (features, integrations and the per-seat plan) and its in-app guide (docs/lane-prompt.md: workflows, polls,
// routing forms). botpro's older product page priced slotLane per booking page; the product now prices per
// person, so this page follows the product.
const APP = 'https://slotlane.cloud';
const PRICE = {month: 10, year: 8, yearTotal: 96, trialDays: 30, trialPeople: 5};

const FACTS: [string, string][] = [
  [`$${PRICE.month}`, 'Per person, a month'],
  [`$${PRICE.year}`, 'Billed yearly'],
  [`${PRICE.trialDays} days`, 'Free, no card needed'],
];

const STEPS: [string, string][] = [
  ['Set your hours', 'Weekly hours with several ranges a day, days off and your timezone. Add buffers, minimum notice and how far ahead people can book.'],
  ['Create a meeting type', 'A title, a length, a location and any questions you want answered. Google Meet, Zoom, a link or in person.'],
  ['Share the link', 'Guests see times in their own timezone, pick one, and get a confirmation with a calendar invite.'],
];

const FEATURES: [string, string][] = [
  ['Your own domain', 'Guests book at book.yourcompany.com. You prove the domain is yours with one DNS record, and the page is served over HTTPS. Your logo heads the page and every confirmation email.'],
  ['Team scheduling', 'Add the people guests can book, each with their own hours, calendar and sign-in. Round robin shares bookings fairly across the team; collective events need everyone free at once.'],
  ['Routing forms', 'Ask guests a few questions first, then send each one to the right booking page, another web page or a short message.'],
  ['Meeting polls', 'Propose a few times, share a link, let people say which work for them, then book the winning time with everyone who can make it.'],
  ['Workflows', 'Your own automatic emails: a reminder a day before, a thank-you after, or a note when someone cancels, to the guest, the host or both.'],
  ['Paid bookings', 'Charge for a session with Stripe, or by UPI, card or netbanking through Razorpay. The guest pays when they book, and gets a receipt.'],
  ['The tools you already use', 'Check Google Calendar for conflicts, add every booking to it, and put a Google Meet or Zoom link in the invite.'],
  ['Confirmations and reminders', 'Both sides get the confirmation by email, then a reminder before the meeting, by email, SMS or WhatsApp. Guests can reschedule or cancel from the link.'],
  ['On your website', 'Link to your booking page, or embed it in your own site with one line of code. Webhooks work with Zapier, Make and n8n.'],
  ['No double bookings', 'The final check runs inside one database transaction, so two people can never take the same time, even when they click at once.'],
];

const PLAN = [
  'Unlimited event types and bookings',
  'Team scheduling: round robin and collective',
  'Routing forms, polls and workflows',
  'Paid bookings with Stripe or Razorpay',
  'Google Calendar, Google Meet and Zoom',
  'Email, SMS and WhatsApp reminders',
  'Your own domain, logo and colours',
];

const ASKED: [string, string][] = [
  ['Do guests need an account?', 'No. Guests open your booking link, choose an available time and enter their details.'],
  ['Which timezone will guests see?', 'Available times are shown in the guest’s timezone. You set your availability in your own timezone.'],
  ['Can guests reschedule or cancel?', 'Yes. The confirmation email includes a link to manage the booking, with options to reschedule or cancel.'],
  ['What happens after the 30-day trial?', `Nothing is deleted. You can stay on the free plan for one person, or subscribe at $${PRICE.month} a month for each person who can be booked ($${PRICE.year} billed yearly). Subscribing brings back your team, round robin, collective events, routing forms and paid bookings.`],
  ['Who counts as a person?', 'Anyone guests can book, you included. People you deactivate don’t count, and you can change the number of seats at any time.'],
  ['Can I move over from Calendly?', 'Yes. Paste a Calendly access token and slotLane imports your event types and weekly hours. You pick what to bring over before anything is written.'],
];

/** The slotLane page: what it is, three steps to a first booking, what's inside, the one plan, and questions. */
export function SlotLanePage() {
  return (
    <div className="apx hub sl">
      <div className="apx-open">
        <SiteHeader />
        <main className="wrap apx-hero">
          <p className="mono apx-tag fade-up">Solutions<span aria-hidden>/</span>slotLane<i aria-hidden />slotlane.cloud</p>

          <h1 className="apx-title hub-title">
            <span className="line"><span className="rise" style={{'--i': 0} as React.CSSProperties}>Your time.</span></span>
            <span className="line"><span className="rise" style={{'--i': 1} as React.CSSProperties}>Your <em>domain.</em></span></span>
          </h1>

          <div className="apx-lead fade-up" style={{'--i': 2} as React.CSSProperties}>
            <div className="apx-say">
              <p>A booking page that feels like yours. Your guests pick a time. slotLane takes care of the invitation.</p>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button label="Try it free" variant="primary" size="lg" href={APP}>
                  <span className="inline-flex items-center gap-2.5">Try it free <ArrowUpRight /></span>
                </Button>
                <Button label="See how it works" variant="ghost" size="lg" href="#how">
                  <span className="inline-flex items-center gap-2.5">See how it works <ArrowDown /></span>
                </Button>
              </div>
            </div>
            <dl className="apx-facts">
              {FACTS.map(([value, label]) => <div key={label}><dd>{value}</dd><dt className="mono">{label}</dt></div>)}
            </dl>
          </div>
        </main>
      </div>

      <section id="how" aria-labelledby="how-title" className="wrap apx-block">
        <header className="apx-head">
          <p className="mono">From sign-up to your first booking</p>
          <h2 id="how-title">A little setup. A clearer calendar.</h2>
        </header>
        <ol className="apx-run cs-run">
          {STEPS.map(([title, body], i) => (
            <li key={title}>
              <span className="mono num-badge">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="inside-title" className="wrap apx-block">
        <header className="apx-head">
          <p className="mono">What’s inside</p>
          <h2 id="inside-title">Your name. On every step.</h2>
        </header>
        <ol className="apx-ledger">
          {FEATURES.map(([title, body], i) => (
            <li key={title}>
              <span className="mono num-badge">{String(i + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="pricing" aria-labelledby="plan-title" className="wrap apx-block">
        <header className="apx-head">
          <p className="mono">Pricing</p>
          <h2 id="plan-title">One plan. Priced per person.</h2>
        </header>
        <div className="cs-offer">
          <div className="cs-offer-say">
            <p className="cs-pain">Try everything free for {PRICE.trialDays} days, no card needed. Then it’s free for one person, or ${PRICE.month} a month for each person on your team.</p>
            <p><strong>Just you?</strong> Stay on the free plan: unlimited bookings, calendar sync and video links, for one person.</p>
          </div>
          <div className="cs-offer-card">
            <p className="mono">slotLane · {PRICE.trialDays} days free</p>
            <p className="ws-price"><b>${PRICE.month}</b> <span className="mono">per person a month</span></p>
            <p className="cs-sub">or ${PRICE.year} a month, billed yearly (${PRICE.yearTotal} a person)</p>
            <ul>
              {PLAN.map((x) => <li key={x}><Check size={15} />{x}</li>)}
            </ul>
            <Button label="Start your free trial" variant="primary" href={APP}>
              <span className="inline-flex items-center gap-2">Start your free trial <ArrowUpRight size={14} /></span>
            </Button>
          </div>
        </div>
      </section>

      <section aria-labelledby="asked-title" className="wrap apx-block">
        <header className="apx-head">
          <p className="mono">Questions</p>
          <h2 id="asked-title">Before you share the link.</h2>
        </header>
        <dl className="apx-asked">
          {ASKED.map(([q, a]) => <div key={q}><dt>{q}</dt><dd>{a}</dd></div>)}
        </dl>
      </section>

      <section aria-labelledby="close-title" className="wrap apx-block">
        <div className="hub-pair">
          <div className="hub-card hub-card-ink">
            <p className="mono">slotlane.cloud</p>
            <h2 id="close-title">Make time for what matters.</h2>
            <p>Set up your booking page in a few minutes. {PRICE.trialDays} days free, no card needed.</p>
            <Button label="Try it free" variant="primary" size="lg" href={APP}>
              <span className="inline-flex items-center gap-2.5">Try it free <ArrowUpRight /></span>
            </Button>
          </div>
          <Link href="/docs" className="hub-card">
            <p className="mono">Documentation</p>
            <p className="hub-card-title">How slotLane works, step by step.</p>
            <p>Booking pages, availability, calendars and reminders, explained.</p>
            <span className="apx-more">Read the docs <ArrowRight size={14} /></span>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
