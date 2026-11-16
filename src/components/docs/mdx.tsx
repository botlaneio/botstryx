import type {ComponentProps} from 'react';
import Link from 'next/link';

function Heading(Tag: 'h2' | 'h3') {
  return function DocsHeading({id, children, ...props}: ComponentProps<typeof Tag>) {
    return (
      <Tag id={id} {...props}>
        {id ? <a className="docs-anchor" href={`#${id}`}>{children}</a> : children}
      </Tag>
    );
  };
}

function DocsAnchor({href, children, ...props}: ComponentProps<'a'>) {
  if (href?.startsWith('/')) return <Link href={href} {...props}>{children}</Link>;
  return <a href={href} {...props}>{children}</a>;
}

function DocsTable(props: ComponentProps<'table'>) {
  return <div className="docs-table-wrap"><table {...props} /></div>;
}

function DocsPre(props: ComponentProps<'pre'>) {
  return <div className="docs-code"><pre {...props} /></div>;
}

/** A quiet note. Registered for MDX, used only when a page needs one. */
export function Callout({title, children}: {title?: string; children: React.ReactNode}) {
  return (
    <aside className="docs-callout">
      {title ? <p className="mono">{title}</p> : null}
      <div>{children}</div>
    </aside>
  );
}

export function getMdxComponents() {
  return {
    h2: Heading('h2'),
    h3: Heading('h3'),
    a: DocsAnchor,
    table: DocsTable,
    pre: DocsPre,
    Callout,
  };
}
