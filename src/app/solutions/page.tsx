import type {Metadata} from 'next';

import {PlaceholderPage} from '@/components/site/placeholder-page';

export const metadata: Metadata = {title: 'Solutions · botLane'};

// The address is set up; the page's content is still to be written.
export default function SolutionsPage() {
  return <PlaceholderPage title="Solutions" path="/solutions" />;
}
