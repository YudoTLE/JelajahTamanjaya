'use client';

import { HeroSection } from '@/components/sections/hero';
import { UpcomingEventSection, RunningEventSection } from '@/components/sections/event';
import { PostSection } from '@/components/sections/post';

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-8 py-6">
      <HeroSection />
      <RunningEventSection />
      <UpcomingEventSection />
      <PostSection />
    </div>
  );
}
