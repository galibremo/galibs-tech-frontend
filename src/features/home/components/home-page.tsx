import FeaturedCategories from "./featured-categories";
import FeaturedProducts from "./featured-products";
import HeroSection from "./hero-secntion";
import HomeHighlights from "./home-highlights";
import NewArrivalProducts from "./new-arrival-products";
import TopBrands from "./top-brands";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <HomeHighlights />
      <FeaturedCategories />
      <FeaturedProducts />
      <NewArrivalProducts />
      <TopBrands />
    </div>
  );
}


