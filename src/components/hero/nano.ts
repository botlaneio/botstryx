// The hero's nanotech layer: a swarm of tiny square cells that takes things apart and builds them again. A phrase
// breaks into cells that stream along curved paths and lock into the next phrase; a panel is woven out of cells that
// rise from the dot grid before it appears. One 2D canvas over the first screen draws every cell, and only while
// something is moving.

export type Point = {x: number; y: number};

type Cell = {
  sx: number; sy: number; // where it starts
  cx: number; cy: number; // the bend in its path
  tx: number; ty: number; // where it locks in
  start: number; // ms: when it leaves
  dur: number; // ms: how long the trip takes
  spin: number; // radians it turns on the way (a flip, back to square on arrival)
};

export type Job = {
  cells: Cell[];
  size: number; // a cell's side, in px
  /** How strong a cell at rest is drawn: 1 for a phrase, lower for the mesh a panel is woven from. */
  rest: number;
  /** Whether a cell is already drawn at its start before it leaves (a phrase coming apart) or fades in on the way. */
  showStart: boolean;
  /** ms after the last cell locks before the job hands over and fades. */
  hold: number;
  fade: number;
  onStart?: () => void;
  onSettle?: () => void;
  settleAt: number;
  started: boolean;
  settled: boolean;
};

// Charged cells take a colour from a spectrum that runs across the screen and drifts over time, so a phrase in
// transit reads as one moving gradient. Each cell is drawn in one of a few shades between the ink and its hue, one
// path per shade, so a frame is a few dozen fills.
const SHADES = 8;
const SPECTRUM = ['#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#f97316', '#ec4899', '#d946ef'];
const HUES = 18;
/** How long the gradient takes to drift once across the screen, in ms. */
const DRIFT = 5000;

const hex = (h: string): [number, number, number] => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
// The spectrum sampled evenly round a loop, so its two ends meet without a seam.
const RING = Array.from({length: HUES}, (_, i) => {
  const at = (i / HUES) * SPECTRUM.length;
  const a = hex(SPECTRUM[Math.floor(at)]), b = hex(SPECTRUM[(Math.floor(at) + 1) % SPECTRUM.length]);
  const t = at - Math.floor(at);
  return a.map((v, k) => Math.round(v + (b[k] - v) * t)) as [number, number, number];
});

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
// Arrives a touch past the mark and settles back, so each cell reads as locking into place.
const easeOutBack = (t: number) => {
  const c = 1.4;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

const channels = (css: string): [number, number, number] => {
  const n = css.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
  return [n[0], n[1], n[2]];
};

export class NanoEngine {
  private ctx: CanvasRenderingContext2D;
  private jobs: Job[] = [];
  private raf = 0;
  private ratio = 1;
  private width = 0;
  private height = 0;
  private shades: string[][] = [];

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    this.resize();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.ratio = Math.min(window.devicePixelRatio || 1, 2);
    this.width = Math.max(1, Math.round(rect.width));
    this.height = Math.max(1, Math.round(rect.height));
    this.canvas.width = Math.round(this.width * this.ratio);
    this.canvas.height = Math.round(this.height * this.ratio);
    if (!this.raf) this.clear();
  }

  /** The canvas's top left on screen: cell positions are measured from here. */
  origin() {
    return this.canvas.getBoundingClientRect();
  }

  /** The ink comes from CSS (the canvas's color), so cells at rest follow the theme. */
  private readColors() {
    const ink = channels(getComputedStyle(this.canvas).color);
    this.shades = RING.map((hue) =>
      Array.from({length: SHADES}, (_, i) => {
        const t = i / (SHADES - 1);
        return `rgb(${ink.map((v, k) => Math.round(v + (hue[k] - v) * t)).join(',')})`;
      }),
    );
  }

  run(job: Omit<Job, 'settleAt' | 'started' | 'settled'>) {
    const last = job.cells.reduce((m, c) => Math.max(m, c.start + c.dur), performance.now());
    this.jobs.push({...job, settleAt: last + job.hold, started: false, settled: false});
    this.readColors();
    if (!this.raf) this.raf = requestAnimationFrame(this.frame);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.jobs = [];
  }

  private clear() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private frame = (now: number) => {
    const ctx = this.ctx;
    this.clear();
    ctx.setTransform(this.ratio, 0, 0, this.ratio, 0, 0);

    for (const job of this.jobs) {
      if (!job.started) { job.started = true; job.onStart?.(); }
      if (!job.settled && now >= job.settleAt) { job.settled = true; job.onSettle?.(); }
      const fadeOut = job.settled ? 1 - clamp01((now - job.settleAt) / job.fade) : 1;
      if (fadeOut <= 0) continue;
      this.draw(job, now, fadeOut);
    }
    this.jobs = this.jobs.filter((j) => !j.settled || now - j.settleAt < j.fade);

    if (this.jobs.length) this.raf = requestAnimationFrame(this.frame);
    else { this.raf = 0; this.clear(); }
  };

  private draw(job: Job, now: number, fadeOut: number) {
    const ctx = this.ctx;
    // One path per shade and strength, so cells that look alike are filled together.
    const paths = new Map<number, Path2D>();
    const drift = now / DRIFT;
    const add = (key: number, x: number, y: number, s: number, a: number) => {
      let p = paths.get(key);
      if (!p) { p = new Path2D(); paths.set(key, p); }
      const h = s / 2;
      if (a === 0) { p.rect(x - h, y - h, s, s); return; }
      const cos = Math.cos(a) * h, sin = Math.sin(a) * h;
      p.moveTo(x - cos + sin, y - sin - cos);
      p.lineTo(x + cos + sin, y + sin - cos);
      p.lineTo(x + cos - sin, y + sin + cos);
      p.lineTo(x - cos - sin, y - sin + cos);
      p.closePath();
    };

    for (const c of job.cells) {
      const t = (now - c.start) / c.dur;
      let x: number, y: number, size = job.size, angle = 0, lit: number, alpha: number;
      if (t < 0) {
        if (!job.showStart) continue;
        // Waiting to leave: it charges up in the last moments before it goes.
        x = c.sx; y = c.sy;
        lit = clamp01(1 + (now - c.start) / 160);
        alpha = job.rest + (1 - job.rest) * lit;
      } else if (t < 1) {
        const e = easeOutBack(easeInOut(t) * 0.92 + t * 0.08);
        const u = 1 - e;
        x = u * u * c.sx + 2 * u * e * c.cx + e * e * c.tx;
        y = u * u * c.sy + 2 * u * e * c.cy + e * e * c.ty;
        const arc = Math.sin(Math.PI * Math.min(t, 1));
        size = job.size * (1 - 0.3 * arc);
        angle = c.spin * arc;
        lit = 0.55 + 0.45 * arc;
        alpha = job.showStart ? 1 : clamp01(t * 4);
      } else {
        // Locked in: a short flash, then it rests.
        x = c.tx; y = c.ty;
        const since = now - (c.start + c.dur);
        lit = Math.max(0, 1 - since / 320);
        size = job.size * (1 + 0.35 * lit);
        alpha = job.rest + (1 - job.rest) * lit;
      }
      alpha *= fadeOut;
      if (alpha <= 0.01) continue;
      const shade = Math.round(lit * (SHADES - 1));
      const hue = shade === 0 ? 0 : Math.floor(((x / this.width) * 0.8 + y / this.height * 0.2 - drift) * HUES) % HUES;
      const strength = Math.round(alpha * 10);
      add(((hue < 0 ? hue + HUES : hue) * SHADES + shade) * 16 + strength, x, y, size, angle);
    }

    for (const [key, path] of paths) {
      const shade = (key >> 4) % SHADES;
      const hue = Math.floor((key >> 4) / SHADES);
      ctx.globalAlpha = (key & 15) / 10;
      ctx.fillStyle = this.shades[hue][shade];
      // The brightest cells glow in their own colour, which is what makes the swarm read as energy rather than confetti.
      if (shade >= SHADES - 3) { ctx.shadowColor = this.shades[hue][SHADES - 1]; ctx.shadowBlur = 8; }
      else ctx.shadowBlur = 0;
      ctx.fill(path);
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }
}

/** The dot grid's pitch (dot-field.tsx): cells for a panel rise from the dots. */
const GRID = 32;
const rand = (a: number, b: number) => a + Math.random() * (b - a);

/**
 * Samples text as it is set on the page: every point on a grid of `step` px that falls inside a letter. Each word is
 * drawn off screen in the element's own font, where the page put it and stretched to the width the page gives it,
 * so text over several lines (a <br>, or wrapping on a phone) comes out right too.
 */
export function sampleText(el: HTMLElement, origin: DOMRect, step: number): Point[] {
  const box = el.getBoundingClientRect();
  if (!box.width || !box.height) return [];
  const style = getComputedStyle(el);
  const scratch = document.createElement('canvas');
  // Room round the box for descenders and overhanging letters.
  const pad = Math.ceil(parseFloat(style.fontSize) * 0.3);
  const w = Math.ceil(box.width) + pad * 2, h = Math.ceil(box.height) + pad * 2;
  scratch.width = w; scratch.height = h;
  const ctx = scratch.getContext('2d', {willReadFrequently: true})!;
  ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & {letterSpacing: string}).letterSpacing = style.letterSpacing;
  ctx.fillStyle = '#000';
  const range = document.createRange();
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent ?? '';
    for (const word of text.matchAll(/\S+/g)) {
      range.setStart(node, word.index);
      range.setEnd(node, word.index + word[0].length);
      const rect = range.getBoundingClientRect();
      if (!rect.width) continue;
      const m = ctx.measureText(word[0]);
      const stretch = m.width > 0 ? Math.min(1.15, Math.max(0.87, rect.width / m.width)) : 1;
      ctx.setTransform(stretch, 0, 0, 1, rect.left - box.left + pad, 0);
      ctx.fillText(word[0], 0, rect.top - box.top + pad + (m.fontBoundingBoxAscent || parseFloat(style.fontSize) * 0.92));
    }
  }
  const data = ctx.getImageData(0, 0, w, h).data;
  const points: Point[] = [];
  for (let y = step / 2; y < h; y += step) {
    for (let x = step / 2; x < w; x += step) {
      if (data[(Math.floor(y) * w + Math.floor(x)) * 4 + 3] > 120) {
        points.push({x: box.left - origin.left - pad + x, y: box.top - origin.top - pad + y});
      }
    }
  }
  return points;
}

/** Text assembling out of nothing: cells rise from dots of the grid spread round it and lock in, left to right. */
export function assembleCells(to: Point[], width: number, height: number, now: number) {
  const left = Math.min(...to.map((p) => p.x)), right = Math.max(...to.map((p) => p.x));
  const span = Math.max(1, right - left);
  return to.map((t): Cell => {
    const fx = Math.round((t.x + rand(-0.5, 0.5) * width * 0.6) / GRID - 0.5) * GRID + GRID / 2;
    const fy = Math.round(rand(0, height) / GRID - 0.5) * GRID + GRID / 2;
    return {
      sx: fx, sy: fy, tx: t.x, ty: t.y,
      cx: (fx + t.x) / 2 + rand(-60, 60), cy: (fy + t.y) / 2 + rand(-80, 80),
      start: now + ((t.x - left) / span) * 560 + rand(0, 200),
      dur: rand(700, 1100),
      spin: rand(-1, 1) * Math.PI,
    };
  });
}

/** A phrase coming apart and locking into the next: cells leave in a sweep from left to right. */
export function morphCells(from: Point[], to: Point[], fontSize: number, now: number) {
  const n = Math.max(from.length, to.length);
  const sort = (a: Point, b: Point) => a.x - b.x || a.y - b.y;
  const a = [...from].sort(sort), b = [...to].sort(sort);
  const left = Math.min(a[0]?.x ?? 0, b[0]?.x ?? 0);
  const right = Math.max(a.at(-1)?.x ?? 1, b.at(-1)?.x ?? 1);
  const span = Math.max(1, right - left);
  const cells: Cell[] = [];
  for (let k = 0; k < n; k++) {
    const s = a[Math.floor((k * a.length) / n)] ?? b[k % b.length];
    const t = b[Math.floor((k * b.length) / n)] ?? s;
    const sweep = (s.x - left) / span;
    const lift = rand(0.5, 1.6) * fontSize * (Math.random() < 0.5 ? -1 : 1);
    cells.push({
      sx: s.x, sy: s.y, tx: t.x, ty: t.y,
      cx: (s.x + t.x) / 2 + rand(-0.12, 0.12) * span,
      cy: (s.y + t.y) / 2 + lift,
      start: now + sweep * 620 + rand(0, 160),
      dur: rand(620, 980),
      spin: rand(-1, 1) * Math.PI,
    });
  }
  return cells;
}

/** A panel woven from cells that rise out of the dot grid around it and lock into a mesh over its box. */
export function buildCells(box: DOMRect, origin: DOMRect, step: number, now: number) {
  const left = box.left - origin.left, top = box.top - origin.top;
  const cols = Math.max(1, Math.round(box.width / step)), rows = Math.max(1, Math.round(box.height / step));
  const sx = box.width / cols, sy = box.height / rows;
  const cells: Cell[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tx = left + (c + 0.5) * sx, ty = top + (r + 0.5) * sy;
      // Start on a dot of the grid somewhere near, mostly below, as if the surface is drawn up out of it.
      const fx = Math.round((tx + rand(-1, 1) * box.width * 0.6) / GRID - 0.5) * GRID + GRID / 2;
      const fy = Math.round((ty + rand(-0.3, 1.2) * Math.max(160, box.height)) / GRID - 0.5) * GRID + GRID / 2;
      // Locks in from the bottom left corner outward, row by row, like a weave.
      const order = (c / cols) * 0.6 + (1 - r / rows) * 0.4;
      cells.push({
        sx: fx, sy: fy, tx, ty,
        cx: (fx + tx) / 2 + rand(-40, 40), cy: Math.max(fy, ty) + rand(10, 60),
        start: now + order * 520 + rand(0, 120),
        dur: rand(520, 820),
        spin: rand(-1, 1) * Math.PI,
      });
    }
  }
  return cells;
}
