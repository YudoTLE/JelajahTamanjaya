import { UserIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const authorType = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'fullname',
      type: 'string',
      title: 'Full Name',
      description: 'The name of the person/organization',
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'This will be the URL path for your author',
      validation: Rule =>
        Rule.custom((slug) => {
          const value = slug?.current ?? '';
          if (!value) return 'Slug is required';
          const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
          return regex.test(value) || 'Slug can only contain lowercase letters, numbers, and hyphens';
        }),
      options: {
        source: 'fullname',
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
    }),
    defineField({
      name: 'mainImage',
      title: 'Profile Picture',
      type: 'image',
      description: 'Profile picture that will be shown',
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
    defineField({
      name: 'bio',
      type: 'text',
      title: 'Biodata',
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
