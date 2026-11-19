'use client';

// "Brief to live": a site assembling itself as the page scrolls. A brief is typed, a browser window draws itself
// round it, the page goes in as a wireframe, fills in, and goes live on a phone as well.
//
// The choreography is a Theatre.js sequence, the "Brief to live" sheet of the homepage's project
// (src/components/theatre). Scrolling through the section moves the sequence's playhead. Theatre only hands
// over numbers: each object writes them as CSS variables on its element, and the CSS draws from those.
//
// Every variable's fallback in the CSS is the finished page, so without JavaScript, before Theatre has loaded, and
// under reduced motion, the section shows the end state and does not pin. Theatre loads only when the section comes near
// the screen (or when the hero has already loaded it).

import {useEffect, useRef} from 'react';

import {loadHomeProject, prefersReducedMotion, scrub, type Sheet} from '@/components/theatre/project';

const BRIEF = 'A booking system for our clinic.';

// What each act is called, in the words of the process further down the page.
const STEPS = [
  {title: 'Start with a brief', body: 'Tell us what you need and what you want to achieve.'},
  {title: 'See the design', body: 'Your content. Your brand. A design you can review and refine.'},
  {title: 'Follow the build', body: 'See the progress as your project comes together.'},
  {title: 'Make it live', body: 'Launch, handover, and Care for ongoing upkeep.'},
];

const BLOCKS = ['Nav', 'Title', 'Image', 'Card 1', 'Card 2', 'Card 3'] as const;

type Types = typeof import('@theatre/core').types;

/** The objects on the sheet and their props. Each prop's default is its value in the finished page. */
function objects(t: Types) {
  const n = (v: number, min: number, max: number) => t.number(v, {range: [min, max]});
  const block = {opacity: n(1, 0, 1), y: n(0, -80, 80), fill: n(1, 0, 1)};
  return {
    Camera: {zoom: n(1, 0.6, 1.6), tilt: n(0, -45, 45), turn: n(0, -45, 45), x: n(0, -20, 20), y: n(0, -80, 80)},
    Brief: {opacity: n(0, 0, 1), y: n(0, -120, 120), scale: n(1, 0.3, 1.5), typed: n(1, 0, 1)},
    Frame: {opacity: n(1, 0, 1), draw: n(1, 0, 1), lift: n(1, 0, 1)},
    Captions: {at: n(3, 0, 3)},
    Live: {opacity: n(1, 0, 1), scale: n(1, 0.5, 1.5)},
    Phone: {opacity: n(1, 0, 1), x: n(0, -200, 200), rotate: n(0, -30, 30)},
    ...Object.fromEntries(BLOCKS.map((b) => [b, block])),
  };
}

/** Puts every object on the sheet, and writes its values on the elements that carry its name as CSS variables. */
function wire(sheet: Sheet, root: HTMLElement, t: Types) {
  const off: (() => void)[] = [];
  const brief = root.querySelector<HTMLElement>('[data-typed]');
  const captions = [...root.querySelectorAll<HTMLElement>('[data-step]')];

  for (const [key, props] of Object.entries(objects(t))) {
    const obj = sheet.object(key, props);
    const els = [...root.querySelectorAll<HTMLElement>(`[data-th="${key}"]`)];
    off.push(obj.onValuesChange((v: Record<string, number>) => {
      for (const el of els) for (const [k, x] of Object.entries(v)) el.style.setProperty(`--${k}`, String(Math.round(x * 1e4) / 1e4));
      if (key === 'Brief' && brief) brief.textContent = BRIEF.slice(0, Math.round(v.typed * BRIEF.length));
      // One caption at a time: each is fully in at its own number and gone a little over half a step away.
      if (key === 'Captions') captions.forEach((c, i) => c.style.setProperty('--a', String(Math.max(0, 1 - Math.abs(v.at - i) * 1.8))));
    }));
  }
  // The window's outline is drawn along its length (pathLength 1), which only holds when the SVG is drawn at its real
  // size: a stretched viewBox with a non-scaling stroke draws it wrongly in Chrome. So the rect follows the window's size.
  const frame = root.querySelector<HTMLElement>('.btl-window');
  const svg = frame?.querySelector('svg');
  const rect = svg?.querySelector('rect');
  if (frame && svg && rect) {
    const fit = () => {
      const w = frame.offsetWidth, h = frame.offsetHeight;
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      rect.removeAttribute('vector-effect');
      for (const [k, v] of Object.entries({x: 0.5, y: 0.5, width: w - 1, height: h - 1, rx: 14})) rect.setAttribute(k, String(v));
    };
    const ro = new ResizeObserver(fit);
    ro.observe(frame);
    off.push(() => ro.disconnect());
  }
  return () => off.forEach((f) => f());
}

export function BuildSequence() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;

    let dead = false;
    let cleanup = () => {};

    const start = async () => {
      const {core, project} = await loadHomeProject();
      if (dead) return;
      const sheet = project.sheet('Brief to live');
      const unwire = wire(sheet, root, core.types);
      const length = core.val(sheet.sequence.pointer.length);
      root.classList.add('is-live');
      const stop = scrub(sheet, () => {
        const r = root.getBoundingClientRect();
        return Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight))) * length;
      });
      cleanup = () => {
        stop();
        root.classList.remove('is-live');
        unwire();
      };
    };

    // Load Theatre only once the section is a screen or so away.
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        start();
      }
    }, {rootMargin: '100% 0px'});
    io.observe(root);

    return () => {
      dead = true;
      io.disconnect();
      cleanup();
    };
  }, []);

  return (
    <section ref={ref} aria-labelledby="hm-live" className="btl">
      <div className="btl-pin">
        <div className="wrap btl-grid">
          <div className="btl-side">
            <p className="mono hm-kicker"><i aria-hidden />From brief to live</p>
            <h2 id="hm-live">Watch it come together. <span>One page at a time.</span></h2>
            <ol className="btl-steps" data-th="Captions">
              {STEPS.map((s, i) => (
                <li key={s.title} data-step={i}>
                  <span className="mono">0{i + 1}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="btl-stage" aria-hidden>
            <div className="btl-camera" data-th="Camera">
              <div className="btl-window" data-th="Frame">
                <svg className="btl-outline" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <rect x="0.5" y="0.5" width="99" height="99" rx="3" pathLength="1" vectorEffect="non-scaling-stroke" />
                </svg>
                <div className="btl-bar">
                  <i /><i /><i />
                  <span className="mono">yourclinic.com</span>
                  <b className="btl-live mono" data-th="Live"><i />Live</b>
                </div>
                <div className="btl-page">
                  <div className="btl-block btl-nav" data-th="Nav"><s /><u /><u /><u /><em /></div>
                  <div className="btl-block btl-title" data-th="Title"><u /><u /><em /></div>
                  <div className="btl-block btl-image" data-th="Image"><s /></div>
                  <div className="btl-cards">
                    {(['Card 1', 'Card 2', 'Card 3'] as const).map((c, i) => (
                      <div key={c} className="btl-block btl-card" data-th={c} style={{'--k': i} as React.CSSProperties}><s /><u /><u /></div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="btl-phone" data-th="Phone">
                <div className="btl-notch" />
                <s className="btl-phone-img" />
                <u /><u /><em />
              </div>

              <div className="btl-brief" data-th="Brief">
                <span className="mono">Your brief</span>
                <p><span data-typed>{BRIEF}</span><i className="btl-caret" /></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
