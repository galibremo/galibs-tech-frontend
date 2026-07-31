import BentoGrid from "@/features/landing/components/bento-grid";
import FAQAccordion from "@/features/landing/components/faq-accordion";
import Footer from "@/features/landing/components/footer";
import Hero from "@/features/landing/components/hero";
import InteractiveContactForm from "@/features/landing/components/interactive-contact-form";
import Pricing from "@/features/landing/components/pricing";
import JsonLd from "@/features/landing/components/json-ld";
import Navbar from "@/features/landing/components/navbar";
import TimelineRoadmap from "@/features/landing/components/timeline-roadmap";

export default function LandingPage() {
  return (
    <>
      <JsonLd />
      <div className="bg-slate-950 min-h-screen text-gray-100 flex flex-col font-sans">
        <Navbar />
        <main>
          <Hero />
          <BentoGrid />
          <Pricing />
          <TimelineRoadmap />
          <FAQAccordion />
          <InteractiveContactForm />
        </main>
        <Footer />
      </div>
    </>
  );
}
