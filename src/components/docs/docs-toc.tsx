'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';

import type {TocItem} from '@/lib/docs';

const idsOf = (items: TocItem[]) => items.flatMap((item) => [item.id, ...(item.children?.map((child) => child.id) ?? [])]);

/** Sticky on desktop. On a phone it is a closed disclosure until opened. */
export function DocsToc({items}: {items: TocItem[]}) {
  const [active, setActive] = useState(items[0]?.id ?? '');

  useEffect(() => {
    const ids = idsOf(items);
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = 120;
      let current = ids[0] ?? '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [items]);

  const closeOnPhone = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const details = event.currentTarget.closest('details');
    if (!details || window.matchMedia('(min-width: 960px)').matches) return;
    const id = event.currentTarget.getAttribute('href')?.slice(1);
    // Closing the disclosure scrolls the summary back into view, which would cancel the jump.
    event.preventDefault();
    details.open = false;
    if (!id) return;
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({block: 'start'});
      window.history.pushState(null, '', `#${id}`);
    });
  };

  const link = (id: string, title: string) => (
    <Link href={`#${id}`} aria-current={active === id ? 'location' : undefined} onClick={closeOnPhone}>
      {title}
    </Link>
  );

  const entries = () => (
    <ol>
      {items.map((item) => (
        <li key={item.id}>
          {link(item.id, item.title)}
          {item.children && (
            <ol>
              {item.children.map((child) => (
                <li key={child.id}>{link(child.id, child.title)}</li>
              ))}
            </ol>
          )}
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <details className="docs-toc docs-toc-phone">
        <summary className="mono">On this page</summary>
        {entries()}
      </details>
      <div className="docs-toc docs-toc-desk">
        <p className="mono">On this page</p>
        {entries()}
      </div>
    </>
  );
}
