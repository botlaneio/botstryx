'use client';

import {useState} from 'react';
import Link from 'next/link';
import {Button} from '@astryxdesign/core/Button';
import {TextInput} from '@astryxdesign/core/TextInput';

import {ArrowRight, ArrowUpRight} from '@/components/icons';
import type {PostSummary} from '@/lib/insights';

import {Cover} from './cover';

/** The journal's index: the newest note set large, the rest as a list, filtered by topic or searched. */
export function InsightsIndex({posts}: {posts: PostSummary[]}) {
  const [topic, setTopic] = useState('');
  const [query, setQuery] = useState('');
  const search = query.trim().toLowerCase();
  const topics = [...new Set(posts.map((p) => p.topic))];
  const shown = posts.filter((p) => (!topic || p.topic === topic) && (!search || `${p.title} ${p.dek} ${p.topic}`.toLowerCase().includes(search)));
  const open = !topic && !search;
  const [lead, ...rest] = open ? shown : [undefined, ...shown];

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

      {lead && (
        <Link href={`/blog/${lead.slug}`} className="ins-lead">
          <div className="ins-lead-art"><Cover kind={lead.cover} seed={lead.slug} /></div>
          <div className="ins-lead-text">
            <p className="mono"><i aria-hidden />The studio pick<span>{lead.topic}</span></p>
            <h2>{lead.title}</h2>
            <p>{lead.dek}</p>
            <p className="mono ins-meta">{lead.date} · {lead.minutes} min read</p>
            <span className="ins-read">Read the note <ArrowRight size={15} /></span>
          </div>
        </Link>
      )}

      <ol className="ins-list">
        {rest.filter((p): p is PostSummary => !!p).map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`}>
              <span className="mono ins-date">{p.date}</span>
              <span className="ins-title"><b>{p.title}</b><span>{p.dek}</span></span>
              <span className="mono ins-topic">{p.topic}<span>{p.minutes} min read</span></span>
              <ArrowUpRight size={18} className="ins-arrow" />
            </Link>
          </li>
        ))}
      </ol>

      {!shown.length && (
        <div className="ins-empty">
          <h2>No notes found.</h2>
          <p>Try another phrase or explore the full journal.</p>
          <Button label="Show all notes" variant="secondary" onClick={() => { setTopic(''); setQuery(''); }} />
        </div>
      )}

      {open && (
        <aside className="ins-invite">
          <p className="mono">From reading to building</p>
          <h2>Good questions.<br />Better starting points.</h2>
          <p>Have a project in mind? Tell us what you want to make possible.</p>
          <Button label="Talk to the studio" variant="primary" size="lg" href="/contact">
            <span className="inline-flex items-center gap-2.5">Talk to the studio <ArrowUpRight /></span>
          </Button>
        </aside>
      )}
    </div>
  );
}
