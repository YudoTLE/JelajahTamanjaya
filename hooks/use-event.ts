import { useQuery } from '@tanstack/react-query';
import { getUpcomingEvents, getRunningEvents, getEventBySlug } from '@/lib/axios';

export const useFetchUpcomingEvents = () => {
  return useQuery({
    queryKey: ['events', 'upcoming'],
    queryFn: () => {
      return getUpcomingEvents();
    },
    staleTime: 1000 * 60,
  });
};

export const useFetchRunningEvents = () => {
  return useQuery({
    queryKey: ['events', 'running'],
    queryFn: () => {
      return getRunningEvents();
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
