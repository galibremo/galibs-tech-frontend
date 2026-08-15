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

  return (
    <Container className="py-4 sm:py-6 xl:py-10 px-4 sm:px-6">
      <Carousel className="w-full">
        <CarouselContent>
          {heroSectionData?.map((slides, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-video lg:aspect-20/9 p-1">
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
    </Container>
  );
}
