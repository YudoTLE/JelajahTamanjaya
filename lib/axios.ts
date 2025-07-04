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
  categories[]->{
    _id,
    title,
    slug
  },
  publishedAt,
  body
}`);

const fetchEventsQuery = defineQuery(`*[_type == "event"]{
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
  categories[]->{
    _id,
    title,
    slug
  },
  publishedAt,
  beginAt,
  endAt,
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
  categories[]->{
    _id,
    title,
    slug
  },
  publishedAt,
  beginAt,
  endAt,
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

export const getEvents = async () => {
  const data = await client.fetch<EventType[]>(fetchEventsQuery);
  return data;
};

export const getEventBySlug = async (slug: string) => {
  const data = await client.fetch<EventType | null>(fetchEventBySlug, { slug });
  return data;
};
