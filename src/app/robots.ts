import type {MetadataRoute} from 'next';
import {headers} from 'next/headers';
import {regionForHostname} from '@/lib/regional-pricing';

import {SITE_URL} from '@/lib/site';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const region = regionForHostname((await headers()).get('host')?.split(':')[0] ?? 'botlane.io');
  const base = region === 'in' ? 'https://botlane.in' : SITE_URL;
  return {
    // Everything public is open; the chat endpoint and signed-in pages aren't for search engines.
    rules: {userAgent: '*', allow: '/', disallow: ['/api/', '/account', '/portal']},
    sitemap: `${base}/sitemap.xml`,
  };
}
