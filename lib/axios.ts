import { defineQuery } from 'next-sanity';
import { client } from '@/sanity/lib/client';

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

export async function getPosts({
  page = 1,
  limit = 1024,
  filter,
  search,
}: {
  page?: number
  limit?: number
  filter?: string[]
  search?: string
}) {
  const start = (page - 1) * limit;
  const end = start + limit;
  const isSearching = !!search;
  const isFiltering = !!filter && filter.length > 0;

  let baseFilter = '_type == "post" && publishedAt <= now()';

  if (isFiltering) {
    const categoryFilter = filter.map((_, index) => `$filter${index} in categories[]->slug.current`).join(' || ');
    baseFilter += ` && (${categoryFilter})`;
  }

  const query = isSearching
    ? `*[${baseFilter} && (
          title match $search + "*" ||
          pt::text(body) match $search + "*"
        )]
        | score(
            boost(title match $search + "*", 2),
            boost(pt::text(body) match $search + "*", 1)
          )
        | order(_score desc, publishedAt desc)
        [_score > 0]
        [$start...$end] {
          _score,
          _id,
          title,
          slug,
          mainImage { asset->{_id, url}, alt },
          author->{fullname, slug, mainImage{alt}},
          categories[]->{_id, title, slug},
          publishedAt,
          body
        }
      `
    : `
      *[${baseFilter}]
        | order(publishedAt desc)
        [$start...$end] {
          _id,
          title,
          slug,
          mainImage { asset->{_id, url}, alt },
          author->{fullname, slug, mainImage{alt}},
          categories[]->{_id, title, slug},
          publishedAt,
          body
        }
      `;

  const params: Record<string, string | number> = { start, end };

  if (isSearching) {
    params.search = search;
  }

  if (isFiltering) {
    filter.forEach((slug, i) => {
      params[`filter${i}`] = slug;
    });
  }

  return client.fetch<PostType[]>(query, params);
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

export const getCategories = async () => {
  const query = `
    *[_type == "category"] {
      _id,
      title,
      slug,
    }
  `;

  const data = await client.fetch<Category[]>(query);
  return data;
};
