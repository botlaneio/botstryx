'use client';

import {useState} from 'react';

export type PathStep = {title: string; body: string; tags: string[]; note?: string};

/**
 * How a project runs, as a line you can step along. The steps sit on a ruled track; choosing one fills the
 * track up to it and shows what happens there.
 */
export function PathTimeline({steps}: {steps: PathStep[]}) {
  const [index, setIndex] = useState(0);
  const step = steps[index];
  const last = steps.length - 1;

  // Left and right arrows move along the line, as they would along a row of tabs.
  const onKeyDown = (e: React.KeyboardEvent) => {
    const next = e.key === 'ArrowRight' ? Math.min(last, index + 1) : e.key === 'ArrowLeft' ? Math.max(0, index - 1) : null;
    if (next === null) return;
    e.preventDefault();
    setIndex(next);
    (e.currentTarget.querySelectorAll('[role="tab"]')[next] as HTMLElement | undefined)?.focus();
  };

  return (
    <div className="path">
      <div className="path-track" role="tablist" aria-label="Project steps" onKeyDown={onKeyDown} style={{'--at': index / last} as React.CSSProperties}>
        {steps.map((s, i) => (
          <button
            key={s.title}
            type="button"
            role="tab"
            id={`path-tab-${i}`}
            aria-selected={i === index}
            aria-controls="path-panel"
            tabIndex={i === index ? 0 : -1}
            data-done={i < index}
            onClick={() => setIndex(i)}
          >
            <i aria-hidden />
            <span className="mono">0{i + 1}</span>
            <span className="name">{s.title}</span>
          </button>
        ))}
      </div>

      {/* The key replays the panel's entrance when the step changes. */}
      <div className="path-panel" role="tabpanel" id="path-panel" aria-labelledby={`path-tab-${index}`} key={index}>
        <span className="count mono">0{index + 1} / 0{steps.length}</span>
        <div>
          <h3>{step.title}</h3>
          <p>{step.body}</p>
          <ul>
            {step.tags.map((t) => <li key={t}>{t}</li>)}
            {step.note && <li className="note">{step.note}</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
