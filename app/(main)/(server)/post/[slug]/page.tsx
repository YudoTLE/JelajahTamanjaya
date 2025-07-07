import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/axios';
import { PortableText } from '@portabletext/react';

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
          <h1 className="text-3xl font-bold">{post.title}</h1>
          {post.body && <PortableText value={post.body} />}
        </article>
      </div>
    );
  }
  catch (error) {
    console.error('Error fetching post:', error);
    return notFound();
  }
}
