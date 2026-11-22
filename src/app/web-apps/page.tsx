import type {Metadata} from 'next';
import {headers} from 'next/headers';
import {regionForHostname} from '@/lib/regional-pricing';

import {WebAppsPage} from '@/components/offers/web-apps-page';

const usMetadata: Metadata = {
  title: 'Web Apps · botLane',
  description: 'Custom web apps, planned and priced in stages: a scoping sprint for $1,500, MVP development for $9,500, and full product builds from $18,000. Every price fixed before we start.',
};

export async function generateMetadata(): Promise<Metadata> {
  const region = regionForHostname((await headers()).get('host')?.split(':')[0] ?? 'botlane.io');
  return region === 'in' ? {...usMetadata, description: 'Custom web apps for India: scoping from ₹24,900, prototype development from ₹2,99,900, and full product builds from ₹6,99,900.'} : usMetadata;
}

export default function WebAppsRoute() {
  return <WebAppsPage />;
}
