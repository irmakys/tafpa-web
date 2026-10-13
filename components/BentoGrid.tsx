"use client";

import { motion } from "framer-motion";
import {
  AudioLines,
  BellRing,
  CalendarClock,
  Fingerprint,
  LineChart,
  Lock,
  Palette,
  Users,
  type LucideIcon,
} from "lucide-react";
import { TiltCard } from "./TiltCard";
import { SplitReveal } from "./SplitReveal";
import { cn } from "@/lib/utils";

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-10% 0px" },
};

function CardHead({ icon: I, title, text, tint }: { icon: LucideIcon; title: string; text: string; tint: string }) {
  return (
    <div>
      <span className={cn("grid h-10 w-10 place-items-center rounded-xl border border-white/10", tint)}>
        <I className="h-5 w-5" />
      </span>
      <h3 className="mt-5 text-xl font-semibold tracking-tight text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-400">{text}</p>
    </div>
  );
}

const appIcons = [
  { bg: "#7c3aed", l: "KA" },
  { bg: "#f43f5e", l: "MS" },
  { bg: "#059669", l: "DB" },
  { bg: "#d97706", l: "KE" },
  { bg: "#0284c7", l: "MD" },
  { bg: "#27272a", l: "SN" },
  { bg: "#db2777", l: "PL" },
  { bg: "#4f46e5", l: "AT" },
];

export function BentoGrid() {
  return (
    <section id="ozellikler" className="relative mx-auto max-w-7xl px-5 py-28 sm:py-36">
      <div className="mb-14 max-w-3xl">
        <span className="eyebrow">02 — Ekosistem</span>
        <h2 className="section-title mt-6">
          <SplitReveal text="Bir klinik için gereken" inView />{" "}
          <SplitReveal text="her şey," inView delay={0.15} wordClassName="font-serif font-normal italic text-cyan-200" />{" "}
          <SplitReveal text="tek çatı altında." inView delay={0.25} />
        </h2>
      </div>

      <div className="grid auto-rows-[minmax(250px,auto)] gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* 1 — White-label (büyük) */}
        <motion.div {...reveal} transition={{ duration: 0.7 }} className="md:col-span-2 lg:row-span-2">
          <TiltCard className="flex flex-col justify-between overflow-hidden" max={6}>
            <CardHead
              icon={Palette}
              tint="bg-violet-500/15 text-violet-300"
              title="%100 sizin markanız"
              text="Logonuz, renkleriniz, uygulama adınız. Danışanlarınız Tafpa'yı değil, sizi görür — App Store ve Google Play'de kendi adınızla."
            />
            <div className="relative mt-10 h-56 [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]">
              <div className="grid grid-cols-4 gap-4 sm:gap-5" style={{ transform: "translateZ(30px)" }}>
                {appIcons.map((a, i) => (
                  <motion.div
                    key={a.l}
                    className="flex flex-col items-center gap-2"
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.07, type: "spring", stiffness: 200, damping: 14 }}
                  >
                    <motion.span
                      whileHover={{ scale: 1.12, rotate: -6 }}
                      className="grid aspect-square w-full max-w-[76px] place-items-center rounded-[22px] text-lg font-bold text-white shadow-[0_14px_30px_-10px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.3)]"
                      style={{ background: `linear-gradient(145deg, ${a.bg}, ${a.bg}cc)` }}
                    >
                      {a.l}
                    </motion.span>
                    <span className="h-1.5 w-10 rounded-full bg-white/10" />
                  </motion.div>
                ))}
              </div>
            </div>
          </TiltCard>
        </motion.div>

        {/* 2 — Takvim */}
        <motion.div {...reveal} transition={{ duration: 0.7, delay: 0.1 }}>
          <TiltCard glare="rgba(34,211,238,0.16)">
            <CardHead
              icon={CalendarClock}
              tint="bg-cyan-500/15 text-cyan-300"
              title="Akıllı takvim"
              text="Online randevu, otomatik SMS/push hatırlatma, iptal ve telafi seansı yönetimi."
            />
            <div className="mt-6 flex gap-1.5">
              {["Pt", "Sa", "Ça", "Pe", "Cu"].map((d, i) => (
                <div key={d} className="flex-1 rounded-lg border border-white/5 bg-white/[0.02] p-1.5 text-center">
                  <p className="font-mono text-[9px] text-zinc-500">{d}</p>
                  {Array.from({ length: 3 }).map((_, k) => (
                    <span
                      key={k}
                      className={cn(
                        "mt-1 block h-1.5 rounded-full",
                        (i + k) % 3 === 0 ? "bg-cyan-400/80" : (i + k) % 3 === 1 ? "bg-violet-400/60" : "bg-white/10"
                      )}
                    />
                  ))}
                </div>
              ))}
            </div>
          </TiltCard>
        </motion.div>

        {/* 3 — Analitik */}
        <motion.div {...reveal} transition={{ duration: 0.7, delay: 0.2 }}>
          <TiltCard glare="rgba(163,230,53,0.14)">
            <CardHead
              icon={LineChart}
              tint="bg-lime-500/15 text-lime-300"
              title="İlerleme analitiği"
              text="Her danışanın hedef bazlı gelişimi, veliye tek tıkla rapor."
            />
            <svg viewBox="0 0 200 60" className="mt-6 h-16 w-full overflow-visible">
              <defs>
                <linearGradient id="lc" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#a3e635" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#a3e635" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path
                d="M0 50 C 25 48, 35 38, 55 40 S 90 26, 110 30 S 150 12, 170 14 S 195 6, 200 4 L200 60 L0 60Z"
                fill="url(#lc)"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.8 }}
              />
              <motion.path
                d="M0 50 C 25 48, 35 38, 55 40 S 90 26, 110 30 S 150 12, 170 14 S 195 6, 200 4"
                fill="none"
                stroke="#a3e635"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />
              <circle cx="200" cy="4" r="3.5" fill="#a3e635" className="animate-pulse" />
            </svg>
          </TiltCard>
        </motion.div>

        {/* 4 — Veli bildirimleri */}
        <motion.div {...reveal} transition={{ duration: 0.7, delay: 0.1 }}>
          <TiltCard glare="rgba(251,113,133,0.15)">
            <CardHead
              icon={BellRing}
              tint="bg-rose-500/15 text-rose-300"
              title="Veli portalı"
              text="Ödev, seans notu ve ödeme bildirimleri — WhatsApp'a gerek kalmadan."
            />
            <div className="relative mt-6 h-20">
              {[
                ["Yeni ödev: /ş/ sesi", "şimdi"],
                ["Seans notu eklendi", "2 dk"],
                ["Fatura hazır", "1 sa"],
              ].map(([t, w], i) => (
                <motion.div
                  key={t}
                  className="absolute inset-x-0 flex items-center justify-between rounded-xl border border-white/10 bg-zinc-900/90 px-3 py-2 backdrop-blur"
                  style={{ top: i * 10, scale: 1 - i * 0.05, zIndex: 3 - i, opacity: 1 - i * 0.3 }}
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: i * 0.2 }}
                >
                  <span className="text-xs text-white">{t}</span>
                  <span className="font-mono text-[10px] text-zinc-500">{w}</span>
                </motion.div>
              ))}
            </div>
          </TiltCard>
        </motion.div>

        {/* 5 — KVKK */}
        <motion.div {...reveal} transition={{ duration: 0.7, delay: 0.2 }}>
          <TiltCard glare="rgba(52,211,153,0.15)">
            <CardHead
              icon={Lock}
              tint="bg-emerald-500/15 text-emerald-300"
              title="KVKK & şifreleme"
              text="Sağlık verisi Türkiye'deki sunucularda, uçtan uca şifreli ve rol bazlı yetkili."
            />
            <div className="mt-6 flex items-center gap-3">
              <span className="relative grid h-12 w-12 place-items-center">
                <span className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-emerald-400/40" />
                <Fingerprint className="h-6 w-6 text-emerald-300" />
              </span>
              <div className="font-mono text-[10px] leading-relaxed text-zinc-500">
                AES-256 · TLS 1.3
                <br />
                Denetim kaydı · 2FA
              </div>
            </div>
          </TiltCard>
        </motion.div>

        {/* 6 — Ses ödevleri */}
        <motion.div {...reveal} transition={{ duration: 0.7, delay: 0.1 }} className="md:col-span-2">
          <TiltCard glare="rgba(129,140,248,0.18)" max={6}>
            <div className="flex h-full flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <CardHead
                icon={AudioLines}
                tint="bg-indigo-500/15 text-indigo-300"
                title="Evden ses ödevleri"
                text="Çocuk evde kaydeder, terapist panelde dinler, işaretler ve geri bildirim verir."
              />
              <div className="flex h-16 items-center gap-[3px] sm:w-56">
                {Array.from({ length: 36 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="w-[3px] flex-1 rounded-full bg-gradient-to-t from-indigo-500 to-cyan-300"
                    animate={{ height: ["20%", `${30 + ((i * 47) % 70)}%`, "20%"] }}
                    transition={{ repeat: Infinity, duration: 1.2 + (i % 5) * 0.15, ease: "easeInOut", delay: i * 0.03 }}
                  />
                ))}
              </div>
            </div>
          </TiltCard>
        </motion.div>

        {/* 7 — Ekip */}
        <motion.div {...reveal} transition={{ duration: 0.7, delay: 0.2 }} className="md:col-span-2">
          <TiltCard glare="rgba(250,204,21,0.12)" max={6}>
            <div className="flex h-full flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <CardHead
                icon={Users}
                tint="bg-amber-500/15 text-amber-300"
                title="Çoklu terapist & şube"
                text="Terapist yetkileri, şube bazlı takvim, otomatik faturalama ve gelir raporu."
              />
              <div className="flex -space-x-3">
                {["#7c3aed", "#0284c7", "#059669", "#f43f5e", "#d97706"].map((c, i) => (
                  <motion.span
                    key={c}
                    whileHover={{ y: -8, zIndex: 10 }}
                    className="grid h-12 w-12 place-items-center rounded-full border-2 border-ink-900 text-xs font-semibold text-white"
                    style={{ background: c }}
                  >
                    {["ZA", "MK", "SB", "DE", "+8"][i]}
                  </motion.span>
                ))}
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}
