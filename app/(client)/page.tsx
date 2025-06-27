'use client';

import { HeroSection } from '@/components/sections/hero';
import { PostSection } from '@/components/sections/post';

export default function Home() {
  return (
    <main className="space-y-16 flex flex-col items-center">
      <HeroSection />
      <PostSection />
    </main>
  );
}
