// Rebuild marker: refresh the PR #40 preview after reconnecting GitHub.
// Cloudflare branch previews use the same OpenNext build configuration.
import {defineCloudflareConfig} from '@opennextjs/cloudflare';

// How the site runs on Cloudflare Workers. No incremental cache yet: add an R2 bucket here if pages start
// using ISR or cached fetches (https://opennext.js.org/cloudflare/caching).
export default defineCloudflareConfig({});
