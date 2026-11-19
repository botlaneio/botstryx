'use client';

// The homepage's one Theatre.js project, shared by the hero and "Brief to live". Its keyframes are in
// home.theatre.json, one sheet per sequence, first drafted by scripts/theatre-keys.mjs.
//
// Theatre (about 32 KB gzipped) and the keyframes load on first use, in the browser only: the server bundle gets an
// empty stub in Theatre's place (turbopack.resolveAlias in next.config.ts). In `next dev` the studio, Theatre's
// editor, opens over the page: tune a sequence there, export the project, and save it over home.theatre.json.

type Core = typeof import('@theatre/core');
export type Sheet = import('@theatre/core').ISheet;
type Loaded = {core: Core; project: import('@theatre/core').IProject};

let loading: Promise<Loaded> | null = null;

export function loadHomeProject() {
  loading ??= (async () => {
    // Dropped from production builds.
    if (process.env.NODE_ENV === 'development') {
      const studio = (await import('@theatre/studio')).default;
      studio.initialize();
    }
    const [core, {default: state}] = await Promise.all([import('@theatre/core'), import('./home.theatre.json')]);
    const project = core.getProject('botLane home', {state});
    await project.ready;
    return {core, project};
  })();
  return loading;
}

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Moves a sheet's playhead after `target()`, read on every scroll and resize, with a little lag, so a flick of the
 * wheel reads as one smooth camera move. Returns the function that stops it.
 */
export function scrub(sheet: Sheet, target: () => number) {
  let goal = 0, shown = -1, raf = 0;
  const step = () => {
    raf = 0;
    shown = shown < 0 ? goal : shown + (goal - shown) * 0.14;
    if (Math.abs(goal - shown) < 0.002) shown = goal;
    sheet.sequence.position = shown;
    if (shown !== goal) raf = requestAnimationFrame(step);
  };
  const measure = () => {
    goal = target();
    if (!raf) raf = requestAnimationFrame(step);
  };
  measure();
  window.addEventListener('scroll', measure, {passive: true});
  window.addEventListener('resize', measure);
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('scroll', measure);
    window.removeEventListener('resize', measure);
  };
}
