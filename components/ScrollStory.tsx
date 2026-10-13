"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Brush, Rocket, Smartphone, Users } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const manifesto =
  "Terapi seansta bitmez. Asıl dönüşüm evde, iki seans arasındaki sessiz günlerde olur. Tafpa, o günleri kliniğinizin markasıyla doldurur — kağıtsız, kaybolmayan, ölçülebilir.";

const steps = [
  { icon: Brush, day: "Gün 1–3", title: "Marka kurulumu", text: "Logo, renk paleti, uygulama adı ve mağaza görselleri kliniğinize göre hazırlanır." },
  { icon: Users, day: "Gün 4–7", title: "Veri taşıma", text: "Danışan listeniz, terapistleriniz ve takviminiz WhatsApp/Excel'den güvenle aktarılır." },
  { icon: Smartphone, day: "Gün 8–12", title: "Mağaza yayını", text: "Uygulamanız App Store ve Google Play'de kendi kliniğinizin adıyla yayına girer." },
  { icon: Rocket, day: "Gün 13–14", title: "Ekip eğitimi", text: "Terapist ve sekreterlere canlı eğitim; velilere hazır davet mesajları." },
];

const stats = [
  { v: 92, s: "%", l: "ödev tamamlanma oranı" },
  { v: 6, s: " sa", l: "haftalık idari zaman tasarrufu" },
  { v: 3, s: "x", l: "daha az seans iptali" },
  { v: 14, s: " gün", l: "kurulumdan mağazaya" },
];

export function ScrollStory() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      // 1) Manifesto: kelimeler kaydırmayla aydınlanır
      gsap.fromTo(
        "[data-word]",
        { opacity: 0.12, filter: "blur(2px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.08,
          ease: "none",
          scrollTrigger: { trigger: "[data-manifesto]", start: "top 75%", end: "bottom 45%", scrub: true },
        }
      );

      // 2) Sayaçlar
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = Math.round(obj.v).toString();
          },
        });
      });

      // 3) Yatay pin (yalnız masaüstü)
      mm.add("(min-width: 1024px)", () => {
        const track = root.current?.querySelector<HTMLElement>("[data-track]");
        const pin = root.current?.querySelector<HTMLElement>("[data-pin]");
        if (!track || !pin) return;
        const distance = () => track.scrollWidth - window.innerWidth + 80;
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        gsap.to("[data-progress]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: pin, start: "top top", end: () => `+=${distance()}`, scrub: true },
        });
      });
    }, root);
    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={root}>
      {/* MANİFESTO */}
      <section className="relative mx-auto max-w-6xl px-5 py-28 sm:py-40">
        <p data-manifesto className="text-3xl font-medium leading-[1.2] tracking-tight text-white sm:text-5xl lg:text-[3.6rem]">
          {manifesto.split(" ").map((w, i) => (
            <span key={i} data-word className="inline-block pr-[0.25em]">
              {w}
            </span>
          ))}
        </p>

        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.06] lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="bg-ink-950/80 p-6 backdrop-blur sm:p-8">
              <p className="text-4xl font-semibold tracking-tightest text-white sm:text-6xl">
                <span data-count={s.v}>0</span>
                <span className="text-zinc-500">{s.s}</span>
              </p>
              <p className="mt-2 text-sm text-zinc-500">{s.l}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-right font-mono text-[10px] text-zinc-600">* Pilot klinik ortalamaları</p>
      </section>

      {/* YATAY AKIŞ */}
      <section data-pin className="relative overflow-hidden py-24 lg:flex lg:h-screen lg:items-center lg:py-0">
        <div data-track className="flex flex-col gap-5 px-5 lg:flex-row lg:gap-6 lg:pl-[8vw] lg:pr-[8vw]">
          <div className="shrink-0 lg:w-[34vw]">
            <span className="eyebrow">04 — Kurulum</span>
            <h2 className="section-title mt-6">
              14 günde,
              <br />
              <span className="font-serif font-normal italic text-amber-200">kendi uygulamanız.</span>
            </h2>
            <p className="mt-6 max-w-sm text-zinc-400">Teknik ekip gerekmez. Biz kurarız, siz terapiye odaklanırsınız.</p>
            <div className="mt-10 hidden h-px w-64 bg-white/10 lg:block">
              <div data-progress className="h-px origin-left scale-x-0 bg-gradient-to-r from-violet-400 to-cyan-300" />
            </div>
          </div>

          {steps.map((s, i) => (
            <article
              key={s.title}
              className="glass group relative flex shrink-0 flex-col justify-between overflow-hidden rounded-[28px] p-7 lg:h-[62vh] lg:w-[30vw] lg:p-10"
            >
              <span className="pointer-events-none absolute -right-4 -top-10 select-none text-[11rem] font-semibold leading-none tracking-tightest text-white/[0.03] transition-colors duration-700 group-hover:text-white/[0.06]">
                {i + 1}
              </span>
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
                  <s.icon className="h-5 w-5 text-white" />
                </span>
                <span className="font-mono text-xs text-zinc-500">{s.day}</span>
              </div>
              <div className="mt-16">
                <h3 className="text-2xl font-semibold tracking-tight text-white lg:text-3xl">{s.title}</h3>
                <p className="mt-3 text-zinc-400">{s.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
