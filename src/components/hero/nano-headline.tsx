'use client';

import {useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore} from 'react';

import {cellStep, morphCells, sampleText} from './nano';
import {useNano} from './nano-layer';

type Props = {
  /** The line that stays put. */
  staticText: string;
  /** Shown in turn under it, each one rebuilt from the last. The first is the one search engines, screen readers and still pages get. */
  phrases: readonly string[];
  /** Classes for the box around the headline, such as its margin. */
  className?: string;
  /** Called with the next phrase's index the moment it starts to form, so something else can move in time with it. */
  onTurn?: (next: number) => void;
};

// Milliseconds a phrase is held before it comes apart: the first one a little longer, so the page settles first.
const FIRST_HOLD = 2400;
const HOLD = 2600;

const delay = (i: number) => ({'--i': i}) as React.CSSProperties;

function useTabVisible() {
  return useSyncExternalStore(
    (onChange) => {
      document.addEventListener('visibilitychange', onChange);
      return () => document.removeEventListener('visibilitychange', onChange);
    },
    () => !document.hidden,
    () => true,
  );
}

/**
 * A two-line headline: the first line stays, and the second transforms from one phrase into the next. The letters
 * break into tiny cells, which stream across and lock together as the new phrase (nano.ts draws them), and the real
 * text takes over again once they have settled. Every phrase is set in the same spot, the shown one visible, so the
 * line keeps the room of the longest one and nothing below it moves. Without script or with motion turned off, the
 * first phrase simply stays.
 */
export function NanoHeadline({staticText, phrases, className, onTurn}: Props) {
  const nano = useNano();
  const visible = useTabVisible();
  const [at, setAt] = useState(0);
  const first = useRef(true);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!nano || !visible || phrases.length < 2) return;
    let live = true;
    const timer = window.setTimeout(async () => {
      await document.fonts.ready;
      const h1 = heading.current;
      if (!live || !h1) return;
      first.current = false;
      const ghosts = h1.querySelectorAll<HTMLElement>('.tw-ghost');
      const next = (at + 1) % phrases.length;
      const size = parseFloat(getComputedStyle(h1).fontSize);
      const step = cellStep(size);
      const origin = nano.origin();
      const from = sampleText(ghosts[at], origin, step);
      const to = sampleText(ghosts[next], origin, step);
      if (!from.length || !to.length) return setAt(next);
      nano.run({
        cells: morphCells(from, to, size, performance.now()),
        size: step * 0.9,
        rest: 1,
        showStart: true,
        hold: 60,
        fadeIn: 260,
        fade: 520,
        // The real text steps aside the moment the cells are drawn in its place, and comes back once they settle.
        onStart: () => {
          h1.setAttribute('data-morph', '');
          onTurn?.(next);
        },
        onSettle: () => setAt(next),
      });
    }, first.current ? FIRST_HOLD : HOLD);
    return () => { live = false; window.clearTimeout(timer); };
  }, [at, nano, visible, phrases, onTurn]);

  // The new phrase is on the page now: show the real text again, under the cells as they fade.
  useLayoutEffect(() => {
    heading.current?.removeAttribute('data-morph');
  }, [at]);

  // The headline is sized so the longest line fits the width on one line, phones included. Instrument Sans at this
  // weight and tracking sets about 0.45em a character.
  const fit = Math.max(staticText.length, ...phrases.map((p) => p.length)) * 0.45 + 0.2;

  return (
    <div className={`tw-fit ${className ?? ''}`}>
      <h1 ref={heading} className="display tw" style={{'--tw-fit': fit} as React.CSSProperties}>
        <span className="sr-only">{`${staticText} ${phrases[0] ?? ''}`}</span>
        <span className="line" aria-hidden>
          <span className="rise" style={delay(0)}>{staticText}</span>
        </span>
        <span className="line" aria-hidden>
          <span className="rise" style={delay(1)}>
            <span className="tw-slot">
              {phrases.map((p, i) => (
                <span key={p} className="tw-ghost" data-on={i === at || undefined}>{p}</span>
              ))}
            </span>
          </span>
        </span>
      </h1>
    </div>
  );
}
