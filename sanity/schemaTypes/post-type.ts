import { DocumentTextIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The headline of your post',
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'This will be the URL path for your post',
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
      name: 'author',
      title: 'Author',
      type: 'reference',
      description: 'Who wrote this post?',
      to: { type: 'author' },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Featured Image',
      type: 'image',
      description: 'Main image that appears with your post',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description: 'Describe this image for screen readers and SEO',
        }),
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      description: 'Which categories does this post belong to?',
      of: [defineArrayMember({ type: 'reference', to: { type: 'category' } })],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      description: 'When should this post be published?',
      validation: Rule => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'body',
      title: 'Post Content',
      type: 'blockContent',
      description: 'Write your post content here. Use headings to structure your content.',
    }),
  ],

  fieldsets: [
    {
      name: 'meta',
      title: 'SEO & Publishing',
      description: 'Settings for how this post appears and when it\'s published',
      options: {
        collapsible: true,
        collapsed: false,
      },
    },
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      publishedAt: 'publishedAt',
    },
    prepare(selection) {
      const { title, author, media, publishedAt } = selection;
      const subtitle = [
        author && `by ${author}`,
        publishedAt && new Date(publishedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      ]
        .filter(Boolean)
        .join(' • ');

      return {
        title: title || 'Untitled Post',
        subtitle,
        media,
      };
    },
  },

  orderings: [
    {
      title: 'Publish Date',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
});
