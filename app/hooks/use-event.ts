import { useQuery } from '@tanstack/react-query';
import { getEvents, getEventBySlug } from '@/lib/axios';

export const useFetchEvents = () => {
  return useQuery({
    queryKey: ['event'],
    queryFn: () => {
      return getEvents();
    },
    staleTime: 1000 * 60,
  });
};

export const useFetchEventBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['event', slug],
    queryFn: () => {
      return getEventBySlug(slug);
    },
    staleTime: 1000 * 60,
  });
};
