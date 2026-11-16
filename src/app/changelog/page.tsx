import type {Metadata} from 'next';

import {ChangelogPage} from '@/components/site/changelog-page';

export const metadata: Metadata = {
  title: 'Changelog · botLane',
  description: 'Every change to botlane.io worth knowing about, newest first.',
};

export default function ChangelogRoute() {
  return <ChangelogPage />;
}
