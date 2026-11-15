import type {MetadataRoute} from 'next';

import {POSTS} from '@/lib/insights';
import {SITE_URL} from '@/lib/site';

// Every public page. Add a path here when a page is added under src/app (sign-in pages stay out).
const PAGES = [
  '', '/solutions', '/websites', '/websites/business-sites', '/websites/company-sites', '/websites/brand-sites',
  '/web-apps', '/web-apps/scoping-sprint', '/web-apps/mvp', '/web-apps/full-product', '/care',
  '/custom-solutions', '/custom-solutions/ai-assistant', '/products', '/products/slotlane',
  '/blog', '/changelog', '/docs', '/help', '/contact', '/privacy', '/terms',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PAGES.map((path) => ({url: `${SITE_URL}${path}`, priority: path === '' ? 1 : 0.7})),
    ...POSTS.map((post) => ({url: `${SITE_URL}/blog/${post.slug}`, lastModified: post.date, priority: 0.5})),
  ];
}
