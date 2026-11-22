import type {Metadata} from 'next';
import {headers} from 'next/headers';
import {regionForHostname} from '@/lib/regional-pricing';

import {FullProductPage} from '@/components/offers/full-product-page';

const usMetadata: Metadata = {
  title: 'Full product build · botLane',
  description: 'For launching a production product: a complete, secure app with accounts and roles, payments if you need them, an admin panel, and testing and launch support. From $18,000, priced after scoping.',
};

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get('host')?.split(':')[0] ?? 'botlane.io';
  return regionForHostname(host) === 'in' ? {...usMetadata, description: 'Full product web app development in India from ₹6,99,900.'} : usMetadata;
}

export default function FullProductRoute() {
  return <FullProductPage />;
}
