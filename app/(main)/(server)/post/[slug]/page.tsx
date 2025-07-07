import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/axios';
import { PortableText } from '@/components/ui/portable-text';
import { format } from 'date-fns';

type Props = {
  params: Promise<{ slug: string }>
};

export default async function PostPage({ params }: Props) {
  const resolvedParams = await params;

  if (!resolvedParams?.slug) return notFound();

  try {
    const post = await getPostBySlug(resolvedParams.slug);

    if (!post) return notFound();

    return (
      <div className="flex flex-col items-center">
        <article className="max-w-3xl w-full px-5 py-8 prose prose-invert">
          <h1 className="font-bold -mb-4">{post.title}</h1>
          <p className="text-muted-foreground italic">
            published at
            {' '}
            {format(new Date(post.publishedAt), 'PPP')}
            {' '}
            by
            {' '}
            {post.author?.fullname}
          </p>
          {post.body && (
            <PortableText value={post.body} />
          )}
        </article>
      </div>
    );
  }
  catch (error) {
    console.error('Error fetching post:', error);
    return notFound();
  }
}
