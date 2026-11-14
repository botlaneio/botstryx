'use client';

import {useEffect, useRef, useState, useSyncExternalStore} from 'react';
import {SegmentedControl, SegmentedControlItem} from '@astryxdesign/core/SegmentedControl';

export type SitePage = {
  /** Which sketch to draw for it. */
  id: 'home' | 'about' | 'services' | 'choice' | 'contact';
  name: string;
  title: string;
  body: string;
};

type Device = 'desktop' | 'phone';
type Props = {pages: SitePage[]; caption: string; disclaimer: string};

/**
 * The pages of a small site, one at a time: a list that says which page is showing, and a frame that draws a
 * sketch of it as a desktop window or as a phone. The sketch is boxes and lines only: it shows how a page is
 * arranged, not a real design, and the caption says so. What chooses the page (a tap, or the scroll position)
 * is up to whoever renders this.
 */
function ExplorerView({pages, caption, disclaimer, index, device, onPick, bar, after}: Props & {
  index: number;
  device: Device;
  onPick: (i: number) => void;
  /** What sits above the frame: the screen-size switch, or a progress marker. */
  bar: React.ReactNode;
  /** Anything that follows the list of pages, in the same column. */
  after?: React.ReactNode;
}) {
  const page = pages[index];
  return (
    <div className="explorer">
      <div className="explorer-side">
      <ol className="explorer-list">
        {pages.map((p, i) => {
          const active = i === index;
          return (
            <li key={p.id} data-active={active}>
              <button type="button" aria-expanded={active} aria-controls={`explorer-${p.id}`} onClick={() => onPick(i)}>
                <span className="mono">0{i + 1}</span>
                <span className="name">{p.name}</span>
              </button>
              <div id={`explorer-${p.id}`} className="explorer-detail" inert={!active}>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      {after}
      </div>

      <figure className="explorer-stage">
        <div className="explorer-bar">{bar}</div>

        <div className="frame-well">
          <div className="frame" data-device={device} aria-hidden>
            <div className="frame-chrome">
              <i /><i /><i />
              <span className="mono">{page.name}</span>
            </div>
            <div className="frame-nav">
              <b />
              {pages.map((p, i) => <span key={p.id} data-here={i === index} />)}
            </div>
            {/* The key redraws the sketch from scratch when the page changes, so its parts arrive in order. */}
            <div className="sketch" data-page={page.id} key={page.id}>
              <Sketch id={page.id} />
            </div>
          </div>
        </div>

        <figcaption>
          <span>{caption}</span>
          <span>{disclaimer}</span>
        </figcaption>
      </figure>
    </div>
  );
}

/** The explorer worked by hand: tap a page in the list, and switch the frame between desktop and phone. */
export function PageExplorer(props: Props) {
  const [index, setIndex] = useState(0);
  const [device, setDevice] = useState<Device>('desktop');
  return (
    <ExplorerView
      {...props}
      index={index}
      device={device}
      onPick={setIndex}
      bar={
        <SegmentedControl label="Screen size" size="sm" value={device} onChange={(v) => setDevice(v === 'phone' ? 'phone' : 'desktop')}>
          <SegmentedControlItem value="desktop" label="Desktop" />
          <SegmentedControlItem value="phone" label="Phone" />
        </SegmentedControl>
      }
    />
  );
}

const REDUCED = '(prefers-reduced-motion: reduce)';
const onReducedChange = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

/**
 * The explorer worked by scrolling. The section is several screens tall and its contents stay pinned while it
 * passes: each stretch of scrolling brings the next page into the frame, and the last stretch narrows the
 * frame from a desktop window to a phone. Tapping a page in the list scrolls to its stretch.
 * With reduced motion asked for, the hand-worked explorer is shown instead, at its ordinary height.
 */
export function PageWalkthrough({cta, ...props}: Props & {
  /** Shown once the walk reaches its end: the action to take, having seen the whole site. */
  cta?: React.ReactNode;
}) {
  const reduced = useSyncExternalStore(onReducedChange, () => window.matchMedia(REDUCED).matches, () => false);
  const track = useRef<HTMLDivElement>(null);
  // One stretch per page, and one more at the end for the phone.
  const stretches = props.pages.length + 1;
  const [stretch, setStretch] = useState(0);

  useEffect(() => {
    if (reduced) return;
    // Measured on every scroll event: it is one rectangle read, and the state only changes when a new stretch
    // begins, so nothing is redrawn in between. (Waiting for the next painted frame instead would stall in a
    // window that is not being painted.)
    const measure = () => {
      const el = track.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      setStretch(Math.min(stretches - 1, Math.floor(progress * stretches)));
    };
    measure();
    window.addEventListener('scroll', measure, {passive: true});
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [reduced, stretches]);

  if (reduced) return <PageExplorer {...props} />;

  const last = props.pages.length - 1;
  const index = Math.min(stretch, last);
  const device: Device = stretch > last ? 'phone' : 'desktop';
  const atEnd = stretch === stretches - 1;

  // Scrolls to the middle of a page's stretch.
  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const travel = rect.height - window.innerHeight;
    window.scrollTo({top: window.scrollY + rect.top + ((i + 0.5) / stretches) * travel, behavior: 'smooth'});
  };

  return (
    <div className="walk" ref={track} data-end={atEnd} style={{'--stretches': stretches} as React.CSSProperties}>
      <div className="walk-pin">
        <ExplorerView
          {...props}
          index={index}
          device={device}
          onPick={goTo}
          after={cta && <div className="walk-cta" inert={!atEnd}>{cta}</div>}
          bar={
            <ol className="walk-progress" aria-hidden>
              {Array.from({length: stretches}, (_, i) => <li key={i} data-on={i <= stretch} data-now={i === stretch} />)}
            </ol>
          }
        />
      </div>
    </div>
  );
}

const d = (i: number) => ({'--i': i}) as React.CSSProperties;

/**
 * One page, as boxes and lines. `ink` is a heading or a button, `tint` a picture, `line` a run of text.
 * Sizes are sw-* (width) and sh-* (height): the plain w-* and h-* names belong to Tailwind and mean other sizes.
 */
function Sketch({id}: {id: SitePage['id']}) {
  switch (id) {
    case 'home':
      return (
        <>
          <div className="col">
            <i className="ink sh-lg sw-90" style={d(0)} />
            <i className="ink sh-lg sw-60" style={d(1)} />
            <i className="line sw-80" style={d(2)} />
            <i className="line sw-50" style={d(3)} />
            <i className="ink pill" style={d(4)} />
          </div>
          <i className="tint tall" style={d(2)} />
        </>
      );
    case 'about':
      return (
        <>
          <i className="tint portrait" style={d(0)} />
          <div className="col">
            <i className="ink sh-md sw-70" style={d(1)} />
            <i className="line sw-100" style={d(2)} />
            <i className="line sw-90" style={d(3)} />
            <i className="line sw-95" style={d(4)} />
            <i className="line sw-60" style={d(5)} />
          </div>
        </>
      );
    case 'services':
      return (
        <>
          <i className="ink sh-md sw-40 span" style={d(0)} />
          {[1, 2, 3].map((n) => (
            <div className="card" key={n} style={d(n)}>
              <i className="tint short" />
              <i className="ink sh-sm sw-70" />
              <i className="line sw-100" />
              <i className="line sw-80" />
            </div>
          ))}
        </>
      );
    case 'choice':
      return (
        <>
          <i className="tint wide" style={d(0)} />
          <i className="tint" style={d(1)} />
          <i className="tint" style={d(2)} />
          <div className="col span">
            <i className="ink sh-sm sw-40" style={d(3)} />
            <i className="line sw-70" style={d(4)} />
          </div>
        </>
      );
    case 'contact':
      return (
        <>
          <div className="col">
            <i className="ink sh-md sw-80" style={d(0)} />
            <i className="line sw-90" style={d(1)} />
            <i className="line sw-60" style={d(2)} />
          </div>
          <div className="col form">
            <i className="field" style={d(1)} />
            <i className="field" style={d(2)} />
            <i className="field big" style={d(3)} />
            <i className="ink pill" style={d(4)} />
          </div>
        </>
      );
  }
}
