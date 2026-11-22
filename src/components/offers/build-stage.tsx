'use client';

import {useEffect, useRef, useState} from 'react';

import {Check} from '@/components/icons';
import {APPS, money} from '@/lib/pricing';
import {regionalAmount, formatRegionalMoney, type Region} from '@/lib/regional-pricing';

// The centrepiece of the Web Apps page: one example app, built in front of you in the three stages it's sold in.
// Scrolling through the track moves it from a clickable wireframe (the scoping sprint), to a working first
// version (MVP), to a finished product (full build). Each stage's name, timeline, price, "best for" line and
// inclusions are the price book's (src/lib/pricing.ts). The app itself, "Northstar", is an illustration.
const STAGES = APPS.map((p) => ({
  id: p.id,
  name: p.name,
  price: `${p.from ? 'From ' : ''}${money(p.amount)}`,
  time: p.specs?.find(([k]) => k === 'Timeline')?.[1] ?? '',
  bestFor: p.bestFor,
  includes: p.includes ?? [],
  terms: p.terms,
}));
const N = STAGES.length;
function getStages(region: Region) {
  return STAGES.map(s => ({...s, price: `${APPS.find(p => p.id === s.id)?.from ? 'From ' : ''}${region === 'in' ? formatRegionalMoney(regionalAmount(s.id, APPS.find(p => p.id === s.id)!.amount, region), region) : money(APPS.find(p => p.id === s.id)!.amount)}`}));
}

/** Which stage the reader has scrolled to, and how far through the whole track they are. */
function useStage() {
  const track = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / span));
      el.style.setProperty('--p', p.toFixed(4));
      setStage(Math.min(N - 1, Math.floor(p * N)));
    };
    measure();
    window.addEventListener('scroll', measure, {passive: true});
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, []);

  /** Scroll so a given stage is the one showing. */
  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const span = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY + span * ((i + 0.5) / N);
    window.scrollTo({top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  };

  return {track, stage, go};
}

/** The three stages on one pinned screen: the list on the left, the app being built on the right. */
export function BuildStage({region = 'us'}: {region?: Region}) {
  const {track, stage, go} = useStage();
  const stages = getStages(region);

  return (
    <div ref={track} className="bs" data-stage={stage + 1}>
      <div className="bs-pin">
        <div className="wrap bs-grid">
          <ol className="bs-list">
            {stages.map((s, i) => (
              <li key={s.id} data-on={i === stage || undefined} data-done={i < stage || undefined}>
                <button type="button" className="bs-head" onClick={() => go(i)} aria-current={i === stage ? 'step' : undefined}>
                  <span className="mono num-badge">0{i + 1}</span>
                  <span className="bs-name">{s.name}</span>
                  <span className="mono bs-price">{s.price}</span>
                </button>
                <div className="bs-body">
                  <div>
                    <p className="bs-meta mono">{s.time}{s.terms ? ` · ${s.terms}` : ''}</p>
                    <p className="bs-for">{s.bestFor}</p>
                    <ul>{s.includes.map((x) => <li key={x}><Check size={14} />{x}</li>)}</ul>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <div className="bs-stage">
            <AppWindow />
            <div className="bs-rail" aria-hidden><i /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** For narrow screens and reduced motion: the three stages one after another, each with its own drawing. */
export function BuildStageStack({region = 'us'}: {region?: Region}) {
  const stages = getStages(region);
  return (
    <ol className="bs-stack">
      {stages.map((s, i) => (
        <li key={s.id} className="bs" data-stage={i + 1}>
          <div className="bs-stack-head">
            <span className="mono num-badge">0{i + 1}</span>
            <h3>{s.name}</h3>
            <span className="mono bs-price">{s.price}</span>
          </div>
          <AppWindow />
          <p className="bs-meta mono">{s.time}{s.terms ? ` · ${s.terms}` : ''}</p>
          <p className="bs-for">{s.bestFor}</p>
          <ul>{s.includes.map((x) => <li key={x}><Check size={14} />{x}</li>)}</ul>
        </li>
      ))}
    </ol>
  );
}

const ROWS: [string, string, string][] = [
  ['Spring launch site', 'Maya Chen', 'In review'],
  ['Onboarding flow', 'Sam Ortiz', 'In progress'],
  ['Partner portal', 'Priya Nair', 'Planned'],
  ['Annual report', 'Leo Brandt', 'Done'],
];

/**
 * One example app drawn at every stage at once. CSS shows each part from the stage it arrives in (data-from)
 * and turns the whole thing into a wireframe at stage one.
 */
function AppWindow() {
  return (
    <figure className="aw" aria-label="An example app, Northstar, drawn at this stage of the build">
      <div className="aw-bar">
        <span className="aw-lights" aria-hidden><i /><i /><i /></span>
        <span className="aw-url">
          <span className="aw-sketch-only">Wireframe · not live</span>
          <span data-from="2">app.northstar.com</span>
        </span>
        <span className="aw-live mono" data-from="2"><i />Live</span>
      </div>

      <div className="aw-body">
        <nav className="aw-side" aria-hidden>
          <span className="aw-logo"><i />Northstar</span>
          <span className="aw-nav" data-active>Projects</span>
          <span className="aw-nav">Clients</span>
          <span className="aw-nav" data-from="3">Invoices</span>
          <span className="aw-nav" data-from="3">Team</span>
          <span className="aw-nav aw-admin" data-from="3">Admin</span>
          <span className="aw-me">
            <i className="aw-avatar">J</i>
            <span><b>Jane Miller</b><small data-from="3">Owner</small></span>
          </span>
        </nav>

        <div className="aw-main">
          <div className="aw-top">
            <h4>Projects</h4>
            <span className="aw-btn">New project</span>
          </div>

          <div className="aw-cards" data-from="3">
            <div className="aw-card"><small>Paid this month</small><b>$12,480</b></div>
            <div className="aw-card"><small>Invoice #1042</small><b className="aw-paid">Paid</b></div>
            <div className="aw-card"><small>Checks</small><b className="aw-pass">All passing</b></div>
          </div>

          <div className="aw-table">
            {ROWS.map(([name, who, status], i) => (
              <div key={name} className="aw-row" style={{'--k': i} as React.CSSProperties}>
                <span className="aw-cell-name">{name}</span>
                <span className="aw-cell-who">{who}</span>
                <span className="aw-status" data-status={status}>{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The scoping sprint's own marks: the flow, the plan and the quote, pinned to the wireframe. */}
      <span className="aw-note aw-note-flow aw-sketch-only">Sign in → Projects → Project</span>
      <span className="aw-note aw-note-plan aw-sketch-only">Technical plan: data, sign-in, hosting</span>
      <span className="aw-note aw-note-quote aw-sketch-only">Fixed quote ✓</span>
      <figcaption className="mono aw-cap">Northstar · an example app</figcaption>
    </figure>
  );
}
