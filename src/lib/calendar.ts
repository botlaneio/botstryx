import 'server-only';

// Intro calls booked by agentLane, in the studio's Google Calendar. A Google Workspace service account with
// domain-wide delegation acts as the calendar's owner, so events carry a Meet link and Google emails the invite.
//
// Two secrets on the Worker (`npx wrangler secret put <NAME>`), or .env.local on a computer:
//   GOOGLE_SERVICE_ACCOUNT  the service account's JSON key, pasted whole
//   GOOGLE_CALENDAR_ID      the calendar to book into, which is also the user it acts as (the studio's address)
// Without them, finding times and booking both answer that booking isn't switched on.

// When intro calls can be booked: two weekday windows, each fixed to its own time zone (daylight saving followed).
//   US Central 8:00-12:00  the whole US gets a morning, the UK and Europe an afternoon (19:30-23:30 India in winter)
//   India 11:00-13:00      the Gulf, India, Singapore and Australia get a daytime slot
export const CALL = {
  minutes: 20,
  every: 30, // a slot starts every 30 minutes, so calls keep 10 minutes free after them
  days: [1, 2, 3, 4, 5], // Monday to Friday, in each window's own zone
  windows: [
    {zone: 'America/Chicago', from: 8 * 60, until: 12 * 60},
    {zone: 'Asia/Kolkata', from: 11 * 60, until: 13 * 60},
  ],
  noticeHours: 12,
  aheadDays: 14,
};

/** Minutes a zone is ahead of UTC at a moment (negative west of Greenwich), daylight saving included. */
function zoneOffset(at: number, zone: string): number {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {timeZone: zone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'})
      .formatToParts(at).map((p) => [p.type, Number(p.value)]),
  );
  return (Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute) - Math.floor(at / 60_000) * 60_000) / 60_000;
}

/** The moment a wall-clock time happens in a zone: a date (as a UTC midnight) plus minutes into that day. */
function zoned(dayUtcMidnight: number, minutes: number, zone: string): Date {
  const guess = dayUtcMidnight + minutes * 60_000;
  const first = guess - zoneOffset(guess, zone) * 60_000;
  return new Date(guess - zoneOffset(first, zone) * 60_000);
}

/** A zone's calendar date at a moment, as a UTC midnight. */
function zoneDay(at: number, zone: string): number {
  const d = new Date(at + zoneOffset(at, zone) * 60_000);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

type Slot = {start: Date; day: number; window: number};

export interface CalendarEnv {
  GOOGLE_SERVICE_ACCOUNT?: string;
  GOOGLE_CALENDAR_ID?: string;
}

export class NotConfigured extends Error {}

const SCOPE = 'https://www.googleapis.com/auth/calendar';
let cached: {token: string; until: number} | null = null;

const b64url = (data: ArrayBuffer | string) => {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : new Uint8Array(data);
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

/** An access token for the calendar's owner, signed by the service account (cached until shortly before expiry). */
async function accessToken(env: CalendarEnv): Promise<string> {
  if (cached && cached.until > Date.now()) return cached.token;
  if (!env.GOOGLE_SERVICE_ACCOUNT || !env.GOOGLE_CALENDAR_ID) throw new NotConfigured('Booking is not switched on.');
  const key = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT) as {client_email: string; private_key: string; token_uri?: string};
  const aud = key.token_uri || 'https://oauth2.googleapis.com/token';
  const now = Math.floor(Date.now() / 1000);
  const head = b64url(JSON.stringify({alg: 'RS256', typ: 'JWT'}));
  const body = b64url(JSON.stringify({iss: key.client_email, sub: env.GOOGLE_CALENDAR_ID, scope: SCOPE, aud, iat: now, exp: now + 3600}));
  const pem = key.private_key.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  const signer = await crypto.subtle.importKey('pkcs8', der, {name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256'}, false, ['sign']);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', signer, new TextEncoder().encode(`${head}.${body}`));
  const res = await fetch(aud, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${head}.${body}.${b64url(sig)}`}),
  });
  if (!res.ok) throw new Error(`Google sign-in failed: ${res.status} ${await res.text()}`);
  const {access_token, expires_in} = (await res.json()) as {access_token: string; expires_in: number};
  cached = {token: access_token, until: Date.now() + (expires_in - 120) * 1000};
  return access_token;
}

async function google<T>(env: CalendarEnv, path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`https://www.googleapis.com/calendar/v3${path}`, {
    ...init,
    headers: {Authorization: `Bearer ${await accessToken(env)}`, 'Content-Type': 'application/json', ...init.headers},
  });
  if (!res.ok) throw new Error(`Google Calendar ${res.status}: ${await res.text()}`);
  return (await res.json()) as T;
}

/** Every slot in the windows between two moments, before checking the calendar, earliest first. */
function candidates(from: Date, to: Date): Slot[] {
  const out: Slot[] = [];
  const earliest = Math.max(Date.now() + CALL.noticeHours * 3600_000, from.getTime());
  for (const [i, w] of CALL.windows.entries()) {
    for (let day = zoneDay(from.getTime(), w.zone); day <= zoneDay(to.getTime(), w.zone); day += 86_400_000) {
      if (!CALL.days.includes(new Date(day).getUTCDay())) continue;
      for (let m = w.from; m + CALL.minutes <= w.until; m += CALL.every) {
        const start = zoned(day, m, w.zone);
        if (start.getTime() >= earliest && start < to) out.push({start, day, window: i});
      }
    }
  }
  return out.sort((a, b) => a.start.getTime() - b.start.getTime());
}

/** Open slot starts between two moments, with the calendar's busy times taken out. */
export async function openSlots(env: CalendarEnv, from: Date, to: Date): Promise<Slot[]> {
  const all = candidates(from, to);
  if (!all.length) return [];
  const id = env.GOOGLE_CALENDAR_ID!;
  const fb = await google<{calendars: Record<string, {busy: {start: string; end: string}[]}>}>(env, '/freeBusy', {
    method: 'POST',
    body: JSON.stringify({timeMin: from.toISOString(), timeMax: to.toISOString(), items: [{id}]}),
  });
  const busy = (fb.calendars[id]?.busy ?? []).map((b) => [Date.parse(b.start), Date.parse(b.end)]);
  const len = CALL.minutes * 60_000;
  return all.filter(({start}) => !busy.some(([b0, b1]) => start.getTime() < b1 && start.getTime() + len > b0));
}

/** The next open slots: one day's (that date in each window's own zone), or the first few days that have any. */
export async function findSlots(env: CalendarEnv, day?: string): Promise<Date[]> {
  if (day && /^\d{4}-\d{2}-\d{2}$/.test(day)) {
    const midnight = Date.parse(`${day}T00:00:00Z`);
    if (midnight > Date.now() + CALL.aheadDays * 86_400_000) return [];
    // Wide enough to hold that date in any zone; each slot then keeps only its own zone's date.
    const slots = await openSlots(env, new Date(midnight - 14 * 3600_000), new Date(midnight + 38 * 3600_000));
    return slots.filter((s) => s.day === midnight).map((s) => s.start);
  }
  const now = new Date();
  const slots = await openSlots(env, now, new Date(now.getTime() + CALL.aheadDays * 86_400_000));
  // A few from each window on each of the first three days that have room, so visitors anywhere get times that
  // suit them (the browser puts the ones in the visitor's waking hours first).
  const byDay = new Map<number, Date[]>();
  const perWindow = new Map<string, number>();
  for (const s of slots) {
    const key = Math.floor(s.start.getTime() / 86_400_000);
    if (!byDay.has(key) && byDay.size >= 3) break;
    const taken = perWindow.get(`${key}:${s.window}`) ?? 0;
    if (taken >= 4) continue;
    perWindow.set(`${key}:${s.window}`, taken + 1);
    byDay.set(key, [...(byDay.get(key) ?? []), s.start]);
  }
  return [...byDay.values()].flat();
}

/** Books one slot if it's still open: an event with a Meet link, with the visitor invited by Google. */
export async function bookCall(env: CalendarEnv, start: Date, guest: {name: string; email: string; note?: string}) {
  const end = new Date(start.getTime() + CALL.minutes * 60_000);
  const open = await openSlots(env, new Date(start.getTime() - 60_000), new Date(end.getTime() + 60_000));
  if (!open.some((s) => s.start.getTime() === start.getTime())) return {ok: false as const, reason: 'taken'};
  const event = await google<{htmlLink: string; hangoutLink?: string}>(env, `/calendars/${encodeURIComponent(env.GOOGLE_CALENDAR_ID!)}/events?conferenceDataVersion=1&sendUpdates=all`, {
    method: 'POST',
    body: JSON.stringify({
      summary: `Intro call: ${guest.name} and botLane`,
      description: [`Booked by agentLane on the website.`, guest.note ? `\nWhat they want to talk about:\n${guest.note}` : ''].join(''),
      start: {dateTime: start.toISOString()},
      end: {dateTime: end.toISOString()},
      attendees: [{email: guest.email, displayName: guest.name}],
      conferenceData: {createRequest: {requestId: crypto.randomUUID(), conferenceSolutionKey: {type: 'hangoutsMeet'}}},
      reminders: {useDefault: true},
    }),
  });
  return {ok: true as const, meet: event.hangoutLink ?? null};
}
