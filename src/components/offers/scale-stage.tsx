'use client';

import {useCallback, useEffect, useRef, useState, useSyncExternalStore} from 'react';

// Five scales of one website, from widest to smallest. Scrolling zooms through them without a cut: each
// drawing grows out of the centre of the one before it.
const SCENES = [
  {
    name: 'The world',
    unit: 'Measured in countries',
    title: 'Found wherever you’re looked for.',
    body: 'Advanced SEO and structured data, in every language your audience needs.',
    has: ['Advanced SEO', 'Multiple languages'],
  },
  {
    name: 'The site',
    unit: 'Measured in pages',
    title: 'A structure that holds as you grow.',
    body: 'Case studies, docs and a changelog, each built as a content type of its own and edited by your team.',
    has: ['Structured content', 'Content editor'],
  },
  {
    name: 'The page',
    unit: 'Measured in pixels',
    title: 'Drawn for you, on every screen.',
    body: 'Custom design on a design system of your own. Nothing borrowed, nothing left to a template.',
    has: ['Custom design', 'Everything in Ascend'],
  },
  {
    name: 'The moment',
    unit: 'Measured in frames',
    title: 'Motion that’s yours alone.',
    body: 'A signature motion language: how things enter, respond and leave. You review it as motion studies before we build.',
    has: ['Signature motion', 'Interactions'],
  },
  {
    name: 'The millisecond',
    unit: 'Measured in milliseconds',
    title: 'Fast, by agreement.',
    body: 'Limits on page weight and load time, set at the start and verified across devices before launch.',
    has: ['A performance budget'],
  },
];
const N = SCENES.length;

const HOLD = 0.28; // how long a drawing rests at full size, as a share of one step
const ZOOM = 8; // how much larger each scale is than the next
const clamp = (n: number) => Math.min(1, Math.max(0, n));
const smooth = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t); };

const QUERY = '(prefers-reduced-motion: reduce)';
const subscribe = (fn: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', fn);
  return () => mq.removeEventListener('change', fn);
};

/** The centrepiece of the Apex page: one website drawn at five scales, zoomed through by scrolling. */
export function ScaleStage() {
  const track = useRef<HTMLDivElement>(null);
  const reduced = useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el || reduced) return;
    const figs = Array.from(el.querySelectorAll<SVGGElement>('[data-fig]'));
    const caps = Array.from(el.querySelectorAll<HTMLElement>('[data-cap]'));
    const bar = el.querySelector<HTMLElement>('[data-bar]');

    const update = () => {
      const r = el.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      const f = (travel > 0 ? clamp(-r.top / travel) : 0) * (N - 1);

      figs.forEach((g, i) => {
        const d = f - i;
        let scale = 1;
        let opacity = 1;
        if (d > HOLD) {
          const u = clamp((d - HOLD) / (1 - 2 * HOLD));
          scale = ZOOM ** u;
          opacity = 1 - smooth(u / 0.7);
        } else if (d < -HOLD) {
          const u = clamp((d + 1 - HOLD) / (1 - 2 * HOLD));
          scale = ZOOM ** (u - 1);
          opacity = smooth((u - 0.3) / 0.7);
        }
        g.style.transform = `scale(${scale.toFixed(4)})`;
        g.style.opacity = opacity.toFixed(3);
        g.style.visibility = opacity > 0.001 ? 'visible' : 'hidden';
      });

      caps.forEach((c, i) => {
        const d = f - i;
        const opacity = 1 - smooth((Math.abs(d) - 0.3) / 0.18);
        c.style.opacity = opacity.toFixed(3);
        c.style.transform = `translate3d(0, ${(-d * 26).toFixed(1)}px, 0)`;
        c.style.visibility = opacity > 0.001 ? 'visible' : 'hidden';
      });

      if (bar) bar.style.transform = `scaleY(${(f / (N - 1)).toFixed(4)})`;
      setActive(Math.round(f));
    };

    update();
    window.addEventListener('scroll', update, {passive: true});
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      [...figs, ...caps].forEach((n) => n.removeAttribute('style'));
    };
  }, [reduced]);

  const goTo = useCallback((i: number) => {
    const el = track.current;
    if (!el || reduced) return setActive(i);
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({top: top + (el.offsetHeight - window.innerHeight) * (i / (N - 1)), behavior: 'smooth'});
  }, [reduced]);

  return (
    <section ref={track} className="scale" data-still={reduced} aria-label="Apex, at five scales">
      <div className="scale-pin">
        <div className="wrap scale-grid">
          <div className="scale-caps">
            {SCENES.map((s, i) => (
              <article key={s.name} data-cap data-on={i === active} aria-hidden={i !== active}>
                <p className="mono"><b>0{i + 1}</b>{s.name}</p>
                <h2>{s.title}</h2>
                <p>{s.body}</p>
                <ul>{s.has.map((h) => <li key={h} className="mono">{h}</li>)}</ul>
              </article>
            ))}
          </div>

          <div className="scale-view">
            <svg viewBox="0 0 600 600" role="img" aria-label={`${SCENES[active].name}: ${SCENES[active].title}`}>
              <g data-fig data-on={active === 0}><World /></g>
              <g data-fig data-on={active === 1}><Site /></g>
              <g data-fig data-on={active === 2}><Page /></g>
              <g data-fig data-on={active === 3}><Moment /></g>
              <g data-fig data-on={active === 4}><Milli /></g>
            </svg>
            <i className="scale-mark tl" aria-hidden /><i className="scale-mark tr" aria-hidden />
            <i className="scale-mark bl" aria-hidden /><i className="scale-mark br" aria-hidden />
            <p className="scale-unit mono" aria-hidden>{SCENES[active].unit}</p>
          </div>

          <nav className="scale-rail" aria-label="Scales">
            <span className="scale-bar" aria-hidden><i data-bar /></span>
            {SCENES.map((s, i) => (
              <button key={s.name} type="button" aria-current={i === active ? 'step' : undefined} onClick={() => goTo(i)}>
                <b className="mono">0{i + 1}</b><span>{s.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}

/* ---------- The drawings. Each is 600 by 600 with the point of interest in the centre. ---------- */

const n = (v: number) => v.toFixed(1);
const rad = (deg: number) => (deg * Math.PI) / 180;

const Target = ({label}: {label?: string}) => (
  <g className="hot">
    <circle cx="300" cy="300" r="4.5" className="dot" />
    <circle cx="300" cy="300" r="13" />
    <path d="M300 274v-12M300 326v12M274 300h-12M326 300h12" />
    {label && <text x="322" y="282">{label}</text>}
  </g>
);

const R = 214;
const TILT = rad(20);
const LANGS: [string, number, number][] = [['EN', 196, 214], ['ES', 168, 338], ['FR', 318, 176], ['DE', 404, 232], ['AR', 386, 398], ['JA', 448, 318], ['PT', 246, 436]];

function World() {
  return (
    <>
      <circle cx="300" cy="300" r={R} className="ln" />
      {[-60, -30, 0, 30, 60].map((lat) => {
        const rx = R * Math.cos(rad(lat));
        return <ellipse key={lat} cx="300" cy={n(300 - R * Math.sin(rad(lat)) * Math.cos(TILT))} rx={n(rx)} ry={n(rx * Math.sin(TILT))} className="soft" />;
      })}
      {[22, 45, 68].map((lon) => <ellipse key={lon} cx="300" cy="300" rx={n(R * Math.sin(rad(lon)))} ry={R} className="soft" />)}
      <path d="M300 86v428" className="soft" />
      {LANGS.map(([code, x, y]) => (
        <g key={code}>
          <path d={`M${x} ${y}L300 300`} className="thread" />
          <circle cx={x} cy={y} r="3" className="node" />
          <text x={x + 9} y={y + 3.5}>{code}</text>
        </g>
      ))}
      <Target label="Your site" />
    </>
  );
}

const PAGES: [string, number, number][] = [['Home', 300, 118], ['Work', 140, 300], ['Docs', 460, 300], ['Changelog', 140, 482], ['Journal', 300, 482], ['Contact', 460, 482]];

function Site() {
  return (
    <>
      <path d="M300 151v58M140 267v-58h320v58M300 209v58M140 333v116M300 333v116M460 333v116" className="soft" />
      {PAGES.map(([label, x, y]) => (
        <g key={label}>
          <rect x={x - 28} y={y - 33} width="56" height="66" rx="3" className="ln" />
          <path d={`M${x - 19} ${y - 21}h20M${x - 19} ${y - 12}h38M${x - 19} ${y - 6}h30`} className="soft" />
          <rect x={x - 19} y={y + 3} width="38" height="20" className="tint" />
          <text x={x} y={y + 50} textAnchor="middle">{label}</text>
        </g>
      ))}
      <g className="hot">
        <rect x="272" y="267" width="56" height="66" rx="3" />
        <path d="M281 279h20M281 288h38M281 294h30" />
        <rect x="290" y="304" width="20" height="8" rx="2" />
        <text x="300" y="350" textAnchor="middle">Case study</text>
      </g>
    </>
  );
}

function Page() {
  return (
    <>
      {[116.7, 190, 263.3, 336.7, 410, 483.3].map((x) => <path key={x} d={`M${x} 40v520`} className="guide" />)}
      <rect x="80" y="40" width="440" height="520" rx="6" className="ln" />
      <rect x="100" y="60" width="14" height="14" className="tint strong" />
      <path d="M392 67h28M436 67h28M480 67h20" className="ln" />
      <path d="M80 94h440" className="soft" />
      <rect x="150" y="150" width="300" height="28" className="tint strong" />
      <rect x="190" y="188" width="220" height="28" className="tint strong" />
      <path d="M220 240h160M240 252h120" className="soft" />
      <g className="hot">
        <rect x="266" y="287" width="68" height="26" rx="5" />
        <path d="M284 300h32" />
      </g>
      <rect x="110" y="356" width="380" height="176" className="ln" />
      <path d="M110 356l380 176M490 356L110 532" className="soft" />
      <path d="M80 24h440M80 18v12M520 18v12" className="soft" />
      <text x="300" y="14" textAnchor="middle">1440</text>
      <path d="M266 330h68M266 325v10M334 325v10" className="soft" />
      <text x="300" y="346" textAnchor="middle">68 × 26</text>
    </>
  );
}

function Moment() {
  return (
    <>
      {[30, 20, 10].map((o) => <rect key={o} x="150" y={252 + o} width="300" height="96" rx="18" className="ghost" />)}
      <g className="press">
        <rect x="150" y="252" width="300" height="96" rx="18" className="ln strong" />
        <text x="300" y="307" textAnchor="middle" className="big">Start a project</text>
      </g>
      <text x="150" y="232">Rest</text>
      <text x="450" y="232" textAnchor="end">Press · release</text>

      {/* This site's own easing curve, drawn with its two handles. */}
      <g transform="translate(150 396)">
        <path d="M0 150h300M0 0v150" className="soft" />
        <path d="M0 150C60 45 30 0 300 0" className="hotline" />
        <path d="M0 150L60 45M300 0L30 0" className="soft" />
        <rect x="56" y="41" width="8" height="8" className="node" />
        <rect x="26" y="-4" width="8" height="8" className="node" />
        <g className="dot-x"><g className="dot-y"><circle cx="0" cy="150" r="5" className="dotfill" /></g></g>
        <text x="312" y="4">1</text>
        <text x="312" y="154">0</text>
        <text x="290" y="136" textAnchor="end">0.2, 0.7, 0.1, 1</text>
      </g>
      <g className="hot"><circle cx="300" cy="300" r="2.5" className="dot" /></g>
    </>
  );
}

const TICKS = Array.from({length: 12}, (_, i) => 80 + i * 40);

function Milli() {
  return (
    <>
      {[{y: 232, label: 'Load time', end: 318, unit: 'ms'}, {y: 392, label: 'Page weight', end: 284, unit: 'KB'}].map((row) => (
        <g key={row.label}>
          <text x="80" y={row.y - 44}>{row.label}</text>
          <text x="520" y={row.y - 44} textAnchor="end">{row.unit}</text>
          <path d={`M80 ${row.y}h440`} className="ln" />
          {TICKS.map((x, i) => <path key={x} d={`M${x} ${row.y}v${i % 5 === 0 ? 14 : 7}`} className="soft" />)}
          <path d={`M80 ${row.y - 14}H${row.end}`} className="hotline thick" />
          <circle cx={row.end} cy={row.y - 14} r="4" className="dotfill" />
          <path d={`M440 ${row.y - 34}v60`} className="limit" />
          <text x="446" y={row.y + 30}>Agreed limit</text>
          <text x={row.end} y={row.y + 30} textAnchor="middle">Your page</text>
        </g>
      ))}
      <path d="M80 300h440" className="guide" />
      <text x="300" y="486" textAnchor="middle">Set at the start · Checked at every decision · Verified before launch</text>
    </>
  );
}
