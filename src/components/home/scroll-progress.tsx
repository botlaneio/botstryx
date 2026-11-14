'use client';

import {useEffect, useRef} from 'react';

/**
 * A block that knows how far it has been scrolled through. It writes that as --p, from 0 to 1, on itself,
 * and its children draw from it in CSS: words that ink in, a line that fills, steps that light up.
 *
 * `from` and `to` are where on the screen the block's top and bottom sit at 0 and at 1, as fractions of the
 * viewport's height. Without JavaScript, and under reduced motion, --p stays at 1: everything fully drawn.
 */
export function ScrollProgress({from = 0.85, to = 0.5, className, children}: {from?: number; to?: number; className?: string; children: React.ReactNode}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // One measurement and one property a scroll event.
    const measure = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * from;
      const end = vh * to;
      // 0 when the top reaches `from`; 1 when the bottom reaches `to`.
      const p = (start - r.top) / Math.max(1, r.height + start - end);
      el.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(4));
    };
    const onScroll = measure;
    measure();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      el.style.removeProperty('--p');
    };
  }, [from, to]);

  return <div ref={ref} className={className}>{children}</div>;
}

/**
 * A number that counts up from zero the first time it scrolls into view. The server renders the final value,
 * so it reads correctly without JavaScript and under reduced motion, where it never moves.
 */
export function CountUp({value}: {value: number}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || value === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - start) / 1400);
        node.textContent = String(Math.round(value * (1 - (1 - k) ** 3)));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, {threshold: 0.6});
    // Start from zero only while the number is still out of sight, so nobody sees it jump back.
    const r = node.getBoundingClientRect();
    if (r.top > window.innerHeight || r.bottom < 0) node.textContent = '0';
    io.observe(node);
    return () => { io.disconnect(); cancelAnimationFrame(raf); node.textContent = String(value); };
  }, [value]);

  return <span ref={ref}>{value}</span>;
}
