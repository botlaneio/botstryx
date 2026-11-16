import {SiteFooter} from './site-footer';
import {SiteHeader} from './site-header';

export interface LegalSection {
  id: string;
  title: string;
  body: React.ReactNode;
}

/**
 * A plain reading page for the privacy policy and the terms, after botpro's (src/components/site/legal-page.tsx):
 * the title, when it last changed, a short summary, the sections to jump to, then the sections at a reading width.
 */
export function LegalPage({kicker, title, updated, summary, sections}: {
  kicker: string;
  title: string;
  /** ISO date, e.g. 2026-11-16. */
  updated: string;
  summary: React.ReactNode;
  sections: LegalSection[];
}) {
  const date = new Date(`${updated}T00:00:00Z`).toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'});
  return (
    <div className="apx hub">
      <SiteHeader />
      <main className="wrap legal">
        <header className="legal-head">
          <p className="mono apx-tag">{kicker}<i aria-hidden />Updated <time dateTime={updated}>{date}</time></p>
          <h1>{title}</h1>
          <div className="legal-summary">{summary}</div>
        </header>

        <div className="legal-grid">
          <nav aria-labelledby="legal-contents" className="legal-toc">
            <p id="legal-contents" className="mono">Contents</p>
            <ol>
              {sections.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>)}
            </ol>
          </nav>

          <div className="legal-body">
            {sections.map((s) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`}>
                <h2 id={`${s.id}-title`}>{s.title}</h2>
                {s.body}
              </section>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
