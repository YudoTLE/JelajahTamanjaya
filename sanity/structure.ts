import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = S =>
  S.list()
    .title('Content Studio')
    .items([
      S.documentTypeListItem('author').title('Authors'),
      S.documentTypeListItem('post').title('Posts'),
      S.documentTypeListItem('event').title('Events'),
      S.documentTypeListItem('category').title('Categories'),
    ]);
