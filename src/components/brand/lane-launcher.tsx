'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';

/**
 * Lane, in the bottom corner: the button that opens the assistant. Lane leans in from the corner of a
 * paper-coloured disc, tilts its head, blinks, and now and then ducks out and comes back. Pointing at the
 * button straightens it up and shows its name.
 *
 * Give it `onClick` to open a chat panel; until there is one it is a link (to /contact by default). It stays
 * off the page it links to. Under reduced motion Lane holds still, leaning in.
 */
export function LaneLauncher({href = '/contact', onClick, label = 'Ask Lane'}: {href?: string; onClick?: () => void; label?: string}) {
  const pathname = usePathname();
  if (!onClick && pathname === href) return null;

  const body = (
    <>
      <span className="lane-say" aria-hidden>{label}</span>
      <span className="lane-disc">
        <svg viewBox="0 0 64 64" aria-hidden>
          <g className="lane-lean">
            <g className="lane-bot">
              <rect className="lane-head" x="12" y="16" width="46" height="36" rx="11" />
              <rect className="lane-eye" x="21" y="29" width="8" height="8" rx="2" />
              <rect className="lane-eye blue" x="33" y="29" width="8" height="8" rx="2" />
            </g>
          </g>
        </svg>
      </span>
    </>
  );

  return onClick
    ? <button type="button" className="lane" aria-label={label} onClick={onClick}>{body}</button>
    : <Link href={href} className="lane" aria-label={label}>{body}</Link>;
}
