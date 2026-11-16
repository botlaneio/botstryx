import type {Metadata} from 'next';

import {SlotLanePage} from '@/components/offers/slotlane-page';

export const metadata: Metadata = {
  title: 'slotLane · botLane',
  description: 'Booking pages on your own domain. Team scheduling, routing forms, polls, paid bookings, Google Calendar, Meet and Zoom, and email, SMS and WhatsApp reminders. 30 days free, then $10 a person a month.',
};

export default function SlotLaneRoute() {
  return <SlotLanePage />;
}
