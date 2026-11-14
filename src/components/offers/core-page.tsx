import Link from 'next/link';
import {Button} from '@astryxdesign/core/Button';

import {ArrowDown, ArrowRight, ArrowUpRight, Check} from '@/components/icons';
import {SiteFooter} from '@/components/site/site-footer';
import {SiteHeader} from '@/components/site/site-header';

import {PageWalkthrough, type SitePage} from './page-explorer';
import {PathTimeline, type PathStep} from './path-timeline';

// Every word and figure on this page is botpro's: the Core page (src/components/catalog/core-page.tsx), the
// Core offer (src/lib/catalog.ts), the website-core plan (src/lib/pricing/plans.ts) and the shared process
// steps (src/lib/process.ts).
const CONTACT = '/contact?need=website';
const PRICE = '$2,500';

const PAGES: SitePage[] = [
  {id: 'home', name: 'Home', title: 'Make the first impression count.', body: 'A clear introduction to your business, what you offer, and the next step.'},
  {id: 'about', name: 'About', title: 'Put people behind the business.', body: 'Your story, your approach, and the reasons someone should choose you.'},
  {id: 'services', name: 'Services', title: 'Make your offer easy to understand.', body: 'Explain what you do in the language your customers use.'},
  {id: 'choice', name: 'Your choice', title: 'Room for what makes you different.', body: 'A project, a location, a focused service, or another page your business needs.'},
  {id: 'contact', name: 'Contact', title: 'Turn interest into a conversation.', body: 'A simple contact form that brings enquiries straight to your inbox.'},
];

const OUTCOMES = [
  {title: 'Designed around your business', body: 'Drawn from a blank page around what you do, so it looks like you and no one else.'},
  {title: 'Right on every phone', body: 'Laid out for small screens as carefully as large ones, and built to load fast.'},
  {title: 'Ready to be found', body: 'The search basics set up from day one, so search engines can read and list every page.'},
  {title: 'Enquiries straight to you', body: 'A contact form that sends every enquiry to your inbox.'},
  {title: 'See who visits', body: 'Analytics set up, so you can see how many people come and what they read.'},
];

const SPECS: [string, string][] = [
  ['Pages', 'Up to 5'],
  ['Design', 'Custom, no templates'],
  ['Editing', 'Text changes made by us'],
  ['Timeline', '2–3 weeks'],
  ['Revisions', '2 rounds'],
];

const INCLUDES = ['Custom design, no templates', 'Mobile-ready and fast-loading', 'Basic SEO', 'Contact form', 'Analytics'];
const EXAMPLES = ['Personal brand', 'Local business', 'A landing page with a few pages'];

const STEPS: PathStep[] = [
  {title: 'Intro call', body: "You tell us what you need. We tell you honestly whether we're the right fit.", tags: ['Goals', 'Fit', 'Questions']},
  {title: 'Scope and fixed quote', body: 'A written scope, a timeline and one price, agreed before any work starts.', tags: ['Written scope', 'Timeline', 'One price']},
  {title: 'Design', body: 'A custom design you review in rounds, on real content, not lorem ipsum.', tags: ['Real content', 'Review rounds', 'Design system'], note: '2 rounds of revisions'},
  {title: 'Build', body: 'We build it, share progress as we go, and test it on every screen size.', tags: ['Progress updates', 'Every screen', 'Testing']},
  {title: 'Launch', body: 'We put it live, hand over everything, and stay on with Care if you want us to.', tags: ['Go live', 'Handover', 'Care']},
];

const delay = (i: number) => ({'--i': i}) as React.CSSProperties;

/** The Core website package: what it is, the five pages, what's included and the price, how it runs, who it fits. */
export function CorePage() {
  return (
    <>
      <div className="stage">
        <div className="scene">
          <SiteHeader />

          <main className="wrap offer-hero">
            <nav aria-label="Breadcrumb" className="crumbs fade-up">
              <Link href="/websites">Websites</Link>
              <span aria-hidden>/</span>
              <span aria-current="page">Core</span>
            </nav>

            <p className="kicker mono fade-up"><i />Core · Your first proper website</p>

            <h1 className="display">
              <span className="line"><span className="rise" style={delay(0)}>Small site.</span></span>
              <span className="line"><span className="rise" style={delay(1)}>Strong first <br className="md:hidden" />impression.</span></span>
            </h1>

            <div className="offer-intro fade-up" style={delay(1)}>
              <p className="lede">
                A custom website that makes your business clear, credible, and easy to contact.{' '}
                <strong>Everything you need to get online properly, in up to five pages.</strong>
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button label="Start with Core" variant="primary" size="lg" href={CONTACT}>
                  <span className="inline-flex items-center gap-2.5">Start with Core <ArrowUpRight /></span>
                </Button>
                <Button label="Explore the package" variant="secondary" size="lg" href="#scope">
                  <span className="inline-flex items-center gap-2.5">Explore the package <ArrowDown /></span>
                </Button>
              </div>
            </div>

            <div className="min-h-10 flex-1" />

            {/* The package at a glance: the price, then the plan's own figures. */}
            <dl className="rail spec-rail fade-up" style={delay(3)}>
              <div className="rail-item">
                <dt className="idx mono">Core</dt>
                <dd className="name">{PRICE}</dd>
                <dd className="price">One-time project</dd>
              </div>
              {SPECS.filter(([k]) => k !== 'Editing').map(([k, v]) => (
                <div className="rail-item" key={k}>
                  <dt className="idx mono">{k}</dt>
                  <dd className="name">{v}</dd>
                </div>
              ))}
            </dl>
          </main>
        </div>
      </div>

      <div className="offer-body">
        <section id="scope" aria-labelledby="scope-title" className="wrap offer-section">
          <header className="offer-head">
            <p className="mono">A small site, thought through</p>
            <h2 id="scope-title">Five pages.<br />One clear story.</h2>
            <div>
              <p>We plan the pages around your business. Here’s one way a Core site could come together.</p>
              <p className="aside">An example structure, not a template. Your final page list is agreed in the scope.</p>
            </div>
          </header>
          <PageWalkthrough
            pages={PAGES}
            caption="One business. Every screen."
            disclaimer="Illustrative design · not client work"
            cta={
              <>
                {/* The owner's own offer, confirmed by them on 14 November 2026: 10% off a Core website. It is not in
                    botpro's price book, which has only Founding Ten (20% off for the first 10 clients). */}
                <Button label="Get your Core website today at a 10% discount" variant="primary" size="lg" href={CONTACT}>
                  <span className="inline-flex items-center gap-2.5">Get your Core website today <ArrowUpRight /></span>
                </Button>
                <p className="offer-line"><span className="mono">10% discount</span></p>
              </>
            }
          />
        </section>

        <section aria-labelledby="included-title" className="wrap offer-section offer-included">
          <div>
            <header className="offer-head stacked">
              <p className="mono">The details that make it work</p>
              <h2 id="included-title">More than a good-looking homepage.</h2>
            </header>
            <ol className="outcomes">
              {OUTCOMES.map((o, i) => (
                <li key={o.title}>
                  <span className="mono">0{i + 1}</span>
                  <div>
                    <h3>{o.title}</h3>
                    <p>{o.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <aside aria-label="Core package price and scope" className="price-card">
            <div className="price-top">
              <span className="mono">Core</span>
              <span className="tag">One-time project</span>
            </div>
            <div>
              <p className="amount">{PRICE}</p>
              <p className="terms">Scope and price agreed before we start.</p>
            </div>
            <dl>
              {SPECS.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
            <ul>
              {INCLUDES.map((item) => <li key={item}><Check size={15} />{item}</li>)}
            </ul>
            <Button label="Let’s plan your website" variant="primary" size="lg" href={CONTACT}>
              <span className="inline-flex items-center gap-2.5">Let’s plan your website <ArrowRight /></span>
            </Button>
          </aside>
        </section>

        <section aria-labelledby="process-title" className="wrap offer-section">
          <header className="offer-head">
            <p className="mono">From first idea to live</p>
            <h2 id="process-title">A clear path to launch.</h2>
            <p>2–3 weeks, with 2 rounds of design revisions. We agree the timeline after reviewing your scope and content.</p>
          </header>
          <PathTimeline steps={STEPS} />
        </section>

        <section aria-labelledby="fit-title" className="wrap offer-section offer-fit">
          <div>
            <p className="mono">Is Core your fit?</p>
            <h2 id="fit-title">Start focused. Leave room to grow.</h2>
            <p>A new business, a consultant or a single product getting online properly.</p>
            <ul className="chips" aria-label="Good for">
              {EXAMPLES.map((e) => <li key={e}>{e}</li>)}
            </ul>
          </div>
          <div className="fit-links">
            <p>Need a content editor, a blog, or more pages? <Link href="/websites/company-sites">Explore Ascend <ArrowUpRight size={13} /></Link></p>
            <p>Hosting, security updates and ongoing edits are available separately through <Link href="/care">Care</Link>.</p>
            <Link href="/websites" className="more">Compare website packages <ArrowRight size={14} /></Link>
          </div>
        </section>

        <section aria-labelledby="core-cta" className="wrap offer-section offer-cta">
          <p className="mono">Your next chapter</p>
          <h2 id="core-cta">Give your business a place of its own.</h2>
          <p>Tell us what you do and what your website needs to achieve. We’ll work out the right scope together.</p>
          <Button label="Start with Core" variant="primary" size="lg" href={CONTACT}>
            <span className="inline-flex items-center gap-2.5">Start with Core <ArrowUpRight /></span>
          </Button>
        </section>
      </div>

      <SiteFooter />
    </>
  );
}
