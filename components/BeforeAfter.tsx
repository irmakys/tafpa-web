"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  AlertTriangle,
  CalendarCheck2,
  Check,
  CheckCheck,
  ChevronsLeftRight,
  FileWarning,
  Mic,
  Play,
  Receipt,
  Sparkles,
} from "lucide-react";
import { SplitReveal } from "./SplitReveal";

export function BeforeAfter() {
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { once: true, margin: "-25% 0px" });
  const raw = useMotionValue(50);
  const pos = useSpring(raw, { stiffness: 300, damping: 34 });
  const clip = useMotionTemplate`inset(0 ${useTransform(pos, (v) => 100 - v)}% 0 0)`;
  const left = useMotionTemplate`${pos}%`;
  const chaosOpacity = useTransform(pos, [5, 30], [0, 1]);
  const orderOpacity = useTransform(pos, [70, 95], [1, 0]);
  const [dragging, setDragging] = useState(false);

  // Görünür olunca kullanıcıya "sürüklenebilir" ipucu ver
  useEffect(() => {
    if (!inView) return;
    const seq = async () => {
      await animate(raw, 72, { duration: 0.9, ease: [0.65, 0, 0.35, 1] });
      await animate(raw, 30, { duration: 1, ease: [0.65, 0, 0.35, 1] });
      await animate(raw, 50, { duration: 0.8, ease: [0.65, 0, 0.35, 1] });
    };
    seq();
  }, [inView, raw]);

  const setFromX = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    raw.set(Math.min(98, Math.max(2, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <section id="karsilastirma" className="relative mx-auto max-w-7xl px-5 py-28 sm:py-36">
      <div className="mb-14 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <span className="eyebrow">01 — Dönüşüm</span>
          <h2 className="section-title mt-6 max-w-3xl">
            <SplitReveal text="WhatsApp kaosundan" inView />
            <br />
            <SplitReveal
              text="Tafpa düzenine."
              inView
              delay={0.2}
              wordClassName="font-serif font-normal italic text-violet-300"
            />
          </h2>
        </div>
        <p className="max-w-sm text-zinc-400">
          Çizgiyi sürükleyin. Sol tarafta bugün çoğu kliniğin yaşadığı dağınıklık, sağda aynı günün Tafpa ile hali.
        </p>
      </div>

      <div
        ref={box}
        role="slider"
        tabIndex={0}
        aria-label="Önce / sonra karşılaştırması"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(raw.get())}
        data-cursor-label="Sürükle"
        onPointerDown={(e) => {
          (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
          setDragging(true);
          setFromX(e.clientX);
        }}
        onPointerMove={(e) => dragging && setFromX(e.clientX)}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") raw.set(Math.max(2, raw.get() - 5));
          if (e.key === "ArrowRight") raw.set(Math.min(98, raw.get() + 5));
        }}
        className="relative h-[620px] select-none overflow-hidden rounded-[32px] border border-white/10 outline-none [touch-action:pan-y] focus-visible:ring-2 focus-visible:ring-violet-400 sm:h-[560px]"
      >
        {/* SONRA — Tafpa düzeni (alt katman) */}
        <OrderLayer />
        <motion.div style={{ opacity: orderOpacity }} className="pointer-events-none absolute right-5 top-5 z-20">
          <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-zinc-950">
            <Sparkles className="h-3.5 w-3.5" /> Sonra · Tafpa
          </span>
        </motion.div>

        {/* ÖNCE — WhatsApp kaosu (üst katman, kırpılır) */}
        <motion.div style={{ clipPath: clip }} className="absolute inset-0 z-10">
          <ChaosLayer />
        </motion.div>
        <motion.div style={{ opacity: chaosOpacity }} className="pointer-events-none absolute left-5 top-5 z-20">
          <span className="flex items-center gap-1.5 rounded-full bg-rose-500/90 px-3 py-1.5 text-xs font-semibold text-white">
            <AlertTriangle className="h-3.5 w-3.5" /> Önce · WhatsApp
          </span>
        </motion.div>

        {/* Ayırıcı & tutamak */}
        <motion.div style={{ left }} className="pointer-events-none absolute inset-y-0 z-30 -translate-x-1/2">
          <div className="h-full w-px bg-gradient-to-b from-transparent via-white to-transparent shadow-[0_0_20px_2px_rgba(255,255,255,0.5)]" />
          <motion.div
            animate={{ scale: dragging ? 1.15 : 1 }}
            className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-white/15 text-white shadow-2xl backdrop-blur-xl"
          >
            <ChevronsLeftRight className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- KAOS ---------------- */

const bubbles = [
  { t: "Hocam yarınki seansı 5'e alabilir miyiz??", x: "4%", y: "16%", r: -4, w: "me" },
  { t: "🎤 Sesli mesaj · 2:47", x: "28%", y: "8%", r: 3, w: "them", voice: true },
  { t: "Ödev kağıdını kaybettik, tekrar atar mısınız 🙏", x: "52%", y: "20%", r: -2, w: "them" },
  { t: "Ela'nın videosu (48 MB) — gönderilemedi", x: "8%", y: "44%", r: 5, w: "them", err: true },
  { t: "Fatura kesildi mi? Geçen ayki?", x: "62%", y: "46%", r: 4, w: "them" },
  { t: "Salı 16:00 Ali → Çarşamba? Yoksa Emre miydi?", x: "34%", y: "58%", r: -6, w: "me" },
  { t: "🎤 Sesli mesaj · 0:31", x: "70%", y: "72%", r: -3, w: "them", voice: true },
  { t: "Hangi hafta hangi ödevdeydik 😅", x: "6%", y: "76%", r: 2, w: "them" },
];

const notes = [
  { t: "Seans iptali – Kerem\n(kime söyledim?)", x: "40%", y: "34%", r: 8, c: "bg-yellow-200" },
  { t: "Veli onam formu\nimzalanmadı!", x: "82%", y: "10%", r: -9, c: "bg-rose-200" },
  { t: "/s/ sesi\nödev 3 ??", x: "22%", y: "84%", r: -5, c: "bg-amber-200" },
];

function ChaosLayer() {
  return (
    <div className="absolute inset-0 bg-[#0b141a]">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0), radial-gradient(circle at 12px 12px, #fff 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(244,63,94,0.18),transparent_60%)]" />

      {/* Okunmamış rozetleri */}
      {[
        { n: 37, x: "18%", y: "34%" },
        { n: 112, x: "48%", y: "6%" },
        { n: 9, x: "88%", y: "60%" },
      ].map((b, i) => (
        <motion.span
          key={i}
          className="absolute grid h-7 min-w-7 place-items-center rounded-full bg-[#25d366] px-2 text-xs font-bold text-[#0b141a] shadow-lg"
          style={{ left: b.x, top: b.y }}
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.3 }}
        >
          {b.n}
        </motion.span>
      ))}

      {bubbles.map((b, i) => (
        <motion.div
          key={i}
          className="absolute max-w-[230px]"
          style={{ left: b.x, top: b.y, rotate: b.r }}
          animate={{ y: [0, i % 2 ? -6 : 6, 0], x: [0, i % 3 ? 3 : -3, 0] }}
          transition={{ repeat: Infinity, duration: 2.4 + (i % 4) * 0.6, ease: "easeInOut" }}
        >
          <div
            className={`rounded-xl px-3 py-2 text-[13px] leading-snug shadow-xl ${
              b.w === "me" ? "bg-[#005c4b] text-white" : "bg-[#202c33] text-zinc-100"
            } ${b.err ? "ring-1 ring-rose-400/70" : ""}`}
          >
            {b.voice ? (
              <span className="flex items-center gap-2">
                <Play className="h-3.5 w-3.5 fill-current" />
                <span className="flex h-4 items-center gap-[2px]">
                  {Array.from({ length: 18 }).map((_, k) => (
                    <span key={k} className="w-[2px] rounded bg-zinc-400" style={{ height: `${20 + ((k * 37) % 80)}%` }} />
                  ))}
                </span>
                <span className="text-[11px] text-zinc-400">{b.t.split("· ")[1]}</span>
              </span>
            ) : (
              b.t
            )}
            <span className="ml-2 inline-flex translate-y-0.5 items-center gap-0.5 text-[10px] text-zinc-400">
              23:4{i} {b.w === "me" && <CheckCheck className="h-3 w-3" />}
              {b.err && <FileWarning className="h-3 w-3 text-rose-400" />}
            </span>
          </div>
        </motion.div>
      ))}

      {notes.map((n, i) => (
        <motion.div
          key={i}
          className={`absolute w-36 whitespace-pre-line p-3 font-mono text-[11px] leading-snug text-zinc-800 shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${n.c}`}
          style={{ left: n.x, top: n.y, rotate: n.r }}
          animate={{ rotate: [n.r, n.r + 2, n.r] }}
          transition={{ repeat: Infinity, duration: 3 + i }}
        >
          <span className="absolute -top-2 left-1/2 h-4 w-10 -translate-x-1/2 bg-white/50" />
          {n.t}
        </motion.div>
      ))}
    </div>
  );
}

/* ---------------- DÜZEN ---------------- */

function OrderLayer() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#0d0b1a] via-ink-900 to-[#06131a] p-5 pt-16 sm:p-8 sm:pt-20">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(139,92,246,0.18),transparent_60%)]" />
      <div className="relative grid h-full gap-4 sm:grid-cols-3">
        {/* Takvim */}
        <div className="glass rounded-2xl p-4 sm:col-span-1">
          <div className="mb-3 flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm font-medium text-white">
              <CalendarCheck2 className="h-4 w-4 text-violet-300" /> Bugün
            </p>
            <span className="font-mono text-[10px] text-zinc-500">6 seans</span>
          </div>
          {[
            ["10:00", "Ela Y.", "Artikülasyon", true],
            ["11:30", "Kerem D.", "Akıcılık", true],
            ["14:00", "Ali S.", "Dil gelişimi", false],
            ["16:00", "Emre K.", "Artikülasyon", false],
          ].map(([t, n, k, done]) => (
            <div key={t as string} className="flex items-center gap-3 border-t border-white/5 py-2.5">
              <span className="w-10 font-mono text-[11px] text-zinc-500">{t}</span>
              <div className="flex-1">
                <p className="text-[13px] text-white">{n}</p>
                <p className="text-[10px] text-zinc-500">{k}</p>
              </div>
              <span
                className={`grid h-5 w-5 place-items-center rounded-full ${
                  done ? "bg-emerald-400/90 text-ink-950" : "border border-white/15"
                }`}
              >
                {done && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
            </div>
          ))}
        </div>

        {/* Ses ödevleri */}
        <div className="glass rounded-2xl p-4 sm:col-span-1">
          <p className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
            <Mic className="h-4 w-4 text-cyan-300" /> Gelen ses ödevleri
          </p>
          {[
            ["Ela Y.", "/r/ sesi · 3. hafta", 86],
            ["Kerem D.", "Akıcı okuma", 72],
            ["Ali S.", "/s/ sesi · 1. hafta", 64],
          ].map(([n, k, s], i) => (
            <div key={n as string} className="mb-2 rounded-xl bg-white/[0.03] p-3">
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-white">{n}</p>
                <span className="font-mono text-[11px] text-emerald-300">%{s}</span>
              </div>
              <p className="text-[10px] text-zinc-500">{k}</p>
              <div className="mt-2 flex h-5 items-center gap-[2px]">
                {Array.from({ length: 34 }).map((_, k2) => (
                  <span
                    key={k2}
                    className="w-[3px] rounded-full bg-gradient-to-t from-violet-500 to-cyan-300"
                    style={{ height: `${18 + Math.abs(Math.sin((k2 + i * 5) * 0.55)) * 82}%`, opacity: 0.5 + (k2 % 3) * 0.2 }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Özet */}
        <div className="hidden flex-col gap-4 sm:flex">
          <div className="glass flex-1 rounded-2xl p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Ödev tamamlanma</p>
            <p className="mt-1 text-4xl font-semibold tracking-tight text-white">%92</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-violet-500 to-cyan-300" />
            </div>
            <p className="mt-3 text-xs text-zinc-500">WhatsApp döneminde: %41</p>
          </div>
          <div className="glass flex-1 rounded-2xl p-4">
            <p className="flex items-center gap-2 text-sm font-medium text-white">
              <Receipt className="h-4 w-4 text-amber-300" /> Ödemeler
            </p>
            <p className="mt-2 text-xs text-zinc-400">Ekim faturaları otomatik gönderildi.</p>
            <div className="mt-3 flex -space-x-2">
              {["EY", "KD", "AS", "EK"].map((a) => (
                <span key={a} className="grid h-7 w-7 place-items-center rounded-full border border-ink-900 bg-zinc-800 text-[9px] text-zinc-300">
                  {a}
                </span>
              ))}
              <span className="grid h-7 place-items-center pl-4 text-[11px] text-emerald-300">tümü ödendi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
