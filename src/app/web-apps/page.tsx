import type {Metadata} from 'next';

import {PlaceholderPage} from '@/components/site/placeholder-page';

export const metadata: Metadata = {title: 'Web Apps · botLane'};

// The address is set up; the page's content is still to be written.
export default function WebAppsPage() {
  return <PlaceholderPage title="Web Apps" path="/web-apps" />;
}
