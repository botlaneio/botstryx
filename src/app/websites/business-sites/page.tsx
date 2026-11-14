import type {Metadata} from 'next';

import {CorePage} from '@/components/offers/core-page';

export const metadata: Metadata = {
  title: 'Core · botLane',
  description: 'A custom website that makes your business clear, credible, and easy to contact. Everything you need to get online properly, in up to five pages.',
};

export default function CoreWebsitePage() {
  return <CorePage />;
}
