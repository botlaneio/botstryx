import type {Metadata} from 'next';

import {HelpPage} from '@/components/site/help-page';

export const metadata: Metadata = {
  title: 'Knowledge base · botLane',
  description: 'Straight answers about starting a project, prices, how a project runs, Care, the AI Assistant, slotLane and your information.',
};

export default function KnowledgebaseRoute() {
  return <HelpPage />;
}
