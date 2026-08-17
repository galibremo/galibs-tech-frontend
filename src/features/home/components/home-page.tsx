import FeaturedCategories from "./featured-categories";
import FeaturedProducts from "./featured-products";
import HeroSection from "./hero-secntion";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
    </div>
  );
}


