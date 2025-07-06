'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useFetchPosts } from '@/app/hooks/use-post';
import { urlFor } from '@/sanity/lib/image';

export const PostSection = () => {
  const { data: posts, isPending, isError } = useFetchPosts();

  if (isError) {
    return (
      <div className="flex flex-col w-full items-center justify-center space-y-2 py-2">
        <div className="w-full px-8 text-center">
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-sm text-red-500 mt-4">Failed to load posts.</p>
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col w-full items-center justify-center space-y-2 py-2">
        <div className="w-full px-8 text-center">
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-sm text-muted-foreground mt-4">No posts available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full items-center justify-center space-y-3">
      <div className="w-full px-8 text-center">
        <h1 className="text-2xl font-bold">Posts</h1>
      </div>

      <div className="w-full px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isPending
            ? [...Array(6)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-[400px] w-full rounded-md" />
                </div>
              ))
            : posts.map((post) => {
                const imageUrl = post.mainImage?.asset
                  ? urlFor(post.mainImage).url()
                  : null;

                return (
                  <Link
                    key={post._id}
                    href={`/post/${post.slug?.current}`}
                    className="w-full block group"
                  >
                    <Card className="rounded-md border-none hover:shadow-lg h-[400px] transition-all duration-300 ease-out relative overflow-hidden">
                      {imageUrl && (
                        <div
                          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url(${imageUrl})` }}
                        />
                      )}

                      <div className="absolute opacity-70 inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-all duration-300 group-hover:opacity-90" />
                      <div className="absolute opacity-70 inset-0 bg-gradient-to-r from-black/65 via-black/10 to-transparent transition-all duration-300 group-hover:opacity-90" />

                      <CardHeader className="z-20">
                        <h2 className="text-xl text-white font-semibold transition-all duration-300 group-hover:scale-101">
                          {post.title}
                        </h2>
                      </CardHeader>

                      <CardContent className="z-20 flex-1">
                        {post.excerpt && (
                          <p className="text-white transition-all duration-300 group-hover:scale-101">
                            {post.excerpt}
                          </p>
                        )}
                      </CardContent>

                      <CardFooter className="z-20 flex justify-between">
                        <div className="flex gap-2">
                          {post.categories?.map((c, i) => (
                            <Badge
                              key={i}
                              className="transition-all duration-300 group-hover:scale-105"
                            >
                              {c.title}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm font-semibold text-gray-200 transition-all duration-300 group-hover:scale-105">
                          {format(new Date(post.publishedAt), 'PPP')}
                        </p>
                      </CardFooter>
                    </Card>
                  </Link>
                );
              })}
        </div>
      </div>
    </div>
  );
};
