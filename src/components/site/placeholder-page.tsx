import {SiteFooter} from './site-footer';
import {SiteHeader} from './site-header';

/**
 * A page whose address exists but whose content has not been written: the header, the page's name and
 * address, and the footer. Each such page swaps this for its real content when that is ready.
 */
export function PlaceholderPage({title, path}: {title: string; path: string}) {
  return (
    <>
      <div className="stage">
        <div className="scene scene-short">
          <SiteHeader />
          <main className="wrap placeholder">
            <p className="mono">{path}</p>
            <h1>{title}</h1>
          </main>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
