'use client';

import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { useFetchPosts } from '@/app/hooks/use-post';

export const PostSection = () => {
  const { data: posts, isPending, isError } = useFetchPosts();

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Loading posts...</p>;
  }

  if (isError || !posts) {
    return <p className="text-sm text-red-500">Failed to load posts.</p>;
  }

  return (
    <main className="flex flex-col w-full items-center justify-center h-[100dvh] gap-y-4">
      <h1 className="text-5xl font-bold">Posts</h1>

      {posts.map(post => (
        <Link
          key={post._id}
          href={`/post/${post.slug?.current}`}
          className="w-full max-w-2xl block"
        >
          <Card className="rounded-xl hover:shadow transition relative overflow-hidden">
            <div className="absolute size-32 bg-emerald-400 rounded-full z-10 top-0 left-0 -translate-x-1/2 -translate-y-1/2" />

            <CardContent className="flex flex-row gap-6 p-4">
              {/* Left: Image */}
              {post.mainImage?.asset?.url && (
                <div className="relative w-40 h-40 min-w-[10rem] overflow-hidden rounded-md">
                  <Image
                    src={post.mainImage.asset.url}
                    alt={post.mainImage.alt || 'Post image'}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Right: Title + Date + Categories */}
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-xl text-black font-semibold mb-1">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(post.publishedAt), 'PPP')}
                  </p>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">
                    {post.categories?.map(c => c.title).join(', ') || 'Uncategorized'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </main>
  );
};
