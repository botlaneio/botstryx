import type {Metadata} from 'next';

import {AscendPage} from '@/components/offers/ascend-page';

export const metadata: Metadata = {
  title: 'Ascend · botLane',
  description: 'A complete company website on a design system of its own, with an editor your team actually enjoys using. Up to twelve pages, connected to the tools you already work in.',
};

export default function AscendWebsitePage() {
  return <AscendPage />;
}
