"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useMotionValue,
  useSpring,
  useTransform,
  type Transition,
} from "framer-motion";
import {
  AudioLines,
  Bell,
  CalendarDays,
  Check,
  Home,
  House,
  MessageCircle,
  Mic,
  PenLine,
  Sprout,
  TrendingUp,
  User,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Palette = { id: string; name: string; primary: string; soft: string; ink: string };
type Clinic = { id: string; name: string; tagline: string; icon: LucideIcon; palette: string };

export const PALETTES: Palette[] = [
  { id: "violet", name: "Lavanta", primary: "#7c3aed", soft: "#ede9fe", ink: "#2e1065" },
  { id: "coral", name: "Mercan", primary: "#f43f5e", soft: "#ffe4e6", ink: "#4c0519" },
  { id: "emerald", name: "Zümrüt", primary: "#059669", soft: "#d1fae5", ink: "#022c22" },
  { id: "amber", name: "Kehribar", primary: "#d97706", soft: "#fef3c7", ink: "#451a03" },
  { id: "ocean", name: "Okyanus", primary: "#0284c7", soft: "#e0f2fe", ink: "#082f49" },
  { id: "graphite", name: "Grafit", primary: "#27272a", soft: "#e4e4e7", ink: "#09090b" },
];

const CLINICS: Clinic[] = [
  { id: "atolye", name: "Konuşma Atölyesi", tagline: "Dil & Konuşma Terapisi", icon: MessageCircle, palette: "violet" },
  { id: "minik", name: "Minik Sesler", tagline: "Çocuk DKT Merkezi", icon: AudioLines, palette: "coral" },
  { id: "bahce", name: "Dil Bahçesi", tagline: "Terapi & Gelişim", icon: Sprout, palette: "emerald" },
  { id: "kelime", name: "Kelime Evi", tagline: "Konuşma Kliniği", icon: House, palette: "amber" },
  { id: "dalga", name: "Mavi Dalga", tagline: "Ses & Akıcılık Kliniği", icon: Waves, palette: "ocean" },
];

const colorSpring: Transition = { type: "spring", stiffness: 90, damping: 16, mass: 0.9 };
const popSpring: Transition = { type: "spring", stiffness: 380, damping: 18 };

export function WhiteLabelSimulator() {
  const [clinicId, setClinicId] = useState(CLINICS[0].id);
  const [paletteId, setPaletteId] = useState(CLINICS[0].palette);
  const [customName, setCustomName] = useState("");
  const controls = useAnimationControls();

  const clinic = CLINICS.find((c) => c.id === clinicId)!;
  const p = PALETTES.find((x) => x.id === paletteId)!;
  const displayName = customName.trim() || clinic.name;
  const Icon = clinic.icon;
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toLocaleUpperCase("tr"))
    .join("");

  // Her marka değişiminde cihaz yaylı bir "nefes" alır
  const bump = () => {
    controls.start({
      scale: [1, 0.965, 1],
      rotateZ: [0, -1.2, 0],
      transition: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] },
    });
  };

  const pickClinic = (c: Clinic) => {
    setClinicId(c.id);
    setPaletteId(c.palette);
    setCustomName("");
    bump();
  };
  const pickPalette = (id: string) => {
    setPaletteId(id);
    bump();
  };

  // Fareye göre 3D derinlik
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 14 });
  const sy = useSpring(my, { stiffness: 70, damping: 14 });
  const rotY = useTransform(sx, [-1, 1], [-16, 16]);
  const rotX = useTransform(sy, [-1, 1], [12, -12]);
  const shadowX = useTransform(sx, [-1, 1], [40, -40]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  return (
    <div id="white-label" className="relative flex w-full flex-col items-center gap-8">
      {/* SAHNE */}
      <div className="perspective relative flex h-[560px] w-full items-center justify-center sm:h-[620px]">
        {/* Marka rengiyle nefes alan arka ışık */}
        <motion.div
          aria-hidden
          className="absolute h-[420px] w-[420px] rounded-full blur-[90px]"
          animate={{ backgroundColor: p.primary, opacity: paletteId === "graphite" ? 0.25 : 0.45 }}
          transition={colorSpring}
        />

        <div className="preserve-3d animate-float">
        <motion.div style={{ rotateX: rotX, rotateY: rotY }} className="preserve-3d relative">
          {/* Zemin gölgesi */}
          <motion.div
            aria-hidden
            style={{ x: shadowX }}
            className="absolute -bottom-24 left-1/2 h-16 w-64 -translate-x-1/2 rounded-full bg-black/60 blur-2xl"
          />

          {/* TELEFON */}
          <motion.div
            animate={controls}
            className="preserve-3d relative h-[540px] w-[268px] rounded-[48px] bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 p-[10px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9),inset_0_0_0_1.5px_rgba(255,255,255,0.18)] sm:h-[580px] sm:w-[288px]"
          >
            {/* Yan tuşlar */}
            <span className="absolute -left-[3px] top-28 h-12 w-[3px] rounded-l bg-zinc-600" />
            <span className="absolute -right-[3px] top-36 h-20 w-[3px] rounded-r bg-zinc-600" />

            <div className="relative h-full w-full overflow-hidden rounded-[38px] bg-white">
              {/* Ekran yansıması */}
              <div aria-hidden className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(115deg,rgba(255,255,255,0.35)_0%,transparent_28%,transparent_70%,rgba(255,255,255,0.08)_100%)]" />

              <motion.div className="absolute inset-0" animate={{ backgroundColor: p.soft }} transition={colorSpring} />

              <div className="relative z-10 flex h-full flex-col">
                {/* Status bar + Dynamic island */}
                <div className="flex items-center justify-between px-6 pt-3 text-[11px] font-semibold text-zinc-900">
                  <span>9:41</span>
                  <span className="h-[22px] w-[84px] rounded-full bg-black" />
                  <span className="flex gap-1">
                    <span className="h-2.5 w-4 rounded-sm border border-zinc-900" />
                  </span>
                </div>

                {/* Uygulama başlığı - LOGO */}
                <div className="flex items-center justify-between px-5 pt-5">
                  <div className="flex items-center gap-2.5">
                    <motion.div
                      className="grid h-10 w-10 place-items-center rounded-2xl text-white shadow-lg"
                      animate={{ backgroundColor: p.primary, boxShadow: `0 8px 20px -6px ${p.primary}` }}
                      transition={colorSpring}
                    >
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={customName.trim() ? `txt-${initials}` : clinic.id}
                          initial={{ scale: 0, rotate: -120, opacity: 0 }}
                          animate={{ scale: 1, rotate: 0, opacity: 1 }}
                          exit={{ scale: 0, rotate: 120, opacity: 0 }}
                          transition={popSpring}
                          className="grid place-items-center"
                        >
                          {customName.trim() ? (
                            <span className="text-sm font-bold tracking-tight">{initials}</span>
                          ) : (
                            <Icon className="h-5 w-5" strokeWidth={2.4} />
                          )}
                        </motion.span>
                      </AnimatePresence>
                    </motion.div>
                    <div className="min-w-0 leading-tight">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.p
                          key={displayName}
                          initial={{ y: 14, opacity: 0, filter: "blur(4px)" }}
                          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                          exit={{ y: -14, opacity: 0, filter: "blur(4px)" }}
                          transition={popSpring}
                          className="max-w-[150px] truncate text-[13px] font-bold"
                        >
                          <motion.span animate={{ color: p.ink }} transition={colorSpring}>
                            {displayName}
                          </motion.span>
                        </motion.p>
                      </AnimatePresence>
                      <p className="text-[10px] text-zinc-500">{clinic.tagline}</p>
                    </div>
                  </div>
                  <div className="relative grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm">
                    <Bell className="h-4 w-4 text-zinc-700" />
                    <motion.span
                      className="absolute right-2 top-2 h-2 w-2 rounded-full ring-2 ring-white"
                      animate={{ backgroundColor: p.primary }}
                      transition={colorSpring}
                    />
                  </div>
                </div>

                {/* Hero kart */}
                <motion.div
                  className="relative mx-4 mt-5 overflow-hidden rounded-3xl p-4 text-white"
                  animate={{ backgroundColor: p.primary }}
                  transition={colorSpring}
                >
                  <div aria-hidden className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/15" />
                  <div aria-hidden className="absolute -bottom-12 right-10 h-24 w-24 rounded-full bg-white/10" />
                  <p className="text-[10px] font-medium uppercase tracking-wider text-white/70">Merhaba Ela 👋</p>
                  <p className="mt-1 text-[15px] font-semibold leading-snug">
                    Bugünkü 2 ödevin <br /> seni bekliyor!
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/25">
                      <motion.div
                        className="h-full rounded-full bg-white"
                        initial={{ width: "0%" }}
                        animate={{ width: "60%" }}
                        transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold">3/5</span>
                  </div>
                </motion.div>

                {/* Liste */}
                <div className="mt-4 space-y-2.5 px-4">
                  <AppRow icon={Mic} title="Ses Ödevi: /r/ sesi" meta="Kaydet & gönder · 2 dk" p={p} highlight />
                  <AppRow icon={CalendarDays} title="Seans: Perşembe 15:30" meta="Uzm. DKT Zeynep A." p={p} />
                  <AppRow icon={PenLine} title="Terapist notu" meta="“Harika ilerleme! 🎉”" p={p} />
                </div>

                {/* Tab bar */}
                <div className="mt-auto flex items-center justify-around border-t border-black/5 bg-white/80 px-4 pb-6 pt-3 backdrop-blur">
                  {[Home, TrendingUp, Mic, User].map((T, i) => (
                    <motion.span
                      key={i}
                      className="grid h-9 w-9 place-items-center rounded-xl"
                      animate={{
                        backgroundColor: i === 0 ? p.soft : "rgba(0,0,0,0)",
                        color: i === 0 ? p.primary : "#a1a1aa",
                      }}
                      transition={colorSpring}
                    >
                      <T className="h-[18px] w-[18px]" />
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Yüzen derinlik çipleri */}
          <motion.div
            style={{ z: 90 }}
            className="glass absolute -left-24 top-24 hidden items-center gap-2.5 rounded-2xl px-3.5 py-2.5 sm:flex"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4, ...popSpring }}
          >
            <motion.span
              className="grid h-7 w-7 place-items-center rounded-full text-white"
              animate={{ backgroundColor: p.primary }}
              transition={colorSpring}
            >
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </motion.span>
            <div className="leading-tight">
              <p className="text-xs font-medium text-white">Ödev teslim edildi</p>
              <p className="text-[10px] text-zinc-400">Ela · /r/ sesi · az önce</p>
            </div>
          </motion.div>

          <motion.div
            style={{ z: 130 }}
            className="glass absolute -right-20 bottom-36 hidden rounded-2xl px-4 py-3 sm:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6, ...popSpring }}
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Doğruluk</p>
            <p className="text-2xl font-semibold tracking-tight text-white">
              %86 <span className="text-xs font-normal text-emerald-400">▲ 12</span>
            </p>
            <div className="mt-1 flex h-6 items-end gap-1">
              {[40, 55, 48, 70, 62, 86].map((h, i) => (
                <motion.span
                  key={i}
                  className="w-2 rounded-sm"
                  style={{ height: `${h}%` }}
                  animate={{ backgroundColor: i === 5 ? p.primary : "rgba(255,255,255,0.18)" }}
                  transition={colorSpring}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
        </div>
      </div>

      {/* KONTROL PANELİ */}
      <div className="glass relative z-10 w-full max-w-[520px] rounded-3xl p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">Canlı White-Label</p>
          <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            önizleme
          </span>
        </div>

        <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {CLINICS.map((c) => {
            const active = c.id === clinicId && !customName.trim();
            const pal = PALETTES.find((x) => x.id === c.palette)!;
            return (
              <button
                key={c.id}
                onClick={() => pickClinic(c)}
                data-cursor-label="Dönüştür"
                className={cn(
                  "relative shrink-0 rounded-full px-3.5 py-2 text-xs font-medium transition-colors",
                  active ? "text-zinc-950" : "text-zinc-400 hover:text-white"
                )}
              >
                {active && (
                  <motion.span layoutId="clinic-pill" className="absolute inset-0 rounded-full bg-white" transition={popSpring} />
                )}
                <span className="relative flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: pal.primary }} />
                  {c.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2" role="radiogroup" aria-label="Marka rengi">
            {PALETTES.map((pal) => (
              <button
                key={pal.id}
                role="radio"
                aria-checked={pal.id === paletteId}
                aria-label={pal.name}
                title={pal.name}
                onClick={() => pickPalette(pal.id)}
                className="relative grid h-8 w-8 place-items-center"
              >
                {pal.id === paletteId && (
                  <motion.span
                    layoutId="swatch-ring"
                    className="absolute inset-0 rounded-full border-2 border-white"
                    transition={popSpring}
                  />
                )}
                <motion.span
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.85 }}
                  className="h-5 w-5 rounded-full shadow-inner ring-1 ring-white/20"
                  style={{ backgroundColor: pal.primary }}
                />
              </button>
            ))}
          </div>
          <label className="relative flex-1">
            <span className="sr-only">Klinik adınız</span>
            <input
              value={customName}
              onChange={(e) => setCustomName(e.target.value.slice(0, 28))}
              onBlur={() => customName.trim() && bump()}
              placeholder="Kendi klinik adınızı yazın…"
              className="w-full rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white outline-none placeholder:text-zinc-500 focus:border-white/30"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

function AppRow({
  icon: I,
  title,
  meta,
  p,
  highlight,
}: {
  icon: LucideIcon;
  title: string;
  meta: string;
  p: Palette;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.12)]">
      <motion.span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
        animate={{ backgroundColor: highlight ? p.primary : p.soft, color: highlight ? "#ffffff" : p.primary }}
        transition={colorSpring}
      >
        <I className="h-4 w-4" />
      </motion.span>
      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate text-[12px] font-semibold text-zinc-900">{title}</p>
        <p className="truncate text-[10px] text-zinc-500">{meta}</p>
      </div>
      {highlight && (
        <motion.span
          className="h-2 w-2 rounded-full"
          animate={{ backgroundColor: p.primary, scale: [1, 1.5, 1] }}
          transition={{ backgroundColor: colorSpring, scale: { repeat: Infinity, duration: 1.6 } }}
        />
      )}
    </div>
  );
}
