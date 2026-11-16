import {notFound} from 'next/navigation';

import {findPost, POSTS} from '@/lib/insights';
import {shareImage} from '@/lib/share-image';

export const alt = 'botLane Insights';
export const size = {width: 1200, height: 630};
export const contentType = 'image/png';
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map((post) => ({slug: post.slug}));
}

export default async function Image({params}: {params: Promise<{slug: string}>}) {
  const post = findPost((await params).slug);
  if (!post) notFound();
  return shareImage(post.title, 'botLane · Insights');
}
