import { TagIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'The name of the category',
    }),
    defineField({
      name: 'slug',
      title: 'ID Slug',
      type: 'slug',
      description: 'This will be the unique identifier for the category',
      validation: Rule =>
        Rule.custom((slug) => {
          const value = slug?.current ?? '';
          if (!value) return 'Slug is required';
          const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
          return regex.test(value) || 'Slug can only contain lowercase letters, numbers, and hyphens';
        }),
      options: {
        source: 'title',
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
    }),
    defineField({
      name: 'description',
      type: 'text',
    }),
  ],
});
