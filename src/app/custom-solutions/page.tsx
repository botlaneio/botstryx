import type {Metadata} from 'next';

import {CustomSolutionsPage} from '@/components/offers/custom-solutions-page';

export const metadata: Metadata = {
  title: 'Custom Solutions · botLane',
  description: 'AI and automation, built around how you work: an AI Assistant for your website at $2,500 one-time, or something of your own, scoped and quoted after a short call.',
};

export default function CustomSolutionsRoute() {
  return <CustomSolutionsPage />;
}
