"use client";
import HeroSection from "@/components/ui/HeroSection";
import FeaturesSection from "@/components/ui/FeaturesSection";
import FeaturedProfilesSection from "@/components/ui/FeaturedProfileSection";
import CTAPromoSection from "@/components/ui/CTAPromoSection";
import Seo from "@/components/layout/Seo";

export default function HomePage() {

  return (
    <>
      <Seo />

      <div className="min-h-screen h-full bg-background text-foreground">

        <HeroSection />

        <FeaturesSection />

        <FeaturedProfilesSection />

        {/* <TestimonialsSection/> */}

        <CTAPromoSection />

      </div>
    </>
  );
}
