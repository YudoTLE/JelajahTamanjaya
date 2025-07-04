'use client';

import { HeroSection } from '@/components/sections/hero';
import { UpcomingEventSection } from '@/components/sections/event';
import { PostSection } from '@/components/sections/post';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <HeroSection />
      <UpcomingEventSection />
      <UpcomingEventSection />
      <UpcomingEventSection />
      <PostSection />
    </div>
  );
}
