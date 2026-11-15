'use server';

import {headers} from 'next/headers';
import {getCloudflareContext} from '@opennextjs/cloudflare';

import {notifyBrief, saveBrief, type BriefEnv} from '@/lib/briefs';
import {HONEYPOT, MIN_FILL_MS, check, type ContactValues, type FieldErrors} from '@/lib/contact';

export interface ContactState {
  status: 'idle' | 'sent' | 'error';
  message?: string;
  errors?: FieldErrors;
  name?: string;
}

const FAILED = 'We couldn’t send that just now. Your answers are still here: please try again in a minute.';

/**
 * Takes a brief from the contact form, checks it again on the server, saves it to the D1 database and emails the
 * team (src/lib/briefs.ts). Without a database (a plain `next start`, say) a brief is accepted only outside
 * production, so the form can still be tried; in production the visitor is told it could not be sent.
 */
export async function sendBrief(_prev: ContactState, form: FormData): Promise<ContactState> {
  const get = (k: string) => { const v = form.get(k); return typeof v === 'string' ? v : ''; };

  // Bots get the same answer as people, so they learn nothing from it.
  const started = Number(get('started_at'));
  if (get(HONEYPOT) || !Number.isFinite(started) || Date.now() - started < MIN_FILL_MS) return {status: 'sent'};

  const values: ContactValues = {brief: get('brief'), need: get('need'), name: get('name'), email: get('email'), company: get('company')};
  const errors = check(values);
  if (Object.keys(errors).length) return {status: 'error', message: 'A few answers need another look.', errors};

  const {env, ctx} = getCloudflareContext();

  // A handful a minute per visitor; Cloudflare counts it (BRIEF_LIMITER in wrangler.jsonc).
  const h = await headers();
  const who = h.get('cf-connecting-ip') || h.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
  const limit = await env.BRIEF_LIMITER?.limit({key: who}).catch(() => ({success: true}));
  if (limit && !limit.success) return {status: 'error', message: 'That’s a few briefs in a row. Give it a minute and try again.'};

  if (!env.DB) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Contact form: no database is bound, so the brief was not saved.');
      return {status: 'error', message: FAILED};
    }
    return {status: 'sent', name: values.name.trim()};
  }

  let id: number;
  try {
    id = await saveBrief(env.DB, values);
  } catch (error) {
    console.error('[briefs] save', error);
    return {status: 'error', message: FAILED};
  }

  // The email goes out after the visitor has their answer; the brief is already safe in the database.
  const notifyEnv: BriefEnv = {
    RESEND_API_KEY: (env as BriefEnv).RESEND_API_KEY ?? process.env.RESEND_API_KEY,
    BRIEF_NOTIFY_TO: (env as BriefEnv).BRIEF_NOTIFY_TO ?? process.env.BRIEF_NOTIFY_TO,
    BRIEF_NOTIFY_FROM: (env as BriefEnv).BRIEF_NOTIFY_FROM ?? process.env.BRIEF_NOTIFY_FROM,
  };
  ctx.waitUntil(notifyBrief(notifyEnv, values, id));

  return {status: 'sent', name: values.name.trim()};
}
