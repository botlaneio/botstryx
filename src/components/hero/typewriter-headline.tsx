'use client';

import {useEffect, useState, useSyncExternalStore} from 'react';

type Props = {
  /** The line that stays put. */
  staticText: string;
  /** Typed out in turn under it, looping. The first is the one search engines, screen readers and still pages get. */
  phrases: readonly string[];
  /** Classes for the box around the headline, such as its margin. */
  className?: string;
};

type Phase = 'type' | 'hold' | 'delete' | 'gap';

// Milliseconds: per character typed, the finished phrase held, per character deleted, and the pause before the next.
const WAIT: Record<Phase, number> = {type: 55, hold: 1800, delete: 30, gap: 300};

const delay = (i: number) => ({'--i': i}) as React.CSSProperties;

// Whether the visitor asked for less motion, and whether the tab is on screen. Both read as false and true on the
// server, so the first render is the same either side.
function useMedia(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const m = window.matchMedia(query);
      m.addEventListener('change', onChange);
      return () => m.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
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
 * A two-line headline: the first line stays, the second types each phrase, holds it, deletes it and moves on.
 * Every phrase is also set, unseen, in the same spot, so the line keeps the room of the longest one and nothing
 * below it moves. The page renders with the first phrase whole, so it reads right before any script runs.
 */
export function TypewriterHeadline({staticText, phrases, className}: Props) {
  const still = useMedia('(prefers-reduced-motion: reduce)');
  const visible = useTabVisible();
  const [at, setAt] = useState<{i: number; n: number; phase: Phase}>({i: 0, n: phrases[0]?.length ?? 0, phase: 'hold'});

  useEffect(() => {
    if (still || !visible || phrases.length === 0) return;
    const timer = window.setTimeout(() => {
      setAt(({i, n, phase}) => {
        const length = phrases[i].length;
        switch (phase) {
          case 'hold': return {i, n, phase: 'delete'};
          case 'delete': return n > 1 ? {i, n: n - 1, phase} : {i, n: 0, phase: 'gap'};
          case 'gap': return {i: (i + 1) % phrases.length, n: 0, phase: 'type'};
          case 'type': return n + 1 < length ? {i, n: n + 1, phase} : {i, n: length, phase: 'hold'};
        }
      });
    }, WAIT[at.phase]);
    return () => window.clearTimeout(timer);
  }, [at, still, visible, phrases]);

  const shown = still ? phrases[0] : phrases[at.i]?.slice(0, at.n);
  const typing = !still && at.phase !== 'hold';
  // The headline is sized so the longest phrase fits the width on one line from 768px up, and in two lines below
  // that. Instrument Sans at this weight and tracking sets about 0.45em a character; the 0.2 is room for the caret.
  const fit = Math.max(staticText.length, ...phrases.map((p) => p.length)) * 0.45 + 0.2;

  return (
    <div className={`tw-fit ${className ?? ''}`}>
      <h1 className="display tw" style={{'--tw-fit': fit} as React.CSSProperties}>
        <span className="sr-only">{`${staticText} ${phrases[0] ?? ''}`}</span>
        <span className="line" aria-hidden>
          <span className="rise" style={delay(0)}>{staticText}</span>
        </span>
        <span className="line" aria-hidden>
          <span className="rise" style={delay(1)}>
            <span className="tw-slot">
              {phrases.map((p) => (
                <span key={p} className="tw-ghost">{p}<i className="tw-caret" /></span>
              ))}
              <span className="tw-live">{shown}<i className="tw-caret" data-typing={typing || undefined} /></span>
            </span>
          </span>
        </span>
      </h1>
    </div>
  );
}
