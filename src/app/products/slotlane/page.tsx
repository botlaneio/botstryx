import type {Metadata} from 'next';

import {PlaceholderPage} from '@/components/site/placeholder-page';

export const metadata: Metadata = {title: 'slotLane · botLane'};

// The address is set up; the page's content is still to be written.
export default function SlotLanePage() {
  return <PlaceholderPage title="slotLane" path="/products/slotlane" />;
}
