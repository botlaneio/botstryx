'use server';

import {HONEYPOT, MIN_FILL_MS, check, type ContactValues, type FieldErrors} from '@/lib/contact';

export interface ContactState {
  status: 'idle' | 'sent' | 'error';
  message?: string;
  errors?: FieldErrors;
  name?: string;
}

const FAILED = 'We couldn’t send that just now. Your answers are still here: please try again in a minute.';

/**
 * Takes a brief from the contact form and checks it again on the server.
 *
 * Nothing delivers a brief yet: this site has no inbox or store connected (botpro stores each brief and emails
 * it). Until one is, a brief is accepted only outside production, so the form can be tried end to end; in
 * production the visitor is told it could not be sent, which is the truth.
 */
export async function sendBrief(_prev: ContactState, form: FormData): Promise<ContactState> {
  const get = (k: string) => { const v = form.get(k); return typeof v === 'string' ? v : ''; };

  // Bots get the same answer as people, so they learn nothing from it.
  const started = Number(get('started_at'));
  if (get(HONEYPOT) || !Number.isFinite(started) || Date.now() - started < MIN_FILL_MS) return {status: 'sent'};

  const values: ContactValues = {brief: get('brief'), need: get('need'), name: get('name'), email: get('email'), company: get('company')};
  const errors = check(values);
  if (Object.keys(errors).length) return {status: 'error', message: 'A few answers need another look.', errors};

  if (process.env.NODE_ENV === 'production') {
    console.error('Contact form: no delivery is configured, so the brief was not sent.');
    return {status: 'error', message: FAILED};
  }
  return {status: 'sent', name: values.name.trim()};
}
