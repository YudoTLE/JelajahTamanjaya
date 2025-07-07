import { Card, CardContent } from '@/components/ui/card';
import { useFetchWeather } from '@/hooks/use-weather';

export const HeroSection: React.FC = () => {
  const { cityName, currentWeather, dailyForecast, isPending } = useFetchWeather('Sukabumi,ID');

  const mainImageUrl = '/images/hero.jpg';

  return (
    <div className="relative flex flex-col w-full justify-center px-8">
      <div className="grid grid-cols-2 md:grid-cols-3 grid-rows-2 gap-4 h-[600px]">
        <div className="col-span-2 row-span-2 relative group">
          <div className="absolute -inset-4 bg-green-500/10 group-hover:bg-green-500/20 transition-all duration-500 blur-md transform translate-y-2 rounded-4xl"></div>

          <Card className="rounded-md flex border-none justify-center items-center relative overflow-hidden h-full">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${mainImageUrl})` }}
            />

            <div className="absolute opacity-70 inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-all duration-300 group-hover:opacity-90" />
            <div className="absolute opacity-70 inset-0 bg-gradient-to-r from-black/65 via-black/10 to-transparent transition-all duration-300 group-hover:opacity-90" />

            <CardContent className="z-10 flex flex-col gap-4 md:gap-8 w-full px-8 md:px-16">
              <h1 className="text-3xl md:text-5xl text-foreground font-bold">Jelajah Tamanjaya</h1>
              <p className="text-md sm:text-lg text-foreground">
                Discover the hidden charm of Tamanjaya — your gateway to nature, culture, and unforgettable adventures. Explore local attractions, plan your trip, and experience the beauty of Indonesia like never before.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="group rounded-md flex flex-col border-none relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-800/40" />

          <CardContent className="z-10 flex flex-col justify-between flex-1">
            <div className="flex flex-col gap-3">
              <h2 className="text-xl text-foreground font-bold">{cityName}</h2>

              {isPending
                ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )
                : currentWeather
                  ? (
                      <>
                        {/* Current Weather Section */}
                        <div className="grid grid-cols-1 gap-4">
                          {/* Temperature and Description */}
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {currentWeather.icon}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-3xl font-bold text-foreground">
                                {currentWeather.temp}
                                °
                              </span>
                              <span className="text-sm text-foreground/80 capitalize">
                                {currentWeather.description}
                              </span>
                            </div>
                          </div>

                          {/* Weather Details */}
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-xs text-foreground/70">
                              <span className="block">Feels</span>
                              <span className="text-foreground font-semibold">
                                {currentWeather.feelsLike}
                                {' '}
                                °
                              </span>
                            </div>
                            <div className="text-xs text-foreground/70">
                              <span className="block">Wind</span>
                              <span className="text-foreground font-semibold">
                                {currentWeather.windSpeed}
                                {' '}
                                km/h
                              </span>
                            </div>
                            <div className="text-xs text-foreground/70">
                              <span className="block">Humidity</span>
                              <span className="text-foreground font-semibold">
                                {currentWeather.humidity}
                                %
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Forecast Section */}
                        <div className="border-t border-white/20 pt-3">
                          <div className="grid grid-cols-5 gap-2">
                            {dailyForecast.slice(0, 5).map((day, index) => (
                              <div key={index} className="flex flex-col items-center text-center">
                                <span className="text-xs text-foreground/80 mb-1">{day.dayName}</span>
                                <div className="mb-1">{day.icon}</div>
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-xs text-foreground font-semibold">
                                    {day.tempMax}
                                    °
                                  </span>
                                  <span className="text-xs text-foreground/60">
                                    {day.tempMin}
                                    °
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )
                  : (
                      <div className="text-center py-4 text-foreground/70">
                        Weather data unavailable
                      </div>
                    )}
            </div>
          </CardContent>
        </Card>

        <Card className="group rounded-md flex border-none justify-center items-center relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d46508.00517239035!2d106.47244160364545!3d-7.226226651530203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e42a7485af3807d%3A0xccf4d3bad48a4809!2sTamanjaya%2C%20Kec.%20Ciemas%2C%20Kabupaten%20Sukabumi%2C%20Jawa%20Barat!5e0!3m2!1sen!2sen!4v1751851969091!5m2!1sen!2sen"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            >
            </iframe>
          </div>
        </Card>
      </div>
    </div>
  );
};
