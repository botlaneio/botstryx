import {createFromSource} from 'fumadocs-core/search/server';

import {source} from '@/lib/source';

// Orama search over the compiled pages. The index is built from that content, not from disk.
export const {GET} = createFromSource(source);
