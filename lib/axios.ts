import { defineQuery } from 'next-sanity';
import { client } from '@/sanity/lib/client';

const fetchPostsQuery = defineQuery(`
  *[_type == "post" && publishedAt <= now()] 
  | order(publishedAt desc) 
  [$start...$end] {
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
  }
`);

const fetchPostBySlug = defineQuery(`*[_type == "post" && slug.current == $slug && publishedAt <= now()][0]{
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

const fetchUpcomingEventsQuery = defineQuery(`*[_type == "event" && now() < beginAt && publishedAt <= now()] | order(beginAt desc){
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
  body
}`);

const fetchRunningEventsQuery = defineQuery(`*[_type == "event" && beginAt <= now() && now() <= endAt && publishedAt <= now()] | order(beginAt desc){
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
  body
}`);

const fetchEventBySlug = defineQuery(`*[_type == "event" && slug.current == $slug && publishedAt <= now()][0]{
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
  body
}`);

export async function getPosts(page: number = 1, limit: number = 6) {
  const start = (page - 1) * limit;
  const end = start + limit;

  return client.fetch<PostType[]>(fetchPostsQuery, { start, end });
}

export async function getTotalPostCount() {
  return client.fetch<number>('count(*[_type == "post" && publishedAt <= now()])');
}

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
