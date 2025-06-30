"use client";
import HeroSection from "@/components/ui/HeroSection";
import FeaturesSection from "@/components/ui/FeaturesSection";
import FeaturedProfilesSection from "@/components/ui/FeaturedProfileSection";
import TestimonialsSection from "@/components/ui/TestimonialsSection";
import CTAPromoSection from "@/components/ui/CTAPromoSection";

export default function HomePage() {

  return (
    <div className="min-h-screen h-full bg-background text-foreground">

      <HeroSection/>

      <FeaturesSection/>

      <FeaturedProfilesSection/>

      <TestimonialsSection/>

      <CTAPromoSection/>

      {/* <section className="py-20 px-6 md:px-20 bg-muted dark:bg-[#0A0011] text-center">
        <h2 className="text-3xl font-semibold mb-4">Ready to share your talent with the world?</h2>
        <Link href={`${isProfileCreated ? '/profile/view' : '/profile/create'}`}>
          <Button size="lg">Create Your Profile</Button>
        </Link>
      </section> */}
    </div>
  );
}
