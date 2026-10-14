"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Fingerprint, Layers, RefreshCcw } from "lucide-react";
import { SplitReveal } from "./SplitReveal";
import { MagneticButton } from "./MagneticButton";
import { useProjectModal } from "./ProjectModal";

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroScene() {
  const root = useRef<HTMLElement>(null);
  const { open } = useProjectModal();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      gsap.set("[data-web]", { xPercent: -50, yPercent: -50 });

      if (reduce) {
        // Hareket istemeyen kullanıcı: sahneyi statik, okunaklı bir son pozda göster
        gsap.set("[data-rig]", { y: () => window.innerHeight * 0.5, scale: 0.7, rotationX: 18, rotationY: -14 });
        gsap.set("[data-web]", { x: -200, z: -160, rotationY: 16 });
        gsap.set("[data-cap-word], [data-chip]", { autoAlpha: 0 });
        return;
      }

      // Başlangıç pozu: cihaz başlığın altında, küçük ve eğik
      gsap.set("[data-rig]", { y: () => window.innerHeight * 0.5, scale: 0.62, rotationX: 34, rotationY: -28, rotationZ: 8 });
      gsap.set("[data-web]", { x: 0, z: -420, rotationY: 0, autoAlpha: 0 });
      gsap.set("[data-chip]", { autoAlpha: 0, z: -240, y: 40 });
      gsap.set("[data-cap-word]", { yPercent: 110 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=280%",
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1 — Başlık çekilir, cihaz yükselir
      tl.to("[data-copy]", { y: -140, autoAlpha: 0, duration: 1 }, 0)
        .to("[data-hint]", { autoAlpha: 0, duration: 0.3 }, 0)
        .to("[data-rig]", { y: 0, scale: 0.9, rotationX: 14, rotationY: -16, rotationZ: 2, duration: 1 }, 0)
        // 2 — Cihaz karşıya döner ve yaklaşır; arkadan web katmanı gelir
        .to("[data-rig]", { scale: 1.04, rotationX: 0, rotationY: 0, rotationZ: 0, duration: 1 }, 1)
        .to("[data-web]", { autoAlpha: 1, x: () => -Math.min(260, window.innerWidth * 0.18), z: -160, rotationY: 16, duration: 1 }, 1)
        // 3 — Açı değişir, cam katmanlar derinlikten öne süzülür
        .to("[data-rig]", { rotationY: 12, rotationX: -5, scale: 0.96, y: () => -window.innerHeight * 0.04, duration: 1 }, 2)
        .to("[data-chip]", { autoAlpha: 1, z: 140, y: 0, stagger: 0.18, duration: 0.7 }, 2)
        .to("[data-cap-word]", { yPercent: 0, stagger: 0.12, duration: 0.6 }, 2.4)
        // 4 — Kısa bekleme (nefes)
        .to({}, { duration: 0.5 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={root} className="relative h-[100svh] overflow-hidden">
      {/* BAŞLIK */}
      <div data-copy className="absolute inset-x-0 top-[13vh] z-20 flex flex-col items-center px-5 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1, ease: EASE }}
          className="eyebrow"
          lang="en"
        >
          <span className="hidden h-px w-8 shrink-0 bg-titanium-500 sm:block" />
          Tailored Digital Experiences &amp; Software Architecture
          <span className="hidden h-px w-8 shrink-0 bg-titanium-500 sm:block" />
        </motion.p>
        <h1
          className="mt-8 font-light leading-[0.9] tracking-hyper text-white"
          style={{ fontSize: "clamp(3rem, 8.2vw, 8.8rem)" }}
        >
          <SplitReveal text="Dijital Başyapıtlar" delay={0.35} />
          <br />
          <SplitReveal text="İnşa Ediyoruz." delay={0.6} wordClassName="text-gradient animate-shimmer-bg" />
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 1, ease: EASE }}
          className="mt-7 max-w-2xl text-base font-light leading-relaxed text-titanium-300 sm:text-lg"
        >
          Markanızın vizyonuna özel tasarlanmış üst düzey web sistemleri, sezgisel mobil uygulamalar ve ölçeklenebilir
          dijital altyapılar geliştiriyoruz.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 1, ease: EASE }}
          className="mt-9"
        >
          <MagneticButton onClick={() => open()} cursorLabel="Başla">
            Projenizi başlatın
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </MagneticButton>
        </motion.div>
      </div>

      {/* SAHNE */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1800px" }}>
        <motion.div
          initial={{ opacity: 0, y: 120 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1.6, ease: EASE }}
          className="preserve-3d"
        >
          <div className="preserve-3d scale-[0.52] sm:scale-[0.8] lg:scale-100">
            <div data-rig className="preserve-3d relative h-[620px] w-[304px]">
              {/* WEB KATMANI (arkada) */}
              <div
                data-web
                className="absolute left-1/2 top-1/2 h-[470px] w-[760px] overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-900/95 shadow-[0_80px_160px_-40px_rgba(0,0,0,1)]"
              >
                <WebScreen />
              </div>

              {/* TİTANYUM KASA */}
              <div className="titanium-frame relative h-full w-full rounded-[54px] p-[2px] shadow-[0_90px_140px_-40px_rgba(0,0,0,1),0_0_0_1px_rgba(255,255,255,0.06)]">
                <div className="h-full w-full rounded-[52px] bg-ink-950 p-[10px]">
                  <div className="relative h-full w-full overflow-hidden rounded-[43px] bg-[#0a0a0b]">
                    <div aria-hidden className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(118deg,rgba(255,255,255,0.09)_0%,transparent_32%,transparent_72%,rgba(255,255,255,0.03)_100%)]" />
                    <PhoneScreen />
                  </div>
                </div>
                <span className="absolute -left-[2px] top-32 h-14 w-[3px] rounded-l bg-titanium-500" />
                <span className="absolute -right-[2px] top-40 h-20 w-[3px] rounded-r bg-titanium-500" />
              </div>

              {/* CAM KATMANLAR (önde, derinlikte) */}
              <Chip className="-left-44 top-24" icon={Layers} title="Tasarım sistemi" meta="Tek kaynak, sıfır sapma" />
              <Chip className="-right-48 top-1/2" icon={RefreshCcw} title="Gerçek zamanlı senkron" meta="Mobil ↔ Web" />
              <Chip className="-left-56 bottom-28" icon={Fingerprint} title="Uçtan uca şifreleme" meta="Varsayılan olarak" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ALT YAZI */}
      <p className="pointer-events-none absolute inset-x-0 bottom-[8vh] z-20 text-center font-light tracking-tightest text-white/90" style={{ fontSize: "clamp(1.4rem, 3vw, 2.6rem)" }}>
        {["Sessiz.", "Kesin.", "Kalıcı."].map((w) => (
          <span key={w} className="-mt-[0.18em] mx-[0.2em] inline-block overflow-hidden pt-[0.18em] align-bottom">
            <span data-cap-word className="inline-block">
              {w}
            </span>
          </span>
        ))}
      </p>

      {/* KAYDIRMA İPUCU */}
      <div data-hint className="absolute bottom-10 left-5 z-20 flex flex-col items-center gap-3 sm:left-10">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-titanium-500">Kaydırın</span>
        <span className="relative h-10 w-px overflow-hidden bg-white/10">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-white"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          />
        </span>
      </div>
    </section>
  );
}

function Chip({
  className,
  icon: I,
  title,
  meta,
}: {
  className: string;
  icon: typeof Layers;
  title: string;
  meta: string;
}) {
  return (
    <div
      data-chip
      className={`absolute flex w-56 items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3.5 backdrop-blur-xl ${className}`}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
        <I className="h-4 w-4 text-titanium-200" strokeWidth={1.5} />
      </span>
      <span className="leading-tight">
        <span className="block text-[13px] text-white">{title}</span>
        <span className="block text-[11px] text-titanium-400">{meta}</span>
      </span>
    </div>
  );
}

function PhoneScreen() {
  return (
    <div className="relative flex h-full flex-col px-6 pb-6 pt-4 text-white">
      <div className="flex items-center justify-between text-[11px] font-medium text-titanium-200">
        <span>9:41</span>
        <span className="h-[26px] w-[92px] rounded-full bg-black" />
        <span className="h-2.5 w-5 rounded-[3px] border border-titanium-300" />
      </div>
      <div className="mt-10 flex items-center justify-between">
        <span lang="en" className="font-mono text-[10px] uppercase tracking-[0.3em] text-titanium-400">Atelier</span>
        <span className="h-7 w-7 rounded-full border border-white/10 bg-white/[0.04]" />
      </div>
      <p className="mt-6 text-[44px] font-extralight leading-[0.95] tracking-tightest">
        Az,
        <br />
        ama
        <br />
        <span className="text-titanium-400">kusursuz.</span>
      </p>
      <div className="mt-8 space-y-px overflow-hidden rounded-2xl border border-white/[0.06]">
        {[
          ["Prototip", "v0.9"],
          ["Tasarım sistemi", "412 token"],
          ["Yayın", "Hazır"],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between bg-white/[0.025] px-4 py-3 text-[12px]">
            <span className="text-titanium-200">{k}</span>
            <span className="font-mono text-[10px] text-titanium-400">{v}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between rounded-full border border-white/[0.06] bg-white/[0.03] p-1.5">
        <span className="rounded-full bg-white px-4 py-2 text-[11px] font-medium text-ink-950">Başlat</span>
        <span className="pr-3 font-mono text-[10px] text-titanium-500">01 / 04</span>
      </div>
      <span className="mx-auto mt-4 h-1 w-28 rounded-full bg-white/30" />
    </div>
  );
}

function WebScreen() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-10 items-center gap-2 border-b border-white/[0.06] px-4">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-2.5 w-2.5 rounded-full bg-white/[0.12]" />
        ))}
        <span className="mx-auto rounded-md border border-white/[0.06] px-16 py-1 font-mono text-[10px] text-titanium-500">
          tafpa.company
        </span>
      </div>
      <div className="flex flex-1">
        <div className="w-44 space-y-2 border-r border-white/[0.06] p-4">
          {["Genel bakış", "Ürünler", "Sistemler", "Ekip", "Ayarlar"].map((l, i) => (
            <div key={l} className={`rounded-lg px-3 py-2 text-[11px] ${i === 0 ? "bg-white/[0.06] text-white" : "text-titanium-500"}`}>
              {l}
            </div>
          ))}
        </div>
        <div className="flex-1 p-6">
          <p className="text-[26px] font-extralight tracking-tightest text-white">Genel bakış</p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {["Çalışma süresi", "Yanıt", "Dağıtım"].map((k, i) => (
              <div key={k} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                <p className="text-[10px] text-titanium-500">{k}</p>
                <p className="mt-1 text-lg font-light text-white">{["%99.99", "38 ms", "Günlük"][i]}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <svg viewBox="0 0 400 90" className="h-24 w-full">
              <path d="M0 70 C 50 66, 70 50, 110 54 S 180 30, 230 36 S 320 14, 400 10" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" />
              <path d="M0 80 C 60 78, 90 70, 140 72 S 230 58, 280 60 S 350 48, 400 46" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
