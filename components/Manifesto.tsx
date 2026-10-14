"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  "Hazır şablonlar değil,",
  "iş modelinize tam uyum sağlayan",
  "mühendislik harikaları.",
  "Her pikselde tasarım estetiği,",
  "her satır kodda tavizsiz performans.",
];

const PRINCIPLES = [
  ["01", "Az, ama kusursuz.", "Bir özelliği eklemek kolaydır; vazgeçmek ustalık ister."],
  ["02", "Hız bir tasarım kararıdır.", "Performans sonradan eklenmez, ilk çizgide başlar."],
  ["03", "Sessiz güven.", "Güvenlik ve erişilebilirlik vitrin değil, temeldir."],
];

export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-mword]",
        { yPercent: 110 },
        {
          yPercent: 0,
          ease: "none",
          stagger: 0.06,
          scrollTrigger: { trigger: "[data-mtext]", start: "top 85%", end: "bottom 55%", scrub: 1 },
        }
      );
      gsap.fromTo(
        "[data-principle]",
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.12,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-principles]", start: "top 85%" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="manifesto" ref={root} className="relative mx-auto max-w-[1400px] px-5 py-[22vh] sm:px-10">
      <p className="eyebrow">
        <span className="h-px w-8 bg-titanium-500" /> Manifesto · Vizyon
      </p>

      <h2
        data-mtext
        className="mt-12 font-light leading-[1.02] tracking-hyper text-white"
        style={{ fontSize: "clamp(2.1rem, 5.4vw, 5.8rem)" }}
      >
        {LINES.map((line, li) => (
          <span key={li} className={`block ${li === 1 || li === 4 ? "text-titanium-400" : ""}`}>
            {line.split(" ").map((w, wi) => (
              <span key={wi} className="-mt-[0.18em] mr-[0.22em] inline-block overflow-hidden pb-[0.06em] pt-[0.18em] align-bottom">
                <span data-mword className="inline-block will-change-transform">
                  {w}
                </span>
              </span>
            ))}
          </span>
        ))}
      </h2>

      <div data-principles className="mt-[16vh] grid border-t border-white/[0.08] md:grid-cols-3">
        {PRINCIPLES.map(([n, t, d], i) => (
          <div
            key={n}
            data-principle
            className={`py-10 md:px-10 md:py-12 ${i > 0 ? "border-t border-white/[0.08] md:border-l md:border-t-0" : "md:pl-0"}`}
          >
            <p className="font-mono text-[11px] tracking-[0.25em] text-titanium-500">{n}</p>
            <p className="mt-6 text-2xl font-light tracking-tight text-white">{t}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-titanium-400">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
