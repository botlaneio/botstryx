'use client';

import {memo, useRef, useState} from 'react';
import Link from 'next/link';
import {Button} from '@astryxdesign/core/Button';
import {IconButton} from '@astryxdesign/core/IconButton';
import {Kbd} from '@astryxdesign/core/Kbd';
import {SegmentedControl, SegmentedControlItem} from '@astryxdesign/core/SegmentedControl';
import {TextArea} from '@astryxdesign/core/TextArea';

import {SiteHeader} from '@/components/site/site-header';
import {ArrowRight, ArrowUp, ArrowUpRight} from '@/components/icons';

import {usePrompt} from './stage';
import {NanoHeadline} from './nano-headline';
import {HeroOrbit} from './orbit';

// What Botlane builds. Names, links and price labels as botpro's Solutions menu gives them (src/lib/nav.ts,
// with amounts from the price book in src/lib/pricing/plans.ts).
const BUILDS = [
  {name: 'Websites', price: 'From $2,500', href: '/websites'},
  {name: 'Web Apps', price: 'Scoping $1,500', href: '/web-apps'},
  {name: 'Care', price: 'From $99/month', href: '/care'},
  {name: 'AI Assistant', price: '$2,500 one-time', href: '/custom-solutions/ai-assistant'},
];

// The headline: the first line stays, and the second transforms into each of these in turn, looping. The first phrase is the
// one screen readers, search engines and visitors who turn motion off get. The orbit (orbit.tsx) has one card for each,
// in the same order.
const HEADLINE = 'We design and build';
const PHRASES = [
  'Websites that convert.',
  'Web apps that scale.',
  'Booking systems that just work.',
  'Dashboards your team actually uses.',
  'Products that outlast the launch.',
];

const NEEDS = [
  {id: 'website', label: 'Website'},
  {id: 'web-app', label: 'Web app'},
  {id: 'care', label: 'Care'},
  {id: 'not-sure', label: 'Help me decide'},
];

const delay = (i: number) => ({'--i': i}) as React.CSSProperties;

export const Scene = memo(function Scene() {
  return (
    <div className="scene">
      <SiteHeader />
      <Hero />
    </div>
  );
});

function Hero() {
  // Which phrase the headline is on, and so which card the orbit brings to the front.
  const [front, setFront] = useState(0);
  return (
    <main className="wrap flex flex-1 flex-col">
      <div className="fade-up pt-[clamp(20px,6.5vh,84px)]">
        <Link href="/solutions" className="eyebrow">
          <span className="mono">Founding Ten</span>
          20% off for our first 10 clients
          <ArrowRight size={14} />
        </Link>
      </div>

      <NanoHeadline staticText={HEADLINE} phrases={PHRASES} onTurn={setFront} className="mt-[clamp(36px,7vh,88px)]" />

      {/* Beside the words, what we build circles the logo; the card at the front is the one the headline names. */}
      <div className="hero-split mt-[clamp(28px,5vh,60px)]">
        <div className="hero-lede fade-up" style={delay(1)}>
          <p className="lede">
            Custom design and engineering, <strong>from first idea to life after launch.</strong>
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            <Button label="Start a project" variant="primary" size="lg" href="/contact">
              <span className="inline-flex items-center gap-2.5">Start a project <ArrowRight /></span>
            </Button>
            <Button label="See pricing" variant="secondary" size="lg" href="/solutions" />
          </div>
        </div>

        <HeroOrbit front={front} />

        <div className="hero-brief fade-up" style={delay(2)} data-nano-build>
          <Prompt />
        </div>
      </div>

      <div className="min-h-14 flex-1" />

      <nav aria-label="What we build" className="rail fade-up" style={delay(3)}>
        {BUILDS.map((item, i) => (
          <Link key={item.href} href={item.href} className="rail-item" data-nano-build>
            <span className="idx mono">0{i + 1}</span>
            <ArrowUpRight className="arrow" />
            <span className="name">{item.name}</span>
            <span className="price">{item.price}</span>
          </Link>
        ))}
      </nav>
    </main>
  );
}

/**
 * The brief box: a plain GET form to /contact, so it works before any script loads. The brief and the chosen
 * need arrive as ?brief= and ?need=.
 */
function Prompt() {
  const {brief, setBrief, need, setNeed, example} = usePrompt();
  const form = useRef<HTMLFormElement>(null);

  return (
    <form
      id="hm-brief"
      ref={form}
      action="/contact"
      method="get"
      className="prompt"
      onKeyDown={(e) => {
        // Enter sends, as in any prompt box; Shift and Enter makes a new line.
        if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && (e.target as HTMLElement).tagName === 'TEXTAREA') {
          e.preventDefault();
          form.current?.requestSubmit();
        }
      }}
    >
      <div className="prompt-head">
        <span className="mono inline-flex items-center gap-2"><i className="dot" />What do you have in mind?</span>
      </div>

      <TextArea
        label="What do you have in mind?"
        isLabelHidden
        htmlName="brief"
        rows={3}
        size="lg"
        width="100%"
        value={brief}
        onChange={setBrief}
        placeholder={example || ' '}
        enterKeyHint="send"
      />

      <div className="prompt-foot">
        {/* One selector for the four needs: the chosen one is marked by a pill that slides between them. */}
        <SegmentedControl label="What you need" size="sm" value={need ?? ''} onChange={setNeed}>
          {NEEDS.map((n) => (
            <SegmentedControlItem key={n.id} value={n.id} label={n.label} />
          ))}
        </SegmentedControl>
        {need && <input type="hidden" name="need" value={need} />}
        <div className="prompt-send">
          <span className="hidden items-center gap-2 sm:inline-flex"><Kbd keys="enter" /> to send</span>
          <IconButton label="Send your brief" type="submit" variant="primary" icon={<ArrowUp />} />
        </div>
      </div>
    </form>
  );
}
