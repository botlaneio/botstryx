import type {Metadata} from 'next';

import {FullProductPage} from '@/components/offers/full-product-page';

export const metadata: Metadata = {
  title: 'Full product build · botLane',
  description: 'For launching a production product: a complete, secure app with accounts and roles, payments if you need them, an admin panel, and testing and launch support. From $18,000, priced after scoping.',
};

export default function FullProductRoute() {
  return <FullProductPage />;
}
