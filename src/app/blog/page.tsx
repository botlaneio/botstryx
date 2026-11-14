import type {Metadata} from 'next';

import {PlaceholderPage} from '@/components/site/placeholder-page';

export const metadata: Metadata = {title: 'Insights · botLane'};

// The address is set up; the page's content is still to be written.
export default function InsightsPage() {
  return <PlaceholderPage title="Insights" path="/blog" />;
}
