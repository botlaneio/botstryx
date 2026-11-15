import type {Metadata} from 'next';

import {DocsPage} from '@/components/docs/docs-page';

export const metadata: Metadata = {
  title: 'Documentation · botLane',
  description: 'How slotLane works: share a link, guests pick a time, and the booking lands in Google Calendar. Not launched yet.',
};

export default function DocumentationPage() {
  return <DocsPage />;
}
