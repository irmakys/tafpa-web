import { SmoothScroll } from "@/components/SmoothScroll";
import { AmbientBackground } from "@/components/AmbientBackground";
import { MagneticCursor } from "@/components/MagneticCursor";
import { ProjectModalProvider } from "@/components/ProjectModal";
import { Navbar } from "@/components/Navbar";
import { HeroScene } from "@/components/HeroScene";
import { Manifesto } from "@/components/Manifesto";
import { Capabilities } from "@/components/Capabilities";
import { Access } from "@/components/Access";

export default function Page() {
  return (
    <SmoothScroll>
      <ProjectModalProvider>
        <AmbientBackground />
        <MagneticCursor />
        <Navbar />
        <main className="relative z-10 overflow-x-clip">
          <HeroScene />
          <Manifesto />
          <Capabilities />
          <Access />
        </main>
      </ProjectModalProvider>
    </SmoothScroll>
  );
}
