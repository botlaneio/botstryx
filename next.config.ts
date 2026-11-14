import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets other devices on the local network (an iPad, a phone) load the dev server's scripts. Without it the
  // page arrives as static HTML and nothing interactive works. Update the address if this PC's IP changes.
  allowedDevOrigins: ["192.168.0.103"],
  cacheComponents: true,
  partialPrefetching: true,
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
