import type {Metadata} from 'next';

import {PlaceholderPage} from '@/components/site/placeholder-page';

export const metadata: Metadata = {title: 'Products · botLane'};

// The address is set up; the page's content is still to be written.
export default function ProductsPage() {
  return <PlaceholderPage title="Products" path="/products" />;
}
