'use client';

import {useEffect, useRef, useState} from 'react';

import {SCENES, type Scene} from './assistant-scenes';

/** The conversation player: pick a question, watch it asked and answered (or handed on). */
export function AssistantDemo() {
  const [at, setAt] = useState(0);
  const [step, setStep] = useState(3);
  const scene = SCENES[at];
  const first = useRef(true);

  // Each scene plays in steps: the question, the assistant typing, the answer, then its source or handoff.
  useEffect(() => {
    // The first conversation arrives already finished; only a picked one plays.
    if (first.current) { first.current = false; return; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timers = [
      setTimeout(() => setStep(1), 250),
      setTimeout(() => setStep(2), 1100),
      setTimeout(() => setStep(3), 1700),
    ];
    return () => timers.forEach(clearTimeout);
  }, [at]);

  const pick = (i: number) => {
    setStep(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 3 : 0);
    setAt(i);
  };

  return (
    <div className="ad">
      <div className="ad-picks" role="tablist" aria-label="Pick a question">
        {SCENES.map((s, i) => (
          <button key={s.id} type="button" role="tab" aria-selected={i === at} onClick={() => pick(i)} data-person={s.handoff ? '' : undefined}>
            <span className="mono">{s.label}</span>
            <b>{s.ask}</b>
          </button>
        ))}
      </div>

      <div className="ad-stage" role="tabpanel" aria-label={scene.label}>
        <Chat scene={scene} step={step} />
        {scene.handoff && step >= 3 && (
          <div className="ad-handoff" aria-live="polite">
            <span className="mono">New enquiry · {scene.handoff.to}</span>
            <b>{scene.handoff.summary}</b>
            <small>Handed on by the assistant at {scene.time}</small>
          </div>
        )}
      </div>
    </div>
  );
}

/** One chat window, drawn up to the given step. Exported so the page's opening can show a finished one. */
export function Chat({scene, step = 3}: {scene: Scene; step?: number}) {
  return (
    <figure className="ad-chat" aria-label="An example conversation with Oak & Ember's assistant">
      <div className="ad-chat-head">
        <span className="ad-avatar" aria-hidden>O</span>
        <span className="ad-chat-who"><b>Oak &amp; Ember</b><small><i />Assistant · online</small></span>
        <span className="mono ad-time">{scene.time}</span>
      </div>
      <div className="ad-log">
        {step >= 1 && <p className="ad-msg ad-me">{scene.ask}</p>}
        {step === 2 && <p className="ad-msg ad-bot ad-typing" aria-label="Typing"><i /><i /><i /></p>}
        {step >= 3 && <p className="ad-msg ad-bot">{scene.answer}</p>}
        {step >= 3 && scene.source && <span className="ad-source mono">From: {scene.source}</span>}
        {step >= 3 && scene.handoff && <span className="ad-source ad-source-person mono">Handed to a person</span>}
      </div>
      <div className="ad-input" aria-hidden><span>Ask a question…</span><i /></div>
    </figure>
  );
}
