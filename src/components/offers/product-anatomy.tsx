'use client';

import {useId, useState} from 'react';

import {Check} from '@/components/icons';
import {APPS} from '@/lib/pricing';

// The full product build, taken apart: each of its five inclusions (the price book's words, in order) opens the
// part of the example app it describes. "Northstar" and everything inside it is an illustration.
const FULL = APPS.find((p) => p.id === 'app-full')!;
const [SECURE, ROLES, PAYMENTS, ADMIN, LAUNCH] = FULL.includes!;

type Role = 'Owner' | 'Team member' | 'Client';
const ROLES_LIST: Role[] = ['Owner', 'Team member', 'Client'];

const PARTS: {name: string; note: string}[] = [
  {name: SECURE, note: 'Every screen sits behind a sign-in, and every person has an account of their own.'},
  {name: ROLES, note: 'Each role sees what it should and nothing more. Switch roles to see the same app change.'},
  {name: PAYMENTS, note: 'Invoices, checkout and paid status inside the app, when your product takes money.'},
  {name: ADMIN, note: 'One place to manage the people, accounts and settings behind your product.'},
  {name: LAUNCH, note: 'Tested before it goes live, and supported through the launch itself.'},
];

/** Five tabs, one app: pick a part of the full build and the example app shows it. */
export function ProductAnatomy() {
  const [part, setPart] = useState(1);
  const [role, setRole] = useState<Role>('Owner');
  const id = useId();

  return (
    <div className="pa">
      <div className="pa-tabs" role="tablist" aria-label="Inside a full product build" aria-orientation="vertical">
        {PARTS.map((p, i) => (
          <button
            key={p.name}
            id={`${id}-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={i === part}
            aria-controls={`${id}-panel`}
            tabIndex={i === part ? 0 : -1}
            className="pa-tab"
            onClick={() => setPart(i)}
            onKeyDown={(e) => {
              const step = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
              if (!step) return;
              e.preventDefault();
              const next = (part + step + PARTS.length) % PARTS.length;
              setPart(next);
              document.getElementById(`${id}-tab-${next}`)?.focus();
            }}
          >
            <span className="mono num-badge">0{i + 1}</span>
            <span className="pa-tab-text">
              <b>{p.name}</b>
              <small>{p.note}</small>
            </span>
          </button>
        ))}
      </div>

      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${part}`} className="pa-stage">
        <figure className="aw pa-window" aria-label="An example app, Northstar">
          <div className="aw-bar">
            <span className="aw-lights" aria-hidden><i /><i /><i /></span>
            <span className="aw-url">app.northstar.com{part === 0 ? '/sign-in' : part === 2 ? '/invoices/1042' : part === 3 ? '/admin' : part === 4 ? '/launch' : ''}</span>
            <span className="aw-live mono"><i />Live</span>
          </div>
          <div className="pa-view" key={`${part}-${role}`}>
            {part === 0 && <SignIn />}
            {part === 1 && <Roles role={role} setRole={setRole} />}
            {part === 2 && <Invoice />}
            {part === 3 && <Admin />}
            {part === 4 && <Launch />}
          </div>
        </figure>
        <p className="mono pa-cap">Northstar · an example app</p>
      </div>
    </div>
  );
}

function SignIn() {
  return (
    <div className="pa-signin">
      <span className="aw-logo"><i />Northstar</span>
      <h4>Sign in to your account</h4>
      <label><span>Email</span><span className="pa-input">jane@northstar.com</span></label>
      <label><span>Password</span><span className="pa-input">••••••••••</span></label>
      <span className="aw-btn pa-wide">Sign in</span>
      <small>Every person signs in to an account of their own.</small>
    </div>
  );
}

const NAV: Record<Role, string[]> = {
  Owner: ['Projects', 'Clients', 'Invoices', 'Team', 'Admin'],
  'Team member': ['Projects', 'Clients'],
  Client: ['My projects', 'My invoices'],
};
const ROWS: Record<Role, [string, string][]> = {
  Owner: [['Spring launch site', 'Edit · Assign · Invoice'], ['Onboarding flow', 'Edit · Assign · Invoice'], ['Partner portal', 'Edit · Assign · Invoice']],
  'Team member': [['Spring launch site', 'Edit'], ['Onboarding flow', 'Edit'], ['Partner portal', 'View']],
  Client: [['Spring launch site', 'View · Comment'], ['Annual report', 'View · Comment']],
};

function Roles({role, setRole}: {role: Role; setRole: (r: Role) => void}) {
  return (
    <div className="aw-body pa-roles">
      <nav className="aw-side" aria-hidden>
        <span className="aw-logo"><i />Northstar</span>
        {NAV[role].map((n, i) => <span key={n} className={`aw-nav${n === 'Admin' ? ' aw-admin' : ''}`} data-active={i === 0 || undefined}>{n}</span>)}
        <span className="aw-me">
          <i className="aw-avatar">{role === 'Client' ? 'L' : role === 'Team member' ? 'S' : 'J'}</i>
          <span><b>{role === 'Client' ? 'Leo Brandt' : role === 'Team member' ? 'Sam Ortiz' : 'Jane Miller'}</b><small>{role}</small></span>
        </span>
      </nav>
      <div className="aw-main">
        <div className="pa-switch" role="radiogroup" aria-label="View the app as">
          <span className="mono">View as</span>
          {ROLES_LIST.map((r) => (
            <button key={r} type="button" role="radio" aria-checked={r === role} onClick={() => setRole(r)}>{r}</button>
          ))}
        </div>
        <div className="aw-top"><h4>{role === 'Client' ? 'My projects' : 'Projects'}</h4>{role !== 'Client' && <span className="aw-btn">New project</span>}</div>
        <div className="aw-table">
          {ROWS[role].map(([name, can]) => (
            <div key={name} className="aw-row pa-row">
              <span className="aw-cell-name">{name}</span>
              <span className="pa-can mono">{can}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Invoice() {
  return (
    <div className="pa-invoice">
      <div className="pa-invoice-head">
        <div><small className="mono">Invoice #1042</small><h4>Spring launch site</h4></div>
        <span className="aw-status" data-status="Done">Paid</span>
      </div>
      <dl>
        <div><dt>Design and build, phase 2</dt><dd>$4,800</dd></div>
        <div><dt>Content migration</dt><dd>$1,200</dd></div>
        <div className="pa-invoice-total"><dt>Total</dt><dd>$6,000</dd></div>
      </dl>
      <div className="pa-pay">
        <span className="pa-card mono">•••• 4242</span>
        <span className="pa-paid"><Check size={14} />Paid on 12 Nov</span>
      </div>
    </div>
  );
}

const PEOPLE: [string, string, string][] = [
  ['Jane Miller', 'Owner', 'Active'],
  ['Sam Ortiz', 'Team member', 'Active'],
  ['Priya Nair', 'Team member', 'Invited'],
  ['Leo Brandt', 'Client', 'Active'],
];

function Admin() {
  return (
    <div className="pa-admin">
      <div className="aw-top"><h4>Admin</h4><span className="aw-btn">Invite someone</span></div>
      <div className="pa-admin-stats">
        <div className="aw-card"><small>People</small><b>4</b></div>
        <div className="aw-card"><small>Roles</small><b>3</b></div>
        <div className="aw-card"><small>Open invites</small><b>1</b></div>
      </div>
      <div className="aw-table">
        {PEOPLE.map(([name, role, state]) => (
          <div key={name} className="aw-row">
            <span className="aw-cell-name">{name}</span>
            <span className="aw-cell-who">{role}</span>
            <span className="aw-status" data-status={state === 'Active' ? 'Done' : 'In review'}>{state}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const CHECKS = ['Sign-in and accounts', 'Roles and permissions', 'Payments, end to end', 'Admin panel', 'Every screen size', 'Launch day support'];

function Launch() {
  return (
    <div className="pa-launch">
      <div className="aw-top"><h4>Launch checklist</h4><span className="aw-status" data-status="Done">Ready</span></div>
      <ul>
        {CHECKS.map((c, i) => (
          <li key={c} style={{'--k': i} as React.CSSProperties}><span className="pa-tick"><Check size={12} /></span>{c}</li>
        ))}
      </ul>
    </div>
  );
}
