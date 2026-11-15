import type {Metadata} from 'next';

import {AssistantPage} from '@/components/offers/assistant-page';

export const metadata: Metadata = {
  title: 'AI Assistant · botLane',
  description: 'An assistant on your website that answers visitors’ questions about your business, day and night. Trained on your services, prices, policies and FAQs, and hands enquiries to you when a person is needed. $2,500 one-time.',
};

export default function AIAssistantRoute() {
  return <AssistantPage />;
}
