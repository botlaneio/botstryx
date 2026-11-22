import {headers} from 'next/headers';
import {regionForHostname, regionalAmount, formatRegionalMoney} from '@/lib/regional-pricing';
import Link from 'next/link';
import {Button} from '@astryxdesign/core/Button';

import {ArrowDown, ArrowRight, ArrowUpRight, Check} from '@/components/icons';
import {SiteFooter} from '@/components/site/site-footer';
import {SiteHeader} from '@/components/site/site-header';
import {AFTER, money} from '@/lib/pricing';

import {AskLane} from './ask-lane';
import {AssistantDemo, Chat} from './assistant-demo';
import {SCENES} from './assistant-scenes';

// The AI Assistant. Facts are botpro's, through the price book (src/lib/pricing.ts) and the pricing page's
// question about it (src/app/solutions/page.tsx): $2,500 one-time, "answering visitors' questions about your
// business, day and night", its three inclusions, what it's trained on, and that it hands the conversation to you
// when a person is needed. Oak & Ember is an example business; the headlines and notes are this page's own. Lane,
// the assistant in this site's corner, answers from this site's own price book (src/lib/lane.ts).
const CONTACT = '/contact?need=assistant';
const AI = AFTER.find((p) => p.id === 'ai-assistant')!;
const [ON_SITE, TRAINED, HANDS_ON] = AI.includes!;
const SOURCES = ['Your website', 'Services', 'Prices', 'Policies', 'FAQs'];

const FACTS: [string, string][] = [
  [money(AI.amount), 'One-time'],
  ['Day and night', 'Answering visitors'],
  ['A person', 'When one is needed'],
];

const INCLUDED: [string, string][] = [
  [ON_SITE, 'It lives on your site, where your visitors already are, ready the moment someone has a question.'],
  [TRAINED, 'It answers from what your business actually offers and charges, so its answers are yours.'],
  [HANDS_ON, 'When a question needs a person, it passes the enquiry on to you.'],
];

const ASKED: [string, string][] = [
  ['What is the AI Assistant trained on?', 'Your website and your business: your services, prices, policies and common questions. It answers visitors and hands the conversation to you when a person is needed.'],
  ['What happens when it can’t answer?', 'It hands the enquiry to you, so a question that needs a person reaches one.'],
  ['Is it a subscription?', `No. The AI Assistant is ${money(AI.amount)}, one-time.`],
  ['Can I try one first?', 'Yes. Lane, in the corner of this page, is the assistant on our own site. Ask it anything about our services and prices.'],
];

/** The AI Assistant page: what it answers, what it learns from, when it hands over, and a real one to try. */
export async function AssistantPage() {
  const region = regionForHostname((await headers()).get('host')?.split(':')[0] ?? 'botlane.io');
  const display = (id: string, amount: number) => region === 'in' ? formatRegionalMoney(regionalAmount(id, amount, region), region) : money(amount);
  const facts = region === 'in' ? FACTS.map(([v,l], i) => i === 0 ? [display(AI.id, AI.amount), l] as [string,string] : [v,l] as [string,string]).filter(([,l]) => !l.includes('Founding Ten')) : FACTS;
  const asked = region === 'in' ? ASKED.map(([q,a]) => [q, a.replaceAll(money(AI.amount), display(AI.id, AI.amount))] as [string,string]) : ASKED;
  return (
    <div className="apx wa ai">
      <div className="apx-open">
        <SiteHeader />
        <main className="wrap apx-hero">
          <p className="mono apx-tag fade-up"><Link href="/custom-solutions">Custom solutions</Link><span aria-hidden>/</span>{AI.name}<i aria-hidden />{display(AI.id, AI.amount)} one-time</p>

          <div className="care-hero-grid">
            <h1 className="apx-title care-title fp-title">
              <span className="line"><span className="rise" style={{'--i': 0} as React.CSSProperties}>Answers,</span></span>
              <span className="line"><span className="rise" style={{'--i': 1} as React.CSSProperties}>day <em>and night.</em></span></span>
            </h1>
            <div className="ai-hero-chat fade-up" style={{'--i': 2} as React.CSSProperties}>
              <Chat scene={SCENES[1]} />
              <p className="mono pa-cap">Oak &amp; Ember · an example business</p>
            </div>
          </div>

          <div className="apx-lead fade-up" style={{'--i': 3} as React.CSSProperties}>
            <div className="apx-say">
              <p>An assistant on your website that answers visitors’ questions about your business, day and night. It’s trained on your services, prices, policies and FAQs, and hands enquiries to you when a person is needed.</p>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button label="Get an assistant" variant="primary" size="lg" href={CONTACT}>
                  <span className="inline-flex items-center gap-2.5">Get an assistant <ArrowUpRight /></span>
                </Button>
                <Button label="See it answer" variant="ghost" size="lg" href="#conversations">
                  <span className="inline-flex items-center gap-2.5">See it answer <ArrowDown /></span>
                </Button>
              </div>
            </div>
            <dl className="apx-facts">
              {facts.map(([value, label]) => <div key={label}><dd>{value}</dd><dt className="mono">{label}</dt></div>)}
            </dl>
          </div>
        </main>
      </div>

      <section id="conversations" aria-labelledby="conv-title" className="wrap apx-block">
        <header className="apx-head">
          <p className="mono">Four conversations</p>
          <h2 id="conv-title">Ask it what your customers ask you.</h2>
        </header>
        <AssistantDemo />
      </section>

      <section aria-labelledby="trained-title" className="wrap apx-block">
        <header className="apx-head">
          <p className="mono">What it learns from</p>
          <h2 id="trained-title">Trained on your business.</h2>
        </header>
        <div className="ai-flow">
          <ul className="ai-sources">
            {SOURCES.map((s, i) => <li key={s} style={{'--k': i} as React.CSSProperties}><Check size={14} />{s}</li>)}
          </ul>
          <div className="ai-wires" aria-hidden>
            {SOURCES.map((s, i) => <i key={s} style={{'--k': i} as React.CSSProperties} />)}
          </div>
          <div className="ai-core">
            <span className="ai-core-mark" aria-hidden><i /><i /></span>
            <b>Your assistant</b>
            <p>{AI.bestFor}</p>
            <div className="ai-out">
              <span><i className="ai-ok" />Answers visitors</span>
              <span><i className="ai-hand" />Hands on to you</span>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="lane-title" className="wrap apx-block">
        <div className="ai-lane">
          <div>
            <p className="mono">Try a real one</p>
            <h2 id="lane-title">Lane is ours. Ask it anything.</h2>
            <p>The assistant in the corner of this page answers from this site’s own prices and pages. Pick a question, or ask your own.</p>
          </div>
          <AskLane questions={['What does the AI Assistant cost?', 'What is the AI Assistant trained on?', 'How does a web app project work?']} />
        </div>
      </section>

      <section aria-labelledby="included-title" className="wrap apx-block">
        <header className="apx-head">
          <p className="mono">What’s included</p>
          <h2 id="included-title">Three things, done properly.</h2>
        </header>
        <ol className="care-covers ai-included">
          {INCLUDED.map(([name, note], i) => (
            <li key={name}>
              <div className="care-cover-top"><span className="mono num-badge">0{i + 1}</span></div>
              <h3>{name}</h3>
              <p className="ai-note">{note}</p>
            </li>
          ))}
        </ol>
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
        <p className="mono">{AI.name} · One-time</p>
        <h2 id="price-title">{display(AI.id, AI.amount)}</h2>
        <div className="apx-close-row">
          <p>Trained on your business, and on your site day and night. Tell us about the questions you answer most.</p>
          <div className="apx-close-go">
            <Button label="Get an assistant" variant="primary" size="lg" href={CONTACT}>
              <span className="inline-flex items-center gap-2.5">Get an assistant <ArrowUpRight /></span>
            </Button>
            <Link href="/solutions#after-launch" className="apx-more">See all pricing <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
