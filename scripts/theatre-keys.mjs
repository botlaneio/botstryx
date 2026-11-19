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

// The hero's orbit (src/components/hero/orbit.tsx). "Orbit intro" plays once on load: the ring opens out from the
// logo, tips back to its resting tilt and the logo's glow comes up.
const ORBIT_INTRO = {
  Ring: {
    radius: [[0, 0.12], [1.9, 1]],
    scale: [[0, 0.72], [1.9, 1]],
    tilt: [[0, -38], [2.3, -12]],
    opacity: [[0, 0], [0.9, 1]],
    spin: [[0, -0.9], [2.3, 0]],
  },
  Core: {glow: [[0.2, 0], [1.6, 1]], scale: [[0, 0.6], [1.4, 1]]},
};

// "Orbit turn" plays each time the headline moves on: the ring turns one card forward (progress 0 to 1), dips its
// tilt a little as it goes, and the card arriving at the front lifts as it lands.
const ORBIT_TURN = {
  Turn: {progress: [[0, 0], [1.25, 1]], dip: [[0, 0], [0.55, 5], [1.25, 0]], lift: [[0.7, 0], [1.25, 1]]},
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
    'Orbit intro': sheet(ORBIT_INTRO, 2.3),
    'Orbit turn': sheet(ORBIT_TURN, 1.25),
    'Brief to live': sheet(BRIEF_TO_LIVE, 10),
  },
  definitionVersion: '0.4.0',
  revisionHistory: [],
};

const out = fileURLToPath(new URL('../src/components/theatre/home.theatre.json', import.meta.url));
writeFileSync(out, JSON.stringify(state, null, 2) + '\n');
console.log(`wrote ${out}`);
