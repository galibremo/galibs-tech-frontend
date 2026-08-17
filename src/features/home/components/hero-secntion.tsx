"use client";

import { Container } from "@/components/custom-ui/container";
import { usePromotionalDataQuery } from "../actions/home.queries";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import React from "react";

export default function HeroSection() {
  const { data: promotionalData } = usePromotionalDataQuery();
  const heroSectionData = promotionalData?.heroSlides;
  const offerSEctionData = promotionalData?.offers;

  const [api, setApi] = React.useState<CarouselApi>();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = React.useState(false);

  // IntersectionObserver to detect when HeroSection is in viewport
  React.useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Automatic carousel loop when section is in viewport
  React.useEffect(() => {
    if (!api || !isInView || !heroSectionData || heroSectionData.length <= 1)
      return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [api, isInView, heroSectionData]);

  return (
    <div ref={containerRef}>
      <Container className="p-3 sm:p-4.5 lg:p-6 xl:py-8">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4.5 lg:gap-6">
          <Carousel
            opts={{ loop: true }}
            setApi={setApi}
            className="w-full lg:w-[75%]"
          >
            <CarouselContent>
              {heroSectionData?.map((slides, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-video rounded-2xl p-1">
                    <Image
                      src={slides.imageUrl}
                      alt={slides.altText || "hero slide image"}
                      fill
                      className="rounded-lg object-cover object-center"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselDots />
          </Carousel>
          <div className="flex flex-row lg:flex-col items-center gap-3 sm:gap-4.5 lg:gap-6 w-full lg:w-[25%]">
            {offerSEctionData?.slice(0, 2).map((offer, index) => (
              <div
                className="relative rounded-2xl aspect-4/3 lg:aspect-auto lg:h-full w-full"
                key={index}
              >
                <Image
                  src={
                    offer.bannerImageUrl ||
                    (index === 0 ? "/offers-1.webp" : "/offers-2.webp")
                  }
                  alt={offer.name || "hero slide image"}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
