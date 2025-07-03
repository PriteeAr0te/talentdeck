"use client";
import HeroSection from "@/components/ui/HeroSection";
import FeaturesSection from "@/components/ui/FeaturesSection";
import FeaturedProfilesSection from "@/components/ui/FeaturedProfileSection";
// import TestimonialsSection from "@/components/ui/TestimonialsSection";
import CTAPromoSection from "@/components/ui/CTAPromoSection";

export default function HomePage() {

  return (
    <div className="min-h-screen h-full bg-background text-foreground">

      <HeroSection/>

      <FeaturesSection/>

      <FeaturedProfilesSection/>

      {/* <TestimonialsSection/> */}

      <CTAPromoSection/>

    </div>
  );
}
