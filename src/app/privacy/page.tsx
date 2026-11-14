import type {Metadata} from 'next';

import {PlaceholderPage} from '@/components/site/placeholder-page';

export const metadata: Metadata = {title: 'Privacy · botLane'};

// The address is set up; the page's content is still to be written.
export default function PrivacyPage() {
  return <PlaceholderPage title="Privacy" path="/privacy" />;
}
