'use client';

import {useActionState, useEffect, useRef, useState} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {TextArea} from '@astryxdesign/core/TextArea';
import {TextInput} from '@astryxdesign/core/TextInput';

import {sendBrief, type ContactState} from '@/app/contact/actions';
import {ArrowRight, ArrowUpRight, Check} from '@/components/icons';
import {HONEYPOT, NEEDS, check, type ContactField, type ContactValues, type FieldErrors} from '@/lib/contact';

// Ways in, for a visitor staring at an empty box. Each one starts the sentence; they finish it.
const STARTERS = ['A website for my ', 'A client portal where ', 'A booking system for ', 'An internal tool that '];
const ORDER: ContactField[] = ['brief', 'need', 'name', 'email', 'company'];

/** The brief: three questions on one sheet, checked here and again on the server. */
export function BriefForm({initial}: {initial: Partial<ContactValues>}) {
  const [values, setValues] = useState<ContactValues>({brief: '', need: '', name: '', email: '', company: '', ...initial});
  const [errors, setErrors] = useState<FieldErrors>({});
  const form = useRef<HTMLFormElement>(null);
  const started = useRef<HTMLInputElement>(null);

  const [state, action, pending] = useActionState(async (prev: ContactState, data: FormData) => {
    const next = await sendBrief(prev, data);
    if (next.errors) setErrors(next.errors);
    return next;
  }, {status: 'idle'});

  // When the visitor started, so the server can tell a person from a script.
  useEffect(() => {
    if (started.current) started.current.value = String(Date.now());
  }, []);

  const set = (f: ContactField) => (v: string) => {
    setValues((s) => ({...s, [f]: v}));
    if (errors[f]) setErrors((e) => ({...e, [f]: undefined}));
  };
  const statusOf = (f: ContactField) => (errors[f] ? {type: 'error' as const, message: errors[f]!} : undefined);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const found = check(values);
    setErrors(found);
    const first = ORDER.find((f) => found[f]);
    if (!first) return;
    e.preventDefault();
    form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  if (state.status === 'sent') {
    return (
      <div className="ct-sent" role="status">
        <span className="ct-tick" aria-hidden><Check size={18} /></span>
        <h2>{state.name ? `Thanks, ${state.name}. We’ve got your brief.` : 'Thanks. We’ve got your brief.'}</h2>
        <p>We read every brief ourselves, and we’ll reply with honest advice on whether we’re the right fit.</p>
        <Button label="See our solutions" variant="secondary" size="lg" href="/solutions">
          <span className="inline-flex items-center gap-2.5">See our solutions <ArrowRight /></span>
        </Button>
      </div>
    );
  }

  const answered = [values.brief.trim().length >= 20, values.need !== '', values.name.trim() !== '' && /^\S+@\S+\.\S+$/.test(values.email.trim())].filter(Boolean).length;

  return (
    <form ref={form} action={action} onSubmit={onSubmit} noValidate className="ct-form">
      <fieldset className="ct-q">
        <legend><span className="mono">01</span>What are you building?</legend>
        {/* On a wide sheet the ways in sit inside the empty box, under the placeholder, and go once typing starts. */}
        <div className="ct-brief">
          <TextArea label="What are you building?" isLabelHidden htmlName="brief" rows={4} size="lg" width="100%"
            placeholder="What it is, who it’s for, and what a good result looks like."
            value={values.brief} onChange={set('brief')} status={statusOf('brief')} />
          {!values.brief && (
            <div className="ct-starters" aria-label="Ways to start">
              {STARTERS.map((s) => (
                <button key={s} type="button" onClick={() => { set('brief')(s); requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('[name="brief"]')?.focus()); }}>
                  {s.trim()}…
                </button>
              ))}
            </div>
          )}
        </div>
      </fieldset>

      <fieldset className="ct-q" aria-describedby={errors.need ? 'need-error' : undefined}>
        <legend><span className="mono">02</span>What do you need from us?</legend>
        <div className="ct-needs">
          {NEEDS.map((n) => (
            <label key={n.id} className="ct-need">
              <input type="radio" name="need" value={n.id} checked={values.need === n.id} onChange={() => set('need')(n.id)} />
              <span className="ct-radio" aria-hidden><Check size={12} /></span>
              <span className="ct-need-text"><b>{n.label}</b><span>{n.line}</span></span>
              {n.price && <span className="mono">{n.price}</span>}
            </label>
          ))}
        </div>
        {errors.need && <p id="need-error" className="ct-error">{errors.need}</p>}
      </fieldset>

      <fieldset className="ct-q">
        <legend><span className="mono">03</span>Who should we reply to?</legend>
        <div className="ct-who">
          <TextInput label="Your name" htmlName="name" autoComplete="name" size="lg" width="100%" placeholder="Jane Miller"
            value={values.name} onChange={set('name')} status={statusOf('name')} />
          <TextInput label="Email" type="email" htmlName="email" autoComplete="email" hasSpellCheck={false} size="lg" width="100%" placeholder="jane@company.com"
            value={values.email} onChange={set('email')} status={statusOf('email')} />
          <TextInput label="Company" isOptional htmlName="company" autoComplete="organization" size="lg" width="100%" placeholder="Northstar"
            value={values.company} onChange={set('company')} status={statusOf('company')} />
        </div>
      </fieldset>

      <input ref={started} type="hidden" name="started_at" defaultValue="" />
      <div aria-hidden className="ct-trap">
        <label>Leave this empty <input name={HONEYPOT} tabIndex={-1} autoComplete="off" defaultValue="" /></label>
      </div>

      <div className="ct-send">
        {state.status === 'error' && !state.errors && <p role="alert" className="ct-error">{state.message}</p>}
        <Button label="Send brief" type="submit" variant="primary" size="lg" isLoading={pending}>
          <span className="inline-flex items-center gap-2.5">{pending ? 'Sending…' : 'Send brief'} <ArrowUpRight /></span>
        </Button>
        <p className="mono" aria-live="polite">{answered} of 3 answered</p>
      </div>
    </form>
  );
}
