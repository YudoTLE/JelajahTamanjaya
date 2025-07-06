import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';

export const HeroSection = () => {
  const [heroData, setHeroData] = useState({
    main: {
      imageUrl: '/images/hero.jpg',
      title: 'Jelajah Tamanjaya',
      description: 'Discover the hidden charm of Tamanjaya — your gateway to nature, culture, and unforgettable adventures. Explore local attractions, plan your trip, and experience the beauty of Indonesia like never before.',
    },
    secondary: [
      {
        imageUrl: '/images/hero2.jpg',
        title: 'Nature',
        description: 'Explore pristine landscapes and breathtaking views.',
      },
      {
        imageUrl: '/images/hero3.jpg',
        title: 'Culture',
        description: 'Immerse yourself in local traditions and heritage.',
      },
    ],
  });

  const handleCardClick = (index: number) => {
    const clickedCard = heroData.secondary[index];
    const currentMain = heroData.main;

    setHeroData({
      ...heroData,
      main: {
        imageUrl: clickedCard.imageUrl,
        title: clickedCard.title,
        description: clickedCard.description,
      },
      secondary: heroData.secondary.map((card, i) =>
        i === index
          ? {
              imageUrl: currentMain.imageUrl,
              title: currentMain.title,
              description: currentMain.description,
            }
          : card,
      ),
    });
  };

  return (
    <div className="relative flex flex-col w-full justify-center px-8">
      <div className="grid grid-cols-3 grid-rows-2 gap-4 h-[600px]">
        {/* Main Card - 2x2 */}
        <Card className="group rounded-md flex border-none justify-center items-center col-span-2 row-span-2 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500"
            style={{ backgroundImage: `url(${heroData.main.imageUrl})` }}
          />

          <div className="absolute opacity-70 inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-all duration-300 group-hover:opacity-90" />
          <div className="absolute opacity-70 inset-0 bg-gradient-to-r from-black/65 via-black/10 to-transparent transition-all duration-300 group-hover:opacity-90" />

          <CardContent className="z-10 flex flex-col gap-8 w-full px-8 md:px-16">
            <h1 className="text-5xl text-white font-bold transition-all duration-300">
              {heroData.main.title}
            </h1>
            <p className="text-lg text-white transition-all duration-300">
              {heroData.main.description}
            </p>
          </CardContent>
        </Card>

        {/* Secondary Cards */}
        {heroData.secondary.map((card, index) => (
          <Card
            key={index}
            className="group rounded-md flex border-none justify-center items-center relative overflow-hidden cursor-pointer transform transition-all duration-300"
            onClick={() => handleCardClick(index)}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500"
              style={{ backgroundImage: `url(${card.imageUrl})` }}
            />

            <div className="absolute opacity-70 inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-all duration-300 group-hover:opacity-90" />
            <div className="absolute opacity-70 inset-0 bg-gradient-to-r from-black/65 via-black/10 to-transparent transition-all duration-300 group-hover:opacity-90" />

            <CardContent className="z-10 flex flex-col gap-2 w-full px-4">
              <h2 className="text-2xl text-white font-bold transition-all duration-300">
                {card.title}
              </h2>
              <p className="text-sm text-white transition-all duration-300">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
