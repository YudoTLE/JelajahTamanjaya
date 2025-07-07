'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useFetchUpcomingEvents, useFetchRunningEvents } from '@/hooks/use-event';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { EmblaCarouselType, EmblaEventType } from 'embla-carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { urlFor } from '@/sanity/lib/image';
import { UseQueryResult } from '@tanstack/react-query';

const TWEEN_FACTOR_BASE = 0.84;

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

const EventCarousel = (title: string, { data: events, isPending }: UseQueryResult<EventType[], Error>) => {
  const processedEvents = useMemo(() => {
    if (!events || events.length === 0) return [];

    const eventsCopy = [...events];

    if (eventsCopy.length === 1) {
      eventsCopy.push(eventsCopy[0]);
      eventsCopy.push(eventsCopy[0]);
    }
    if (eventsCopy.length === 2) {
      eventsCopy.push(eventsCopy[0]);
      eventsCopy.push(eventsCopy[1]);
    }

    return eventsCopy;
  }, [events]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    skipSnaps: false,
    dragFree: false,
  });

  const tweenFactor = useRef(0);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenOpacity = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScrollEvent = eventName === 'scroll';

      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }

          const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
          const opacity = numberWithinRange(tweenValue, 0.3, 1).toString();
          emblaApi.slideNodes()[slideIndex].style.opacity = opacity;
        });
      });
    },
    [],
  );

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    setTweenFactor(emblaApi);
    tweenOpacity(emblaApi);
    emblaApi
      .on('reInit', onSelect)
      .on('select', onSelect)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenOpacity)
      .on('scroll', tweenOpacity)
      .on('slideFocus', tweenOpacity);

    return () => {
      emblaApi
        .off('reInit', onSelect)
        .off('select', onSelect)
        .off('reInit', setTweenFactor)
        .off('reInit', tweenOpacity)
        .off('scroll', tweenOpacity)
        .off('slideFocus', tweenOpacity);
    };
  }, [emblaApi, tweenOpacity, setTweenFactor, onSelect]);

  if (processedEvents.length === 0) {
    return null;
  }

  return (
    <div id="event" className="flex flex-col w-full items-center justify-center space-y-3">
      <div className="w-full max-w-4xl px-6 text-center text-foreground">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      {/* Embla Carousel Root */}
      <div className="w-full relative">
        {/* Embla Viewport */}
        <div className="overflow-hidden" ref={emblaRef}>
          {/* Embla Container */}
          <div className="flex">
            {isPending || !events
              ? (
                  [...Array(30)].map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-[85%] max-w-4xl px-2">
                      <Skeleton className="h-[400px] w-full rounded-md" />
                    </div>
                  ))
                )
              : processedEvents.map((event, index) => {
                  const imageUrl = event.mainImage
                    ? urlFor(event.mainImage).url()
                    : null;

                  return (
                    <div key={index} className="flex-shrink-0 w-[85%] max-w-4xl px-2">
                      <Link
                        href={`/event/${event.slug?.current}`}
                        className="w-full block group"
                      >
                        <Card className="rounded-md border-none hover:shadow-lg h-[400px] transition-all duration-300 ease-out relative overflow-hidden">
                          {imageUrl && (
                            <div
                              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                              style={{ backgroundImage: `url(${imageUrl})` }}
                            />
                          )}

                          <div className="absolute opacity-70 inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-all duration-300 group-hover:opacity-90" />
                          <div className="absolute opacity-70 inset-0 bg-gradient-to-r from-black/65 via-black/10 to-transparent transition-all duration-300 group-hover:opacity-90" />

                          <CardHeader className="z-20">
                            <h2 className="text-3xl text-white font-semibold transition-all duration-300 group-hover:scale-101">
                              {event.title}
                            </h2>
                          </CardHeader>

                          <CardContent className="z-20 flex-1">
                            <p className="text-white transition-all duration-300 group-hover:scale-101">
                              {event.description}
                            </p>
                          </CardContent>

                          <CardFooter className="z-20 flex justify-between">
                            <div className="flex gap-2">
                              {event.categories?.map((c, i) => (
                                <Badge
                                  key={i}
                                  className="transition-all duration-300 group-hover:scale-105"
                                >
                                  {c.title}
                                </Badge>
                              ))}
                            </div>
                            <p className="text- font-semibold text-gray-200 transition-all duration-300 group-hover:scale-105">
                              {format(new Date(event.beginAt), 'PPP')}
                              {' - '}
                              {format(new Date(event.endAt), 'PPP')}
                            </p>
                          </CardFooter>
                        </Card>
                      </Link>
                    </div>
                  );
                })}
          </div>
        </div>

        {!isPending
          && (
            <div className="absolute inset-0 flex justify-center pointer-events-none">
              <div className="flex w-full max-w-5xl justify-between relative">
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white/90 opacity-50 hover:opacity-70 hover:bg-white backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer pointer-events-auto"
                  onClick={scrollPrev}
                  disabled={prevBtnDisabled}
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white/90 opacity-50 hover:opacity-70 hover:bg-white backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer pointer-events-auto"
                  onClick={scrollNext}
                  disabled={nextBtnDisabled}
                >
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export const UpcomingEventSection = () => {
  const query = useFetchUpcomingEvents();
  return EventCarousel('Upcoming Events', query);
};

export const RunningEventSection = () => {
  const query = useFetchRunningEvents();
  return EventCarousel('Running Events', query);
};
