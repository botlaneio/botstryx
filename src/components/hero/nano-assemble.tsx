'use client';

import {useEffect, useRef} from 'react';

import {NanoEngine, assembleCells, sampleText} from './nano';

// Room round the text, in px, that the cells fly in from.
const BLEED = 140;

/**
 * Text that assembles itself, once, the first time it scrolls into view: cells rise from the dots around it and lock
 * together as the letters (the hero's nanotech effect, nano.ts), then the real text takes over. It only waits hidden
 * if it starts out of sight; without script, with motion turned off, or already on screen, it is simply there.
 */
export function NanoAssemble({children, delay = 0}: {children: React.ReactNode; /** ms after it comes into view */ delay?: number}) {
  const box = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = box.current, canvas = canvasRef.current;
    const text = wrap?.querySelector<HTMLElement>('.nano-text');
    if (!wrap || !canvas || !text || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = wrap.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return;

    wrap.dataset.nano = 'wait';
    const show = () => { delete wrap.dataset.nano; };
    let nano: NanoEngine | null = null;
    let timer = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      timer = window.setTimeout(async () => {
        await document.fonts.ready;
        nano = new NanoEngine(canvas);
        const size = parseFloat(getComputedStyle(text).fontSize);
        const step = Math.max(1.6, size / 30);
        const origin = nano.origin();
        const to = sampleText(text, origin, step);
        if (!to.length) return show();
        nano.run({
          cells: assembleCells(to, origin.width, origin.height, performance.now()),
          size: step * 0.9,
          rest: 1,
          showStart: false,
          hold: 90,
          fade: 300,
          onSettle: show,
        });
      }, delay + 120);
    }, {threshold: 1, rootMargin: '0px 0px -10% 0px'});
    io.observe(text);
    // However it goes, the text is never left hidden for long once it is in view.
    const failsafe = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) window.setTimeout(show, delay + 3200);
    });
    failsafe.observe(wrap);

    return () => {
      io.disconnect();
      failsafe.disconnect();
      window.clearTimeout(timer);
      nano?.destroy();
      show();
    };
  }, [delay]);

  return (
    <span ref={box} className="nano-assemble">
      <span className="nano-text">{children}</span>
      <canvas ref={canvasRef} className="nano-assemble-canvas" style={{top: -BLEED, left: -BLEED, width: `calc(100% + ${BLEED * 2}px)`, height: `calc(100% + ${BLEED * 2}px)`}} aria-hidden />
    </span>
  );
}
