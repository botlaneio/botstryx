import type {Metadata} from 'next';
import {headers} from 'next/headers';
import {regionForHostname} from '@/lib/regional-pricing';

import {MvpPage} from '@/components/offers/mvp-page';

const usMetadata: Metadata = {
  title: 'MVP development · botLane',
  description: 'For testing the idea with real users or investors: the core workflow working end to end, with sign-in and real data, deployed for real users in 4–6 weeks. $9,500.',
};

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get('host')?.split(':')[0] ?? 'botlane.io';
  return regionForHostname(host) === 'in' ? {...usMetadata, description: 'MVP development for Indian businesses from ₹2,99,900, with working user sign-in and data.'} : usMetadata;
}

export default function MvpRoute() {
  return <MvpPage />;
}
