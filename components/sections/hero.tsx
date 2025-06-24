export const HeroSection = () => {
  return (
    <section className="flex flex-col w-full justify-center h-[100dvh] text-center gap-y-4">
      <div className="flex flex-col justify-center h-[50dvh] bg-[url('/images/hero.jpg')] bg-cover bg-center">
        <h1 className="text-5xl font-bold">Welcome to Our Platform</h1>
        <p className="text-lg text-muted-foreground">Stay updated with our events and posts.</p>
      </div>
    </section>
  );
};
