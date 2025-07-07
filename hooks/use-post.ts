'use client';

import { useQuery } from '@tanstack/react-query';
import { getPosts, getPostBySlug } from '@/lib/axios';

export const useFetchPosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => {
      return getPosts();
    },
    staleTime: 1000 * 60,
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
