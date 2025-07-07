import { defineQuery } from 'next-sanity';
import { client } from '@/sanity/lib/client';

const fetchPostsQuery = defineQuery(`*[_type == "post"]{
  _id,
  title,
  slug,
  mainImage {
    asset->{
      _id,
      url
    },
    alt
  },
  author->{
    fullname,
    slug,
    mainImage {
      alt
    }
  },
  categories[]->{
    _id,
    title,
    slug
  },
  publishedAt,
  body
}`);

const fetchPostBySlug = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  mainImage {
    asset->{
      _id,
      url
    },
    alt
  },
  author->{
    fullname,
    slug,
    mainImage {
      alt
    }
  },
  categories[]->{
    _id,
    title,
    slug
  },
  publishedAt,
  body
}`);

const fetchUpcomingEventsQuery = defineQuery(`*[_type == "event" && now() < beginAt]{
  _id,
  title,
  description,
  slug,
  mainImage {
    asset->{
      _id,
      url
    },
    alt
  },
  author->{
    fullname,
    slug,
    mainImage {
      alt
    }
  },
  categories[]->{
    _id,
    title,
    slug
  },
  publishedAt,
  beginAt,
  endAt,
  innerShadowColor,
  outerShadowColor,
  body
}`);

const fetchRunningEventsQuery = defineQuery(`*[_type == "event" && beginAt <= now() && now() <= endAt]{
  _id,
  title,
  description,
  slug,
  mainImage {
    asset->{
      _id,
      url
    },
    alt
  },
  author->{
    fullname,
    slug,
    mainImage {
      alt
    }
  },
  categories[]->{
    _id,
    title,
    slug
  },
  publishedAt,
  beginAt,
  endAt,
  innerShadowColor,
  outerShadowColor,
  body
}`);

const fetchEventBySlug = defineQuery(`*[_type == "event" && slug.current == $slug][0]{
  _id,
  title,
  description,
  slug,
  mainImage {
    asset->{
      _id,
      url
    },
    alt
  },
  author->{
    fullname,
    slug,
    mainImage {
      alt
    }
  },
  categories[]->{
    _id,
    title,
    slug
  },
  publishedAt,
  beginAt,
  endAt,
  innerShadowColor,
  outerShadowColor,
  body
}`);

export const getPosts = async () => {
  const data = await client.fetch<PostType[]>(fetchPostsQuery);
  return data;
};

export const getPostBySlug = async (slug: string) => {
  const data = await client.fetch<PostType | null>(fetchPostBySlug, { slug });
  return data;
};

export const getUpcomingEvents = async () => {
  const data = await client.fetch<EventType[]>(fetchUpcomingEventsQuery);
  return data;
};

export const getRunningEvents = async () => {
  const data = await client.fetch<EventType[]>(fetchRunningEventsQuery);
  return data;
};

export const getEventBySlug = async (slug: string) => {
  const data = await client.fetch<EventType | null>(fetchEventBySlug, { slug });
  return data;
};
