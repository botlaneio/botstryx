'use client';

import {useState} from 'react';
import Link from 'next/link';
import {Button} from '@astryxdesign/core/Button';
import {TextInput} from '@astryxdesign/core/TextInput';

import {ArrowUpRight} from '@/components/icons';
import type {PostSummary} from '@/lib/insights';

import {Cover} from './cover';

/** The journal's index: every note as a tile in a bento grid, filtered by topic or searched. */
export function InsightsIndex({posts}: {posts: PostSummary[]}) {
  const [topic, setTopic] = useState('');
  const [query, setQuery] = useState('');
  const search = query.trim().toLowerCase();
  const topics = [...new Set(posts.map((p) => p.topic))];
  const shown = posts.filter((p) => (!topic || p.topic === topic) && (!search || `${p.title} ${p.dek} ${p.topic}`.toLowerCase().includes(search)));
  const open = !topic && !search;

  return (
    <div className="ins-index">
      <div className="ins-tools">
        <div className="ins-topics" role="group" aria-label="Filter by topic">
          {['', ...topics].map((t) => (
            <button key={t} type="button" aria-pressed={topic === t} onClick={() => setTopic(t)}>
              {t || 'All notes'}<span className="mono">{t ? posts.filter((p) => p.topic === t).length : posts.length}</span>
            </button>
          ))}
        </div>
        <div className="ins-search">
          <TextInput label="Search articles" isLabelHidden type="search" htmlName="q" width="100%" hasClear placeholder="Find something useful…" value={query} onChange={setQuery} />
        </div>
      </div>

      <p className="ins-count mono" role="status" aria-live="polite">
        {shown.length} {shown.length === 1 ? 'note' : 'notes'} / {topic || 'Ideas put into practice'}
      </p>

      {/* A bento grid: the newest note takes the large tile, the rest vary in size, and the invitation closes it. */}
      <div className="bento" data-open={open}>
        {shown.map((p, i) => {
          const big = open && i === 0;
          const art = big || !open || (i >= 3 && i <= 5);
          return (
            <Link key={p.slug} href={`/blog/${p.slug}`} className={big ? 'tile big' : 'tile'}>
              <span className="tile-top mono">
                <span>{big && <i aria-hidden />}{big ? 'The studio pick' : p.topic}</span>
                <ArrowUpRight size={17} />
              </span>
              {art && <span className="tile-art"><Cover kind={p.cover} seed={p.slug} /></span>}
              <span className="tile-text">
                <b>{p.title}</b>
                {(big || !art) && <span>{p.dek}</span>}
              </span>
              <span className="tile-meta mono">{big ? `${p.topic} · ` : ''}{p.date} · {p.minutes} min read</span>
            </Link>
          );
        })}
        {open && (
          <aside className="tile invite">
            <span className="tile-top mono"><span>From reading to building</span></span>
            <h2>Good questions.<br />Better starting points.</h2>
            <p>Have a project in mind? Tell us what you want to make possible.</p>
            <Link href="/contact" className="invite-go">Talk to the studio <ArrowUpRight size={17} /></Link>
          </aside>
        )}
      </div>

      {!shown.length && (
        <div className="ins-empty">
          <h2>No notes found.</h2>
          <p>Try another phrase or explore the full journal.</p>
          <Button label="Show all notes" variant="secondary" onClick={() => { setTopic(''); setQuery(''); }} />
        </div>
      )}
    </div>
  );
}
