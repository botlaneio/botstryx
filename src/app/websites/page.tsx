import type {Metadata} from 'next';
import {headers} from 'next/headers';
import {regionForHostname} from '@/lib/regional-pricing';

import {WebsitesPage} from '@/components/offers/websites-page';

const usMetadata: Metadata = {
  title: 'Websites · botLane',
  description: 'Core, Ascend and Apex: custom websites for getting online properly, for growing companies, and for brands where the site is the experience. From $2,500 one-time.',
};

export async function generateMetadata(): Promise<Metadata> {
  const region = regionForHostname((await headers()).get('host')?.split(':')[0] ?? 'botlane.io');
  return region === 'in' ? {...usMetadata, description: 'Core, Ascend and Apex: custom websites for getting online properly, for growing companies, and for brands where the site is the experience. From ₹39,900 one-time.'} : usMetadata;
}

export default function WebsitesRoute() {
  return <WebsitesPage />;
}
