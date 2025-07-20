'use client';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getPosts, getPostBySlug } from '@/lib/axios';

export const useFetchPosts = ({
  initialData,
  limit = 6,
  filter,
  search,
}: {
  initialData?: PostType[]
  limit?: number
  filter?: string[]
  search?: string
}) => {
  const processedFilter = filter || [];
  const processedSearch = (search ?? '').trim();

  return useInfiniteQuery({
    queryKey: ['posts', processedFilter.sort().join('|'), processedSearch, limit],
    queryFn: async ({ pageParam = 1 }) => {
      const filterToPass = processedFilter.length > 0 ? processedFilter : undefined;
      const searchToPass = processedSearch || undefined;

      const posts = await getPosts({
        page: pageParam,
        limit,
        filter: filterToPass,
        search: searchToPass,
      });

      return {
        data: posts,
        currentPage: pageParam,
        hasMore: posts.length === limit,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.currentPage + 1 : undefined;
    },
    staleTime: 1000 * 60,
    ...(processedSearch || processedFilter.length > 0
      ? {}
      : {
          initialData: initialData
            ? {
                pages: [{
                  data: initialData.slice(0, limit),
                  currentPage: 1,
                  hasMore: initialData.length === limit,
                }],
                pageParams: [1],
              }
            : undefined,
        }
    ),
  });
};

export const useFetchPostBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => {
      return getPostBySlug(slug);
    },
    staleTime: 1000 * 60,
  });
};
