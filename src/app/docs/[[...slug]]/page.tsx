import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {findNeighbour} from 'fumadocs-core/page-tree';

import {DocsToc} from '@/components/docs/docs-toc';
import {getMdxComponents} from '@/components/docs/mdx';
import {source} from '@/lib/source';

type PageProps = {params: Promise<{slug?: string[]}>};

export const dynamicParams = false;

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const page = source.getPage((await params).slug);
  if (!page) return {};
  return {
    title: `${page.data.title} · slotLane docs`,
    description: page.data.description,
  };
}

export default async function DocsPage({params}: PageProps) {
  const page = source.getPage((await params).slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const neighbours = findNeighbour(source.pageTree, page.url);

  return (
    <div className="docs-read">
      <article className="docs-prose">
        <header className="docs-hero">
          <p className="mono docs-kicker"><i aria-hidden />slotLane</p>
          <h1>{page.data.title}</h1>
          {page.data.status === 'soon' ? <p className="mono docs-badge"><i aria-hidden />Coming soon</p> : null}
          {page.data.description ? <p className="docs-dek">{page.data.description}</p> : null}
        </header>
        <MDX components={getMdxComponents()} />
        <nav className="docs-turn" aria-label="Nearby pages">
          {neighbours.previous ? <Link href={neighbours.previous.url}>Previous<span>{neighbours.previous.name}</span></Link> : <span />}
          {neighbours.next ? <Link href={neighbours.next.url}>Next<span>{neighbours.next.name}</span></Link> : null}
        </nav>
        <p className="docs-stuck-line">Still stuck? <Link href="/contact">Write to us</Link>.</p>
      </article>
      <DocsToc items={page.data.toc} />
    </div>
  );
}
