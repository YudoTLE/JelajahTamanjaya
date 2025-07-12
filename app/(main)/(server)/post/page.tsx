import Link from 'next/link';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getPosts, getTotalPostCount } from '@/lib/axios';
import { urlFor } from '@/sanity/lib/image';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default async function PostPage({
  searchParams,
}: {
  searchParams?: { page?: string }
}) {
  const page = parseInt(searchParams?.page || '1', 10);
  const count = 6;

  const posts = await getPosts(page, count);
  const totalPostCount = await getTotalPostCount();
  const totalPages = Math.ceil(totalPostCount / count);

  return (
    <div className="flex flex-col w-full items-center justify-center my-6 space-y-8">
      <div className="w-full px-8">
        <h1 className="text-2xl font-bold">Posts</h1>
      </div>

      <div className="w-full px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => {
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

      <Pagination>
        <PaginationContent>
          {page > 1 && (
            <PaginationItem>
              <PaginationPrevious href={`/post?page=${page - 1}`} />
            </PaginationItem>
          )}
          {page > 3 && (
            <PaginationItem>
              <PaginationLink href="/post?page=1">1</PaginationLink>
            </PaginationItem>
          )}
          {page > 4 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {page > 2 && (
            <PaginationItem>
              <PaginationLink href={`/post?page=${page - 2}`}>{page - 2}</PaginationLink>
            </PaginationItem>
          )}
          {page > 1 && (
            <PaginationItem>
              <PaginationLink href={`/post?page=${page - 1}`}>{page - 1}</PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink href={`/post?page=${page}`} isActive>{page}</PaginationLink>
          </PaginationItem>
          {page < totalPages && (
            <PaginationItem>
              <PaginationLink href={`/post?page=${page + 1}`}>{page + 1}</PaginationLink>
            </PaginationItem>
          )}
          {page + 1 < totalPages && (
            <PaginationItem>
              <PaginationLink href={`/post?page=${page + 2}`}>{page + 2}</PaginationLink>
            </PaginationItem>
          )}
          {page < totalPages - 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {page < totalPages - 2 && (
            <PaginationItem>
              <PaginationLink href={`/post?page=${totalPages}`}>{totalPages}</PaginationLink>
            </PaginationItem>
          )}
          {page < totalPages && (
            <PaginationItem>
              <PaginationNext href={`/post?page=${page + 1}`} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
