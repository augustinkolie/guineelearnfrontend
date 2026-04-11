import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { Features } from "@/components/Features";
import { TargetAudience } from "@/components/TargetAudience";
import { TeachersSection } from "@/components/TeachersSection";
import { MissionSection } from "@/components/MissionSection";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { AIAssistant } from "@/components/AIAssistant";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <TargetAudience />
      <TeachersSection />
      <MissionSection />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
      <AIAssistant />
    </main>
  );
}
