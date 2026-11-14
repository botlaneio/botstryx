import type {Metadata} from 'next';

import {PlaceholderPage} from '@/components/site/placeholder-page';

export const metadata: Metadata = {title: 'Knowledge base · botLane'};

// The address is set up; the page's content is still to be written.
export default function KnowledgebasePage() {
  return <PlaceholderPage title="Knowledge base" path="/help" />;
}
