import type {Metadata} from 'next';

import {InsightsIndex} from '@/components/insights/insights-index';
import {SiteFooter} from '@/components/site/site-footer';
import {SiteHeader} from '@/components/site/site-header';
import {postsByDate, summary} from '@/lib/insights';
import {DEFAULT_SHARE_IMAGE, SHARE_IMAGE} from '@/lib/site';

const title = 'Insights · botLane';
const description = 'Practical notes on websites, booking, automation, and the work behind them.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: '/blog',
    siteName: 'botLane',
    type: 'website',
    locale: 'en',
    images: [{url: DEFAULT_SHARE_IMAGE, width: SHARE_IMAGE.width, height: SHARE_IMAGE.height, alt: SHARE_IMAGE.alt, type: SHARE_IMAGE.type}],
  },
  twitter: {card: 'summary_large_image', title, description},
};

// The words are botpro's (src/app/blog/page.tsx, src/components/insights/insights-index.tsx).
export default function InsightsPage() {
  const all = postsByDate();
  return (
    <div className="ins">
      <SiteHeader />
      <main className="wrap ins-main">
        <header className="ins-mast">
          <p className="mono ins-kicker"><i aria-hidden />Insights / The botLane journal</p>
          <h1 className="ins-heading">
            <span className="line"><span className="rise" style={{'--i': 0} as React.CSSProperties}>Thought through.</span></span>
            <span className="line"><span className="rise dim" style={{'--i': 1} as React.CSSProperties}>Written down.</span></span>
          </h1>
          <div className="ins-intro fade-up">
            <p>Ideas, decisions, and practical guides.<br />From the people doing the building.</p>
            <span className="mono">{all.length} notes · {new Set(all.map((p) => p.topic)).size} topics</span>
          </div>
        </header>

        <section aria-label="Notes">
          <InsightsIndex posts={all.map(summary)} />
        </section>

        <div className="ins-colophon mono">
          <span>Independent thinking. Practical work.</span>
          <span>By the botLane studio</span>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
