"use client";

import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AccessibilitySection from "@/components/AccessibilitySection";
import TrainingsSection from "@/components/TrainingsSection";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import MissionSection from "@/components/MissionSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="bg-white font-sans text-foreground">
      <Navigation />
      <HeroSection />
      <AccessibilitySection />
      <TrainingsSection />
      <PricingSection />
      <TestimonialsSection />
      <MissionSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
