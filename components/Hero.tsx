"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";
import { SplitReveal } from "./SplitReveal";
import { MagneticButton } from "./MagneticButton";
import { WhiteLabelSimulator } from "./WhiteLabelSimulator";
import { useDemo } from "./DemoModal";
import { useLenis } from "./SmoothScroll";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { open } = useDemo();
  const lenis = useLenis();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to("[data-hero-copy]", {
        yPercent: -18,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hero-device]", {
        yPercent: 10,
        scale: 0.94,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative mx-auto grid min-h-[100svh] max-w-7xl items-center gap-6 px-5 pb-16 pt-32 lg:grid-cols-[1.05fr_1fr] lg:gap-4 lg:pt-28">
      <div data-hero-copy className="relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="eyebrow"
        >
          <Sparkles className="h-3 w-3 text-violet-300" />
          DKT klinikleri için white-label altyapı
        </motion.span>

        <h1 className="mt-7 text-[13vw] font-semibold leading-[0.92] tracking-tightest text-white sm:text-7xl lg:text-[5.6rem]">
          <SplitReveal text="Kliniğiniz," delay={0.25} mode="chars" stagger={0.03} />
          <br />
          <SplitReveal
            text="kendi markasıyla"
            delay={0.55}
            wordClassName="font-serif font-normal italic text-gradient animate-shimmer-bg pr-[0.06em]"
          />
          <br />
          <SplitReveal text="cebinizde." delay={0.8} mode="chars" stagger={0.03} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 1.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg"
        >
          Kliniklerinizi <span className="text-zinc-200">kağıt ve WhatsApp karmaşasından</span> kurtaran,{" "}
          <span className="text-zinc-200">kendi markanızla</span> danışanlarınıza ulaşan yeni nesil terapi ekosistemi.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35, type: "spring", stiffness: 120, damping: 16 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <MagneticButton onClick={open} cursorLabel="Demo">
            Ücretsiz demo talep et
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </MagneticButton>
          <MagneticButton
            variant="ghost"
            onClick={() => lenis?.scrollTo("#karsilastirma", { offset: -40, duration: 1.8 })}
          >
            <PlayCircle className="h-4 w-4" />
            Nasıl çalışır?
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7 }}
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-zinc-500"
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400/80" /> KVKK uyumlu altyapı
          </span>
          <span className="h-3 w-px bg-white/10" />
          <span>App Store & Google Play'de kendi adınızla</span>
          <span className="h-3 w-px bg-white/10" />
          <span>14 günde yayında</span>
        </motion.div>
      </div>

      <div data-hero-device className="relative">
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 60, damping: 16 }}
        className="relative"
      >
        <WhiteLabelSimulator />
      </motion.div>
      </div>
    </section>
  );
}
