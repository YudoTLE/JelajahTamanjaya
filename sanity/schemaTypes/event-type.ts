import { CalendarIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The name of your event',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'This will be the URL path for your event',
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
      title: 'Description',
      type: 'text',
      description: 'Brief description of the event',
    }),
    defineField({
      name: 'author',
      title: 'Organizer',
      type: 'reference',
      description: 'Who is organizing this event?',
      to: { type: 'author' },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Image',
      type: 'image',
      description: 'Main image that appears with your event',
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
      description: 'Which categories does this event belong to?',
      of: [defineArrayMember({ type: 'reference', to: { type: 'category' } })],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      description: 'When should this event be published?',
      validation: Rule => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'eventMode',
      title: 'Event Mode',
      type: 'string',
      description: 'Is this event happening online or offline?',
      initialValue: 'offline',
      options: {
        list: [
          { title: 'Offline', value: 'offline' },
          { title: 'Online', value: 'online' },
        ],
        layout: 'dropdown',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Address or meeting link for the event',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'beginAt',
      title: 'Start',
      type: 'datetime',
      description: 'When does the event begin?',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'endAt',
      title: 'End',
      type: 'datetime',
      description: 'When does the event end?',
      validation: Rule =>
        Rule.custom((endAt, context) => {
          const beginAt = context.document?.beginAt as (string | undefined);
          if (!endAt || !beginAt) return true;
          return new Date(endAt) > new Date(beginAt) || 'End time must be after start time';
        }),
    }),
    defineField({
      name: 'innerShadowColor',
      title: 'Inner Shadow Color',
      type: 'color',
      description: 'Custom shadow color for event styling',
      options: {
        disableAlpha: false,
      },
    }),
    defineField({
      name: 'body',
      title: 'Details',
      type: 'blockContent',
      description: 'Detailed information about the event. Use headings to structure your content.',
    }),
  ],

  fieldsets: [
    {
      name: 'scheduling',
      title: 'Schedule',
      description: 'When does this event happen?',
      options: {
        collapsible: true,
        collapsed: false,
      },
    },
    {
      name: 'design',
      title: 'Visual Design',
      description: 'Customize the appearance of your event',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      beginAt: 'beginAt',
      publishedAt: 'publishedAt',
    },
    prepare(selection) {
      const { title, author, media, beginAt, publishedAt } = selection;
      const eventDate = beginAt || publishedAt;
      const subtitle = [
        author && `by ${author}`,
        eventDate && new Date(eventDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: beginAt ? 'numeric' : undefined,
          minute: beginAt ? '2-digit' : undefined,
        }),
      ]
        .filter(Boolean)
        .join(' • ');

      return {
        title: title || 'Untitled Event',
        subtitle,
        media,
      };
    },
  },

  orderings: [
    {
      title: 'Event Date',
      name: 'beginAtAsc',
      by: [{ field: 'beginAt', direction: 'asc' }],
    },
    {
      title: 'Publish Date',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
});
