import Link from 'next/link';
import {headers} from 'next/headers';
import {regionForHostname} from '@/lib/regional-pricing';
import {Button} from '@astryxdesign/core/Button';

import {Logo} from '@/components/brand/logo';
import {ArrowRight} from '@/components/icons';

import {ThemeToggle} from './theme-toggle';

// Words, links and the company name as botpro's footer gives them (src/components/site/site-footer.tsx,
// src/lib/catalog.ts, src/lib/site.ts). The first column is headed buildLane and the second lists slotLane
// alone, as the menus on this site do.
// botpro's line reads "An independent studio for…"; "design and engineering" was added here at the owner's request.
const DESCRIPTION = (
  <>
    An independent <span className="u">design and engineering studio</span> for websites and software, made with uncommon care.
  </>
);
const COMPANY = 'BotLane LLC';

const COLUMNS = [
  {
    id: 'build',
    heading: 'buildLane',
    links: [
      {href: '/websites', label: 'Websites'},
      {href: '/web-apps', label: 'Web Apps'},
      {href: '/custom-solutions', label: 'Custom Solutions'},
      {href: '/care', label: 'Care'},
      {href: '/solutions', label: 'Pricing'},
    ],
  },
  {
    id: 'lanes',
    heading: 'Products',
    links: [{href: '/products/slotlane', label: 'slotLane', soon: false}],
    note: 'More lanes opening up soon.',
  },
  {
    id: 'studio',
    heading: 'Studio',
    links: [
      {href: '/solutions#process', label: 'How we work'},
      {href: '/solutions#faq', label: 'Questions'},
      {href: '/blog', label: 'Insights'},
      {href: '/contact', label: 'Contact'},
    ],
  },
  // Not in botpro: added at the owner's request. None of these pages exists yet, here or on the live site.
  {
    id: 'resources',
    heading: 'Resources',
    links: [
      {href: '/docs', label: 'Documentation'},
      {href: '/help', label: 'Knowledge base'},
      {href: '/changelog', label: 'Changelog'},
    ],
  },
  {
    id: 'account',
    heading: 'Account',
    links: [
      {href: '/account?mode=signin', label: 'Sign in'},
      {href: '/account', label: 'Create an account'},
    ],
  },
];

/** The year for the copyright line. */
async function year() {
  return new Date().getFullYear();
}

/**
 * The foot of every page: the studio in one line with the main action, the whole site in five columns, the
 * small print, and the wordmark set very large and faint along the bottom edge.
 */
export async function SiteFooter() {
  const region = regionForHostname((await headers()).get('host')?.split(':')[0] ?? 'botlane.io');
  const operatingEntity = region === 'in' ? 'Vedanta Ventures · botLane India' : COMPANY;
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-lead">
            <Link href="/" aria-label="botLane, home" className="rounded-sm outline-offset-4">
              <Logo size={30} />
            </Link>
            <p>{DESCRIPTION}</p>
            <Button label="Start a project" variant="primary" size="lg" href="/contact">
              <span className="inline-flex items-center gap-2.5">Start a project <ArrowRight /></span>
            </Button>
          </div>

          <div className="footer-cols">
            {COLUMNS.map((col) => (
              <nav key={col.id} aria-labelledby={`footer-${col.id}`}>
                <h2 id={`footer-${col.id}`} className="mono">{col.heading}</h2>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href}>
                        {l.label}
                        {'soon' in l && l.soon && <span className="soon mono">Soon</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
                {col.note && <p className="note">{col.note}</p>}
              </nav>
            ))}
          </div>
        </div>

        <div className="footer-base">
          <div className="legal">
            <span>© {await year()} {operatingEntity}</span>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
          <div className="meta">
            <span className="mono">Design and engineering studio</span>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* The wordmark, huge and faint, sitting on the bottom edge so its feet are cut off. */}
      <div aria-hidden className="footer-mark">botLane</div>
    </footer>
  );
}
