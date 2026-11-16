'use client';

import {useEffect, useState} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {Drawer, DrawerHeader} from '@astryxdesign/core/Drawer';
import type {Root} from 'fumadocs-core/page-tree';

import {DocsNav} from './docs-nav';
import {DocsSearch} from './docs-search';

/** Sidebar on a wide screen, a drawer on a phone, and the search box for both. */
export function DocsShell({tree, children}: {tree: Root; children: React.ReactNode}) {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="docs-frame">
      <aside className="docs-side">
        <Button label="Search docs" variant="secondary" onClick={() => setSearch(true)}>
          <span className="inline-flex items-center gap-2">Search <span className="mono docs-kbd">⌘K</span></span>
        </Button>
        <DocsNav tree={tree} />
      </aside>

      <div className="docs-body">
        <div className="docs-menu">
          <Button label="Docs menu" variant="secondary" onClick={() => setMenu(true)}>Docs menu</Button>
          <Button label="Search docs" variant="ghost" onClick={() => setSearch(true)}>Search</Button>
        </div>
        {children}
      </div>

      <Drawer isOpen={menu} onOpenChange={setMenu} side="start" label="Docs menu" width={320}>
        <DrawerHeader title="slotLane docs" onOpenChange={setMenu} />
        <div className="docs-drawer">
          <Button label="Search docs" variant="secondary" onClick={() => { setMenu(false); setSearch(true); }}>Search</Button>
          <DocsNav tree={tree} onNavigate={() => setMenu(false)} />
        </div>
      </Drawer>

      <DocsSearch isOpen={search} onOpenChange={setSearch} />
    </div>
  );
}
