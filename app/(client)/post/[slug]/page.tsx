import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/axios';
import { PortableText } from '@portabletext/react';

export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  if (!params?.slug) return notFound();

  const post = await getPostBySlug(params.slug);

  if (!post) return notFound();

  return (
    <div className="flex flex-col items-center">
      <article className="max-w-3xl w-full px-5 py-8 prose dark:prose-invert">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <PortableText value={post.body} />
      </article>
    </div>
  );
}
