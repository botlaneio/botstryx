// Writes src/components/theatre/home.theatre.json: the keyframes of the homepage's Theatre.js sequences, one sheet
// each, in the state format Theatre loads (and its studio exports).
//
//   node scripts/theatre-keys.mjs
//
// The keyframes are easier to read and change here than in the JSON. Once someone tunes the sequence by hand in the
// studio (`npm run dev`, then the panel over the homepage), export from the studio and save over the JSON:
// from then on the JSON is the source and this script is only the first draft.

import {writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';


// [time in seconds, value]. Between keyframes the value glides on one ease (out handle 0.45,0 and in handle 0.25,1):
// a gentle start and a long, soft landing.
const BRIEF_TO_LIVE = {
  Camera: {
    zoom: [[0, 1.16], [5.6, 1]],
    tilt: [[0, 24], [5.6, 0]],
    turn: [[0, -16], [5.6, 0]],
    x: [[0, 0], [7.2, 0], [8.6, -6]],
    y: [[0, 26], [5.6, 0]],
  },
  Brief: {
    opacity: [[0, 0], [0.6, 1], [2.7, 1], [3.4, 0]],
    y: [[0, 22], [0.6, 0], [2.7, 0], [3.4, -70]],
    scale: [[0, 1], [2.7, 1], [3.4, 0.6]],
    typed: [[0.5, 0], [2.3, 1]],
  },
  Frame: {
    opacity: [[2.4, 0], [3.1, 1]],
    draw: [[2.4, 0], [4.2, 1]],
    lift: [[5, 0], [7.4, 1]],
  },
  Captions: {
    at: [[0, 0], [2.6, 0], [3.3, 1], [5.2, 1], [5.9, 2], [7.6, 2], [8.3, 3]],
  },
  Live: {
    opacity: [[8.4, 0], [9.2, 1]],
    scale: [[8.4, 0.8], [9.2, 1]],
  },
  Phone: {
    opacity: [[7.4, 0], [8.4, 1]],
    x: [[7.4, 140], [8.6, 0]],
    rotate: [[7.4, 9], [8.6, 0]],
  },
};

// The page's blocks: drawn in as wireframes, then filled in as the build goes.
const BLOCKS = [['Nav', 3.4, 5.6], ['Title', 3.6, 5.9], ['Image', 3.8, 6.2], ['Card 1', 4.0, 6.5], ['Card 2', 4.15, 6.7], ['Card 3', 4.3, 6.9]];
for (const [name, inAt, fillAt] of BLOCKS) {
  BRIEF_TO_LIVE[name] = {
    opacity: [[inAt, 0], [inAt + 0.6, 1]],
    y: [[inAt, 26], [inAt + 0.7, 0]],
    fill: [[fillAt, 0], [fillAt + 0.8, 1]],
  };
}

// The hero's opening, played once on load (3.2s): three soft lights drift in behind the headline while a line of light
// sweeps across the top of the screen.
const HERO_INTRO = {
  'Orb 1': {opacity: [[0, 0], [1.6, 1]], scale: [[0, 0.5], [2.4, 1]], x: [[0, 14], [2.6, 0]], y: [[0, -12], [2.6, 0]]},
  'Orb 2': {opacity: [[0.4, 0], [2, 1]], scale: [[0.4, 0.5], [2.8, 1]], x: [[0.4, -16], [3, 0]], y: [[0.4, 10], [3, 0]]},
  'Orb 3': {opacity: [[0.8, 0], [2.4, 1]], scale: [[0.8, 0.6], [3.2, 1]], x: [[0.8, 10], [3.2, 0]], y: [[0.8, 14], [3.2, 0]]},
  Sweep: {x: [[0.3, -100], [1.9, 250]], opacity: [[0.3, 0], [0.6, 1], [1.6, 1], [1.9, 0]]},
};

// The hero's exit, played by scroll: 0 at the top of the page, 1 once the whole first screen has scrolled away. Each
// layer leaves at its own speed, so the screen comes apart in depth, and the camera pushes into the light.
const HERO_EXIT = {
  Eyebrow: {y: [[0, 0], [0.5, -40]], fade: [[0, 1], [0.4, 0]], blur: [[0, 0], [0.4, 6]]},
  Headline: {y: [[0, 0], [0.7, -90]], fade: [[0, 1], [0.6, 0]], blur: [[0.1, 0], [0.6, 8]]},
  Lede: {y: [[0, 0], [0.8, -60]], fade: [[0.05, 1], [0.6, 0]], blur: [[0.1, 0], [0.6, 4]]},
  'Brief box': {y: [[0, 0], [0.8, -30]], tilt: [[0, 0], [0.8, 18]], scale: [[0, 1], [0.8, 0.92]], fade: [[0.15, 1], [0.75, 0]]},
  Rail: {y: [[0, 0], [0.6, 60]], fade: [[0, 1], [0.45, 0]]},
  Lights: {scale: [[0, 1], [1, 1.6]], opacity: [[0, 1], [1, 0.25]], y: [[0, 0], [1, -12]]},
  Dots: {fade: [[0, 1], [0.8, 0]]},
};

const r = (n) => Math.round(n * 1000) / 1000;
let id = 0;
const next = (p) => `${p}${(id++).toString(36).padStart(4, '0')}`;

function sheet(objects, length) {
  const tracksByObject = {};
  for (const [object, props] of Object.entries(objects)) {
    const trackData = {};
    const trackIdByPropPath = {};
    for (const [prop, keys] of Object.entries(props)) {
      const trackId = next('t');
      trackIdByPropPath[JSON.stringify([prop])] = trackId;
      trackData[trackId] = {
        type: 'BasicKeyframedTrack',
        __debugName: `${object}:${JSON.stringify([prop])}`,
        keyframes: keys.map(([position, value], i) => ({
          id: next('k'),
          position: r(position),
          connectedRight: i < keys.length - 1,
          handles: [0.25, 1, 0.45, 0],
          type: 'bezier',
          value,
        })),
      };
    }
    tracksByObject[object] = {trackData, trackIdByPropPath};
  }
  return {staticOverrides: {byObject: {}}, sequence: {subUnitsPerUnit: 30, length, type: 'PositionalSequence', tracksByObject}};
}

const state = {
  sheetsById: {
    'Hero intro': sheet(HERO_INTRO, 3.2),
    'Hero exit': sheet(HERO_EXIT, 1),
    'Brief to live': sheet(BRIEF_TO_LIVE, 10),
  },
  definitionVersion: '0.4.0',
  revisionHistory: [],
};

const out = fileURLToPath(new URL('../src/components/theatre/home.theatre.json', import.meta.url));
writeFileSync(out, JSON.stringify(state, null, 2) + '\n');
console.log(`wrote ${out}`);
