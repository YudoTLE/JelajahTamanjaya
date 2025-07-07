import { DocumentTextIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const authorType = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'fullname',
      type: 'string',
      title: 'Full Name',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'fullname',
      },
    }),
    defineField({
      name: 'bio',
      type: 'string',
      title: 'Biodata',
    }),
    defineField({
      name: 'mainImage',
      title: 'Profile Picture',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'fullname',
      media: 'mainImage',
    },
    prepare(selection) {
      return selection;
    },
  },
});
