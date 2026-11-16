'use client';

import {useEffect, useState} from 'react';
import type {TOCItemType} from 'fumadocs-core/toc';

/** The headings on this page. Teal marks the one in view. */
export function DocsToc({items}: {items: TOCItemType[]}) {
  const [active, setActive] = useState(items[0]?.url ?? '');

  useEffect(() => {
    const ids = items.map((item) => item.url.replace(/^#/, ''));
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = 120;
      let current = items[0]?.url ?? '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = `#${id}`;
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

  if (items.length === 0) return null;

  return (
    <nav className="docs-toc" aria-label="On this page">
      <p className="mono">On this page</p>
      <ol>
        {items.map((item) => (
          <li key={item.url} data-depth={item.depth}>
            <a href={item.url} aria-current={active === item.url ? 'location' : undefined}>{item.title}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
