import {getCloudflareContext} from '@opennextjs/cloudflare';

import {NotConfigured, bookCall} from '@/lib/calendar';
import {calendarEnv, visitor} from '@/lib/calendar-env';

// Books an intro call agentLane has offered and the visitor has confirmed: POST {start, name, email, note?}.
// The slot is checked again against the calendar, so a taken or made-up time is refused.
export async function POST(request: Request) {
  const limit = await getCloudflareContext().env.BOOK_LIMITER?.limit({key: visitor(request)}).catch(() => ({success: true}));
  if (limit && !limit.success) return Response.json({error: 'That’s a few bookings in a row. Try again in a minute.'}, {status: 429});

  const body = (await request.json().catch(() => null)) as {start?: unknown; name?: unknown; email?: unknown; note?: unknown} | null;
  const start = typeof body?.start === 'string' ? new Date(body.start) : null;
  const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 80) : '';
  const email = typeof body?.email === 'string' ? body.email.trim().slice(0, 200) : '';
  const note = typeof body?.note === 'string' ? body.note.trim().slice(0, 1000) : undefined;
  if (!start || Number.isNaN(start.getTime()) || !name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({error: 'A time, a name and a valid email are needed to book.'}, {status: 400});
  }

  try {
    const result = await bookCall(calendarEnv(), start, {name, email, note});
    if (!result.ok) return Response.json({error: 'That time has just been taken. Pick another.'}, {status: 409});
    return Response.json({booked: start.toISOString(), meet: result.meet});
  } catch (error) {
    if (error instanceof NotConfigured) return Response.json({error: 'Booking calls isn’t switched on yet.'}, {status: 503});
    console.error('[book]', error);
    return Response.json({error: 'Couldn’t book that just now.'}, {status: 502});
  }
}
