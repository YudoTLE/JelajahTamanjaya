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
import { formatDateTimeRange } from '@/lib/utils';

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

  if (events && events.length === 0) {
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
                  const imageUrl = event.mainImage?.asset
                    ? urlFor(event.mainImage).url()
                    : null;

                  const innerShadowColor = event.innerShadowColor?.hex || '#000000';
                  const innerShadowRgba = event.innerShadowColor
                    ? `rgba(${event.innerShadowColor.rgb.r}, ${event.innerShadowColor.rgb.g}, ${event.innerShadowColor.rgb.b}, ${event.innerShadowColor.alpha})`
                    : 'rgba(0, 0, 0, 1)';

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

                          <div
                            className="absolute opacity-40 inset-0 transition-all duration-300 group-hover:opacity-60"
                            style={{
                              background: `linear-gradient(to bottom, ${innerShadowRgba}, ${innerShadowColor}40, transparent)`,
                            }}
                          />
                          <div
                            className="absolute opacity-30 inset-0 transition-all duration-300 group-hover:opacity-50"
                            style={{
                              background: `linear-gradient(to right, ${innerShadowRgba.replace(/[\d.]+\)$/, '0.65)')}, ${innerShadowColor}10, transparent)`,
                            }}
                          />
                          <div
                            className="absolute opacity-40 inset-0 transition-all duration-300 group-hover:opacity-60"
                            style={{
                              background: 'linear-gradient(to top, rgba(0, 0, 0, 1), #000000FF, transparent)',
                            }}
                          />

                          <CardHeader className="z-20 transition-all duration-300 group-hover:scale-101">
                            <h2 className="text-3xl text-white font-semibold">
                              {event.title}
                            </h2>
                            <p className="text-xs text-muted-foreground italic">
                              published at
                              {' '}
                              {format(new Date(event.publishedAt), 'PPP')}
                              {' '}
                              by
                              {' '}
                              {event.author?.fullname}
                            </p>
                          </CardHeader>

                          <CardContent className="z-20 flex-1 transition-all duration-300 group-hover:scale-101">
                            <p className="text-white">
                              {event.description}
                            </p>
                          </CardContent>

                          <CardFooter className="z-20 flex gap-2 items-end justify-between">
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
                            <div className="text-sm md:text-md text-right text-foreground transition-all duration-300 group-hover:scale-103">
                              <p>
                                {event.location}
                              </p>
                              <p>
                                {formatDateTimeRange(event.beginAt, event.endAt)}
                              </p>
                            </div>
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
  if (query.data)
    console.log('UPCOMING', query.data);
  // return null;
  return EventCarousel('Upcoming Events', query);
};

export const RunningEventSection = () => {
  const query = useFetchRunningEvents();
  // console.log('RUNNING', query.data);
  // return null;
  return EventCarousel('Running Events', query);
};
