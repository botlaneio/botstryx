'use client';

// The hero's dot grid, made live: dots near a moving pointer are pushed along its path and light up, and a
// click or tap sends a ripple out through them. Each dot sits on a spring tied to its neighbours, so a push
// travels a little way and settles. Ported from botpro (src/components/home/waves-hero/DotGrid.jsx), which is
// based on React Bits: MIT + Commons Clause, Copyright (c) 2026 David Haz.
//
// The plain CSS grid in .stage::before stays as the fallback: it shows until this canvas has drawn, and stays
// if WebGL 2 is missing. It only redraws while something is moving.

import {useEffect, useRef} from 'react';

/** Grid and motion settings, tuned to the quiet grid this replaces. */
const DOT = {size: 1.9, gap: 30.1, proximity: 150, strength: 0.75, bounce: 0.6, tension: 0.4, settle: 0.8, shockRadius: 360, shockStrength: 4, swell: 1.1, stretch: 0.5, glow: 0.35};
/** How strong a dot at rest is drawn, as in the CSS grid. */
const REST_ALPHA = 0.17;

const VERTEX = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec4 aMotion;
layout(location = 2) in float aEnergy;
uniform vec2 uResolution;
uniform float uSize;
uniform float uSwell;
uniform float uStretch;
uniform float uGlow;
out vec2 vLocal;
out float vLength;
out float vRadius;
out float vEnergy;
void main() {
  float energy = aEnergy;
  float radius = 0.5 * uSize * (1.0 + uSwell * energy);
  float speed = length(aMotion.zw);
  float angle = speed > 0.001 ? atan(aMotion.w, aMotion.z) : 0.0;
  float axis = floor(angle / 1.5707963 + 0.5) * 1.5707963;
  angle = axis + (angle - axis) * smoothstep(8.0, 70.0, speed);
  vec2 dir = vec2(cos(angle), sin(angle));
  float halfLength = min(uSize * 2.0, speed * uStretch * 0.02);
  float pad = radius * (1.0 + uGlow * energy * 2.5) + 2.0;
  vec2 local = aCorner * vec2(halfLength + pad, pad);
  vec2 point = aMotion.xy + dir * local.x + vec2(-dir.y, dir.x) * local.y;
  vLocal = local;
  vLength = halfLength;
  vRadius = radius;
  vEnergy = energy;
  vec2 clip = point / uResolution * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}
`;

const FRAGMENT = `#version 300 es
precision highp float;
in vec2 vLocal;
in float vLength;
in float vRadius;
in float vEnergy;
uniform vec3 uBase;
uniform vec3 uActive;
uniform float uGlow;
uniform float uRest;
out vec4 outColor;
void main() {
  float d = length(vec2(max(abs(vLocal.x) - vLength, 0.0), vLocal.y)) - vRadius;
  float aa = max(fwidth(d), 0.0001);
  float body = clamp(0.5 - d / aa, 0.0, 1.0);
  float halo = uGlow * vEnergy * 0.5 * exp(-max(d, 0.0) / max(vRadius * 1.3, 0.6));
  float lit = clamp(vEnergy * 1.2, 0.0, 1.0);
  float alpha = (body + (1.0 - body) * halo) * mix(uRest, 1.0, lit);
  vec3 color = mix(uBase, uActive, lit);
  outColor = vec4(color * alpha, alpha);
}
`;

const smootherstep = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * x * (x * (x * 6 - 15) + 10);
};

/** "rgb(r, g, b)" or "rgba(...)", as getComputedStyle gives it, to 0–1 channels. */
const channels = (css: string): [number, number, number] => {
  const n = css.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
  return [n[0] / 255, n[1] / 255, n[2] / 255];
};

const compile = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
};

type Shock = {x: number; y: number; start: number};

export function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = canvas?.closest<HTMLElement>('.stage');
    if (!canvas || !stage) return;
    const gl = canvas.getContext('webgl2', {alpha: true, premultipliedAlpha: true, antialias: false});
    if (!gl) return;

    const program = gl.createProgram();
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    const u = Object.fromEntries(
      ['uResolution', 'uSize', 'uSwell', 'uStretch', 'uGlow', 'uBase', 'uActive', 'uRest'].map((name) => [name, gl.getUniformLocation(program, name)]),
    );

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const cornerBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cornerBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const instanceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 20, 0);
    gl.vertexAttribDivisor(1, 1);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 20, 16);
    gl.vertexAttribDivisor(2, 1);
    gl.bindVertexArray(null);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const view = {width: 0, height: 0};
    const grid = {count: 0, cols: 1, rows: 1, cell: 1};
    let rest = new Float32Array(0);
    let offset = new Float32Array(0);
    let velocity = new Float32Array(0);
    let force = new Float32Array(0);
    let next = new Float32Array(0);
    let wave = new Float32Array(0);
    let energy = new Float32Array(0);
    let instances = new Float32Array(0);
    const pointer = {x: 0, y: 0, vx: 0, vy: 0, time: 0, inside: false, presence: 0};
    const shocks: Shock[] = [];
    let colors = {base: [0, 0, 0] as number[], active: [0, 0, 0] as number[]};
    let visible = true;
    let raf = 0;
    let last = 0;

    // The colours come from CSS, so they follow the theme: the dots in the text colour, lit dots in the accent.
    const readColors = () => {
      const style = getComputedStyle(canvas);
      colors = {base: channels(style.color), active: channels(style.caretColor)};
    };

    // The grid starts at the top left, like the CSS grid it replaces, so nothing shifts when it takes over.
    const rebuild = () => {
      const cell = DOT.size + DOT.gap;
      const cols = Math.ceil(view.width / cell) + 1;
      const rows = Math.ceil(view.height / cell) + 1;
      const count = cols * rows;
      rest = new Float32Array(count * 2);
      offset = new Float32Array(count * 2);
      velocity = new Float32Array(count * 2);
      force = new Float32Array(count * 2);
      next = new Float32Array(count * 2);
      wave = new Float32Array(count * 4);
      energy = new Float32Array(count);
      instances = new Float32Array(count * 5);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const i = (row * cols + col) * 2;
          rest[i] = cell / 2 + col * cell;
          rest[i + 1] = cell / 2 + row * cell;
        }
      }
      Object.assign(grid, {count, cols, rows, cell});
      gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, instances.byteLength, gl.DYNAMIC_DRAW);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      view.width = Math.max(1, Math.round(rect.width));
      view.height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(view.width * ratio);
      canvas.height = Math.round(view.height * ratio);
      rebuild();
      render();
    };

    const step = (dt: number, now: number) => {
      const motion = reduced ? 0 : 1;
      const zeta = 1 - 0.85 * DOT.bounce;
      const omega = 4 / (zeta * DOT.settle);
      const stiffness = omega * omega;
      const damping = 2 * zeta * omega;
      const radius = DOT.proximity;
      const speed = Math.hypot(pointer.vx, pointer.vy);
      const drive = pointer.inside ? 6500 * Math.tanh(speed / 900) * DOT.strength * motion : 0;
      const dirX = speed > 0.001 ? pointer.vx / speed : 0;
      const dirY = speed > 0.001 ? pointer.vy / speed : 0;
      const width = grid.cell * 1.4;
      const travel = 650;
      const active = shocks.map((shock) => {
        const front = ((now - shock.start) / 1000) * travel;
        const power = smootherstep(1 - front / DOT.shockRadius);
        return {...shock, front, amplitude: power * DOT.shockStrength * grid.cell * 0.24 * motion};
      });
      const coupling = (DOT.tension * 900) ** 2 / (grid.cell * grid.cell);
      const viscosity = Math.sqrt(coupling) * 0.06;
      const limit = Math.sqrt(stiffness + 8 * coupling) + damping + 8 * viscosity;
      const steps = Math.min(24, Math.max(1, Math.ceil(dt / Math.min(1 / 120, 1.2 / limit))));
      const h = dt / steps;

      // Forces: the pointer's push, and the ripples' fronts.
      for (let i = 0; i < grid.count; i++) {
        const index = i * 2;
        const rx = rest[index];
        const ry = rest[index + 1];
        let ax = 0, ay = 0;
        if (drive > 0) {
          const ex = rx + offset[index] - pointer.x;
          const ey = ry + offset[index + 1] - pointer.y;
          const distance = Math.hypot(ex, ey);
          if (distance < radius) {
            const weight = smootherstep(1 - distance / radius) * drive;
            const nx = distance > 0.001 ? ex / distance : 0;
            const ny = distance > 0.001 ? ey / distance : 0;
            ax += weight * (dirX + nx * 0.6);
            ay += weight * (dirY + ny * 0.6);
          }
        }
        let wx = 0, wy = 0, wvx = 0, wvy = 0;
        for (const shock of active) {
          if (shock.amplitude <= 0) continue;
          const ex = rx - shock.x;
          const ey = ry - shock.y;
          const distance = Math.hypot(ex, ey);
          const t = (distance - shock.front) / width;
          if (Math.abs(t) < 3 && distance > 0.001) {
            const nx = ex / distance;
            const ny = ey / distance;
            const profile = Math.exp(-t * t);
            const push = shock.amplitude * profile;
            const rate = ((shock.amplitude * 2 * t * profile) / width) * travel;
            wx += nx * push;
            wy += ny * push;
            wvx += nx * rate;
            wvy += ny * rate;
            ax += nx * push * stiffness * 0.35;
            ay += ny * push * stiffness * 0.35;
          }
        }
        force[index] = ax;
        force[index + 1] = ay;
        const w = i * 4;
        wave[w] = wx;
        wave[w + 1] = wy;
        wave[w + 2] = wvx;
        wave[w + 3] = wvy;
      }

      // Springs: each dot pulled home, and towards its four neighbours.
      const {cols, rows} = grid;
      const stride = cols * 2;
      for (let n = 0; n < steps; n++) {
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const index = (row * cols + col) * 2;
            let ax = force[index] - stiffness * offset[index] - damping * velocity[index];
            let ay = force[index + 1] - stiffness * offset[index + 1] - damping * velocity[index + 1];
            let lx = -4 * offset[index], ly = -4 * offset[index + 1];
            let mx = -4 * velocity[index], my = -4 * velocity[index + 1];
            if (col > 0) { lx += offset[index - 2]; ly += offset[index - 1]; mx += velocity[index - 2]; my += velocity[index - 1]; }
            if (col < cols - 1) { lx += offset[index + 2]; ly += offset[index + 3]; mx += velocity[index + 2]; my += velocity[index + 3]; }
            if (row > 0) { lx += offset[index - stride]; ly += offset[index - stride + 1]; mx += velocity[index - stride]; my += velocity[index - stride + 1]; }
            if (row < rows - 1) { lx += offset[index + stride]; ly += offset[index + stride + 1]; mx += velocity[index + stride]; my += velocity[index + stride + 1]; }
            ax += coupling * lx + viscosity * mx;
            ay += coupling * ly + viscosity * my;
            next[index] = velocity[index] + ax * h;
            next[index + 1] = velocity[index + 1] + ay * h;
          }
        }
        for (let i = 0; i < offset.length; i++) {
          velocity[i] = next[i];
          offset[i] += velocity[i] * h;
        }
      }

      for (let i = 0; i < grid.count; i++) {
        const index = i * 2;
        const w = i * 4;
        energy[i] = Math.min(
          1,
          (Math.hypot(velocity[index] + wave[w + 2], velocity[index + 1] + wave[w + 3]) / 380) * 0.85 +
            (Math.hypot(offset[index] + wave[w], offset[index + 1] + wave[w + 1]) / (grid.cell * 2.2)) * 0.35,
        );
      }
      for (let i = shocks.length - 1; i >= 0; i--) {
        if (active[i].front > DOT.shockRadius + width * 3) shocks.splice(i, 1);
      }
      const decay = 1 - Math.exp(-dt / 0.08);
      pointer.vx -= pointer.vx * decay;
      pointer.vy -= pointer.vy * decay;
      pointer.presence += ((pointer.inside ? 1 : 0) - pointer.presence) * (1 - Math.exp(-dt / 0.2));
    };

    const render = () => {
      const radius = DOT.proximity;
      for (let i = 0; i < grid.count; i++) {
        const index = i * 2;
        const w = i * 4;
        const x = rest[index] + offset[index] + wave[w];
        const y = rest[index + 1] + offset[index + 1] + wave[w + 1];
        let lit = energy[i];
        // A soft light around the pointer, even while it's still.
        if (pointer.presence > 0.001) {
          const distance = Math.hypot(x - pointer.x, y - pointer.y);
          if (distance < radius) lit = Math.max(lit, smootherstep(1 - distance / radius) * 0.4 * pointer.presence);
        }
        const t = i * 5;
        instances[t] = x;
        instances[t + 1] = y;
        instances[t + 2] = velocity[index] + wave[w + 2];
        instances[t + 3] = velocity[index + 1] + wave[w + 3];
        instances[t + 4] = lit;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(program);
      gl.uniform2f(u.uResolution, view.width, view.height);
      gl.uniform1f(u.uSize, DOT.size);
      gl.uniform1f(u.uSwell, reduced ? 0 : DOT.swell);
      gl.uniform1f(u.uStretch, reduced ? 0 : DOT.stretch);
      gl.uniform1f(u.uGlow, DOT.glow);
      gl.uniform3f(u.uBase, colors.base[0], colors.base[1], colors.base[2]);
      gl.uniform3f(u.uActive, colors.active[0], colors.active[1], colors.active[2]);
      gl.uniform1f(u.uRest, REST_ALPHA);
      gl.bindVertexArray(vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, instances);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, grid.count);
      gl.bindVertexArray(null);
    };

    const settled = () => {
      if (shocks.length) return false;
      if (Math.abs(pointer.vx) + Math.abs(pointer.vy) > 1) return false;
      if (Math.abs((pointer.inside ? 1 : 0) - pointer.presence) > 0.002) return false;
      for (let i = 0; i < offset.length; i++) {
        if (Math.abs(offset[i]) > 0.02 || Math.abs(velocity[i]) > 0.5) return false;
      }
      return true;
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      step(dt, now);
      render();
      if (!settled()) raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const locate = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      // The stage shrinks while the small-screen menu is open, so scale back to the canvas's own pixels.
      const sx = rect.width ? view.width / rect.width : 1;
      const sy = rect.height ? view.height / rect.height : 1;
      return [(event.clientX - rect.left) * sx, (event.clientY - rect.top) * sy];
    };

    const onMove = (event: PointerEvent) => {
      const [x, y] = locate(event);
      const inside = x >= 0 && y >= 0 && x <= view.width && y <= view.height;
      const time = event.timeStamp || performance.now();
      if (inside && pointer.inside && pointer.time) {
        const elapsed = Math.max(4, time - pointer.time) / 1000;
        pointer.vx += ((x - pointer.x) / elapsed - pointer.vx) * 0.6;
        pointer.vy += ((y - pointer.y) / elapsed - pointer.vy) * 0.6;
      } else {
        pointer.vx = 0;
        pointer.vy = 0;
      }
      pointer.x = x;
      pointer.y = y;
      pointer.time = time;
      if (inside !== pointer.inside || inside) {
        pointer.inside = inside;
        wake();
      }
    };

    // A finger lifts away rather than leaving, so a touch's light goes out when it ends.
    const onLeave = () => {
      pointer.inside = false;
      pointer.time = 0;
      wake();
    };
    const onUp = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') onLeave();
    };
    const onOut = (event: PointerEvent) => {
      if (!event.relatedTarget) onLeave();
    };

    const onDown = (event: PointerEvent) => {
      if (reduced) return;
      const [x, y] = locate(event);
      if (x < 0 || y < 0 || x > view.width || y > view.height) return;
      shocks.push({x, y, start: performance.now()});
      if (shocks.length > 6) shocks.shift();
      wake();
    };

    window.addEventListener('pointermove', onMove, {passive: true});
    window.addEventListener('pointerdown', onDown, {passive: true});
    window.addEventListener('pointerup', onUp, {passive: true});
    window.addEventListener('pointercancel', onLeave, {passive: true});
    window.addEventListener('pointerout', onOut);
    window.addEventListener('blur', onLeave);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      wake();
    });
    resizeObserver.observe(canvas);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    visibilityObserver.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else wake();
    };
    document.addEventListener('visibilitychange', onVisibility);

    // The theme toggle writes color-scheme on <html>; redraw in the new colours.
    const themeObserver = new MutationObserver(() => {
      readColors();
      render();
    });
    themeObserver.observe(document.documentElement, {attributes: true, attributeFilter: ['style', 'class', 'data-theme']});
    const scheme = window.matchMedia('(prefers-color-scheme: dark)');
    const onScheme = () => {
      readColors();
      render();
    };
    scheme.addEventListener('change', onScheme);

    readColors();
    resize();
    stage.dataset.dots = 'live';

    return () => {
      delete stage.dataset.dots;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      themeObserver.disconnect();
      scheme.removeEventListener('change', onScheme);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onLeave);
      window.removeEventListener('pointerout', onOut);
      window.removeEventListener('blur', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      gl.deleteBuffer(cornerBuffer);
      gl.deleteBuffer(instanceBuffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={canvasRef} className="dot-field" aria-hidden />;
}
