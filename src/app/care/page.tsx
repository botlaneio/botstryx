import type {Metadata} from 'next';
import {headers} from 'next/headers';
import {regionForHostname} from '@/lib/regional-pricing';

import {CarePage} from '@/components/offers/care-page';

const usMetadata: Metadata = {
  title: 'Care · botLane',
  description: 'Hosting, security updates, uptime monitoring, backups and monthly edits for a live website. Care from $99 a month, Care Plus $199.',
};

export async function generateMetadata(): Promise<Metadata> {
  const region = regionForHostname((await headers()).get('host')?.split(':')[0] ?? 'botlane.io');
  return region === 'in' ? {...usMetadata, description: 'Hosting, security updates, uptime monitoring, backups and monthly edits. Care from ₹2,999 a month and Care Plus from ₹6,999.'} : usMetadata;
}

export default function CareRoute() {
  return <CarePage />;
}
