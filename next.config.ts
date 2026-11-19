import {createMDX} from 'fumadocs-mdx/next';
import type {NextConfig} from 'next';
import {initOpenNextCloudflareForDev} from '@opennextjs/cloudflare';

const nextConfig: NextConfig = {
  // Lets other devices on the local network (an iPad, a phone) load the dev server's scripts. Without it the
  // page arrives as static HTML and nothing interactive works. Update the address if this PC's IP changes.
  allowedDevOrigins: ['192.168.0.103'],
  // Off: with Cache Components on, every page hung on Cloudflare Workers (OpenNext 1.20) and returned 500.
  // Turn it back on only after checking `npm run preview` serves pages.
  cacheComponents: false,
  turbopack: {
    // Theatre.js only ever runs in the browser (build-sequence.tsx loads it after the page has mounted), so the
    // Worker gets an empty module in its place instead of carrying it. Keeps it inside the 3 MiB Workers limit.
    resolveAlias: {
      '@theatre/core': {browser: '@theatre/core/dist/index.js', default: './src/lib/stubs/empty.ts'},
    },
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);

// Lets `next dev` reach the Cloudflare bindings in wrangler.jsonc (like the chat's rate limiter), simulated locally.
initOpenNextCloudflareForDev();
