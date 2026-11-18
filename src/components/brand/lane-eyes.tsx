'use client';

import {useEffect, useRef} from 'react';

/**
 * Lane's face: the logo's two eyes, each built from nine nano cells, on a dark disc shaded like a sphere. The cells
 * shimmer through the hero's spectrum (SPECTRUM in src/components/hero/nano.ts), fly in and lock into place when it
 * first appears, follow the visitor's pointer, glance about and blink. Moods:
 *   idle    resting in the corner
 *   notice  pointed at: the eyes widen and blink twice
 *   think   while Lane writes a reply: looks up and to the side while a scan runs across the cells
 *   listen  on a voice call while the visitor talks: the cells stretch like a level meter
 *   speak   on a voice call while Lane talks: light ripples out from the middle of each eye
 */
export type LaneMood = 'idle' | 'notice' | 'think' | 'listen' | 'speak';

const SPECTRUM = ['#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#f97316', '#ec4899', '#d946ef'].map(
  (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)),
);
type RGB = number[];
const spec = (u: number): RGB => {
  u = ((u % 1) + 1) % 1;
  const at = u * SPECTRUM.length, i = Math.floor(at), f = at - i;
  const a = SPECTRUM[i], b = SPECTRUM[(i + 1) % SPECTRUM.length];
  return a.map((v, k) => v + (b[k] - v) * f);
};
const rgba = (c: RGB, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const mix = (a: RGB, b: RGB, t: number) => a.map((v, k) => v + (b[k] - v) * t);
const WHITE = [237, 238, 240], BLUE = [128, 152, 255];
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const easeOutBack = (t: number) => 1 + 2.4 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2);
const MOODS = ['notice', 'think', 'listen', 'speak'] as const;

// The pointer, shared by every pair of eyes on the page.
const pointer = {x: 0, y: 0, at: -99};
let tracking = false;
function track() {
  if (tracking || typeof window === 'undefined') return;
  tracking = true;
  const on = (e: PointerEvent) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.at = performance.now() / 1000; };
  addEventListener('pointermove', on, {passive: true});
  addEventListener('pointerdown', on, {passive: true});
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

type State = {
  mood: LaneMood;
  m: Record<(typeof MOODS)[number], number>;
  look: [number, number];
  born: number;
  noticeAt: number;
  cells: {ph: number; sx: number; sy: number; d: number; j: number}[];
};

function draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, S: number, st: State, t: number, dt: number, follow: boolean) {
  const R = S / 2, c = S / 2, {m, cells} = st;
  for (const k of MOODS) m[k] += ((st.mood === k ? 1 : 0) - m[k]) * Math.min(1, dt * 5);

  // Where the eyes look: at the pointer while it moves, otherwise glancing about (or up, while thinking).
  let tx: number, ty: number;
  if (follow && t - pointer.at < 2.5) {
    const box = canvas.getBoundingClientRect();
    const dx = pointer.x - (box.left + box.width / 2), dy = pointer.y - (box.top + box.height / 2);
    const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 260);
    tx = (dx / d) * k;
    ty = (dy / d) * k;
  } else {
    const g = Math.sin(t * 0.45);
    tx = Math.sign(g) * Math.pow(Math.abs(g), 0.35) * (Math.sin(t * 0.21) > -0.2 ? 0.8 : 0);
    ty = 0.35 * Math.sin(t * 0.33);
  }
  tx = tx * (1 - m.think) + 0.55 * m.think;
  ty = ty * (1 - m.think) - 0.6 * m.think;
  st.look[0] += (tx - st.look[0]) * Math.min(1, dt * 7);
  st.look[1] += (ty - st.look[1]) * Math.min(1, dt * 7);
  const gx = st.look[0] * R * 0.09, gy = st.look[1] * R * 0.07;

  // A slow natural blink, and a double blink when noticed.
  const bt = t % 5.2;
  let blink = bt > 4.9 ? Math.sin(((bt - 4.9) / 0.3) * Math.PI) : 0;
  const nt = t - st.noticeAt;
  if (nt > 0.05 && nt < 0.65) blink = Math.max(blink, Math.abs(Math.sin(((nt - 0.05) / 0.3) * Math.PI)));
  blink *= 1 - m.listen * 0.7;

  ctx.clearRect(0, 0, S, S);
  ctx.save();
  ctx.beginPath();
  ctx.arc(c, c, R, 0, Math.PI * 2);
  ctx.clip();
  const bg = ctx.createRadialGradient(S * 0.38, S * 0.28, 0, c, c, R);
  bg.addColorStop(0, '#1e2129');
  bg.addColorStop(1, '#0a0b0e');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, S, S);

  const born = clamp((t - st.born) / 1.6);
  const widen = 1 + 0.16 * m.notice;
  const cell = R * 0.1 * (1 + 0.06 * m.notice), pitch = (cell + R * 0.032) * widen;
  const eyeAt = (e: number) => [c + (e ? 1 : -1) * R * 0.27 * widen + gx, c + gy];

  // A soft bloom behind each eye.
  for (const e of [0, 1]) {
    const [ex, ey] = eyeAt(e);
    const col = mix(e ? BLUE : WHITE, spec(t * 0.05 + e * 0.3), 0.6);
    const glow = (0.16 + 0.1 * Math.sin(t * 1.4 + e) + 0.12 * m.notice + 0.12 * m.speak) * born;
    const g = ctx.createRadialGradient(ex, ey, 0, ex, ey, R * 0.42);
    g.addColorStop(0, rgba(col, glow));
    g.addColorStop(1, rgba(col, 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
  }

  const scan = ((t * 0.9) % 1.5) - 0.25;
  for (const e of [0, 1]) {
    const [ex, ey] = eyeAt(e);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const p = cells[e * 9 + i * 3 + j];
      let v = 0.5 + 0.5 * Math.sin(t * 1.6 + p.ph * 6.28);
      const xn = (e * 3 + i) / 5;
      v += m.think * 0.9 * Math.exp(-Math.pow(xn - scan, 2) / 0.02);
      v += m.speak * 0.6 * Math.max(0, Math.sin(t * 7 - Math.hypot(i - 1, j - 1) * 2.2));
      v = clamp(v, 0, 1.4);
      const voice = Math.abs(Math.sin(t * 3.1 + i * 1.3 + e * 0.6) * Math.sin(t * 1.7 + i * 0.4));
      const stretch = 1 + m.listen * (j === 1 ? 0.9 : 0.35) * voice;
      const col = mix(e ? BLUE : WHITE, spec(t * 0.06 + p.ph * 0.5 + e * 0.15 + m.think * xn * 0.4), clamp(0.25 + 0.45 * v));
      const h = cell * (1 - blink * 0.55) * stretch;
      let x = ex + (i - 1) * pitch + Math.sin(t * 2.3 + p.j) * R * 0.004;
      let y = ey + (j - 1) * pitch * (1 - blink * 0.92) + Math.cos(t * 2.1 + p.j) * R * 0.004;
      // The entrance: in from scattered points, locking in with a small overshoot.
      const k = easeOutBack(clamp((born * 1.6 - p.d) / 1.1));
      const fx = c + p.sx * R, fy = c + p.sy * R;
      x = fx + (x - fx) * k;
      y = fy + (y - fy) * k;
      ctx.fillStyle = rgba(col, clamp(0.7 + 0.3 * v) * clamp(born * 3));
      ctx.shadowColor = rgba(col, 0.9);
      ctx.shadowBlur = S * 0.05 * clamp(v);
      roundRect(ctx, x - cell / 2, y - h / 2, cell, h, cell * 0.24);
      ctx.fill();
    }
  }
  ctx.shadowBlur = 0;

  // Shading that rounds the disc into a sphere, lit from the top left.
  const shade = ctx.createRadialGradient(c - R * 0.25, c - R * 0.35, R * 0.2, c, c, R * 1.05);
  shade.addColorStop(0, 'rgba(0,0,0,0)');
  shade.addColorStop(0.65, 'rgba(0,0,0,0.08)');
  shade.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, S, S);
  const sheen = ctx.createRadialGradient(c - R * 0.3, c - R * 0.55, 0, c - R * 0.3, c - R * 0.55, R * 0.75);
  sheen.addColorStop(0, 'rgba(255,255,255,0.13)');
  sheen.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, S, S);
  ctx.restore();
}

export function LaneEyes({size, mood = 'idle', follow = false, className}: {size: number; mood?: LaneMood; follow?: boolean; className?: string}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const state = useRef<State | null>(null);
  const redraw = useRef<() => void>(() => {});

  useEffect(() => {
    const st = state.current;
    if (!st) return;
    if (mood === 'notice' && st.mood !== 'notice') st.noticeAt = performance.now() / 1000;
    st.mood = mood;
    redraw.current();
  }, [mood]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    if (follow) track();
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const now = () => performance.now() / 1000;
    const st: State = state.current ?? {
      mood,
      m: {notice: 0, think: 0, listen: 0, speak: 0},
      look: [0, 0],
      born: now(),
      noticeAt: -99,
      cells: Array.from({length: 18}, () => ({ph: Math.random(), sx: Math.random() * 1.8 - 0.9, sy: Math.random() * 1.8 - 0.9, d: Math.random() * 0.45, j: Math.random() * 6.28})),
    };
    state.current = st;

    const still = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, last = now(), seen = true;
    // Motion turned off: one calm frame, already assembled, redrawn when the mood changes.
    const calm = () => {
      st.born = -99;
      for (const k of MOODS) st.m[k] = st.mood === k ? 1 : 0;
      st.look = [0, 0];
      draw(ctx, canvas, size, st, 2, 0, false);
    };
    const tick = () => {
      frame = 0;
      const t = now(), dt = Math.min(0.05, t - last);
      last = t;
      if (seen && !document.hidden) draw(ctx, canvas, size, st, t, dt, follow);
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (still.matches) calm();
      else { last = now(); frame = requestAnimationFrame(tick); }
    };
    redraw.current = () => { if (still.matches) calm(); };
    const io = new IntersectionObserver(([en]) => { seen = en.isIntersecting; });
    io.observe(canvas);
    start();
    still.addEventListener('change', start);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      still.removeEventListener('change', start);
    };
    // The mood is read from state on each frame, so a mood change doesn't restart the drawing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, follow]);

  return <canvas ref={ref} className={className} style={{width: size, height: size}} aria-hidden />;
}

// The voice call (lane-voice.tsx) tells the eyes in the chat header whether Lane or the visitor is talking.
type VoiceMood = 'listen' | 'speak' | null;
let voiceMood: VoiceMood = null;
const voiceListeners = new Set<(m: VoiceMood) => void>();
export function setLaneVoiceMood(m: VoiceMood) {
  if (m === voiceMood) return;
  voiceMood = m;
  voiceListeners.forEach((fn) => fn(m));
}
export function onLaneVoiceMood(fn: (m: VoiceMood) => void) {
  voiceListeners.add(fn);
  fn(voiceMood);
  return () => { voiceListeners.delete(fn); };
}
