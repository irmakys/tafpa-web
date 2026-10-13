"use client";

import { useEffect, useRef } from "react";

/**
 * Fare ile süzülen radyal neon ışıma + sabit film greni.
 * Pozisyon CSS değişkenleriyle güncellenir (React render'ı tetiklemez).
 */
export function AmbientBackground() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight * 0.3;
    let x = tx;
    let y = ty;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const loop = () => {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      el.style.setProperty("--gx", `${x}px`);
      el.style.setProperty("--gy", `${y}px`);
      frame = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Statik atmosfer */}
      <div className="absolute -top-[30vh] left-1/2 h-[80vh] w-[120vw] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgba(99,102,241,0.16),transparent)]" />
      <div className="absolute bottom-[-30vh] right-[-10vw] h-[70vh] w-[70vw] rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.07),transparent)]" />
      <div className="absolute inset-0 bg-grid-fade bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_top,#000_20%,transparent_70%)]" />

      {/* Fareyi takip eden ışıma */}
      <div
        ref={glowRef}
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(600px circle at var(--gx, 50%) var(--gy, 30%), rgba(139,92,246,0.14), rgba(34,211,238,0.05) 40%, transparent 70%)",
        }}
      />

      {/* Film greni */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.07] mix-blend-overlay">
        <filter id="tafpa-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#tafpa-noise)" />
      </svg>
    </div>
  );
}
