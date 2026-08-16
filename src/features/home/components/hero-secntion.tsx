"use client";

import { Container } from "@/components/custom-ui/container";
import { usePromotionalDataQuery } from "../actions/home.queries";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";

export default function HeroSection() {
  const { data: promotionalData } = usePromotionalDataQuery();
  const heroSectionData = promotionalData?.heroSlides;
  const offerSEctionData = promotionalData?.offers;

  return (
    <Container className="p-3 sm:p-4.5 lg:p-6 xl:py-8">
      <div className="flex flex-col lg:flex-row gap-3 sm:gap-4.5 lg:gap-6">
        <Carousel className="w-full lg:w-[75%]">
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
        </Carousel>
        <div className="flex flex-row lg:flex-col items-center gap-3 sm:gap-4.5 lg:gap-6 w-full lg:w-[25%]">
          {offerSEctionData?.slice(0, 2).map((offer, index) => (
            <div
              className="relative rounded-2xl aspect-4/3 lg:aspect-auto lg:h-full w-full"
              key={index}
            >
              <Image
                src={offer.bannerImageUrl || "/offers-1.webp"}
                alt={offer.name || "hero slide image"}
                fill
                className="rounded-lg object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
