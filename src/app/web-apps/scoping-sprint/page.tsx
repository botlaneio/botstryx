import type {Metadata} from 'next';

import {ScopingSprintPage} from '@/components/offers/scoping-sprint-page';

export const metadata: Metadata = {
  title: 'Scoping sprint · botLane',
  description: 'For anyone with an app idea who needs a clear plan and a fixed quote. Requirements and user flows, clickable wireframes, a technical plan and a fixed quote in 1–2 weeks, for $1,500, credited towards your build.',
};

export default function ScopingSprintRoute() {
  return <ScopingSprintPage />;
}
