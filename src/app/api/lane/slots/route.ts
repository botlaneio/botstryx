import {getCloudflareContext} from '@opennextjs/cloudflare';

import {CALL, NotConfigured, findSlots} from '@/lib/calendar';
import {calendarEnv, visitor} from '@/lib/calendar-env';

// Open intro-call times for agentLane to offer: GET /api/lane/slots, or ?day=YYYY-MM-DD.
// Times come back in UTC; the browser says them in the visitor's own time zone.
export async function GET(request: Request) {
  const limit = await getCloudflareContext().env.LANE_LIMITER?.limit({key: visitor(request)}).catch(() => ({success: true}));
  if (limit && !limit.success) return Response.json({error: 'Too many requests. Try again in a minute.'}, {status: 429});

  const day = new URL(request.url).searchParams.get('day') ?? undefined;
  try {
    const slots = await findSlots(calendarEnv(), day);
    return Response.json({minutes: CALL.minutes, slots: slots.map((s) => s.toISOString())}, {headers: {'Cache-Control': 'no-store'}});
  } catch (error) {
    if (error instanceof NotConfigured) return Response.json({error: 'Booking calls isn’t switched on yet.'}, {status: 503});
    console.error('[slots]', error);
    return Response.json({error: 'Couldn’t read the calendar just now.'}, {status: 502});
  }
}
