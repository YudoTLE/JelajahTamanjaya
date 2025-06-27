import { type SchemaTypeDefinition } from 'sanity';

import { blockContentType } from './block-content-type';
import { categoryType } from './category-type';
import { postType } from './post-type';
import { eventType } from './event-type';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, postType, eventType],
};
