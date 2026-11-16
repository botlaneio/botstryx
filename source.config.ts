import {defineConfig, defineDocs} from 'fumadocs-mdx/config';
import {pageSchema} from 'fumadocs-core/source/schema';
import {z} from 'zod';

// title and description come from the Fumadocs page schema. description stays under 160 characters.
// status is draft until a page is ready to read as current, live once it is, or soon while slotLane
// has not launched. There is no product field: these docs are only slotLane.
const docsFrontmatter = pageSchema.extend({
  description: z.string().max(160).optional(),
  status: z.enum(['draft', 'live', 'soon']).default('draft'),
});

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {schema: docsFrontmatter},
});

export default defineConfig();
