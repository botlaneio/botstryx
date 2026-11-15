import type {MetadataRoute} from 'next';

import {SITE_URL} from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    // Everything public is open; the chat endpoint and signed-in pages aren't for search engines.
    rules: {userAgent: '*', allow: '/', disallow: ['/api/', '/account', '/portal']},
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
