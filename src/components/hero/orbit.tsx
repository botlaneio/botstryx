'use client';

// The hero's orbit: what we build, as five small live screens circling the logo. The card at the front is the one
// the headline names, so when the headline's phrase changes (nano-headline.tsx calls onTurn), the ring turns one
// card forward.
//
// The motion is two Theatre.js sequences from the homepage's project (src/components/theatre): "Orbit intro" opens
// the ring out from the logo once, on load, and "Orbit turn" plays for each step round. Theatre hands over numbers;
// render() places the cards from them, with the pointer tilting the whole ring a little.
//
// Under reduced motion the ring stands still, already open, and Theatre isn't loaded. Without script only the front
// card shows, in front of the logo. The cards are a picture of the rail below, which has the links, so the orbit is
// hidden from screen readers.

import {useEffect, useRef} from 'react';

import {BotMark} from '@/components/brand/bot-mark';
import {loadHomeProject, prefersReducedMotion} from '@/components/theatre/project';

const css = (vars: Record<string, string | number>) => vars as React.CSSProperties;

/** One card per headline phrase, in the same order. */
const CARDS: {name: string; meta: string; art: React.ReactNode}[] = [
  {
    name: 'Websites',
    meta: 'From $2,500',
    art: (
      <div className="ob-site">
        <div className="ob-nav"><i /><u /><u /><u /><em /></div>
        <div className="ob-img" />
        <u /><u className="short" />
      </div>
    ),
  },
  {
    name: 'Web Apps',
    meta: 'Scoping $1,500',
    art: (
      <div className="ob-app">
        <div className="ob-side"><i /><u /><u /><u /></div>
        <div className="ob-rows">
          {[0, 1, 2, 3].map((r) => <div key={r}><i style={css({'--k': r})} /><u /><b /></div>)}
        </div>
      </div>
    ),
  },
  {
    name: 'slotLane',
    meta: '$10 per person',
    art: (
      <div className="ob-cal">
        <div className="ob-days">{Array.from({length: 21}, (_, i) => <i key={i} data-on={[4, 9, 10, 15].includes(i) || undefined} />)}</div>
        <span className="ob-chip mono">Booked · Tue 10:30</span>
      </div>
    ),
  },
  {
    name: 'Dashboards',
    meta: 'Live data',
    art: (
      <div className="ob-dash">
        <div className="ob-kpis"><span><b>1,284</b><i>bookings</i></span><span><b>+18%</b><i>this month</i></span></div>
        <div className="ob-bars">{[38, 54, 46, 70, 62, 84, 76, 92].map((h, i) => <i key={i} style={css({'--h': `${h}%`, '--k': i})} />)}</div>
      </div>
    ),
  },
  {
    name: 'Care',
    meta: 'From $99/month',
    art: (
      <div className="ob-care">
        <div className="ob-up">{Array.from({length: 30}, (_, i) => <i key={i} style={css({'--k': i})} />)}</div>
        <span className="ob-ok mono"><i />All systems normal</span>
      </div>
    ),
  },
];
const N = CARDS.length;
const STEP = 360 / N;

type Values = {
  ring: {radius: number; scale: number; tilt: number; opacity: number; spin: number};
  core: {glow: number; scale: number};
  turn: {progress: number; dip: number; lift: number};
};
// Where everything comes to rest: what reduced motion shows, and what Theatre's props default to.
const REST: Values = {
  ring: {radius: 1, scale: 1, tilt: -12, opacity: 1, spin: 0},
  core: {glow: 1, scale: 1},
  turn: {progress: 1, dip: 0, lift: 1},
};

export function HeroOrbit({front}: {front: number}) {
  const ref = useRef<HTMLDivElement>(null);
  const api = useRef<{turnTo: (i: number) => void} | null>(null);
  // The card the headline is on, kept for when the orbit is ready to turn (Theatre may still be loading).
  const want = useRef(0);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const ring = root.querySelector<HTMLElement>('.ob-ring')!;
    const core = root.querySelector<HTMLElement>('.ob-core')!;
    const cards = [...root.querySelectorAll<HTMLElement>('.ob-card')];

    // The turn: the ring goes from card `from` to card `to`. Once a turn has landed, `settled` holds it there.
    let from = want.current, to = want.current, settled = true;
    const v: Values = structuredClone(REST);
    let px = 0, py = 0, tx = 0, ty = 0, raf = 0;

    const render = () => {
      const w = root.offsetWidth;
      const R = Math.min(w * 0.34, 270) * v.ring.radius;
      const delta = (to - from + N) % N;
      const at = settled ? to : from + v.turn.progress * delta;
      const tilt = ((v.ring.tilt - v.turn.dip + py * 5) * Math.PI) / 180;
      ring.style.opacity = String(v.ring.opacity);
      ring.style.transform = `rotateY(${(px * 9).toFixed(2)}deg) scale(${v.ring.scale.toFixed(4)})`;
      core.style.setProperty('--glow', v.core.glow.toFixed(3));
      core.style.setProperty('--core-scale', v.core.scale.toFixed(3));
      cards.forEach((el, i) => {
        const deg = (i - at) * STEP + v.ring.spin * 360;
        const th = (deg * Math.PI) / 180;
        const x = Math.sin(th) * R;
        const z = Math.cos(th) * R;
        const depth = (Math.cos(th) + 1) / 2;
        const lift = settled ? (i === to ? 1 : 0) : i === to ? v.turn.lift : i === from ? 1 - v.turn.lift : 0;
        const y = -z * Math.sin(tilt) - lift * 10;
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${(z * Math.cos(tilt)).toFixed(1)}px) scale(${(1 + lift * 0.06).toFixed(4)})`;
        el.style.opacity = (0.28 + 0.72 * depth ** 1.6).toFixed(3);
        el.style.zIndex = String(Math.round(depth * 100));
        el.toggleAttribute('data-front', lift > 0.5);
      });
    };

    // The pointer tilts the ring, gently and with a little lag.
    const follow = () => {
      raf = 0;
      px += (tx - px) * 0.08;
      py += (ty - py) * 0.08;
      render();
      if (Math.abs(tx - px) > 0.001 || Math.abs(ty - py) > 0.001) raf = requestAnimationFrame(follow);
    };
    const stage = root.closest<HTMLElement>('.stage') ?? root;
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = stage.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(follow);
    };
    const resize = new ResizeObserver(render);
    resize.observe(root);

    if (prefersReducedMotion()) {
      root.dataset.ready = '';
      api.current = {turnTo: (i) => { from = to = i; render(); }};
      render();
      return () => resize.disconnect();
    }

    // Closed until the intro starts; if Theatre never loads, open anyway.
    v.ring.opacity = 0;
    render();
    root.dataset.ready = '';
    const fallback = window.setTimeout(() => { Object.assign(v.ring, REST.ring); render(); }, 4000);

    let dead = false;
    const off: (() => void)[] = [];
    stage.addEventListener('pointermove', onPointer);

    loadHomeProject().then(({core: theatre, project}) => {
      if (dead) return;
      window.clearTimeout(fallback);
      const n = (x: number, min: number, max: number) => theatre.types.number(x, {range: [min, max]});

      const intro = project.sheet('Orbit intro');
      off.push(intro.object('Ring', {
        radius: n(REST.ring.radius, 0, 2), scale: n(REST.ring.scale, 0.3, 2), tilt: n(REST.ring.tilt, -60, 60),
        opacity: n(REST.ring.opacity, 0, 1), spin: n(REST.ring.spin, -2, 2),
      }).onValuesChange((x) => { Object.assign(v.ring, x); render(); }));
      off.push(intro.object('Core', {glow: n(REST.core.glow, 0, 2), scale: n(REST.core.scale, 0.3, 2)})
        .onValuesChange((x) => { Object.assign(v.core, x); render(); }));

      const turn = project.sheet('Orbit turn');
      off.push(turn.object('Turn', {progress: n(1, 0, 1), dip: n(0, -20, 20), lift: n(1, 0, 1)})
        .onValuesChange((x) => { Object.assign(v.turn, x); render(); }));
      const length = theatre.val(turn.sequence.pointer.length);
      turn.sequence.position = length;

      from = to = want.current;
      api.current = {
        turnTo: (i) => {
          if (i === to) return;
          from = settled ? to : from;
          to = i;
          settled = false;
          turn.sequence.position = 0;
          turn.sequence.play().then((done) => {
            if (done && !dead) { settled = true; render(); }
          });
        },
      };

      intro.sequence.position = 0;
      intro.sequence.play();
    });

    return () => {
      dead = true;
      window.clearTimeout(fallback);
      cancelAnimationFrame(raf);
      stage.removeEventListener('pointermove', onPointer);
      resize.disconnect();
      off.forEach((f) => f());
      api.current = null;
    };
  }, []);

  useEffect(() => {
    want.current = front % N;
    api.current?.turnTo(want.current);
  }, [front]);

  return (
    <div ref={ref} className="ob" aria-hidden>
      <div className="ob-core">
        <BotMark size={76} />
      </div>
      <div className="ob-ring">
        {CARDS.map((c) => (
          <div key={c.name} className="ob-card">
            <header><b>{c.name}</b><span className="mono">{c.meta}</span></header>
            <div className="ob-art">{c.art}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
