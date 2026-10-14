"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitReveal } from "./SplitReveal";

gsap.registerPlugin(ScrollTrigger);

type Cap = {
  title: string;
  kicker: string;
  text: string;
  points: string[];
  visual: React.ReactNode;
};

const CAPS: Cap[] = [
  {
    title: "Özel Mobil Uygulama Geliştirme",
    kicker: "Bespoke Mobile Apps · iOS & Android",
    text: "iOS ve Android için kusursuz akıcılıkta, native hissi veren uygulamalar. Markanızın ritmine göre tasarlanır, mağaza standartlarında yayına alınır.",
    points: ["iOS & Android · Swift, Kotlin, React Native", "Kusursuz akıcılık, native his", "Mağaza yayını & sürüm yönetimi"],
    visual: <MobileVisual />,
  },
  {
    title: "Yüksek Performanslı Web Mimarisi",
    kicker: "High-Performance Web Architecture",
    text: "Next.js üzerinde, mikro-etkileşimlerle zenginleşen ve global ölçekte aynı hızla çalışan web platformları. İlk kullanıcıdan milyonuncusuna tavizsiz.",
    points: ["Next.js · React · Node.js", "Mikro-etkileşimler & hareket tasarımı", "Global ölçek, edge altyapı & CI/CD"],
    visual: <WebVisual />,
  },
  {
    title: "Kurumsal Çözümler & White-Label Altyapılar",
    kicker: "Enterprise & White-Label Infrastructure",
    text: "Sektörel SaaS ürünleri, iş süreçlerini hızlandıran otomasyonlar ve güvenli bulut mimarisi. Tek çekirdek üzerinde, her markaya kendi kimliğiyle.",
    points: ["Sektörel SaaS & multi-tenant mimari", "Otomasyon & entegrasyonlar", "Güvenli bulut mimarisi & rol bazlı yetki"],
    visual: <PlatformVisual />,
  },
];

export function Capabilities() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-cap]", root.current);
      const stage = root.current?.querySelector<HTMLElement>("[data-cap-stage]");
      if (!stage || cards.length < 2) return;

      gsap.set(cards.slice(1), { yPercent: 105 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${window.innerHeight * (cards.length - 1) * 1.1}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      cards.forEach((card, i) => {
        const visual = card.querySelector("[data-cap-visual]");
        // Aktif kartın görseli kaydırmayla açı değiştirir
        if (visual) tl.fromTo(visual, { rotationY: -14, rotationX: 8 }, { rotationY: 10, rotationX: -4, duration: 1 }, i === 0 ? 0 : i - 0.5);
        if (i === 0) return;
        tl.to(card, { yPercent: 0, duration: 1 }, i - 1).to(
          cards[i - 1],
          { scale: 0.9, autoAlpha: 0.25, filter: "blur(4px)", duration: 1 },
          i - 1
        );
        // İki önceki kart tamamen çekilir; arka planda hayalet metin kalmaz
        if (cards[i - 2]) tl.to(cards[i - 2], { autoAlpha: 0, duration: 0.6 }, i - 1);
      });
    });
    return () => mm.revert();
  }, []);

  // Kart üzerinde fareyi izleyen spot ışık
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--sx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };

  return (
    <section id="kabiliyetler" ref={root} className="relative">
      <div className="mx-auto max-w-[1400px] px-5 pb-[10vh] sm:px-10">
        <p className="eyebrow">
          <span className="h-px w-8 bg-titanium-500" /> Kabiliyetler
        </p>
        <h2 className="section-title mt-10">
          <SplitReveal text="Üç odak." inView />
          <br />
          <SplitReveal text="Tek standart." inView delay={0.15} wordClassName="text-titanium-400" />
        </h2>
      </div>

      <div data-cap-stage className="relative px-3 pb-10 sm:px-6 md:h-[100svh] md:pb-0">
        <div className="relative flex flex-col gap-4 md:block md:h-full md:py-6">
          {CAPS.map((c, i) => (
            <article
              key={c.title}
              data-cap
              onPointerMove={onMove}
              className="group relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-ink-900 md:absolute md:inset-y-6 md:inset-x-0"
              style={{ zIndex: i + 1 }}
            >
              {/* Spot ışık */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{ background: "radial-gradient(600px circle at var(--sx,50%) var(--sy,50%), rgba(255,255,255,0.06), transparent 60%)" }}
              />
              <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

              <div className="relative grid h-full gap-10 p-7 sm:p-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:p-16">
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 font-mono text-[11px] tracking-[0.25em] text-titanium-500">
                      <span>0{i + 1}</span>
                      <span className="h-px w-10 bg-white/15" />
                      <span>0{CAPS.length}</span>
                    </div>
                    <h3
                      className="mt-8 max-w-[14ch] font-light leading-[0.98] tracking-hyper text-white"
                      style={{ fontSize: "clamp(2.2rem, 4.4vw, 4.6rem)" }}
                    >
                      {c.title}
                    </h3>
                    <p lang="en" className="mt-5 font-mono text-xs uppercase tracking-[0.22em] text-titanium-400">
                      {c.kicker}
                    </p>
                    <p className="mt-8 max-w-md leading-relaxed text-titanium-300">{c.text}</p>
                  </div>
                  <ul className="mt-10 border-t border-white/[0.08]">
                    {c.points.map((p) => (
                      <li key={p} className="flex items-center justify-between border-b border-white/[0.08] py-4 text-sm text-titanium-200">
                        {p}
                        <span className="h-1 w-1 rounded-full bg-titanium-500 transition-colors duration-500 group-hover:bg-white" />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative hidden items-center justify-center lg:flex" style={{ perspective: "1400px" }}>
                  <div data-cap-visual className="preserve-3d">
                    {c.visual}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Monokrom görseller ---------- */

function MobileVisual() {
  return (
    <div className="preserve-3d relative h-[440px] w-[420px]">
      {[
        { x: -120, z: -140, o: 0.35 },
        { x: 120, z: -140, o: 0.35 },
        { x: 0, z: 0, o: 1 },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 h-[400px] w-[196px]"
          style={{ transform: `translate(-50%,-50%) translateX(${p.x}px) translateZ(${p.z}px)`, opacity: p.o }}
        >
          {i === 2 ? (
            <div className="titanium-frame h-full w-full rounded-[38px] p-[2px]">
              <div className="h-full w-full rounded-[36px] bg-ink-950 p-[7px]">
                <div className="flex h-full w-full flex-col rounded-[30px] bg-[#0b0b0c] p-5">
                  <span className="mx-auto h-4 w-16 rounded-full bg-black" />
                  <p className="mt-8 text-3xl font-extralight leading-none tracking-tightest text-white">
                    Merhaba,
                    <br />
                    <span className="text-titanium-400">Deniz.</span>
                  </p>
                  <div className="mt-6 space-y-2">
                    {[0, 1, 2].map((k) => (
                      <div key={k} className="h-11 rounded-xl border border-white/[0.06] bg-white/[0.025]" />
                    ))}
                  </div>
                  <span className="mt-auto rounded-full bg-white py-2 text-center text-[11px] font-medium text-ink-950">Devam</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full w-full rounded-[38px] border border-white/20" />
          )}
        </div>
      ))}
    </div>
  );
}

function WebVisual() {
  const nodes = [
    { x: 210, y: 40, l: "Client" },
    { x: 60, y: 160, l: "Edge" },
    { x: 360, y: 160, l: "CDN" },
    { x: 210, y: 220, l: "API" },
    { x: 80, y: 340, l: "Queue" },
    { x: 210, y: 380, l: "Postgres" },
    { x: 340, y: 340, l: "Cache" },
  ];
  const links = [
    [0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [3, 6], [6, 5],
  ];
  return (
    <svg viewBox="0 0 420 420" className="h-[440px] w-[440px] overflow-visible">
      {links.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1"
          strokeDasharray="4 6"
          className="animate-dash"
        />
      ))}
      {nodes.map((n, i) => (
        <g key={n.l} transform={`translate(${n.x} ${n.y})`}>
          <rect x={-46} y={-17} width={92} height={34} rx={17} fill={i === 3 ? "#ffffff" : "#0e0e0f"} stroke="rgba(255,255,255,0.18)" />
          <text
            textAnchor="middle"
            dy="4"
            className="font-mono"
            fontSize="11"
            letterSpacing="1.5"
            fill={i === 3 ? "#050505" : "rgba(255,255,255,0.75)"}
          >
            {n.l.toUpperCase()}
          </text>
        </g>
      ))}
    </svg>
  );
}

function PlatformVisual() {
  const layers = ["Tenant · C", "Tenant · B", "Tenant · A", "Core"];
  return (
    <div className="preserve-3d relative h-[440px] w-[440px]">
      <div className="preserve-3d absolute inset-0" style={{ transform: "rotateX(58deg) rotateZ(-38deg)" }}>
        {layers.map((l, i) => {
          const core = i === layers.length - 1;
          return (
            <div
              key={l}
              className={`absolute left-1/2 top-1/2 grid h-56 w-56 place-items-end rounded-3xl border p-4 transition-transform duration-700 ${
                core ? "border-white/40 bg-white/[0.1]" : "border-white/15 bg-white/[0.03]"
              }`}
              style={{ transform: `translate(-50%,-50%) translateZ(${(layers.length - 1 - i) * 56}px)` }}
            >
              <span className={`font-mono text-[10px] tracking-[0.2em] ${core ? "text-white" : "text-titanium-400"}`}>{l.toUpperCase()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
