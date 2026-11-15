import type {Metadata} from 'next';

import {WebAppsPage} from '@/components/offers/web-apps-page';

export const metadata: Metadata = {
  title: 'Web Apps · botLane',
  description: 'Custom web apps, planned and priced in stages: a scoping sprint for $1,500, MVP development for $9,500, and full product builds from $18,000. Every price fixed before we start.',
};

export default function WebAppsRoute() {
  return <WebAppsPage />;
}
