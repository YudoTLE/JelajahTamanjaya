import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isSameDay, isSameMonth, isSameYear } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isSameDay(start, end)) {
    return `${format(start, 'PPP')}, ${format(start, 'p')} - ${format(end, 'p')}`;
  }

  if (isSameMonth(start, end)) {
    return `${format(start, 'MMMM d')} - ${format(end, 'd, yyyy')}`;
  }

  if (isSameYear(start, end)) {
    return `${format(start, 'MMMM d')} - ${format(end, 'MMMM d, yyyy')}`;
  }

  return `${format(start, 'PPP')} - ${format(end, 'PPP')}`;
}

export function formatDateTimeRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isSameDay(start, end)) {
    return `${format(start, 'PPP')}, ${format(start, 'p')} - ${format(end, 'p')}`;
  }

  if (isSameMonth(start, end)) {
    return `${format(start, 'MMMM d, p')} - ${format(end, 'd, yyyy, p')}`;
  }

  if (isSameYear(start, end)) {
    return `${format(start, 'MMMM d, p')} - ${format(end, 'MMMM d, yyyy, p')}`;
  }

  return `${format(start, 'PPP, p')} - ${format(end, 'PPP, p')}`;
}
