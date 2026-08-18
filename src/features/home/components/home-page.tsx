import FeaturedCategories from "./featured-categories";
import FeaturedProducts from "./featured-products";
import HeroSection from "./hero-secntion";
import NewArrivalProducts from "./new-arrival-products";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <NewArrivalProducts />
    </div>
  );
}



