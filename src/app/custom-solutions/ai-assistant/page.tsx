import type {Metadata} from 'next';
import {headers} from 'next/headers';
import {regionForHostname} from '@/lib/regional-pricing';

import {AssistantPage} from '@/components/offers/assistant-page';

const usMetadata: Metadata = {
  title: 'AI Assistant · botLane',
  description: 'An assistant on your website that answers visitors’ questions about your business, day and night. Trained on your services, prices, policies and FAQs, and hands enquiries to you when a person is needed. $2,500 one-time.',
};

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get('host')?.split(':')[0] ?? 'botlane.io';
  return regionForHostname(host) === 'in' ? {...usMetadata, description: 'Website AI assistant development in India from ₹49,900.'} : usMetadata;
}

export default function AIAssistantRoute() {
  return <AssistantPage />;
}
