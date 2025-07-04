import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/lib/axios';
import { PortableText } from '@portabletext/react';

type Props = {
  params: Promise<{ slug: string }>
};

export default async function EventPage({ params }: Props) {
  const resolvedParams = await params;

  if (!resolvedParams?.slug) return notFound();

  try {
    const event = await getEventBySlug(resolvedParams.slug);

    if (!event) return notFound();

    return (
      <div className="flex flex-col items-center">
        <article className="max-w-3xl w-full px-5 py-8 prose dark:prose-invert">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          {event.body && <PortableText value={event.body} />}
        </article>
      </div>
    );
  }
  catch (error) {
    console.error('Error fetching event:', error);
    return notFound();
  }
}
