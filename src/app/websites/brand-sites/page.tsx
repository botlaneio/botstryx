import type {Metadata} from 'next';

import {PlaceholderPage} from '@/components/site/placeholder-page';

export const metadata: Metadata = {title: 'Apex · botLane'};

// The address is set up; the page's content is still to be written.
export default function ApexPage() {
  return <PlaceholderPage title="Apex" path="/websites/brand-sites" />;
}
