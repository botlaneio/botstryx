import {Suspense} from 'react';
import type {Metadata} from 'next';

import {Account} from '@/components/account/account';
import {SiteFooter} from '@/components/site/site-footer';

export const metadata: Metadata = {title: 'Account · botLane'};

type Search = Promise<{[key: string]: string | string[] | undefined}>;

/** Reads which tab the address asks for: /account opens on sign-up, /account?mode=signin on sign-in. */
async function AccountForAddress({searchParams}: {searchParams: Search}) {
  const {mode} = await searchParams;
  return <Account initialMode={mode === 'signin' ? 'signin' : 'signup'} />;
}

export default function AccountPage({searchParams}: {searchParams: Search}) {
  return (
    <>
      <Suspense fallback={null}>
        <AccountForAddress searchParams={searchParams} />
      </Suspense>
      <SiteFooter />
    </>
  );
}
