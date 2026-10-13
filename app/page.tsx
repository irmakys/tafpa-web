import { SmoothScroll } from "@/components/SmoothScroll";
import { AmbientBackground } from "@/components/AmbientBackground";
import { MagneticCursor } from "@/components/MagneticCursor";
import { DemoModalProvider } from "@/components/DemoModal";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { BeforeAfter } from "@/components/BeforeAfter";
import { BentoGrid } from "@/components/BentoGrid";
import { VoiceSpectrum } from "@/components/VoiceSpectrum";
import { ScrollStory } from "@/components/ScrollStory";
import { CTA, Footer, Marquee } from "@/components/CTA";

export default function Page() {
  return (
    <SmoothScroll>
      <DemoModalProvider>
        <AmbientBackground />
        <MagneticCursor />
        <Navbar />
        <main id="top" className="relative z-10 overflow-x-clip">
          <Hero />
          <Marquee />
          <BeforeAfter />
          <BentoGrid />
          <VoiceSpectrum />
          <ScrollStory />
          <CTA />
        </main>
        <Footer />
      </DemoModalProvider>
    </SmoothScroll>
  );
}
