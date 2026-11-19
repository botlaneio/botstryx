'use client';

// The hero's choreography, two Theatre.js sequences from the homepage's project (src/components/theatre):
//
// - "Hero intro" plays once on load: three soft lights drift in behind the headline and a line of light sweeps
//   under the header. The nanotech weave (nano-layer.tsx) runs on top of it as before.
// - "Hero exit" is played by scroll: as the first screen scrolls away, each layer leaves at its own speed and the
//   camera pushes into the light, handing over to "Brief to live" below.
//
// The exit moves the hero's own elements with the individual `translate` and `scale` properties and with `filter`,
// which the CSS entrance (fade-up) and the weave (data-nano-build) don't touch, so the three never fight. At the top
// of the page every value is neutral and nothing is written.
//
// Without script the lights don't show (they wait for the intro). Under reduced motion they show, still, and nothing
// moves.

import {useEffect, useRef} from 'react';

import {loadHomeProject, prefersReducedMotion, scrub} from '@/components/theatre/project';

type Values = Record<string, number>;

/** Writes the exit's values on one of the hero's elements, leaving it untouched when they are neutral. */
function place(el: HTMLElement, v: Values) {
  const y = v.y ?? 0, scale = v.scale ?? 1, fade = v.fade ?? 1, blur = v.blur ?? 0, tilt = v.tilt ?? 0;
  el.style.translate = y ? `0 ${y.toFixed(2)}px` : '';
  el.style.scale = scale !== 1 ? scale.toFixed(4) : '';
  el.style.filter = fade < 1 || blur > 0 ? `opacity(${fade.toFixed(3)}) blur(${blur.toFixed(2)}px)` : '';
  el.style.transform = tilt ? `perspective(1100px) rotateX(${tilt.toFixed(2)}deg)` : '';
}

/** Writes values as CSS variables, `--<prefix><prop>`, on an element of the lights. */
function vars(el: HTMLElement, v: Values, prefix = '') {
  for (const [k, x] of Object.entries(v)) el.style.setProperty(`--${prefix}${k}`, String(Math.round(x * 1e4) / 1e4));
}

export function HeroTheatre() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lights = ref.current;
    const stage = lights?.closest<HTMLElement>('.stage');
    if (!lights || !stage) return;
    if (prefersReducedMotion()) {
      lights.dataset.on = '';
      return;
    }

    let dead = false;
    const off: (() => void)[] = [];

    loadHomeProject().then(({core, project}) => {
      if (dead) return;
      const t = core.types;
      const n = (v: number, min: number, max: number) => t.number(v, {range: [min, max]});

      // The intro. Each prop's default is where it comes to rest.
      const intro = project.sheet('Hero intro');
      const orb = {opacity: n(1, 0, 1), scale: n(1, 0.2, 2), x: n(0, -60, 60), y: n(0, -60, 60)};
      for (const key of ['Orb 1', 'Orb 2', 'Orb 3']) {
        const el = lights.querySelector<HTMLElement>(`[data-hx="${key}"]`);
        if (el) off.push(intro.object(key, orb).onValuesChange((v: Values) => vars(el, v)));
      }
      const sweep = lights.querySelector<HTMLElement>('[data-hx="Sweep"]');
      if (sweep) off.push(intro.object('Sweep', {x: n(250, -150, 300), opacity: n(0, 0, 1)}).onValuesChange((v: Values) => vars(sweep, v)));

      // The exit.
      const exit = project.sheet('Hero exit');
      const layer = {y: n(0, -200, 200), fade: n(1, 0, 1), blur: n(0, 0, 20)};
      const layers: [string, Record<string, ReturnType<typeof n>>][] = [
        ['Eyebrow', layer],
        ['Headline', layer],
        ['Lede', layer],
        ['Brief box', {...layer, tilt: n(0, -45, 45), scale: n(1, 0.5, 1.5)}],
        ['Rail', layer],
      ];
      for (const [key, props] of layers) {
        const el = stage.querySelector<HTMLElement>(key === 'Headline' ? '.tw-fit' : `[data-hx="${key}"]`);
        if (el) off.push(exit.object(key, props).onValuesChange((v: Values) => place(el, v)), () => place(el, {}));
      }
      off.push(exit.object('Lights', {scale: n(1, 0.5, 3), opacity: n(1, 0, 1), y: n(0, -50, 50)}).onValuesChange((v: Values) => vars(lights, v, 'l-')));
      const dots = stage.querySelector<HTMLElement>('.dot-field');
      off.push(exit.object('Dots', {fade: n(1, 0, 1)}).onValuesChange((v: Values) => {
        if (dots) dots.style.opacity = v.fade < 1 ? v.fade.toFixed(3) : '';
      }));

      lights.dataset.on = '';
      intro.sequence.position = 0;
      intro.sequence.play();
      off.push(scrub(exit, () => Math.min(1, Math.max(0, window.scrollY / Math.max(1, stage.offsetHeight)))));
    });

    return () => {
      dead = true;
      off.forEach((f) => f());
    };
  }, []);

  return (
    <div ref={ref} className="hx-lights" aria-hidden>
      <div className="hx-orb hx-orb-1" data-hx="Orb 1"><i /></div>
      <div className="hx-orb hx-orb-2" data-hx="Orb 2"><i /></div>
      <div className="hx-orb hx-orb-3" data-hx="Orb 3"><i /></div>
      <div className="hx-sweep" data-hx="Sweep" />
    </div>
  );
}
