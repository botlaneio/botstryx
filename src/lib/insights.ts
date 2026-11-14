// Insights: the studio's notes. The posts are botpro's, word for word (src/content/imported-insights.json there,
// kept here as src/content/insights.json). Two of botpro's notes are not here yet: "What a fixed price actually
// covers" and "Moving botlane.io to Cloudflare Workers" are written against its price book, which this site
// does not have.
import posts from '../content/insights.json';

export type Block =
  | {type: 'markdown'; text: string}
  | {type: 'p'; text: string}
  | {type: 'h2'; text: string}
  | {type: 'list'; items: string[]}
  | {type: 'quote'; text: string};

export interface Post {
  slug: string;
  title: string;
  /** The line under the title, and the post's description. */
  dek: string;
  topic: string;
  /** Published, as YYYY-MM-DD. */
  date: string;
  /** Which cover drawing the post gets. */
  cover: 'lines' | 'grid' | 'orbit';
  body: Block[];
}

export const POSTS = posts as Post[];

/** Posts, newest first; the same date keeps the order they are stored in. */
export const postsByDate = (): Post[] => [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
export const findPost = (slug: string): Post | undefined => POSTS.find((p) => p.slug === slug);

/** A date as "28 October 2026". */
export const formatDate = (iso: string): string =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'});

/** Minutes to read, at about 220 words a minute, never less than one. */
export function readingMinutes(post: Post): number {
  const words = post.body.flatMap((b) => (b.type === 'list' ? b.items : [b.text])).join(' ').split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

/** A heading's anchor: "Where Next.js keeps its cache" becomes "where-nextjs-keeps-its-cache". */
export const anchor = (text: string): string => text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');

export interface PostSummary {
  slug: string;
  title: string;
  dek: string;
  topic: string;
  date: string;
  minutes: number;
  cover: Post['cover'];
}
export const summary = (p: Post): PostSummary => ({slug: p.slug, title: p.title, dek: p.dek, topic: p.topic, date: formatDate(p.date), minutes: readingMinutes(p), cover: p.cover});
