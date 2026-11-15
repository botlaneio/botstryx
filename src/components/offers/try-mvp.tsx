'use client';

import {useId, useState} from 'react';

import {Check} from '@/components/icons';

// "The core workflow, working end to end", one of MVP development's inclusions, made literal: a tiny first
// version of the example app that works. Sign in, add a project, move it along. Everything stays in this page.
type Status = 'Planned' | 'In progress' | 'Done';
const NEXT: Record<Status, Status> = {Planned: 'In progress', 'In progress': 'Done', Done: 'Planned'};
const START: {id: number; name: string; status: Status}[] = [
  {id: 1, name: 'Spring launch site', status: 'In progress'},
  {id: 2, name: 'Partner portal', status: 'Planned'},
];

export function TryMvp() {
  const [signedIn, setSignedIn] = useState(false);
  const [projects, setProjects] = useState(START);
  const [name, setName] = useState('');
  const [fresh, setFresh] = useState<number | null>(null);
  const id = useId();

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    const next = Math.max(0, ...projects.map((p) => p.id)) + 1;
    setProjects((ps) => [{id: next, name: n.slice(0, 40), status: 'Planned'}, ...ps]);
    setFresh(next);
    setName('');
  };
  const advance = (pid: number) => setProjects((ps) => ps.map((p) => (p.id === pid ? {...p, status: NEXT[p.status]} : p)));
  const done = projects.filter((p) => p.status === 'Done').length;

  return (
    <div className="tm">
      <figure className="aw tm-window" aria-label="A working demo of an example app">
        <div className="aw-bar">
          <span className="aw-lights" aria-hidden><i /><i /><i /></span>
          <span className="aw-url">app.northstar.com{signedIn ? '/projects' : '/sign-in'}</span>
          <span className="aw-live mono"><i />Live</span>
        </div>

        {!signedIn ? (
          <div className="pa-signin tm-signin">
            <span className="aw-logo"><i />Northstar</span>
            <h4>Sign in to try it</h4>
            <label><span>Email</span><span className="pa-input">jane@northstar.com</span></label>
            <button type="button" className="aw-btn pa-wide tm-go" onClick={() => setSignedIn(true)}>Sign in as Jane</button>
            <small>A demo account. Nothing here leaves this page.</small>
          </div>
        ) : (
          <div className="tm-app">
            <div className="aw-top">
              <h4>Projects</h4>
              <span className="tm-me"><i className="aw-avatar">J</i>Jane<button type="button" className="tm-out" onClick={() => setSignedIn(false)}>Sign out</button></span>
            </div>
            <form className="tm-add" onSubmit={add}>
              <label htmlFor={id} className="sr-only">New project name</label>
              <input id={id} value={name} onChange={(e) => setName(e.target.value)} placeholder="Name a new project" maxLength={40} autoComplete="off" />
              <button type="submit" className="aw-btn" disabled={!name.trim()}>Add</button>
            </form>
            <ul className="tm-list" aria-live="polite">
              {projects.map((p) => (
                <li key={p.id} data-fresh={p.id === fresh || undefined}>
                  <span className="aw-cell-name">{p.name}</span>
                  <button type="button" className="aw-status tm-status" data-status={p.status} onClick={() => advance(p.id)} aria-label={`${p.name}: ${p.status}. Move to ${NEXT[p.status]}`}>
                    {p.status === 'Done' && <Check size={11} />}{p.status}
                  </button>
                </li>
              ))}
            </ul>
            <p className="tm-foot mono">{projects.length} projects · {done} done · click a status to move it along</p>
          </div>
        )}
      </figure>
    </div>
  );
}
