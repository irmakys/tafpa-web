"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Check, Mic, Pause, Play, RotateCcw, Send, ThumbsUp } from "lucide-react";
import { SplitReveal } from "./SplitReveal";
import { cn } from "@/lib/utils";

const BARS = 84;
const W = 840;
const H = 220;
const MID = H / 2;
const BAR_W = W / BARS;
const DURATION = 9; // saniye (simüle kayıt)

// Deterministik "kaydedilmiş" ses: hece zarfları + doku
const recorded = Array.from({ length: BARS }, (_, i) => {
  const syll = Math.pow(Math.abs(Math.sin(i * 0.19)), 1.6);
  const tex = 0.55 + 0.45 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.53));
  const gap = i % 21 < 2 ? 0.08 : 1;
  return Math.max(0.06, syll * tex * gap);
});

const markers = [
  { at: 0.17, ok: true },
  { at: 0.42, ok: true },
  { at: 0.63, ok: false },
  { at: 0.86, ok: true },
];

type Mode = "recording" | "review";

export function VoiceSpectrum() {
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { margin: "0px 0px -10% 0px" });
  const barsRef = useRef<(SVGRectElement | null)[]>([]);
  const lineRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const [mode, setMode] = useState<Mode>("recording");
  const [playing, setPlaying] = useState(true);
  const [feedback, setFeedback] = useState(false);
  const state = useRef({ t: 0, progress: 0, levels: new Array(BARS).fill(0.05) as number[] });

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = state.current;
      if (playing) s.t += dt;

      if (mode === "recording") {
        // Canlı mikrofon: sağdan giren, sola akan spektrum
        const speak = 0.55 + 0.45 * Math.sin(s.t * 2.1) * Math.sin(s.t * 0.7 + 1);
        for (let i = 0; i < BARS; i++) {
          const k = i / BARS;
          const wave =
            Math.abs(Math.sin(k * 9 - s.t * 6)) * 0.5 +
            Math.abs(Math.sin(k * 23 + s.t * 9.5)) * 0.3 +
            Math.abs(Math.sin(k * 3.1 - s.t * 2.3)) * 0.4;
          const env = Math.sin(Math.PI * k) * 0.85 + 0.15;
          const target = playing ? Math.max(0.05, wave * env * speak) : 0.04;
          s.levels[i] += (target - s.levels[i]) * 0.22;
        }
      } else {
        if (playing) s.progress = (s.progress + dt / DURATION) % 1;
        for (let i = 0; i < BARS; i++) {
          const near = Math.abs(i / BARS - s.progress) < 0.025;
          const boost = playing && near ? 1.18 + 0.12 * Math.sin(s.t * 30) : 1;
          const target = recorded[i] * boost;
          s.levels[i] += (target - s.levels[i]) * 0.18;
        }
      }

      // Barlar
      for (let i = 0; i < BARS; i++) {
        const el = barsRef.current[i];
        if (!el) continue;
        const h = Math.max(3, s.levels[i] * (H - 30));
        el.setAttribute("y", String(MID - h / 2));
        el.setAttribute("height", String(h));
        if (mode === "review") {
          el.setAttribute("fill", i / BARS <= s.progress ? "url(#vs-grad)" : "rgba(255,255,255,0.14)");
        } else {
          el.setAttribute("fill", "url(#vs-grad)");
        }
      }

      // Osiloskop çizgisi
      if (lineRef.current) {
        let d = "";
        const amp = mode === "recording" && playing ? 1 : 0.35;
        for (let x = 0; x <= W; x += 8) {
          const k = x / W;
          const env = Math.sin(Math.PI * k);
          const y =
            MID +
            env *
              amp *
              (Math.sin(k * 26 + s.t * 7) * 26 + Math.sin(k * 61 - s.t * 11) * 12 + Math.sin(k * 7 + s.t * 2) * 18);
          d += `${x === 0 ? "M" : "L"}${x} ${y.toFixed(1)} `;
        }
        lineRef.current.setAttribute("d", d);
      }

      // Oynatma başlığı & süre
      if (headRef.current) {
        headRef.current.style.transform = `translateX(${s.progress * W}px)`;
        headRef.current.style.opacity = mode === "review" ? "1" : "0";
      }
      if (timeRef.current) {
        const sec = mode === "review" ? s.progress * DURATION : s.t % 60;
        timeRef.current.textContent = `0:${Math.floor(sec).toString().padStart(2, "0")}`;
      }

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, mode, playing]);

  const switchMode = (m: Mode) => {
    setMode(m);
    setPlaying(true);
    setFeedback(false);
    state.current.progress = 0;
  };

  return (
    <section id="ses-odevi" className="relative mx-auto max-w-7xl px-5 py-28 sm:py-36">
      <div className="grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <span className="eyebrow">03 — Ses ödevleri</span>
          <h2 className="section-title mt-6">
            <SplitReveal text="Evdeki pratik," inView />
            <br />
            <SplitReveal text="terapistin kulağında." inView delay={0.2} wordClassName="font-serif font-normal italic text-indigo-300" />
          </h2>
          <p className="mt-6 max-w-md text-zinc-400">
            Çocuk evde, kliniğin uygulamasından ödevini sesli kaydeder. Kayıt şifreli olarak panele düşer; terapist hedef
            sesleri işaretleyip anında geri bildirim gönderir.
          </p>
          <ol className="mt-8 space-y-4">
            {[
              ["Kaydet", "Çocuk, oyunlaştırılmış ekranda kelimeleri seslendirir."],
              ["Dinle & işaretle", "Terapist hedef fonemleri zaman çizgisinde işaretler."],
              ["Geri bildirim", "Veli, kliniğin markasıyla bildirim alır."],
            ].map(([t, d], i) => (
              <motion.li
                key={t}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.12 }}
                className="flex gap-4"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 font-mono text-xs text-zinc-400">
                  0{i + 1}
                </span>
                <div>
                  <p className="font-medium text-white">{t}</p>
                  <p className="text-sm text-zinc-500">{d}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <motion.div
          ref={wrap}
          initial={{ opacity: 0, y: 50, rotateX: 10 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ type: "spring", stiffness: 60, damping: 16 }}
          className="glass relative overflow-hidden rounded-[28px] p-5 sm:p-7"
        >
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-[80px]" />

          {/* Başlık */}
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-rose-300 to-amber-200 text-sm font-bold text-ink-950">
                EY
              </span>
              <div>
                <p className="font-medium text-white">Ela Yıldız · 6 yaş</p>
                <p className="text-xs text-zinc-500">Ödev #14 · “Araba, Arı, Kırmızı” · /r/ sesi</p>
              </div>
            </div>
            <div className="flex rounded-full border border-white/10 p-1 text-xs">
              {(["recording", "review"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={cn(
                    "relative rounded-full px-3.5 py-1.5 transition-colors",
                    mode === m ? "text-ink-950" : "text-zinc-400 hover:text-white"
                  )}
                >
                  {mode === m && (
                    <motion.span layoutId="vs-mode" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                  )}
                  <span className="relative">{m === "recording" ? "Evde kayıt" : "Terapist paneli"}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dalga */}
          <div className="relative mt-8">
            <div className="mb-3 flex items-center justify-between font-mono text-[11px] text-zinc-500">
              <span className="flex items-center gap-2">
                {mode === "recording" ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className={cn("absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75", playing && "animate-ping")} />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
                    </span>
                    {playing ? "KAYIT ALINIYOR" : "DURAKLATILDI"}
                  </>
                ) : (
                  "ÖDEV KAYDI · 48 kHz"
                )}
              </span>
              <span ref={timeRef}>0:00</span>
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} className="h-44 w-full overflow-visible sm:h-56" preserveAspectRatio="none">
              <defs>
                <linearGradient id="vs-grad" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0" stopColor="#818cf8" />
                  <stop offset="0.5" stopColor="#c084fc" />
                  <stop offset="1" stopColor="#22d3ee" />
                </linearGradient>
                <filter id="vs-glow" x="-10%" y="-50%" width="120%" height="200%">
                  <feGaussianBlur stdDeviation="4" />
                </filter>
              </defs>
              <line x1="0" x2={W} y1={MID} y2={MID} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 6" />
              {Array.from({ length: BARS }).map((_, i) => (
                <rect
                  key={i}
                  ref={(el) => {
                    barsRef.current[i] = el;
                  }}
                  x={i * BAR_W + BAR_W * 0.22}
                  width={BAR_W * 0.56}
                  y={MID - 2}
                  height={4}
                  rx={BAR_W * 0.28}
                  fill="url(#vs-grad)"
                />
              ))}
              <path ref={lineRef} fill="none" stroke="#e0e7ff" strokeOpacity="0.5" strokeWidth="1.5" filter="url(#vs-glow)" />
              <g ref={headRef} style={{ opacity: 0 }}>
                <line x1="0" x2="0" y1="0" y2={H} stroke="#fff" strokeWidth="2" />
              </g>
            </svg>

            {/* Fonem işaretleri */}
            <div className="relative mt-2 h-7">
              <AnimatePresence>
                {mode === "review" &&
                  markers.map((m, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 8, scale: 0.6 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ delay: 0.15 + i * 0.1, type: "spring", stiffness: 300, damping: 18 }}
                      className={cn(
                        "absolute -translate-x-1/2 rounded-full px-2 py-0.5 font-mono text-[10px]",
                        m.ok ? "bg-emerald-400/15 text-emerald-300" : "bg-rose-400/15 text-rose-300"
                      )}
                      style={{ left: `${m.at * 100}%` }}
                    >
                      /r/ {m.ok ? "✓" : "✗"}
                    </motion.span>
                  ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Kontroller */}
          <div className="relative mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-5">
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Duraklat" : "Oynat"}
                className={cn(
                  "grid h-12 w-12 place-items-center rounded-full text-white shadow-lg",
                  mode === "recording" ? "bg-rose-500 shadow-rose-500/30" : "bg-white text-ink-950"
                )}
              >
                {playing ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : mode === "recording" ? (
                  <Mic className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 fill-current" />
                )}
              </motion.button>
              <button
                onClick={() => {
                  state.current.progress = 0;
                  state.current.t = 0;
                }}
                aria-label="Baştan"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-zinc-400 transition hover:text-white"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {mode === "recording" ? (
              <button
                onClick={() => switchMode("review")}
                className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-2.5 text-sm text-white transition hover:bg-white/10"
              >
                <Send className="h-4 w-4" /> Terapiste gönder
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Doğruluk</p>
                  <p className="text-lg font-semibold text-white">
                    3/4 <span className="text-sm font-normal text-emerald-300">%75</span>
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setFeedback(true)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition",
                    feedback ? "bg-emerald-400 text-ink-950" : "bg-white text-ink-950 hover:bg-emerald-200"
                  )}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {feedback ? (
                      <motion.span key="ok" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-2">
                        <Check className="h-4 w-4" strokeWidth={3} /> Veliye iletildi
                      </motion.span>
                    ) : (
                      <motion.span key="send" exit={{ y: -10, opacity: 0 }} className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4" /> Geri bildirim gönder
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
