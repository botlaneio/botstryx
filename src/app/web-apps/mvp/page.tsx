import type {Metadata} from 'next';

import {PlaceholderPage} from '@/components/site/placeholder-page';

export const metadata: Metadata = {title: 'MVP development · botLane'};

// The address is set up; the page's content is still to be written.
export default function MVPdevelopmentPage() {
  return <PlaceholderPage title="MVP development" path="/web-apps/mvp" />;
}
