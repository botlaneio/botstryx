'use client';

import {useState} from 'react';
import Link from 'next/link';
import {Button} from '@astryxdesign/core/Button';
import {SegmentedControl, SegmentedControlItem} from '@astryxdesign/core/SegmentedControl';
import {TextInput} from '@astryxdesign/core/TextInput';
import {useToast} from '@astryxdesign/core/Toast';

import {Logo} from '@/components/brand/logo';
import {ArrowRight, GitHubMark, GoogleMark, MicrosoftMark} from '@/components/icons';

export type AccountMode = 'signin' | 'signup';

// Wording as botpro's account page gives it (src/components/ui/sign-in.tsx, src/components/auth/account-access.tsx,
// src/lib/account-form.ts). The three provider buttons are new here and, like the form, are not connected.
const COPY = {
  signin: {title: 'Sign in to botLane', submit: 'Sign in', provider: 'Sign in with'},
  signup: {title: 'Get started', submit: 'Create account', provider: 'Sign up with'},
};
const DESCRIPTION = 'Your projects, products, and what comes next.';
const PREVIEW = 'Preview only. Account access is not connected yet; use sample details.';
const NOT_SENT = 'Account access is not connected yet. Your details were not sent or saved.';
const NO_RESET = 'Password reset will be available when account access is connected.';
const PASSWORD_MIN = 8;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PROVIDERS = [
  {name: 'Google', icon: <GoogleMark />},
  {name: 'GitHub', icon: <GitHubMark />},
  {name: 'Microsoft', icon: <MicrosoftMark />},
];

/**
 * Where a sign-in or sign-up would be sent. Nothing is connected yet, so it sends nothing and says so; when
 * account access exists, this is the one place that changes, and the 'done' and 'failed' toasts below start to fire.
 */
type Outcome = 'done' | 'failed' | 'not-connected';
async function sendAccount(): Promise<Outcome> {
  return 'not-connected';
}

// What the toast says for each outcome. Only 'not-connected' can happen today.
const TOASTS: Record<AccountMode, Record<Outcome, {body: string; type: 'info' | 'error'}>> = {
  signup: {
    done: {body: 'Account created.', type: 'info'},
    failed: {body: 'Could not create your account. Try again.', type: 'error'},
    'not-connected': {body: NOT_SENT, type: 'info'},
  },
  signin: {
    done: {body: 'Signed in.', type: 'info'},
    failed: {body: 'Could not sign you in. Try again.', type: 'error'},
    'not-connected': {body: NOT_SENT, type: 'info'},
  },
};

type Fields = {email: string; firstName: string; lastName: string; password: string};
type Errors = Partial<Record<keyof Fields, string>>;

function check(mode: AccountMode, f: Fields): Errors {
  const errors: Errors = {};
  const email = f.email.trim();
  if (!email) errors.email = 'Enter your work email.';
  else if (!EMAIL.test(email)) errors.email = 'Enter a valid work email.';
  if (mode === 'signup') {
    if (!f.firstName.trim()) errors.firstName = 'Enter your first name.';
    if (!f.lastName.trim()) errors.lastName = 'Enter your last name.';
    if (f.password.length < PASSWORD_MIN) errors.password = `Use at least ${PASSWORD_MIN} characters.`;
  } else if (!f.password) {
    errors.password = 'Enter your password.';
  }
  return errors;
}

/**
 * Sign in and sign up on one page, as two tabs over one card. It is a preview: nothing is sent or saved, and
 * the card says so. The chosen tab is kept in the address (/account for sign-up, /account?mode=signin).
 */
export function Account({initialMode = 'signup'}: {initialMode?: AccountMode}) {
  const [mode, setMode] = useState<AccountMode>(initialMode);
  const [fields, setFields] = useState<Fields>({email: '', firstName: '', lastName: '', password: ''});
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const [notice, setNotice] = useState(PREVIEW);
  const toast = useToast();

  // The result of an attempt, as a toast and in the card's own notice. One id, so repeats replace, not stack.
  const report = (message: {body: string; type: 'info' | 'error'}) => {
    setNotice(message.body);
    toast({...message, uniqueID: 'account'});
  };

  const switchMode = (next: string) => {
    const m: AccountMode = next === 'signin' ? 'signin' : 'signup';
    setMode(m);
    setErrors({});
    setAttempted(false);
    setNotice(PREVIEW);
    window.history.replaceState(null, '', m === 'signin' ? '/account?mode=signin' : '/account');
  };

  const set = (key: keyof Fields) => (value: string) => {
    const next = {...fields, [key]: value};
    setFields(next);
    if (attempted) setErrors(check(mode, next));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = check(mode, fields);
    setAttempted(true);
    setErrors(found);
    // Field mistakes are shown on the fields themselves, not as a toast.
    if (Object.keys(found).length > 0) return;
    report(TOASTS[mode][await sendAccount()]);
  };

  const statusOf = (key: keyof Fields) => (errors[key] ? {type: 'error' as const, message: errors[key]} : undefined);

  return (
    <div className="stage">
      <div className="scene">
        <header className="wrap site-header">
          <Link href="/" aria-label="botLane, home" className="rounded-sm outline-offset-4">
            <Logo size={30} />
          </Link>
          <Button label="Back" variant="ghost" href="/" />
        </header>

        <main className="wrap account">
          <div className="account-pitch fade-up">
            <h2>
              Projects, products, and what comes next.{' '}
              <span>Websites and web apps from the studio, plus slotLane, spotLane and dotLane.</span>
            </h2>
          </div>

          <div className="account-card fade-up" style={{'--i': 1} as React.CSSProperties}>
            <SegmentedControl label="Sign in or sign up" layout="fill" size="lg" value={mode} onChange={switchMode}>
              <SegmentedControlItem value="signin" label="Sign in" />
              <SegmentedControlItem value="signup" label="Sign up" />
            </SegmentedControl>

            {/* Both forms are always in the card, stacked in the same place, and only the chosen one shows.
                The card is therefore as tall as the taller form whichever tab is open, so switching tabs
                never changes its size or moves anything around it. */}
            <div className="account-panels">
            {(['signin', 'signup'] as const).map((m) => {
              const copy = COPY[m];
              const active = m === mode;
              return (
            <div key={m} className="account-panel" data-active={active} inert={!active}>
              <h1>{copy.title}</h1>
              <p className="account-lede">{DESCRIPTION}</p>

              <ul className="account-providers">
                {PROVIDERS.map((p) => (
                  <li key={p.name}>
                    <button type="button" className="signin" onClick={async () => report(TOASTS[m][await sendAccount()])}>
                      {p.icon}
                      {copy.provider} {p.name}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="account-rule" role="separator" />

              {/* method="post": if the form is ever sent before the page's script has loaded, the password must not end up in the address. */}
              <form className="account-form" method="post" noValidate onSubmit={submit}>
                <TextInput label="Work email" type="email" htmlName="email" autoComplete="email" hasSpellCheck={false} size="lg" width="100%"
                  placeholder="you@company.com" value={fields.email} onChange={set('email')} status={active ? statusOf('email') : undefined} statusVariant="detached" />
                {m === 'signup' && (
                  <div className="grid grid-cols-2 gap-3">
                    <TextInput label="First name" htmlName="given-name" autoComplete="given-name" size="lg" width="100%"
                      placeholder="Ada" value={fields.firstName} onChange={set('firstName')} status={active ? statusOf('firstName') : undefined} statusVariant="detached" />
                    <TextInput label="Last name" htmlName="family-name" autoComplete="family-name" size="lg" width="100%"
                      placeholder="Lovelace" value={fields.lastName} onChange={set('lastName')} status={active ? statusOf('lastName') : undefined} statusVariant="detached" />
                  </div>
                )}
                <TextInput label="Password" type="password" htmlName="password" size="lg" width="100%"
                  autoComplete={m === 'signup' ? 'new-password' : 'current-password'}
                  placeholder={m === 'signup' ? 'Create a password' : 'Enter your password'}
                  description={m === 'signup' ? `At least ${PASSWORD_MIN} characters.` : undefined}
                  value={fields.password} onChange={set('password')} status={active ? statusOf('password') : undefined} statusVariant="detached" />

                <Button label={copy.submit} type="submit" variant="primary" size="lg">
                  <span className="inline-flex items-center gap-2.5">{copy.submit} <ArrowRight /></span>
                </Button>
                {m === 'signin' && (
                  <button type="button" className="account-link justify-self-center" onClick={() => report({body: NO_RESET, type: 'info'})}>Forgot password?</button>
                )}
                <p className="account-notice" role={active ? 'status' : undefined}>{notice}</p>
              </form>

              <p className="account-switch">
                {m === 'signin' ? 'New to botLane? ' : 'Already have an account? '}
                <button type="button" className="account-link" onClick={() => switchMode(m === 'signin' ? 'signup' : 'signin')}>
                  {m === 'signin' ? 'Create an account' : 'Sign in'}
                </button>
              </p>
            </div>
              );
            })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
