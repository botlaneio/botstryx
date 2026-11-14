import Link from 'next/link';
import {Button} from '@astryxdesign/core/Button';

import {ArrowDown, ArrowRight, ArrowUpRight, Check} from '@/components/icons';
import {SiteFooter} from '@/components/site/site-footer';
import {SiteHeader} from '@/components/site/site-header';

import {EditorDemo} from './editor-demo';
import {PathTimeline, type PathStep} from './path-timeline';
import {SystemStudio} from './system-studio';

// Every word and figure on this page is botpro's: the Ascend page (src/components/catalog/ascend-page.tsx),
// the Ascend offer (src/lib/catalog.ts), the website-ascend plan (src/lib/pricing/plans.ts) and the shared
// process steps (src/lib/process.ts). The sample firm, Northline, is botpro's own example. The two short
// lead-ins in the fit section ("Starting smaller?", "Need signature motion or more than one language?") are this
// site's, pointing at what botpro lists for Core and Apex.
const CONTACT = '/contact?need=website';
const PRICE = '$4,900';

const STATS: [string, string][] = [
  ['12', 'Pages, planned around you'],
  ['1', 'Design system across all of them'],
  ['You', 'Publish without waiting on us'],
  ['3–5', 'Weeks to launch'],
];

const PAGES = ['Home', 'About', 'Services', 'Team', 'Insights', 'Careers', 'Case studies', 'Pricing', 'FAQ', 'Locations', 'Contact', 'Legal'];

const SPECS: [string, string][] = [
  ['Pages', 'Up to 12'],
  ['Design', 'Custom design system across every page'],
  ['Editing', 'Content editor for pages and blog'],
  ['Timeline', '3–5 weeks'],
  ['Revisions', '3 rounds'],
];
const INCLUDES = ['Everything in Core', 'A design system across every page', 'Content editor for pages and blog', 'Integrations: booking, CRM, newsletter'];
const CORE = ['Custom design, no templates', 'Right on every screen', 'Fast-loading', 'Contact form', 'Analytics'];
const EXAMPLES = ['Agency', 'Clinic', 'Law or accounting firm', 'SaaS company site'];

const STEPS: PathStep[] = [
  {title: 'Intro call', body: "You tell us what you need. We tell you honestly whether we're the right fit.", tags: ['Goals', 'Fit', 'Questions']},
  {title: 'Scope and fixed quote', body: 'A written scope, a timeline and one price, agreed before any work starts.', tags: ['Written scope', 'Timeline', 'One price']},
  {title: 'Design', body: 'A custom design you review in rounds, on real content, not lorem ipsum.', tags: ['Real content', 'Review rounds', 'Design system'], note: '3 rounds of revisions'},
  {title: 'Build', body: 'We build it, share progress as we go, and test it on every screen size.', tags: ['Progress updates', 'Every screen', 'Testing']},
  {title: 'Launch', body: 'We put it live, hand over everything, and stay on with Care if you want us to.', tags: ['Go live', 'Handover', 'Care']},
];

const FAQ: [string, string][] = [
  ['How is Ascend different from Core?', 'Core is a focused site of up to five pages that we keep updated for you. Ascend grows to twelve pages, adds a design system and an editor so your team can publish themselves, and connects booking, CRM and newsletter tools.'],
  ['Can we bring our existing content?', 'Yes. We review what you have during scoping and agree what to keep, rework or write fresh before the build begins.'],
  ['Which booking, CRM and newsletter tools do you connect?', 'Most of the common ones, such as Calendly, HubSpot and Mailchimp. We confirm the exact tools, and any subscriptions they need, in your scope.'],
  ['What happens after launch?', "We hand over everything and walk your team through the editor. Hosting, security updates and ongoing edits are available through Care if you'd like us to stay on."],
];

const delay = (i: number) => ({'--i': i}) as React.CSSProperties;

/** The Ascend website package: two hands-on demos of what it adds, then the price, the path and the questions. */
export function AscendPage() {
  return (
    <>
      <div className="stage">
        <div className="scene">
          <SiteHeader />

          <main className="wrap offer-hero">
            <nav aria-label="Breadcrumb" className="crumbs fade-up">
              <Link href="/websites">Websites</Link>
              <span aria-hidden>/</span>
              <span aria-current="page">Ascend</span>
            </nav>

            <p className="kicker mono fade-up"><i />Ascend · The company site</p>

            <h1 className="display">
              <span className="line"><span className="rise" style={delay(0)}>Room to grow.</span></span>
              <span className="line"><span className="rise" style={delay(1)}>Yours to run.</span></span>
            </h1>

            <div className="offer-intro fade-up" style={delay(1)}>
              <p className="lede">
                A complete company website on a design system of its own, with an editor your team actually enjoys using.{' '}
                <strong>Up to twelve pages, connected to the tools you already work in.</strong>
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button label="Start with Ascend" variant="primary" size="lg" href={CONTACT}>
                  <span className="inline-flex items-center gap-2.5">Start with Ascend <ArrowUpRight /></span>
                </Button>
                <Button label="Explore the package" variant="secondary" size="lg" href="#system">
                  <span className="inline-flex items-center gap-2.5">Explore the package <ArrowDown /></span>
                </Button>
              </div>
            </div>

            <div className="min-h-10 flex-1" />

            <dl className="rail spec-rail stats fade-up" style={delay(3)}>
              <div className="rail-item">
                <dt className="idx mono">Ascend</dt>
                <dd className="name">{PRICE}</dd>
                <dd className="price">One-time project</dd>
              </div>
              {STATS.map(([n, label]) => (
                <div className="rail-item" key={label}>
                  <dt className="idx mono">{label}</dt>
                  <dd className="name">{n}</dd>
                </div>
              ))}
            </dl>
          </main>
        </div>
      </div>

      <div className="offer-body">
        <section id="system" aria-labelledby="system-title" className="wrap offer-section">
          <header className="offer-head">
            <p className="mono">Design system · One look, every page</p>
            <h2 id="system-title">A design system of your own.</h2>
            <p>Type, colour, spacing and components, defined once and used everywhere, so page twelve feels as considered as the homepage.</p>
          </header>
          <SystemStudio />
        </section>

        <section aria-labelledby="editor-title" className="wrap offer-section">
          <header className="offer-head">
            <p className="mono">Content editor · Edited by your team</p>
            <h2 id="editor-title">An editor your team will use.</h2>
            <p>Change a headline, publish an article, add a new hire. Your pages and blog are yours to update, the same afternoon.</p>
          </header>
          <EditorDemo />
        </section>

        <section aria-labelledby="adds-title" className="wrap offer-section">
          <header className="offer-head">
            <p className="mono">What Ascend adds</p>
            <h2 id="adds-title">Everything a growing company needs from its website.</h2>
            <p>Ascend takes the craft of Core and gives it the structure, the reach and the independence a company outgrows a small site for.</p>
          </header>

          <div className="adds">
            <article className="add">
              <div className="add-visual pages-grid" aria-hidden>
                {PAGES.map((p, i) => <span key={p} style={delay(i)}><em className="mono">{String(i + 1).padStart(2, '0')}</em>{p}</span>)}
              </div>
              <h3>Up to twelve pages</h3>
              <p>Services, team, insights, careers: the whole company, mapped out in the scope before design begins.</p>
            </article>

            <article className="add">
              <div className="add-visual flow" aria-hidden>
                <div className="flow-form">
                  <span className="mono">Enquiry</span>
                  <i /><i /><i className="short" />
                </div>
                <svg className="flow-lines" viewBox="0 0 100 120" preserveAspectRatio="none">
                  <path d="M0 60 C 50 60, 50 18, 100 18" />
                  <path d="M0 60 L 100 60" />
                  <path d="M0 60 C 50 60, 50 102, 100 102" />
                </svg>
                <div className="flow-tools">
                  <span>Calendly</span>
                  <span>HubSpot</span>
                  <span>Mailchimp</span>
                </div>
              </div>
              <h3>Connected to how you work</h3>
              <p>Booking, CRM and newsletter, wired in, so every enquiry and sign-up lands where your team already looks.</p>
            </article>

            <article className="add">
              <div className="add-visual serp" aria-hidden>
                <div className="serp-query"><i />accounting firm for growing businesses</div>
                <div className="serp-result">
                  <span className="serp-site">northline.example › advisory</span>
                  <b>Northline — advice for what comes next</b>
                  <span>Accounting, tax and planning for companies on the move.</span>
                  <span className="serp-links"><u>Services</u><u>Team</u><u>Insights</u></span>
                </div>
              </div>
              <h3>Built for search, from day one</h3>
              <p>Clean structure, fast pages and the essentials of SEO in place before launch, so you’re found for what you do.</p>
            </article>
          </div>
        </section>

        <section aria-labelledby="included-title" className="wrap offer-section offer-included">
          <div>
            <header className="offer-head stacked">
              <p className="mono">Builds on Core</p>
              <h2 id="included-title">Everything in Core.</h2>
            </header>
            <ol className="outcomes">
              {CORE.map((o, i) => (
                <li key={o}>
                  <span className="mono">0{i + 1}</span>
                  <div><h3>{o}</h3></div>
                </li>
              ))}
            </ol>
          </div>

          <aside aria-label="Ascend package price and scope" className="price-card">
            <div className="price-top">
              <span className="mono">Ascend</span>
              <span className="tag">One-time project</span>
            </div>
            <div>
              <p className="amount">{PRICE}</p>
              <p className="terms">Scope and price agreed before we start.</p>
            </div>
            <dl>
              {SPECS.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
            <ul>
              {INCLUDES.map((item) => <li key={item}><Check size={15} />{item}</li>)}
            </ul>
            <Button label="Start with Ascend" variant="primary" size="lg" href={CONTACT}>
              <span className="inline-flex items-center gap-2.5">Start with Ascend <ArrowRight /></span>
            </Button>
          </aside>
        </section>

        <section aria-labelledby="process-title" className="wrap offer-section">
          <header className="offer-head">
            <p className="mono">From first idea to live</p>
            <h2 id="process-title">A clear path to launch.</h2>
            <p>3–5 weeks, with 3 rounds of design revisions. We agree the timeline after reviewing your scope and content.</p>
          </header>
          <PathTimeline steps={STEPS} />
        </section>

        <section aria-labelledby="fit-title" className="wrap offer-section offer-fit">
          <div>
            <p className="mono">Is Ascend your fit?</p>
            <h2 id="fit-title">An established business that needs a full company site it can update itself.</h2>
            <ul className="chips" aria-label="Good for">
              {EXAMPLES.map((e) => <li key={e}>{e}</li>)}
            </ul>
          </div>
          <div className="fit-links">
            <p>Starting smaller? <Link href="/websites/business-sites">See Core <ArrowUpRight size={13} /></Link></p>
            <p>Need signature motion or more than one language? <Link href="/websites/brand-sites">See Apex <ArrowUpRight size={13} /></Link></p>
            <Link href="/websites" className="more">Compare website packages <ArrowRight size={14} /></Link>
          </div>
        </section>

        <section aria-labelledby="faq-title" className="wrap offer-section offer-faq">
          <header className="offer-head stacked">
            <p className="mono">Questions</p>
            <h2 id="faq-title">Before you start.</h2>
          </header>
          <div className="faq">
            {FAQ.map(([q, a]) => (
              <details key={q}>
                <summary>{q}<i aria-hidden /></summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="ascend-cta" className="wrap offer-section offer-cta">
          <p className="mono">Your next chapter</p>
          <h2 id="ascend-cta">Your company has grown. Let your website catch up.</h2>
          <p>Tell us where the business is heading. We’ll shape the site that takes it there.</p>
          <Button label="Start with Ascend" variant="primary" size="lg" href={CONTACT}>
            <span className="inline-flex items-center gap-2.5">Start with Ascend <ArrowUpRight /></span>
          </Button>
        </section>
      </div>

      <SiteFooter />
    </>
  );
}
