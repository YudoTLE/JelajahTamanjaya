import { getPosts, getCategories } from '@/lib/axios';
import { PostSection } from '@/components/sections/post';

export const dynamic = 'force-dynamic';

export default async function PostPage() {
  const limit = 12;
  const initialPosts = await getPosts({ limit });
  const categories = await getCategories();

  return (
    <div className="flex flex-col items-center gap-8 py-6">
      <PostSection
        initialPosts={initialPosts}
        categories={categories}
        limit={limit}
        variant="default"
      />
    </div>
  );
}
