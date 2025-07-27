import { HeroSection } from '@/components/sections/hero';
import { UpcomingEventSection, RunningEventSection } from '@/components/sections/event';
import { PostSection } from '@/components/sections/post';
import { getCategories, getPosts } from '@/lib/axios';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const postLimit = 6;
  const initialPosts = await getPosts({ limit: postLimit });
  const categories = await getCategories();

  return (
    <div className="flex flex-col items-center gap-8 py-6">
      <HeroSection />
      <RunningEventSection />
      <UpcomingEventSection />
      <PostSection
        initialPosts={initialPosts}
        categories={categories}
        limit={postLimit}
        variant="lite"
      />
    </div>
  );
}
