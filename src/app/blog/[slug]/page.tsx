import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {Button} from '@astryxdesign/core/Button';
import {Markdown} from '@astryxdesign/core/Markdown';

import {ArrowRight, ArrowUpRight} from '@/components/icons';
import {Cover} from '@/components/insights/cover';
import {SiteFooter} from '@/components/site/site-footer';
import {SiteHeader} from '@/components/site/site-header';
import {POSTS, anchor, findPost, formatDate, postsByDate, readingMinutes} from '@/lib/insights';

type Props = {params: Promise<{slug: string}>};

export const generateStaticParams = () => POSTS.map((p) => ({slug: p.slug}));

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const post = findPost((await params).slug);
  return post ? {title: `${post.title} · botLane`, description: post.dek} : {};
}

/** One note from the journal. */
export default async function NotePage({params}: Props) {
  const post = findPost((await params).slug);
  if (!post) notFound();

  const headings = post.body.flatMap((b) => (b.type === 'h2' ? [b.text] : []));
  const more = postsByDate().filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="ins">
      <SiteHeader />
      <main className="wrap note">
        <header className="note-head">
          <p className="mono note-crumbs"><Link href="/blog">Insights</Link><span aria-hidden>/</span>{post.topic}</p>
          <h1>{post.title}</h1>
          <p className="note-dek">{post.dek}</p>
          <p className="mono note-meta">{formatDate(post.date)} · {readingMinutes(post)} min read · By the botLane studio</p>
        </header>

        <div className="note-cover"><Cover kind={post.cover} seed={post.slug} /></div>

        <div className="note-grid">
          {headings.length > 1 && (
            <nav className="note-toc" aria-label="In this note">
              <p className="mono">In this note</p>
              <ol>{headings.map((h) => <li key={h}><a href={`#${anchor(h)}`}>{h}</a></li>)}</ol>
            </nav>
          )}

          <article className="note-body">
            {post.body.map((b, i) => {
              if (b.type === 'h2') return <h2 key={i} id={anchor(b.text)}>{b.text}</h2>;
              if (b.type === 'list') return <ul key={i}>{b.items.map((x) => <li key={x}>{x}</li>)}</ul>;
              if (b.type === 'quote') return <blockquote key={i}>{b.text}</blockquote>;
              if (b.type === 'p') return <p key={i}>{b.text}</p>;
              return <Markdown key={i}>{b.text}</Markdown>;
            })}
          </article>
        </div>

        <aside className="ins-invite">
          <p className="mono">From reading to building</p>
          <h2>Good questions.<br />Better starting points.</h2>
          <p>Have a project in mind? Tell us what you want to make possible.</p>
          <Button label="Talk to the studio" variant="primary" size="lg" href="/contact">
            <span className="inline-flex items-center gap-2.5">Talk to the studio <ArrowUpRight /></span>
          </Button>
        </aside>

        <section aria-labelledby="more-title" className="note-more">
          <h2 id="more-title" className="mono">More from the journal</h2>
          <ol className="ins-list">
            {more.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`}>
                  <span className="mono ins-date">{formatDate(p.date)}</span>
                  <span className="ins-title"><b>{p.title}</b><span>{p.dek}</span></span>
                  <span className="mono ins-topic">{p.topic}<span>{readingMinutes(p)} min read</span></span>
                  <ArrowUpRight size={18} className="ins-arrow" />
                </Link>
              </li>
            ))}
          </ol>
          <Link href="/blog" className="apx-more">All notes <ArrowRight size={14} /></Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
