import type {Metadata} from 'next';

import {WebsitesPage} from '@/components/offers/websites-page';

export const metadata: Metadata = {
  title: 'Websites · botLane',
  description: 'Core, Ascend and Apex: custom websites for getting online properly, for growing companies, and for brands where the site is the experience. From $2,500 one-time.',
};

export default function WebsitesRoute() {
  return <WebsitesPage />;
}
