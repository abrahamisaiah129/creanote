"use client";

import React, { useState, useEffect } from "react";

import Link from 'next/link';

export interface SlideItem {
  id?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  alt?: string;
  title?: string;
  meta?: string;
  badgeText?: string;
  headline?: string;
  linkUrl?: string;
}

interface HeroSliderProps {
  slides?: SlideItem[];
  autoplayInterval?: number;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  slides = [],
  autoplayInterval = 5000,
}) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [slides.length, autoplayInterval]);

  const goToSlide = (index: number) => {
    setCurrent(index);
  };

  return (
    <div
      className="relative block aspect-[4/5] w-full max-w-[100vw] overflow-hidden bg-black sm:aspect-[16/8] lg:aspect-[16/7]"
      id="heroWrapper"
      data-testid="hero-slider"
    >
      {slides.map((slide, idx) => {
        const slideContent = (
          <>
            <picture>
              <source
                media="(max-width: 639px)"
                srcSet={slide.mobileImageUrl || slide.imageUrl}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="absolute inset-0 block h-full w-full object-cover object-center"
                src={slide.imageUrl}
                alt={slide.alt || `Creanote Slide ${idx + 1}`}
              />
            </picture>

            {(slide.badgeText || slide.title || slide.headline || slide.meta) && (
              // Added pb-16 on mobile to push the text upwards and leave clear room for the dots below it
              <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-4 pb-16 pt-12 sm:px-8 sm:pb-8 sm:pt-16 lg:px-12 lg:pb-10 lg:pt-20">
                {/* the texts and eyebrow */}
                <div className="mx-auto max-w-[1280px]">
                  {slide.badgeText && (
                    <span className="mb-2 inline-block bg-[#f59e0b] px-3 py-1.5 font-['Ubuntu'] text-xs font-bold uppercase italic leading-none tracking-wide text-white sm:mb-3 sm:px-4 sm:py-1.5 sm:text-sm lg:text-base">
                      {slide.badgeText}
                    </span>
                  )}
                  {(slide.title || slide.headline) && (
                    <h2 className="line-clamp-3 max-w-4xl font-['Ubuntu'] text-lg font-extrabold leading-tight text-white drop-shadow-md sm:text-2xl lg:text-4xl">
                      {slide.title || slide.headline}
                    </h2>
                  )}
                  {slide.meta && (
                    <div className="mt-2 font-['Ubuntu'] text-[10px] font-bold uppercase tracking-wide text-[var(--green)] sm:mt-3 sm:text-xs lg:mt-3 lg:text-xs">
                      {slide.meta}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        );

        return (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 h-full w-full pointer-events-none opacity-0 transition-opacity duration-700 ${idx === current ? "active pointer-events-auto opacity-100" : ""}`}
            id={`slide-${idx}`}
            data-testid={`hero-slide-${idx}`}
          >
            {slide.linkUrl ? (
              <Link href={slide.linkUrl} className="block w-full h-full text-inherit no-underline">
                {slideContent}
              </Link>
            ) : (
              slideContent
            )}
          </div>
        );
      })}

      {/* FIXED SLIDER DOTS */}
      {slides.length > 1 && (
        <div
          // Keeps flex-row on BOTH mobile and desktop so the pill stays horizontal
          className="absolute z-20 flex flex-row items-center gap-2.5 bottom-4 left-1/2 -translate-x-1/2 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:left-auto md:right-6 lg:right-12"
          id="heroDots"
          data-testid="hero-dots"
        >
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`cursor-pointer border-0 transition-all duration-300 rounded-full ${
                idx === current
                  ? // Active horizontal pill: Made taller (h-3.5) and wider (w-10) to match your design image
                    "active h-3.5 w-10 bg-[var(--green)]"
                  : // Inactive dots: Enlarged to a comfortable, matching scale (h-3 w-3)
                    "h-3 w-3 bg-white/30"
              }`}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              data-testid={`hero-dot-${idx}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
