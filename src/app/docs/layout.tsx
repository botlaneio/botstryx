import type {ReactNode} from 'react';

import {DocsShell} from '@/components/docs/docs-shell';
import {SiteFooter} from '@/components/site/site-footer';
import {SiteHeader} from '@/components/site/site-header';
import {source} from '@/lib/source';

export default function DocsLayout({children}: {children: ReactNode}) {
  return (
    <>
      <div className="stage">
        <div className="scene docs-scene">
          <SiteHeader />
          <main className="wrap docs">
            <DocsShell tree={source.pageTree}>{children}</DocsShell>
          </main>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
