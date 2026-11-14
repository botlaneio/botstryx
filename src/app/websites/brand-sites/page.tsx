import type {Metadata} from 'next';

import {ApexPage} from '@/components/offers/apex-page';

export const metadata: Metadata = {
  title: 'Apex · botLane',
  description: 'For launches, premium brands and flagship companies, where the site isn’t a brochure for the product but part of it. Signature motion, structured content, and engineering held to a performance budget.',
};

export default function ApexWebsitePage() {
  return <ApexPage />;
}
