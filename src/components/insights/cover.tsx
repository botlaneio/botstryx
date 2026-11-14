import type {Post} from '@/lib/insights';

// A small, repeatable source of variety: the same note always gets the same drawing.
function seeded(seed: string) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}
const n = (v: number) => v.toFixed(1);

/** A note's cover: one of three line drawings, varied by the note's address. Decorative. */
export function Cover({kind, seed}: {kind: Post['cover']; seed: string}) {
  const r = seeded(seed);
  return (
    <svg className="cover" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {kind === 'lines' && Array.from({length: 13}, (_, i) => {
        const y = 28 + i * 15.5;
        const start = 30 + r() * 120;
        const end = 230 + r() * 140;
        const hot = i === 3 + Math.floor(r() * 6);
        return <path key={i} d={`M${n(start)} ${n(y)}H${n(end)}`} className={hot ? 'hot' : i % 3 === 0 ? 'ln' : 'soft'} />;
      })}
      {kind === 'grid' && Array.from({length: 8 * 5}, (_, i) => {
        const x = 44 + (i % 8) * 40;
        const y = 30 + Math.floor(i / 8) * 40;
        const v = r();
        return <rect key={i} x={x} y={y} width="32" height="32" rx="3" className={v > 0.93 ? 'hotfill' : v > 0.7 ? 'tint' : 'soft'} />;
      })}
      {kind === 'orbit' && (
        <>
          {[38, 66, 94, 122, 150].map((rad, i) => {
            const a = r() * Math.PI * 2;
            return (
              <g key={rad}>
                <ellipse cx="200" cy="120" rx={rad * 1.25} ry={rad * 0.62} className={i % 2 ? 'soft' : 'ln'} />
                <circle cx={n(200 + Math.cos(a) * rad * 1.25)} cy={n(120 + Math.sin(a) * rad * 0.62)} r={i === 2 ? 5 : 3} className={i === 2 ? 'hotfill' : 'node'} />
              </g>
            );
          })}
          <circle cx="200" cy="120" r="7" className="ln" />
        </>
      )}
    </svg>
  );
}
