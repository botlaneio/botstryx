import type {Metadata} from 'next';
import {Button} from '@astryxdesign/core/Button';

import {SiteFooter} from '@/components/site/site-footer';
import {SiteHeader} from '@/components/site/site-header';

export const metadata: Metadata = {
  title: 'Page not found · botLane',
  description: 'That page is not on botlane.io.',
};

/** Unknown addresses, and notes that call notFound(). Next adds noindex when the status is 404. */
export default function NotFound() {
  return (
    <>
      <div className="stage">
        <div className="scene scene-short">
          <SiteHeader />
          <main className="wrap placeholder">
            <p className="mono">404</p>
            <h1>Page not found</h1>
            <div className="placeholder-actions">
              <Button label="Home" variant="primary" href="/">Home</Button>
              <Button label="Insights" variant="secondary" href="/blog">Insights</Button>
            </div>
          </main>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
