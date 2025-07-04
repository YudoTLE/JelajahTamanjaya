export const HeroSection = () => {
  return (
    <div className="flex flex-col w-full justify-center text-center gap-y-4">
      {/* <div className="flex flex-col justify-center h-[50dvh]
                      bg-[url('/images/hero.jpg')] bg-cover bg-center"
      > */}
      <div className="flex flex-col justify-center h-[50dvh]">
        <h1 className="text-5xl font-bold">Jelajah Tamanjaya</h1>
        <p className="text-lg text-muted-foreground">Stay updated with our events and posts.</p>
      </div>
    </div>
  );
};
