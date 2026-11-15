import Link from 'next/link';
import {Button} from '@astryxdesign/core/Button';

import {ArrowRight, ArrowUpRight} from '@/components/icons';
import {SiteFooter} from '@/components/site/site-footer';
import {SiteHeader} from '@/components/site/site-header';
import {DOCS_INTRO, DOCS_SECTIONS, DOCS_TOC, type DocsBlock, type Inline} from '@/lib/docs';

import {DocsToc} from './docs-toc';

function Rich({text}: {text: Inline[]}) {
  return text.map((part, i) =>
    typeof part === 'string' ? <span key={i}>{part}</span> : <Link key={i} href={part.href}>{part.text}</Link>,
  );
}

function Blocks({blocks}: {blocks: DocsBlock[]}) {
  return blocks.map((block, i) => {
    switch (block.type) {
      case 'p':
        return <p key={i}><Rich text={block.text} /></p>;
      case 'ul':
        return <ul key={i}>{block.items.map((item, n) => <li key={n}><Rich text={item} /></li>)}</ul>;
      case 'ol':
        return <ol key={i}>{block.items.map((item, n) => <li key={n}><Rich text={item} /></li>)}</ol>;
      case 'h3':
        return <h3 key={block.id} id={block.id}>{block.title}</h3>;
      case 'label':
        return <p key={i} className="mono docs-label">{block.text}</p>;
      case 'steps':
        return (
          <ol key={i} className="docs-steps">
            {block.items.map((step) => (
              <li key={step.id}>
                <h3 id={step.id}>{step.title}</h3>
                <p><Rich text={step.text} /></p>
              </li>
            ))}
          </ol>
        );
      case 'rows':
        return (
          <dl key={i} className="docs-rows">
            {block.rows.map((row) => (
              <div key={row.term}>
                <dt>{row.term}</dt>
                <dd>{row.detail}</dd>
              </div>
            ))}
          </dl>
        );
      case 'faq':
        return (
          <div key={i} className="docs-faq">
            {block.items.map((item) => (
              <details key={item.q} className="docs-qa">
                <summary>{item.q}</summary>
                <p className="docs-answer"><Rich text={item.a} /></p>
              </details>
            ))}
          </div>
        );
      default: {
        const unreachable: never = block;
        return unreachable;
      }
    }
  });
}

/** slotLane's documentation: a sticky contents list, and the guides as one reading column. */
export function DocsPage() {
  return (
    <>
      <div className="stage">
        <div className="scene docs-scene">
          <SiteHeader />
          <main className="wrap docs">
            <header className="docs-hero">
              <p className="mono docs-kicker"><i aria-hidden />{DOCS_INTRO.kicker}</p>
              <h1>{DOCS_INTRO.title}</h1>
              <p className="mono docs-badge"><i aria-hidden />{DOCS_INTRO.badge}</p>
              <p className="docs-dek">{DOCS_INTRO.tagline}</p>
              <p className="docs-status">{DOCS_INTRO.status}</p>
              <Link href="#quickstart" className="docs-jump">Read the quickstart <ArrowRight size={14} /></Link>
            </header>

            <div className="docs-layout">
              <nav aria-label="On this page">
                <DocsToc items={DOCS_TOC} />
              </nav>
              <article className="docs-prose">
                {DOCS_SECTIONS.map((section) => (
                  <section key={section.id} className="docs-section" aria-labelledby={section.id}>
                    <h2 id={section.id}>{section.title}</h2>
                    <Blocks blocks={section.blocks} />
                  </section>
                ))}

                <aside className="docs-stuck" aria-labelledby="still-stuck">
                  <h2 id="still-stuck">Still stuck?</h2>
                  <p>If this page does not answer it, write to us, or open the knowledge base.</p>
                  <div className="docs-actions">
                    <Button label="Contact" variant="primary" href="/contact">
                      <span className="inline-flex items-center gap-2">Contact <ArrowUpRight /></span>
                    </Button>
                    <Button label="Knowledge base" variant="ghost" href="/help">
                      <span className="inline-flex items-center gap-2">Knowledge base <ArrowRight size={14} /></span>
                    </Button>
                  </div>
                </aside>
              </article>
            </div>
          </main>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
