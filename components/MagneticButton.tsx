"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "ghost";
  strength?: number;
  cursorLabel?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

/** İmleci kendine çeken, hover'da parlayan (shimmer) buton. */
export function MagneticButton({
  children,
  onClick,
  className,
  variant = "primary",
  strength = 0.35,
  cursorLabel,
  type = "button",
  disabled,
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 15, mass: 0.4 });
  const y = useSpring(my, { stiffness: 220, damping: 15, mass: 0.4 });
  const innerX = useTransform(x, (v) => v * 0.45);
  const innerY = useTransform(y, (v) => v * 0.45);

  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glow = useTransform(
    [glowX, glowY],
    ([gx, gy]) => `radial-gradient(120px circle at ${gx}% ${gy}%, rgba(255,255,255,0.55), transparent 60%)`
  );

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * strength);
    my.set((e.clientY - (r.top + r.height / 2)) * strength);
    glowX.set(((e.clientX - r.left) / r.width) * 100);
    glowY.set(((e.clientY - r.top) / r.height) * 100);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      data-cursor
      data-cursor-label={cursorLabel}
      style={{ x, y }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "group relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-4 text-sm font-medium tracking-tight transition-shadow duration-500 disabled:opacity-60",
        variant === "primary" &&
          "bg-white text-ink-950 shadow-[0_0_0_1px_rgba(255,255,255,0.15)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.5),0_20px_70px_-15px_rgba(255,255,255,0.35)]",
        variant === "ghost" && "border border-white/[0.08] bg-white/[0.02] text-white backdrop-blur-xl hover:border-white/20",
        className
      )}
    >
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(110deg,#ffffff,#d4d4d8_45%,#ffffff_70%,#e4e4e7)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      )}
      {/* Fareyi takip eden parlama */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glow }}
      />
      {/* Süpüren shimmer */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-0 group-hover:animate-shimmer group-hover:opacity-100"
      />
      <motion.span style={{ x: innerX, y: innerY }} className="relative inline-flex items-center gap-2">
        {children}
      </motion.span>
    </motion.button>
  );
}
