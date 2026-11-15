import type {Metadata} from 'next';

import {CarePage} from '@/components/offers/care-page';

export const metadata: Metadata = {
  title: 'Care · botLane',
  description: 'Hosting, security updates, uptime monitoring, backups and monthly edits for a live website. Care from $99 a month, Care Plus $199.',
};

export default function CareRoute() {
  return <CarePage />;
}
