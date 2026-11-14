'use client';

import {useState} from 'react';
import Link from 'next/link';
import {Button} from '@astryxdesign/core/Button';
import {Popover} from '@astryxdesign/core/Popover';

import {ArrowUpRight, ChevronDown} from '@/components/icons';

// buildLane: the studio's services. Titles, lines, prices and links as botpro's Solutions menu gives them
// (src/lib/nav.ts, with amounts from the price book in src/lib/pricing/plans.ts).
export const BUILD = [
  {href: '/websites', title: 'Websites', body: 'Core, Ascend and Apex. Custom design, no templates.', price: 'From $2,500'},
  {href: '/web-apps', title: 'Web Apps', body: 'Plan it, prove it, then build it. Fixed price per stage.', price: 'Scoping $1,500'},
  {href: '/care', title: 'Care', body: 'Hosting, security updates and small edits, handled.', price: 'From $99/month'},
  {href: '/custom-solutions/ai-assistant', title: 'AI Assistant', body: "Answers visitors' questions, trained on your business.", price: '$2,500 one-time'},
];

// slotLane: name, status, host and line from botpro's src/lib/lanes.ts and the header's product line; the three
// reasons from src/lib/products.ts.
export const SLOT = {
  href: '/products/slotlane',
  line: 'Booking pages on your own domain.',
  features: ['Your booking page on your own domain', 'Google Calendar sync, with Meet or Zoom links', 'One flat price per page, never per seat'],
  meta: 'Coming soon · slotlane.cloud',
};

/** The Solutions menu: one panel laid out as lanes side by side, each divided from the next by a dashed lane line. */
export function SolutionsMenu() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Popover
      label="Solutions"
      isOpen={open}
      onOpenChange={setOpen}
      placement="below"
      alignment="center"
      width="min(940px, calc(100vw - 32px))"
      padding={0}
      content={
        <div className="mega">
          <section className="mega-lane" aria-labelledby="lane-build">
            <header className="mega-head">
              <h2 id="lane-build" className="lane-name">buildLane</h2>
              <Link href="/solutions" onClick={close} className="mega-all">See pricing <ArrowUpRight size={13} /></Link>
            </header>
            <ul className="mega-items">
              {BUILD.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={close} className="mega-item">
                    <span className="title">{item.title}</span>
                    <span className="body">{item.body}</span>
                    <span className="price mono">{item.price}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mega-lane" aria-labelledby="lane-slot">
            <header className="mega-head">
              <h2 id="lane-slot" className="lane-name">slotLane</h2>
            </header>
            <Link href={SLOT.href} onClick={close} className="mega-item mega-product">
              <span className="title">{SLOT.line}</span>
              <ul className="features">
                {SLOT.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <span className="price mono">{SLOT.meta}</span>
            </Link>
          </section>

          <section className="mega-lane mega-soon">
            <p>More lanes opening up soon.</p>
          </section>
        </div>
      }
    >
      <Button label="Solutions" variant="ghost">
        <span className="inline-flex items-center gap-1.5">
          Solutions <ChevronDown size={14} className={open ? 'chev open' : 'chev'} />
        </span>
      </Button>
    </Popover>
  );
}
