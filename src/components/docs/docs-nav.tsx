'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import type {Node, Root} from 'fumadocs-core/page-tree';

function keyOf(node: Node, index: number) {
  if (node.type === 'page') return node.url;
  if (node.type === 'folder') return node.$id ?? `folder-${index}`;
  return node.$id ?? `sep-${index}`;
}

function Nodes({nodes, pathname, onNavigate}: {nodes: Node[]; pathname: string; onNavigate?: () => void}) {
  return (
    <ul>
      {nodes.map((node, index) => {
        if (node.type === 'separator') return null;
        if (node.type === 'folder') {
          return (
            <li key={keyOf(node, index)}>
              <p className="mono docs-group">{node.name}</p>
              {node.index ? <PageLink item={node.index} pathname={pathname} onNavigate={onNavigate} /> : null}
              <Nodes nodes={node.children} pathname={pathname} onNavigate={onNavigate} />
            </li>
          );
        }
        return (
          <li key={keyOf(node, index)}>
            <PageLink item={node} pathname={pathname} onNavigate={onNavigate} />
          </li>
        );
      })}
    </ul>
  );
}

function PageLink({item, pathname, onNavigate}: {item: {url: string; name: React.ReactNode}; pathname: string; onNavigate?: () => void}) {
  const current = pathname === item.url;
  return (
    <Link href={item.url} aria-current={current ? 'page' : undefined} onClick={onNavigate}>
      {item.name}
    </Link>
  );
}

/** Every docs page, in the order the meta files set. */
export function DocsNav({tree, onNavigate}: {tree: Root; onNavigate?: () => void}) {
  const pathname = usePathname();
  return (
    <nav className="docs-nav" aria-label="Documentation">
      <Nodes nodes={tree.children} pathname={pathname} onNavigate={onNavigate} />
    </nav>
  );
}
