'use client';

import {openLane} from '@/lib/lane-open';

/** Buttons that open agentLane, this site's own assistant, with a question already asked. */
export function AskLane({questions}: {questions: string[]}) {
  return (
    <div className="al-asks">
      {questions.map((q) => (
        <button key={q} type="button" onClick={() => openLane(q)}>
          <span>{q}</span>
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M4 12 12 4M6 4h6v6" /></svg>
        </button>
      ))}
      <button type="button" className="al-open" onClick={() => openLane()}>Open Lane and ask your own</button>
    </div>
  );
}
