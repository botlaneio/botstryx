import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets other devices on the local network (an iPad, a phone) load the dev server's scripts. Without it the
  // page arrives as static HTML and nothing interactive works. Update the address if this PC's IP changes.
  allowedDevOrigins: ["192.168.0.103"],
  // Off: with Cache Components on, every page hung on Cloudflare Workers (OpenNext 1.20) and returned 500.
  // Turn it back on only after checking `npm run preview` serves pages.
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

// Lets `next dev` reach the Cloudflare bindings in wrangler.jsonc (like the chat's rate limiter), simulated locally.
import {initOpenNextCloudflareForDev} from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();
