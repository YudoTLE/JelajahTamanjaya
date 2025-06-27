import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const UpcomingEventSection = () => {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1, spacing: 16 },
  });

  return (
    <section className="space-y-6 max-w-4xl">
      <h2 className="text-3xl font-semibold text-center">Upcoming Events</h2>

      <div className="relative">
        <div ref={sliderRef} className="keen-slider">
          {[1, 2, 3].map(id => (
            <Card key={id} className="keen-slider__slide">
              <CardHeader>
                <CardTitle>
                  Event
                  {id}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">
                  Description for event
                  {' '}
                  {id}
                  . Come and enjoy.
                </p>
                <p className="text-sm font-medium text-blue-500">
                  June
                  {' '}
                  {25 + id}
                  , 2025
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="absolute -left-10 top-1/2 -translate-y-1/2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => instanceRef.current?.prev()}
            className="rounded-full"
          >
            <ChevronLeft className="size-8" />
          </Button>
        </div>
        <div className="absolute -right-10 top-1/2 -translate-y-1/2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => instanceRef.current?.next()}
            className="rounded-full"
          >
            <ChevronRight className="size-8" />
          </Button>
        </div>
      </div>
    </section>
  );
};
