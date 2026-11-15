import 'server-only';
import {getCloudflareContext} from '@opennextjs/cloudflare';

import type {CalendarEnv} from '@/lib/calendar';

/** The calendar's secrets: Worker secrets on Cloudflare, .env.local on a computer. */
export function calendarEnv(): CalendarEnv {
  const env = getCloudflareContext().env as CalendarEnv;
  return {
    GOOGLE_SERVICE_ACCOUNT: env.GOOGLE_SERVICE_ACCOUNT ?? process.env.GOOGLE_SERVICE_ACCOUNT,
    GOOGLE_CALENDAR_ID: env.GOOGLE_CALENDAR_ID ?? process.env.GOOGLE_CALENDAR_ID,
  };
}

/** Who's asking, for rate limits: Cloudflare's visitor address, or the forwarded one elsewhere. */
export const visitor = (request: Request) =>
  request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
