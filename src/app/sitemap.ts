import type {MetadataRoute} from 'next';
import {headers} from 'next/headers';
import {regionForHostname} from '@/lib/regional-pricing';

import {POSTS} from '@/lib/insights';
import {source} from '@/lib/source';
import {SITE_URL} from '@/lib/site';

// Every public page. Add a path here when a page is added under src/app (sign-in pages stay out).
// Docs pages come from the Fumadocs source, so a new MDX file is listed without editing this array.
const PAGES = [
  '', '/solutions', '/websites', '/websites/business-sites', '/websites/company-sites', '/websites/brand-sites',
  '/web-apps', '/web-apps/scoping-sprint', '/web-apps/mvp', '/web-apps/full-product', '/care',
  '/custom-solutions', '/custom-solutions/ai-assistant', '/products/slotlane',
  '/blog', '/changelog', '/help', '/contact', '/privacy', '/terms',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const region = regionForHostname((await headers()).get('host')?.split(':')[0] ?? 'botlane.io');
  const base = region === 'in' ? 'https://botlane.in' : SITE_URL;
  return [
    ...PAGES.map((path) => ({url: `${base}${path}`, priority: path === '' ? 1 : 0.7})),
    ...source.getPages().map((page) => ({url: `${base}${page.url}`, priority: page.url === '/docs' ? 0.7 : 0.5})),
    ...POSTS.map((post) => ({url: `${base}/blog/${post.slug}`, lastModified: post.date, priority: 0.5})),
  ];
}
