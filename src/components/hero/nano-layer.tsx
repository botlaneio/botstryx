'use client';

import {createContext, useContext, useEffect, useRef, useState} from 'react';

import {NanoEngine, buildCells} from './nano';

const NanoContext = createContext<NanoEngine | null>(null);
/** The first screen's nanotech layer, once it is running. Null on the server, before it mounts, and for visitors who turn motion off. */
export const useNano = () => useContext(NanoContext);

// When each panel is woven, in ms from the layer starting: the brief box first, then the price rail item by item.
const FIRST_BUILD = 450;
const BUILD_GAP = 140;
// However the swarm goes, every panel is shown by now.
const FAILSAFE = 4200;

/**
 * The canvas the swarm is drawn on, over the whole first screen, and the panels it builds. A panel marked
 * data-nano-build starts hidden (only once this runs, so the page reads fine without script or motion) and is shown
 * when its cells have locked in.
 */
export function NanoLayer({children}: {children: React.ReactNode}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [engine, setEngine] = useState<NanoEngine | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = canvas?.parentElement;
    if (!canvas || !stage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const nano = new NanoEngine(canvas);
    const observer = new ResizeObserver(() => nano.resize());
    observer.observe(canvas);
    // The layer's own engine is handed to the headline through context; set once, after the canvas exists.
    setEngine(nano);

    const panels = [...stage.querySelectorAll<HTMLElement>('[data-nano-build]')];
    const show = (el: HTMLElement) => el.setAttribute('data-built', '');
    panels.forEach((el) => el.removeAttribute('data-built'));
    stage.dataset.nano = 'on';

    const timers = panels.map((el, i) =>
      window.setTimeout(() => {
        const box = el.getBoundingClientRect();
        // Off screen (a short phone screen): nothing to watch, so just show it.
        if (box.bottom < 0 || box.top > window.innerHeight || box.width === 0) return show(el);
        const step = box.width > 420 ? 9 : 7;
        nano.run({
          cells: buildCells(box, nano.origin(), step, performance.now()),
          size: step * 0.5,
          rest: 0.28,
          showStart: false,
          hold: 60,
          fade: 520,
          onSettle: () => show(el),
        });
      }, FIRST_BUILD + i * BUILD_GAP),
    );
    const failsafe = window.setTimeout(() => panels.forEach(show), FAILSAFE);

    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(failsafe);
      observer.disconnect();
      nano.destroy();
      panels.forEach(show);
      delete stage.dataset.nano;
      setEngine(null);
    };
  }, []);

  return (
    <NanoContext value={engine}>
      <canvas ref={canvasRef} className="nano-layer" aria-hidden />
      {children}
    </NanoContext>
  );
}
