'use client';

import {createContext, useContext, useEffect, useMemo, useState} from 'react';

import {DotField} from './dot-field';
import {Scene} from './scene';

type PromptState = {
  brief: string;
  setBrief: (v: string) => void;
  need: string | null;
  setNeed: (v: string | null) => void;
  example: string;
};
const PromptContext = createContext<PromptState>({brief: '', setBrief: () => {}, need: null, setNeed: () => {}, example: ''});
export const usePrompt = () => useContext(PromptContext);

// Briefs the placeholder types out, one after another. Real kinds of project, in a visitor's words.
const EXAMPLES = [
  'A website that reflects where our business is today.',
  'A booking system for our clinic.',
  'A client portal that keeps everything in one place.',
];
const TYPE_MS = 38, HOLD_MS = 1900, ERASE_MS = 16;

function useTypedExample(active: boolean) {
  const [text, setText] = useState(EXAMPLES[0]);
  useEffect(() => {
    if (!active || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let i = 0, n = EXAMPLES[0].length, erasing = true;
    let timer = window.setTimeout(function tick() {
      const full = EXAMPLES[i];
      if (!erasing) {
        n += 1;
        if (n >= full.length) erasing = true;
        setText(full.slice(0, n));
        timer = window.setTimeout(tick, n >= full.length ? HOLD_MS : TYPE_MS);
      } else {
        n -= 2;
        if (n <= 0) { n = 0; erasing = false; i = (i + 1) % EXAMPLES.length; }
        setText(full.slice(0, n));
        timer = window.setTimeout(tick, n === 0 ? 400 : ERASE_MS);
      }
    }, 4200);
    return () => window.clearTimeout(timer);
  }, [active]);
  return text;
}

/** The first screen: header, headline, the brief box and the price rail. */
export function Stage() {
  const [brief, setBrief] = useState('');
  const [need, setNeed] = useState<string | null>(null);
  const example = useTypedExample(!brief);
  const prompt = useMemo(() => ({brief, setBrief, need, setNeed, example}), [brief, need, example]);

  return (
    <PromptContext value={prompt}>
      <div className="stage">
        <DotField />
        <Scene />
      </div>
    </PromptContext>
  );
}
