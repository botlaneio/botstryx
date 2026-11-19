'use client';

import {createContext, useCallback, useContext, useMemo, useState} from 'react';
import Link from 'next/link';
import {Theme} from '@astryxdesign/core/theme';
import {LinkProvider} from '@astryxdesign/core/Link';
import {ToastViewport} from '@astryxdesign/core/Toast';

import {themes, defaultThemeSlug} from '../astryx-themes';

type Mode = 'system' | 'light' | 'dark';

const ModeContext = createContext<{mode: Mode; toggle: () => void}>({mode: 'dark', toggle: () => {}});

export const useColorMode = () => useContext(ModeContext);

export function Providers({children}: {children: React.ReactNode}) {
  const [mode, setMode] = useState<Mode>('dark');

  // The page opens in the dark theme whatever the device is set to; the toggle flips whatever is showing.
  const toggle = useCallback(() => {
    setMode((current) => {
      const showing = current === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : current;
      const next = showing === 'dark' ? 'light' : 'dark';
      // The page behind the theme root follows too (html background, scrollbars).
      document.documentElement.style.colorScheme = next;
      return next;
    });
  }, []);

  const value = useMemo(() => ({mode, toggle}), [mode, toggle]);

  return (
    <ModeContext value={value}>
      <Theme theme={themes[defaultThemeSlug]} mode={mode}>
        <LinkProvider component={Link}>
          {/* Where toasts appear, for any page that shows one. */}
          <ToastViewport position="bottomEnd">{children}</ToastViewport>
        </LinkProvider>
      </Theme>
    </ModeContext>
  );
}
