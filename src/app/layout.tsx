import {Suspense} from 'react';
import type {Metadata, Viewport} from 'next';
import {Instrument_Sans, JetBrains_Mono} from 'next/font/google';

import './globals.css'; // first: declares the cascade-layer order
import {LaneLauncher} from '@/components/brand/lane-launcher';

import {Providers} from './providers';

const instrument = Instrument_Sans({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-instrument',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'botLane · Custom websites and web apps, built properly',
  description: 'Design that looks right. Engineering that stays right. Custom design and engineering, from first idea to life after launch.',
};

export const viewport: Viewport = {
  themeColor: [
    {media: '(prefers-color-scheme: light)', color: '#f2f3f5'},
    {media: '(prefers-color-scheme: dark)', color: '#0b0c0e'},
  ],
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en" className={`${instrument.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          {/* It reads the page's address, so it waits outside the prerendered shell. */}
          <Suspense fallback={null}><LaneLauncher /></Suspense>
        </Providers>
      </body>
    </html>
  );
}
