'use client';

import Link from 'next/link';
import {Button} from '@astryxdesign/core/Button';

import {Logo} from '@/components/brand/logo';

import {MobileMenu} from './mobile-menu';
import {SolutionsMenu} from './solutions-menu';
import {ThemeToggle} from './theme-toggle';

const NAV = [
  {label: 'Products', href: '/products'},
  // botpro's pricing overview lives on /solutions; its own buttons call it "See pricing".
  {label: 'Pricing', href: '/solutions'},
  {label: 'Insights', href: '/blog'},
  {label: 'Contact', href: '/contact'},
];

/** The bar at the top of every page: the logo, the main navigation, the theme toggle and the main action. */
export function SiteHeader() {
  return (
    <header className="wrap site-header">
      <Link href="/" aria-label="botLane, home" className="rounded-sm outline-offset-4">
        <Logo size={30} />
      </Link>

      <nav aria-label="Main" className="hidden items-center gap-0.5 md:flex">
        <SolutionsMenu />
        {NAV.map((item) => (
          <Button key={item.href} label={item.label} variant="ghost" href={item.href} />
        ))}
      </nav>

      <div className="flex items-center gap-1.5">
        <ThemeToggle />
        <span className="hidden lg:inline-flex"><Button label="Start a project" variant="secondary" href="/contact" /></span>
        <MobileMenu links={NAV} />
      </div>
    </header>
  );
}
