import { HeroSection } from '@/components/sections/hero';
import { UpcomingEventSection, RunningEventSection } from '@/components/sections/event';
import { PostSection } from '@/components/sections/post';
import { getCategories, getPosts } from '@/lib/axios';
import { Navbar } from '@/components/navbar';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const postLimit = 6;
  const initialPosts = await getPosts({ limit: postLimit });
  const categories = await getCategories();

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center gap-8 py-6 pt-24">
        <section id="hero" className="w-full">
          <HeroSection />
        </section>

        <section id="running-events" className="w-full">
          <RunningEventSection />
        </section>

        <section id="upcoming-events" className="w-full">
          <UpcomingEventSection />
        </section>

        <section id="posts" className="w-full">
          <PostSection
            initialPosts={initialPosts}
            categories={categories}
            limit={postLimit}
            variant="lite"
          />
        </section>
      </div>
    </>
  );
}
