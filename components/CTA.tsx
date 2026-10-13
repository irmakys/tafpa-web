"use client";

import { motion } from "framer-motion";
import { ArrowRight, CalendarDays } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import { SplitReveal } from "./SplitReveal";
import { useDemo } from "./DemoModal";
import { TafpaLogo } from "./TafpaLogo";

export function Marquee() {
  const items = [
    "Konuşma Atölyesi",
    "Minik Sesler",
    "Dil Bahçesi",
    "Kelime Evi",
    "Mavi Dalga",
    "Akıcı Adımlar",
    "Ses Durağı",
    "Lisan Terapi",
  ];
  return (
    <div className="relative border-y border-white/[0.06] py-6 mask-fade-x">
      <div className="flex w-max animate-marquee gap-14 whitespace-nowrap">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-14 text-lg font-medium tracking-tight text-zinc-600">
            {t}
            <span className="text-zinc-800">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function CTA() {
  const { open } = useDemo();
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-28 sm:py-40">
      <div className="relative overflow-hidden rounded-[40px] border border-white/10 px-6 py-20 text-center sm:px-12 sm:py-28">
        {/* Dönen aurora */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-ink-900" />
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-1/2 -z-10 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 opacity-60 blur-[100px]"
          style={{
            background: "conic-gradient(from 0deg, #7c3aed, #22d3ee, #a3e635, #f43f5e, #7c3aed)",
          }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
        />
        <div aria-hidden className="absolute inset-[1px] -z-10 rounded-[39px] bg-ink-950/80 backdrop-blur-3xl" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-grid-fade bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,#000_10%,transparent_65%)]" />

        <span className="eyebrow">
          <CalendarDays className="h-3 w-3" /> Bu ay 5 klinik için kurulum ücretsiz
        </span>
        <h2 className="mx-auto mt-8 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-tightest text-white sm:text-7xl lg:text-8xl">
          <SplitReveal text="Kağıdı bırakın." inView />
          <br />
          <SplitReveal
            text="Markanızı büyütün."
            inView
            delay={0.25}
            wordClassName="font-serif font-normal italic text-gradient animate-shimmer-bg"
          />
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-zinc-400">
          Kliniğinizin logosu ve renkleriyle hazırlanmış uygulamayı 30 dakikalık canlı demoda görün. Kredi kartı yok,
          taahhüt yok.
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MagneticButton onClick={open} cursorLabel="Hadi" className="px-9 py-5 text-base" strength={0.45}>
            Demo talep et
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </MagneticButton>
          <a
            href="mailto:merhaba@tafpa.app"
            className="text-sm text-zinc-400 underline-offset-4 transition hover:text-white hover:underline"
          >
            ya da merhaba@tafpa.app
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative mx-auto max-w-7xl px-5 pb-10">
      <div className="flex flex-col items-start justify-between gap-8 border-t border-white/[0.06] pt-10 sm:flex-row sm:items-center">
        <div>
          <TafpaLogo />
          <p className="mt-3 max-w-xs text-sm text-zinc-500">
            Dil ve konuşma terapisi klinikleri için white-label dijital ekosistem.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-zinc-500">
          {["KVKK Aydınlatma", "Gizlilik", "Kullanım Koşulları", "İletişim"].map((l) => (
            <a key={l} href="#" className="transition hover:text-white">
              {l}
            </a>
          ))}
        </div>
      </div>
      <div className="relative mt-16 select-none overflow-hidden">
        <p className="bg-gradient-to-b from-white/[0.07] to-transparent bg-clip-text text-center text-[26vw] font-semibold leading-[0.8] tracking-tightest text-transparent">
          tafpa
        </p>
      </div>
      <p className="mt-6 text-center font-mono text-[11px] text-zinc-600">© {new Date().getFullYear()} Tafpa Teknoloji A.Ş.</p>
    </footer>
  );
}
