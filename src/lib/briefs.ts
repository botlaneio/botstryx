import 'server-only';

import {NEEDS, type ContactValues} from '@/lib/contact';

// Where a brief goes once the contact form accepts it: a row in the D1 database (binding DB, table `briefs`,
// schema in migrations/), then an email to the team through Resend.
//
// The email needs two secrets on the Worker (`npx wrangler secret put <NAME>`), or .env.local on a computer:
//   RESEND_API_KEY   a Resend key that can send from botlane.io
//   BRIEF_NOTIFY_TO  the address (or comma-separated addresses) that should receive new briefs
// BRIEF_NOTIFY_FROM, the sender, is a plain variable in wrangler.jsonc. Without the secrets the brief is still
// saved; only the email is skipped.

export interface BriefEnv {
  DB?: D1Database;
  RESEND_API_KEY?: string;
  BRIEF_NOTIFY_TO?: string;
  BRIEF_NOTIFY_FROM?: string;
}

const clean = (v: ContactValues) => ({
  need: v.need,
  brief: v.brief.trim(),
  name: v.name.trim(),
  email: v.email.trim(),
  company: v.company.trim() || null,
});

/** Saves a checked brief and returns its row id. */
export async function saveBrief(db: D1Database, values: ContactValues): Promise<number> {
  const b = clean(values);
  const row = await db
    .prepare('INSERT INTO briefs (need, brief, name, email, company) VALUES (?, ?, ?, ?, ?) RETURNING id')
    .bind(b.need, b.brief, b.name, b.email, b.company)
    .first<{id: number}>();
  if (!row) throw new Error('The brief was not saved.');
  return row.id;
}

/** Emails the team about a new brief. Replying to the email replies to the visitor. Never throws. */
export async function notifyBrief(env: BriefEnv, values: ContactValues, id: number): Promise<void> {
  const key = env.RESEND_API_KEY;
  const to = env.BRIEF_NOTIFY_TO?.split(',').map((s) => s.trim()).filter(Boolean);
  if (!key || !to?.length) return;

  const b = clean(values);
  const need = NEEDS.find((n) => n.id === b.need)?.label ?? b.need;
  const who = b.company ? `${b.name}, ${b.company}` : b.name;
  const text = [
    `New brief #${id} from ${who}`,
    '',
    `Needs: ${need}`,
    `Email: ${b.email}`,
    b.company ? `Company: ${b.company}` : null,
    '',
    b.brief,
    '',
    '— Reply to this email to answer them directly.',
  ].filter((l) => l !== null).join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {Authorization: `Bearer ${key}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({
        from: env.BRIEF_NOTIFY_FROM || 'Botlane <briefs@botlane.io>',
        to,
        reply_to: b.email,
        // Keep the subject on one line whatever was typed.
        subject: `New brief: ${need} — ${who}`.replace(/\s+/g, ' ').slice(0, 150),
        text,
      }),
    });
    if (!res.ok) console.error('[briefs] Resend', res.status, await res.text().catch(() => ''));
  } catch (error) {
    console.error('[briefs] Resend', error);
  }
}
