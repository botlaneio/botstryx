import {docs} from '@/.source';
import {loader} from 'fumadocs-core/source';

// fumadocs-mdx compiles content at build time (postinstall and next build) into .source/.
// Nothing here reads the filesystem at runtime, which the Cloudflare Worker requires.
export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
});
