import {postShareImage, SITE_DESCRIPTION, SITE_NAME, SITE_URL, SHARE_IMAGE} from '@/lib/site';
import type {Post} from '@/lib/insights';

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/** JSON-LD for a script tag. `<` is escaped so the payload cannot close the script. */
export function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** Organization and WebSite, on every page via the root layout. */
export function siteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORGANIZATION_ID,
        name: SITE_NAME,
        url: SITE_URL,
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        inLanguage: 'en',
        publisher: {'@id': ORGANIZATION_ID},
      },
    ],
  };
}

/** BlogPosting and BreadcrumbList for one note. dateModified matches datePublished: posts are not revised in place. */
export function postJsonLd(post: Post) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const published = `${post.date}T00:00:00.000Z`;
  const organization = {'@type': 'Organization', '@id': ORGANIZATION_ID, name: SITE_NAME, url: SITE_URL};

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: post.title,
        description: post.dek,
        datePublished: published,
        dateModified: published,
        author: organization,
        publisher: organization,
        mainEntityOfPage: {'@type': 'WebPage', '@id': url},
        image: {
          '@type': 'ImageObject',
          url: `${SITE_URL}${postShareImage(post.slug)}`,
          width: SHARE_IMAGE.width,
          height: SHARE_IMAGE.height,
        },
        url,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          {'@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL},
          {'@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog`},
          {'@type': 'ListItem', position: 3, name: post.title, item: url},
        ],
      },
    ],
  };
}
