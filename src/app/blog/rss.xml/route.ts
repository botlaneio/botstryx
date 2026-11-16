import {postsByDate} from '@/lib/insights';
import {SITE_URL} from '@/lib/site';

const FEED_DESCRIPTION = 'Practical notes on websites, booking, automation, and the work behind them.';

export const dynamic = 'force-static';

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

/** The journal as RSS. Built once; every post is already in the repo. */
export function GET() {
  const items = postsByDate()
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const published = new Date(`${post.date}T00:00:00Z`).toUTCString();
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${published}</pubDate>
      <description>${escapeXml(post.dek)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Insights · botLane</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {'Content-Type': 'application/rss+xml; charset=utf-8'},
  });
}
