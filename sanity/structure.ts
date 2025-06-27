import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = S =>
  S.list()
    .title('Content Studio')
    .items([
      S.listItem()
        .title('Publications')
        .child(
          S.list()
            .title('Publication')
            .items([
              S.documentTypeListItem('post').title('Posts'),
              S.documentTypeListItem('event').title('Events'),
            ]),
        ),
      S.listItem()
        .title('Labels')
        .child(
          S.list()
            .title('Label')
            .items([
              S.documentTypeListItem('category').title('Categories'),
            ]),
        ),
    ]);
