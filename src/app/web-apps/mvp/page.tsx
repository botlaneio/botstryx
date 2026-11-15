import type {Metadata} from 'next';

import {MvpPage} from '@/components/offers/mvp-page';

export const metadata: Metadata = {
  title: 'MVP development · botLane',
  description: 'For testing the idea with real users or investors: the core workflow working end to end, with sign-in and real data, deployed for real users in 4–6 weeks. $9,500.',
};

export default function MvpRoute() {
  return <MvpPage />;
}
