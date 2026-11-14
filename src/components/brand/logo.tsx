/**
 * The Botlane "b": a lowercase b whose ascender is broken off into one square, like a pixel set above the letter.
 * Geometry from the brand source: stem and square 84 wide, bowl radius 158 centred at 158,242, counter radius 72.
 * The square carries the electric blue; the rest follows the text colour.
 */
const BODY = 'M0 168H84V84H158A158 158 0 1 1 0 242ZM86 242a72 72 0 1 0 144 0a72 72 0 1 0 -144 0Z';
const SQUARE = 'M0 6H78V84H0Z';

export function Logo({size = 28}: {size?: number}) {
  return (
    <span className="logo" style={{fontSize: Math.round(size * 0.82)}}>
      <svg width={size} height={size} viewBox="-62 -17 440 440" aria-hidden className="shrink-0 overflow-visible">
        <path className="logo-body" d={BODY} fill="currentColor" fillRule="evenodd" />
        <path className="logo-square" d={SQUARE} />
      </svg>
      <span>botLane</span>
    </span>
  );
}
