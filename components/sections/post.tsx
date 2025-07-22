'use client';

import React from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useFetchPosts } from '@/hooks/use-post';
import { urlFor } from '@/sanity/lib/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const PostSkeleton = () => {
  return (
    <div className="w-full block group transition-all duration-200 ease-out">
      <div className="relative">
        <div className="absolute inset-0">
          <div className="w-full h-full blur-xs bg-primary rounded-md opacity-0" />
        </div>

        <div className="rounded-md overflow-hidden transition-all duration-200 ease-out">
          <div className="relative h-[200px] bg-primary-foreground">
            <Skeleton className="absolute inset-0 w-full h-full" />
          </div>

          <Card className="rounded-md bg-card/50 rounded-t-none transition-colors duration-200 h-[250px] relative">
            <CardHeader className="z-20">
              <Skeleton className="h-6 w-3/4 bg-muted" />
              <div className="flex items-center space-x-1 mt-2">
                <Skeleton className="h-4 w-20 bg-muted" />
                <Skeleton className="h-4 w-16 bg-muted" />
                <Skeleton className="h-4 w-2 bg-muted" />
                <Skeleton className="h-4 w-20 bg-muted" />
              </div>
            </CardHeader>

            <CardContent className="z-20 flex-1">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-muted" />
                <Skeleton className="h-4 w-full bg-muted" />
                <Skeleton className="h-4 w-2/3 bg-muted" />
              </div>
            </CardContent>

            <CardFooter className="z-20 flex justify-between">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 bg-muted rounded-full" />
                <Skeleton className="h-6 w-20 bg-muted rounded-full" />
                <Skeleton className="h-6 w-14 bg-muted rounded-full" />
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export const PostItem = ({ post }: { post: PostType }) => {
  const imageUrl = post.mainImage?.asset
    ? urlFor(post.mainImage).url()
    : null;

  return (
    <Link
      key={post._id}
      href={`/post/${post.slug?.current}`}
      className="w-full block group "
    >
      <div className="relative">
        <div className="absolute inset-0">
          <div className="w-full h-full blur-xs bg-primary rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>

        <div className="rounded-md overflow-hidden transition-all duration-200 ease-out group-hover:-translate-y-1">

          <div className="relative h-[200px] bg-primary-foreground">
            {imageUrl && (
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${imageUrl})` }}
              />
            )}
          </div>
          <Card className="rounded-md bg-card/50 rounded-t-none transition-colors duration-200 h-[270px] relative">
            <CardHeader className="z-20">
              <h2 className="text-xl font-semibold line-clamp-2">
                {post.title}
              </h2>
              <p className="text-xs text-muted-foreground italic">
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
                  <Badge className="bg-card" key={i}>
                    {c.title}
                  </Badge>
                ))}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Link>
  );
};

export const PostSearchbar = ({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) => {
  return (
    <div className="w-full max-w-4xl">
      <input
        placeholder="Search posts"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="border-none w-full outline-primary-foreground bg-primary text-primary-foreground px-4 py-2 m-0 rounded-md appearance-none focus:ring-0 focus:outline-none"
      />
    </div>
  );
};

export const PostFilter = ({
  categories,
  value,
  onChange,
}: {
  categories: Category[]
  value: string[]
  onChange: (value: string[]) => void
}) => {
  const isAllActive = value.length === 0;

  const handleCategoryToggle = (slug: string) => {
    if (slug === 'all') {
      onChange([]);
    }
    else {
      if (isAllActive) {
        onChange([slug]);
      }
      else if (value.includes(slug)) {
        onChange(value.filter(v => v !== slug));
      }
      else {
        const newCategorySlugs = [...value, slug];
        if (newCategorySlugs.length === categories.length)
          onChange([]);
        else
          onChange(newCategorySlugs);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="flex gap-2 flex-wrapZ">
        <Button
          variant="outline"
          onClick={() => handleCategoryToggle('all')}
          className={cn(
            'rounded-full hover:bg-white hover:text-black hover:cursor-pointer',
            isAllActive && 'bg-card',
          )}
        >
          All
        </Button>

        {categories.map((category, i) => (
          <Button
            key={i}
            variant="outline"
            onClick={() => handleCategoryToggle(category.slug.current)}
            className={cn(
              'rounded-full hover:bg-white hover:text-black hover:cursor-pointer',
              value.includes(category.slug.current) && 'bg-card',
            )}
          >
            {category.title}
          </Button>
        ))}
      </div>
    </div>
  );
};
export const PostContainer = (props: { initialData?: PostType[], filter?: string[], search?: string, limit?: number, variant: string }) => {
  const { data: posts, fetchNextPage, hasNextPage, isPending, isFetchingNextPage } = useFetchPosts(props);

  if (posts && posts.pages.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 w-full">
      <div className="flex flex-col w-full items-center justify-center space-y-3">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isPending
            ? [...Array(props.limit ?? 6)].map((_, i) => (
                <PostSkeleton key={i} />
              ))
            : posts?.pages.map((group, i) => (
                <React.Fragment key={i}>
                  {group.data.map((post, j) => (
                    <PostItem key={j} post={post} />
                  ))}
                </React.Fragment>
              ))}

          {isFetchingNextPage
            && [...Array(props.limit ?? 6)].map((_, i) => (
              <PostSkeleton key={`loading-more-${i}`} />
            ))}
        </div>
      </div>
      {props.variant === 'lite' && (
        <div className="flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/post">See More</Link>
          </Button>
        </div>
      )}
      {props.variant === 'default' && hasNextPage && (
        <div className="flex justify-center">
          <Button
            onClick={() => fetchNextPage()}
            variant="outline"
            disabled={isFetchingNextPage}
            className="cursor-pointer"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};
export const PostSection = ({
  initialPosts,
  limit,
  categories,
  variant = 'default',
}: {
  initialPosts?: PostType[]
  limit?: number
  categories: Category[]
  variant: string
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 50);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="flex flex-col w-full items-center gap-6 px-8">
      <div className="space-y-2 w-full max-w-4xl">
        <div className="px-6 text-center text-foreground">
          <h1 className="text-2xl font-bold">Posts</h1>
        </div>
        <PostSearchbar
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <PostFilter
          categories={categories}
          value={selectedCategories}
          onChange={setSelectedCategories}
        />
      </div>
      <PostContainer
        initialData={initialPosts}
        limit={limit}
        search={debouncedSearch}
        filter={selectedCategories}
        variant={variant}
      />
    </div>
  );
};
