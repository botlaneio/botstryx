import type {Metadata} from 'next';

import {Portal} from '@/components/portal/portal';

export const metadata: Metadata = {title: 'Client portal · botLane'};

export default function PortalPage() {
  return <Portal />;
}
