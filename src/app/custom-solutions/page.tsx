import type {Metadata} from 'next';

import {PlaceholderPage} from '@/components/site/placeholder-page';

export const metadata: Metadata = {title: 'Custom Solutions · botLane'};

// The address is set up; the page's content is still to be written.
export default function CustomSolutionsPage() {
  return <PlaceholderPage title="Custom Solutions" path="/custom-solutions" />;
}
