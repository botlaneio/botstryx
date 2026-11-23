import type {Metadata} from 'next';

import {Portal} from '@/components/portal/portal';

export const metadata: Metadata = {title: 'Client portal · botLane', robots: {index: false, follow: false}};

export default function PortalPage() {
  return <Portal />;
}
