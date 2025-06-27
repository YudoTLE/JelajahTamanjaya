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

export const getPosts = async () => {
  const data = await client.fetch<Post[]>(fetchPostsQuery);
  return data;
};

export const getPostBySlug = async (slug: string) => {
  const data = await client.fetch<Post | null>(fetchPostBySlug, { slug });
  return data;
};
