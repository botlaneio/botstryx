'use client';

import {useState} from 'react';

// "Clickable wireframes", one of the scoping sprint's four deliverables, made literal: three grey screens of an
// example app you can click through, with the user flow above them lighting up as you go. An illustration.
type Screen = 'sign-in' | 'projects' | 'project';
const FLOW: [Screen, string][] = [['sign-in', 'Sign in'], ['projects', 'Projects'], ['project', 'Project']];

export function ClickableWireframe() {
  const [screen, setScreen] = useState<Screen>('sign-in');
  const at = FLOW.findIndex(([s]) => s === screen);

  return (
    <div className="cw">
      <ol className="cw-flow" aria-label="User flow">
        {FLOW.map(([s, label], i) => (
          <li key={s} data-on={i === at || undefined} data-done={i < at || undefined}>
            <button type="button" onClick={() => setScreen(s)} aria-current={i === at ? 'step' : undefined}>
              <span className="mono">0{i + 1}</span>{label}
            </button>
          </li>
        ))}
      </ol>

      <figure className="aw cw-window" aria-label={`Wireframe: ${FLOW[at][1]} screen`}>
        <div className="aw-bar">
          <span className="aw-lights" aria-hidden><i /><i /><i /></span>
          <span className="aw-url">Wireframe · {FLOW[at][1]}</span>
          <span className="mono cw-proto">Prototype</span>
        </div>

        <div className="cw-screen" key={screen}>
          {screen === 'sign-in' && (
            <div className="cw-signin">
              <span className="cw-bar cw-w30" />
              <span className="cw-bar cw-w60 cw-tall" />
              <span className="cw-field">Email</span>
              <span className="cw-field">Password</span>
              <button type="button" className="cw-hot cw-btn" onClick={() => setScreen('projects')}>Sign in</button>
              <span className="cw-bar cw-w40" />
            </div>
          )}

          {screen === 'projects' && (
            <div className="cw-list">
              <div className="cw-head"><span className="cw-label">Projects</span><span className="cw-ghost">+ New</span></div>
              {['Spring launch site', 'Onboarding flow', 'Partner portal'].map((name, i) => (
                i === 0
                  ? <button key={name} type="button" className="cw-hot cw-row" onClick={() => setScreen('project')}><span>{name}</span><span className="cw-bar cw-w20" /></button>
                  : <div key={name} className="cw-row"><span className="cw-bar cw-w50" /><span className="cw-bar cw-w20" /></div>
              ))}
            </div>
          )}

          {screen === 'project' && (
            <div className="cw-detail">
              <button type="button" className="cw-hot cw-back" onClick={() => setScreen('projects')}>← Projects</button>
              <span className="cw-label cw-big">Spring launch site</span>
              <div className="cw-cols">
                <div className="cw-box"><span className="cw-bar cw-w60" /><span className="cw-bar cw-w80" /><span className="cw-bar cw-w40" /></div>
                <div className="cw-box"><span className="cw-bar cw-w50" /><span className="cw-bar cw-w70" /></div>
              </div>
              <span className="cw-note">Status, files and comments go here</span>
            </div>
          )}
        </div>
      </figure>
      <p className="mono pa-cap">{at < 2 ? 'Click the outlined element to go on' : 'Go back, or pick a step above'}</p>
    </div>
  );
}
