'use client';

import {useState} from 'react';
import {SegmentedControl, SegmentedControlItem} from '@astryxdesign/core/SegmentedControl';

// The choices a design system makes once. Each sets a few variables on the stage, and every page under it reads
// them, so one change restyles all of them together.
const TYPE = {
  sans: {label: 'Sans', family: 'var(--font-instrument)', weight: 600, tracking: '-0.04em'},
  serif: {label: 'Serif', family: 'Georgia, "Times New Roman", serif', weight: 500, tracking: '-0.02em'},
  mono: {label: 'Mono', family: 'var(--font-jetbrains)', weight: 600, tracking: '-0.05em'},
} as const;
const ACCENTS = [
  // 'on' is the text colour on a filled button. Ink follows the theme, so it stays visible in dark mode.
  {id: 'blue', label: 'Blue', value: '#2f55f0', on: '#fff'},
  {id: 'teal', label: 'Teal', value: '#0e8c7c', on: '#fff'},
  {id: 'ember', label: 'Ember', value: '#c24e1e', on: '#fff'},
  {id: 'ink', label: 'Ink', value: 'var(--color-text-primary)', on: 'var(--color-background-surface)'},
] as const;
const CORNERS = {sharp: {label: 'Sharp', r: '0px'}, soft: {label: 'Soft', r: '6px'}, round: {label: 'Round', r: '16px'}} as const;

type TypeId = keyof typeof TYPE;
type CornerId = keyof typeof CORNERS;

/** Three pages of one site, and the three decisions that make them look like one site. */
export function SystemStudio() {
  const [type, setType] = useState<TypeId>('sans');
  const [accent, setAccent] = useState<(typeof ACCENTS)[number]['id']>('blue');
  const [corner, setCorner] = useState<CornerId>('soft');

  const t = TYPE[type];
  const vars = {
    '--ds-font': t.family,
    '--ds-weight': t.weight,
    '--ds-track': t.tracking,
    '--ds-accent': ACCENTS.find((a) => a.id === accent)!.value,
    '--ds-on': ACCENTS.find((a) => a.id === accent)!.on,
    '--ds-radius': CORNERS[corner].r,
  } as React.CSSProperties;

  return (
    <div className="studio">
      <div className="studio-controls" role="group" aria-label="Design system">
        <div className="studio-control">
          <span className="mono">Type</span>
          <SegmentedControl label="Typeface" size="sm" value={type} onChange={(v) => setType(v as TypeId)}>
            {Object.entries(TYPE).map(([id, o]) => <SegmentedControlItem key={id} value={id} label={o.label} />)}
          </SegmentedControl>
        </div>
        <div className="studio-control">
          <span className="mono">Colour</span>
          <div className="swatches" role="radiogroup" aria-label="Accent colour">
            {ACCENTS.map((a) => (
              <button
                key={a.id}
                type="button"
                role="radio"
                aria-checked={accent === a.id}
                aria-label={a.label}
                title={a.label}
                style={{'--sw': a.value} as React.CSSProperties}
                onClick={() => setAccent(a.id)}
              />
            ))}
          </div>
        </div>
        <div className="studio-control">
          <span className="mono">Corners</span>
          <SegmentedControl label="Corners" size="sm" value={corner} onChange={(v) => setCorner(v as CornerId)}>
            {Object.entries(CORNERS).map(([id, o]) => <SegmentedControlItem key={id} value={id} label={o.label} />)}
          </SegmentedControl>
        </div>
      </div>

      {/* The three pages. Everything inside reads the variables above. */}
      <div className="studio-stage" style={vars} aria-hidden>
        <MiniPage name="Home">
          <b className="ds-h big">Advice for what comes next.</b>
          <i className="ds-line dw-80" />
          <i className="ds-line dw-60" />
          <span className="ds-btn">Book a call</span>
          <i className="ds-pic" />
        </MiniPage>
        <MiniPage name="Services">
          <b className="ds-h">Services</b>
          {['Accounting', 'Tax', 'Planning'].map((s) => (
            <div className="ds-card" key={s}>
              <span className="ds-dot" />
              <b>{s}</b>
              <i className="ds-line dw-90" />
            </div>
          ))}
        </MiniPage>
        <MiniPage name="Team">
          <b className="ds-h">Team</b>
          <div className="ds-people">
            {[0, 1, 2, 3].map((n) => <i key={n} className="ds-face" />)}
          </div>
          <i className="ds-line dw-70" />
          <span className="ds-btn ghost">Careers</span>
        </MiniPage>
      </div>
    </div>
  );
}

function MiniPage({name, children}: {name: string; children: React.ReactNode}) {
  return (
    <div className="ds-page">
      <div className="ds-bar"><span className="ds-logo">Northline</span><span className="mono">{name}</span></div>
      <div className="ds-body">{children}</div>
    </div>
  );
}
