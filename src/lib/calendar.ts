import 'server-only';

// Intro calls booked by agentLane, in the studio's Google Calendar. A Google Workspace service account with
// domain-wide delegation acts as the calendar's owner, so events carry a Meet link and Google emails the invite.
//
// Two secrets on the Worker (`npx wrangler secret put <NAME>`), or .env.local on a computer:
//   GOOGLE_SERVICE_ACCOUNT  the service account's JSON key, pasted whole
//   GOOGLE_CALENDAR_ID      the calendar to book into, which is also the user it acts as (the studio's address)
// Without them, finding times and booking both answer that booking isn't switched on.

export const CALL = {
  minutes: 20,
  every: 30, // a slot starts every 30 minutes, so calls keep 10 minutes free after them
  days: [1, 2, 3, 4, 5], // Monday to Friday
  from: 10 * 60, // 10:00 India time, in minutes from midnight
  until: 18 * 60, // the last call ends by 18:00
  offset: 330, // India Standard Time is UTC+5:30 all year
  noticeHours: 12,
  aheadDays: 14,
};

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

/** Every slot start in the window that falls in working hours, before checking the calendar. */
function candidates(from: Date, to: Date): Date[] {
  const out: Date[] = [];
  const earliest = Date.now() + CALL.noticeHours * 3600_000;
  // Walk the days in India time: shift by the offset, read the date, shift back.
  const startDay = new Date(from.getTime() + CALL.offset * 60_000);
  startDay.setUTCHours(0, 0, 0, 0);
  for (let day = startDay.getTime(); day < to.getTime() + CALL.offset * 60_000; day += 86_400_000) {
    if (!CALL.days.includes(new Date(day).getUTCDay())) continue;
    for (let m = CALL.from; m + CALL.minutes <= CALL.until; m += CALL.every) {
      const start = new Date(day + (m - CALL.offset) * 60_000);
      if (start.getTime() >= Math.max(earliest, from.getTime()) && start < to) out.push(start);
    }
  }
  return out;
}

/** Open slot starts between two moments, with the calendar's busy times taken out. */
export async function openSlots(env: CalendarEnv, from: Date, to: Date): Promise<Date[]> {
  const all = candidates(from, to);
  if (!all.length) return [];
  const id = env.GOOGLE_CALENDAR_ID!;
  const fb = await google<{calendars: Record<string, {busy: {start: string; end: string}[]}>}>(env, '/freeBusy', {
    method: 'POST',
    body: JSON.stringify({timeMin: from.toISOString(), timeMax: to.toISOString(), items: [{id}]}),
  });
  const busy = (fb.calendars[id]?.busy ?? []).map((b) => [Date.parse(b.start), Date.parse(b.end)]);
  const len = CALL.minutes * 60_000;
  return all.filter((s) => !busy.some(([b0, b1]) => s.getTime() < b1 && s.getTime() + len > b0));
}

/** The next open slots: one day's, or the first few days that have any. */
export async function findSlots(env: CalendarEnv, day?: string): Promise<Date[]> {
  if (day && /^\d{4}-\d{2}-\d{2}$/.test(day)) {
    const from = new Date(`${day}T00:00:00+05:30`);
    const to = new Date(from.getTime() + 86_400_000);
    const ahead = Date.now() + CALL.aheadDays * 86_400_000;
    return from.getTime() > ahead ? [] : openSlots(env, from, to);
  }
  const now = new Date();
  const slots = await openSlots(env, now, new Date(now.getTime() + CALL.aheadDays * 86_400_000));
  // A few from each of the first three days that have room, so the choice isn't all one morning.
  const byDay = new Map<string, Date[]>();
  for (const s of slots) {
    const key = new Date(s.getTime() + CALL.offset * 60_000).toISOString().slice(0, 10);
    if (!byDay.has(key) && byDay.size >= 3) break;
    const list = byDay.get(key) ?? [];
    if (list.length < 3) list.push(s);
    byDay.set(key, list);
  }
  return [...byDay.values()].flat();
}

/** Books one slot if it's still open: an event with a Meet link, with the visitor invited by Google. */
export async function bookCall(env: CalendarEnv, start: Date, guest: {name: string; email: string; note?: string}) {
  const end = new Date(start.getTime() + CALL.minutes * 60_000);
  const open = await openSlots(env, new Date(start.getTime() - 60_000), new Date(end.getTime() + 60_000));
  if (!open.some((s) => s.getTime() === start.getTime())) return {ok: false as const, reason: 'taken'};
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
