'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useFetchPosts } from '@/hooks/use-post';
import { urlFor } from '@/sanity/lib/image';
import { Button } from '../ui/button';

const PostSkeleton = () => {
  return (
    <div className="w-full block group transition-all duration-200 ease-out">
      <div className="relative rounded-md overflow-hidden">
        <div className="relative h-[200px]">
          <Skeleton className="absolute inset-0 w-full h-full" />
        </div>

        <Card className="rounded-md bg-primary text-primary-foreground border-none h-[250px]">
          <CardHeader className="z-20">
            <Skeleton className="h-6 w-3/4 bg-primary-foreground/20" />
            <div className="flex items-center space-x-2 mt-2">
              <Skeleton className="h-4 w-20 bg-primary-foreground/20" />
              <Skeleton className="h-4 w-24 bg-primary-foreground/20" />
              <Skeleton className="h-4 w-2 bg-primary-foreground/20" />
              <Skeleton className="h-4 w-20 bg-primary-foreground/20" />
            </div>
          </CardHeader>

          <CardContent className="z-20 flex-1">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-primary-foreground/20" />
              <Skeleton className="h-4 w-full bg-primary-foreground/20" />
              <Skeleton className="h-4 w-2/3 bg-primary-foreground/20" />
            </div>
          </CardContent>

          <CardFooter className="z-20 flex justify-between">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 bg-primary-foreground/20 rounded-full" />
              <Skeleton className="h-6 w-20 bg-primary-foreground/20 rounded-full" />
              <Skeleton className="h-6 w-14 bg-primary-foreground/20 rounded-full" />
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export const PostSection = () => {
  const { data: posts, isPending } = useFetchPosts();

  if (posts && posts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col w-full items-center justify-center space-y-3">
      <div className="w-full px-8 text-center">
        <h1 className="text-2xl font-bold">Posts</h1>
      </div>

      <div className="w-full px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isPending
            ? [...Array(6)].map((_, i) => (
                <div key={i}>
                  <PostSkeleton />
                </div>
              ))
            : posts?.map((post) => {
                const imageUrl = post.mainImage?.asset
                  ? urlFor(post.mainImage).url()
                  : null;

                return (
                  <Link
                    key={post._id}
                    href={`/post/${post.slug?.current}`}
                    className="w-full block group transition-all duration-200 ease-out hover:-translate-y-1"
                  >
                    <div className="relative rounded-md overflow-hidden">
                      <div className="relative h-[200px] bg-primary-foreground">
                        {imageUrl && (
                          <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                            style={{ backgroundImage: `url(${imageUrl})` }}
                          />
                        )}
                      </div>

                      <Card className="rounded-md bg-primary text-primary-foreground border-none h-[250px]">
                        <CardHeader className="z-20">
                          <h2 className="text-xl font-semibold">
                            {post.title}
                          </h2>
                          <p className="text-muted-foreground italic">
                            published at
                            {' '}
                            {format(new Date(post.publishedAt), 'PPP')}
                            {' '}
                            by
                            {' '}
                            {post.author?.fullname}
                          </p>
                        </CardHeader>

                        <CardContent className="z-20 flex-1">
                          {post.body && (
                            <p className="line-clamp-3">
                              {post.body
                                .map((block) => {
                                  if (block._type === 'block' && Array.isArray(block.children)) {
                                    return block.children.map(child => child.text).join('');
                                  }
                                  return '';
                                })
                                .join(' ')}
                            </p>
                          )}
                        </CardContent>

                        <CardFooter className="z-20 flex justify-between">
                          <div className="flex gap-2">
                            {post.categories?.map((c, i) => (
                              <Badge className="bg-secondary text-secondary-foreground" key={i}>
                                {c.title}
                              </Badge>
                            ))}
                          </div>
                        </CardFooter>
                      </Card>
                    </div>
                  </Link>
                );
              })}
        </div>
      </div>

      <Button asChild>
        <Link href="/post">See More</Link>
      </Button>
    </div>
  );
};
