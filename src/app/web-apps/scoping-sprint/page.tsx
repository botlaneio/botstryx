import type {Metadata} from 'next';
import {headers} from 'next/headers';
import {regionForHostname} from '@/lib/regional-pricing';

import {ScopingSprintPage} from '@/components/offers/scoping-sprint-page';

const usMetadata: Metadata = {
  title: 'Scoping sprint · botLane',
  description: 'For anyone with an app idea who needs a clear plan and a fixed quote. Requirements and user flows, clickable wireframes, a technical plan and a fixed quote in 1–2 weeks, for $1,500, credited towards your build.',
};

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get('host')?.split(':')[0] ?? 'botlane.io';
  return regionForHostname(host) === 'in' ? {...usMetadata, description: 'Web app scoping sprint from ₹24,900 in India, including requirements, wireframes and a fixed build quote.'} : usMetadata;
}

export default function ScopingSprintRoute() {
  return <ScopingSprintPage />;
}
