import {Suspense} from 'react';
import type {Metadata, Viewport} from 'next';
import {Instrument_Sans, JetBrains_Mono} from 'next/font/google';

import './globals.css'; // first: declares the cascade-layer order
import {LaneLauncher} from '@/components/brand/lane-launcher';
import {jsonLdScript, siteJsonLd} from '@/lib/seo';
import {DEFAULT_SHARE_IMAGE, SHARE_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL} from '@/lib/site';

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
  // Makes canonical and social-preview links absolute, on botlane.io whatever address served the page.
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: './',
    types: {'application/rss+xml': '/blog/rss.xml'},
  },
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en',
    images: [{url: DEFAULT_SHARE_IMAGE, width: SHARE_IMAGE.width, height: SHARE_IMAGE.height, alt: SHARE_IMAGE.alt, type: SHARE_IMAGE.type}],
  },
  twitter: {card: 'summary_large_image', images: [DEFAULT_SHARE_IMAGE]},
};

export const viewport: Viewport = {
  // The page opens dark whatever the device is set to, so the browser's own bar matches it.
  themeColor: '#0b0c0e',
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en" className={`${instrument.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: jsonLdScript(siteJsonLd())}} />
        <Providers>
          {children}
          {/* It reads the page's address, so it waits outside the prerendered shell. */}
          <Suspense fallback={null}><LaneLauncher /></Suspense>
        </Providers>
      </body>
    </html>
  );
}
