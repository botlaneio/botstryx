'use client';

import {useEffect, useRef} from 'react';
import {useRouter} from 'next/navigation';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {useDocsSearch} from 'fumadocs-core/search/client';

/** Search over the compiled docs. Opened from the sidebar, and with ⌘K or Ctrl K. */
export function DocsSearch({isOpen, onOpenChange}: {isOpen: boolean; onOpenChange: (open: boolean) => void}) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const {search, setSearch, query} = useDocsSearch({type: 'fetch', api: '/api/search'});
  const results = query.data === 'empty' || !query.data ? [] : query.data;

  useEffect(() => {
    if (isOpen) input.current?.focus();
  }, [isOpen]);

  const go = (url: string) => {
    onOpenChange(false);
    setSearch('');
    router.push(url);
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange} width={520}>
      <DialogHeader title="Search docs" onOpenChange={onOpenChange} />
      <form className="docs-search-form" onSubmit={(event) => { event.preventDefault(); const first = results[0]; if (first) go(first.url); }}>
        <input
          ref={input}
          className="docs-search-input"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search slotLane docs"
          aria-label="Search slotLane docs"
        />
      </form>
      <ul className="docs-search-results">
        {search && !query.isLoading && results.length === 0 ? <li className="docs-search-empty">Nothing matches that.</li> : null}
        {results.map((item) => (
          <li key={item.id}>
            <button type="button" onClick={() => go(item.url)}>{item.content}</button>
          </li>
        ))}
      </ul>
    </Dialog>
  );
}
