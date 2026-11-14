'use client';

import {useEffect, useRef, useState} from 'react';

export type BotMood = 'idle' | 'thinking' | 'happy' | 'asleep';

/**
 * The bot: a friendly face for the "bot" in botLane. A rounded head with two square eyes, one of them the
 * electric blue square from the "b" mark.
 *
 * An animated React component. Left alone it is alive but quiet: it blinks at uneven intervals, as eyes do,
 * and glances to each side now and then. Hover tilts its head and winks the blue eye; a click makes it happy
 * for a moment. The mood prop sets its state from outside:
 *   idle      blinking and glancing
 *   thinking  eyes up, looking from side to side (while something loads)
 *   happy     eyes squeezed into a smile, with a small bounce (after something succeeds)
 *   asleep    eyes closed, breathing slowly (when nothing is happening)
 *
 * React decides when (the blink timer, the click, the mood); the movement itself is CSS, in globals.css under
 * ".bot-mark", so it stays smooth and stops entirely when the visitor asks for reduced motion.
 * Pass animated={false} for a still mark, such as in a footer or an image export.
 */
export function BotMark({size = 40, mood = 'idle', animated = true, title}: {size?: number; mood?: BotMood; animated?: boolean; title?: string}) {
  const [blink, setBlink] = useState(false);
  const [cheer, setCheer] = useState(false);
  const cheerTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const shown: BotMood = cheer ? 'happy' : mood;

  // Blinks come at uneven intervals, between two and a half and six seconds apart, and now and then twice.
  useEffect(() => {
    if (!animated || shown !== 'idle') return;
    let timer: ReturnType<typeof setTimeout>;
    const once = (then: () => void) => {
      setBlink(true);
      timer = setTimeout(() => { setBlink(false); then(); }, 140);
    };
    const wait = () => {
      timer = setTimeout(() => once(() => {
        if (Math.random() < 0.25) timer = setTimeout(() => once(wait), 160);
        else wait();
      }), 2500 + Math.random() * 3500);
    };
    wait();
    return () => { clearTimeout(timer); setBlink(false); };
  }, [animated, shown]);

  useEffect(() => () => clearTimeout(cheerTimer.current), []);

  const onClick = () => {
    if (!animated) return;
    setCheer(true);
    clearTimeout(cheerTimer.current);
    cheerTimer.current = setTimeout(() => setCheer(false), 1100);
  };

  return (
    <svg
      className="bot-mark"
      data-animated={animated}
      data-mood={shown}
      data-blink={blink}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      onClick={onClick}
    >
      <g className="bot-head">
        <rect x="18" y="25" width="84" height="70" rx="22" fill="none" stroke="currentColor" strokeWidth="13" />
        <g className="bot-eyes">
          <rect className="bot-eye" x="39" y="52" width="16" height="16" rx="2" fill="currentColor" />
          <rect className="bot-eye bot-eye-blue" x="65" y="52" width="16" height="16" rx="2" />
        </g>
      </g>
    </svg>
  );
}
