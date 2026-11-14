'use client';

import {useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Button} from '@astryxdesign/core/Button';
import {Drawer} from '@astryxdesign/core/Drawer';

import {Logo} from '@/components/brand/logo';
import {ArrowRight, ArrowUpRight, GitHubMark, GoogleMark, Mail, MicrosoftMark} from '@/components/icons';

import {Hamburger} from './hamburger';
import {BUILD, SLOT} from './solutions-menu';

const delay = (i: number) => ({'--i': i}) as React.CSSProperties;

// The ways in. botpro's account page is /account, opening on sign-up, with ?mode=signin for sign-in; none of
// the providers is connected to anything yet, so every button leads to that page.
const SIGN_IN = '/account?mode=signin';
const PROVIDERS = [
  {name: 'Google', icon: <GoogleMark />},
  {name: 'GitHub', icon: <GitHubMark />},
  {name: 'Microsoft', icon: <MicrosoftMark />},
  {name: 'Email', icon: <Mail />},
];

type LaneId = 'build' | 'slot';

// Pages that carry an offer of their own, where the Founding Ten line would be a second, different discount.
// The Core page offers 10% off.
const OWN_OFFER = ['/websites/business-sites'];

// The packages inside Websites and Web Apps: names and page addresses from botpro's src/lib/catalog.ts, prices
// from its price book (src/lib/pricing/plans.ts). Care and AI Assistant have nothing beneath them.
const PACKAGES: Record<string, {all: string; items: {href: string; name: string; price: string}[]}> = {
  '/websites': {
    all: 'All Websites',
    items: [
      {href: '/websites/business-sites', name: 'Core', price: '$2,500 one-time'},
      {href: '/websites/company-sites', name: 'Ascend', price: '$4,900 one-time'},
      {href: '/websites/brand-sites', name: 'Apex', price: '$7,900 one-time'},
    ],
  },
  '/web-apps': {
    all: 'All Web Apps',
    items: [
      {href: '/web-apps/scoping-sprint', name: 'Scoping sprint', price: '$1,500 one-time'},
      {href: '/web-apps/mvp', name: 'MVP development', price: '$9,500 one-time'},
      {href: '/web-apps/full-product', name: 'Full product build', price: 'From $18,000 one-time'},
    ],
  },
};

// The icon in front of each entry. The two lanes' icons have a part that moves when the lane is unfolded
// (.lift and .slot, animated in globals.css from the row's aria-expanded).
const ico = {width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, className: 'ico'};

/** buildLane: four blocks. Unfolded, the top right one lifts away and turns blue, as the square does in the logo. */
const BuildIcon = () => (
  <svg {...ico}>
    <rect x="3" y="3" width="6" height="6" rx="1.4" />
    <rect x="3" y="11" width="6" height="6" rx="1.4" />
    <rect x="11" y="11" width="6" height="6" rx="1.4" />
    <rect className="lift" x="11" y="3" width="6" height="6" rx="1.4" />
  </svg>
);

/** slotLane: a calendar. Unfolded, a slot on it fills in. */
const SlotIcon = () => (
  <svg {...ico}>
    <rect x="3" y="4" width="14" height="13" rx="2.5" />
    <path d="M3 8h14M7 2.5v3M13 2.5v3" />
    <rect className="slot" x="6" y="10.25" width="4.5" height="4" rx="1" />
  </svg>
);

const LINK_ICONS: Record<string, React.ReactNode> = {
  // Products: a box.
  '/products': <svg {...ico}><path d="M10 2.5l6.5 3.6v7.8L10 17.5l-6.5-3.6V6.1z" /><path d="M3.5 6.1L10 9.8l6.5-3.7M10 9.8v7.7" /></svg>,
  // Pricing: a price tag.
  '/solutions': <svg {...ico}><path d="M3 4.5v5.1a1.5 1.5 0 0 0 .44 1.06l6.4 6.4a1.5 1.5 0 0 0 2.12 0l4.6-4.6a1.5 1.5 0 0 0 0-2.12l-6.4-6.4A1.5 1.5 0 0 0 9.1 3.5H4a1 1 0 0 0-1 1z" /><circle cx="6.75" cy="7.25" r="1" /></svg>,
  // Insights: a page of writing.
  '/blog': <svg {...ico}><path d="M5.5 2.75h6l3.5 3.5v9.5a1.5 1.5 0 0 1-1.5 1.5h-8a1.5 1.5 0 0 1-1.5-1.5v-11.5a1.5 1.5 0 0 1 1.5-1.5z" /><path d="M11.5 2.75v3.5H15M7 10h6M7 13.25h4" /></svg>,
  // Contact: a speech bubble.
  '/contact': <svg {...ico}><path d="M4.5 3.75h11a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5H9.5L6 16.75v-3H4.5a1.5 1.5 0 0 1-1.5-1.5v-7a1.5 1.5 0 0 1 1.5-1.5z" /></svg>,
};

/**
 * The menu on small screens. The button sits in the header; the menu is a panel that slides in from the right
 * over two thirds of the screen, while the page behind steps back like the card beneath it in a stack.
 * It opens on five entries only; buildLane and slotLane each unfold to show what is inside, one at a time.
 */
export function MobileMenu({links}: {links: {label: string; href: string}[]}) {
  const [open, setOpen] = useState(false);
  const [lane, setLaneOnly] = useState<LaneId | null>(null);
  // Which of Websites or Web Apps is unfolded inside buildLane, by its address.
  const [pack, setPack] = useState<string | null>(null);
  const setLane = (next: LaneId | null) => {
    setLaneOnly(next);
    setPack(null);
  };
  const close = () => setOpen(false);
  // Marks the entry for the page being viewed.
  const pathname = usePathname();
  const here = (href: string) => (pathname === href ? ('page' as const) : undefined);
  // Every opening starts from the five entries, with nothing unfolded.
  const onOpenChange = (next: boolean) => {
    if (next) setLane(null);
    setOpen(next);
  };

  return (
    <>
      <Hamburger className="md:hidden" isOpen={open} onClick={() => onOpenChange(!open)} label={open ? 'Close menu' : 'Open menu'} />

      <Drawer isOpen={open} onOpenChange={onOpenChange} label="Menu" side="end" width="66.667vw" padding={0}>
        <div className="mnav">
          <div className="mnav-top">
            <Link href="/" onClick={close} aria-label="botLane, home" aria-current={here('/')} className="mnav-logo">
              <Logo size={26} />
            </Link>
            <Hamburger isOpen={open} onClick={close} label="Close menu" />
          </div>

          <nav aria-label="Menu">
            <ul className="mnav-list">
              <li style={delay(0)}>
                <Fold id="build" name="buildLane" icon={<BuildIcon />} lane={lane} setLane={setLane}>
                  <ul>
                    {BUILD.map((item) => {
                      const packages = PACKAGES[item.href];
                      if (!packages) {
                        return (
                          <li key={item.href}>
                            <Link href={item.href} onClick={close} aria-current={here(item.href)} className="mnav-item">
                              <span className="title">{item.title}</span>
                              <span className="price mono">{item.price}</span>
                            </Link>
                          </li>
                        );
                      }
                      // Websites and Web Apps unfold once more, to the packages inside them.
                      const isOpen = pack === item.href;
                      const panel = `mnav-pack-${item.href.slice(1)}`;
                      return (
                        <li key={item.href}>
                          <button type="button" className="mnav-item mnav-sub" aria-expanded={isOpen} aria-controls={panel} onClick={() => setPack(isOpen ? null : item.href)}>
                            <span className="title">{item.title}</span>
                            <span className="price mono">{item.price}</span>
                            <i className="plus" aria-hidden />
                          </button>
                          <div id={panel} className="mnav-fold" data-open={isOpen} inert={!isOpen}>
                            <ul className="mnav-packs">
                              {packages.items.map((pk) => (
                                <li key={pk.href}>
                                  <Link href={pk.href} onClick={close} aria-current={here(pk.href)} className="mnav-pack">
                                    <span>{pk.name}</span>
                                    <span className="price mono">{pk.price}</span>
                                  </Link>
                                </li>
                              ))}
                              <li>
                                <Link href={item.href} onClick={close} aria-current={here(item.href)} className="mnav-pack all">{packages.all} <ArrowUpRight size={12} /></Link>
                              </li>
                            </ul>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <Link href="/solutions" onClick={close} aria-current={here('/solutions')} className="mnav-more">See pricing <ArrowUpRight size={13} /></Link>
                </Fold>
              </li>
              <li style={delay(1)}>
                <Fold id="slot" name="slotLane" icon={<SlotIcon />} lane={lane} setLane={setLane}>
                  <Link href={SLOT.href} onClick={close} aria-current={here(SLOT.href)} className="mnav-item">
                    <span className="title">{SLOT.line}</span>
                    <span className="price mono">{SLOT.meta}</span>
                  </Link>
                  <p className="mnav-soon">More lanes opening up soon.</p>
                </Fold>
              </li>
              {links.map((item, i) => (
                <li key={item.href} style={delay(i + 2)}>
                  <Link href={item.href} onClick={close} aria-current={here(item.href)} className="mnav-row">{LINK_ICONS[item.href]}<span className="label">{item.label}</span></Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mnav-foot" style={delay(links.length + 2)}>
            {/* The Founding Ten offer, as the hero words it, kept beside the action it supports. */}
            {!OWN_OFFER.includes(pathname) && (
              <Link href="/solutions" onClick={close} className="mnav-offer">
                <span className="mono">Founding Ten</span>
                20% off for our first 10 clients
              </Link>
            )}
            <Button label="Start a project" variant="primary" size="lg" href="/contact" onClick={close}>
              <span className="inline-flex items-center gap-2.5">Start a project <ArrowRight /></span>
            </Button>

            {/* Two by two. "Sign in with" is said once, above, so each button needs only its mark and name. */}
            <div className="mnav-signin">
              <p id="mnav-signin" className="mono">Sign in with</p>
              <ul aria-labelledby="mnav-signin">
                {PROVIDERS.map((p) => (
                  <li key={p.name}>
                    <Link href={SIGN_IN} onClick={close} className="signin" aria-label={`Sign in with ${p.name}`}>
                      {p.icon}
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mnav-signup">
              New to botLane? <Link href="/account" onClick={close}>Create an account</Link>
            </p>
            <p className="mnav-legal">
              <Link href="/privacy" onClick={close} aria-current={here('/privacy')}>Privacy</Link>
              <Link href="/terms" onClick={close} aria-current={here('/terms')}>Terms</Link>
            </p>
          </div>
        </div>
      </Drawer>
    </>
  );
}

/** One lane in the menu: a row that unfolds what is inside it. Opening one folds the other. */
function Fold({id, name, icon, lane, setLane, children}: {
  id: LaneId;
  name: string;
  icon: React.ReactNode;
  lane: LaneId | null;
  setLane: (next: LaneId | null) => void;
  children: React.ReactNode;
}) {
  const isOpen = lane === id;
  return (
    <>
      <button
        type="button"
        className="mnav-row"
        aria-expanded={isOpen}
        aria-controls={`mnav-${id}`}
        onClick={() => setLane(isOpen ? null : id)}
      >
        {icon}
        <span className="label">{name}</span>
        <i className="plus" aria-hidden />
      </button>
      <div id={`mnav-${id}`} className="mnav-fold" data-open={isOpen} inert={!isOpen}>
        <div>{children}</div>
      </div>
    </>
  );
}
