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
          "bg-white text-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_10px_40px_-10px_rgba(139,92,246,0.6)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.4),0_20px_80px_-10px_rgba(139,92,246,0.9)]",
        variant === "ghost" && "glass text-white hover:bg-white/[0.06]",
        className
      )}
    >
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-20 bg-[conic-gradient(from_180deg_at_50%_50%,#ffffff_0deg,#e9d5ff_120deg,#cffafe_240deg,#ffffff_360deg)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
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
        className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 group-hover:animate-shimmer group-hover:opacity-100"
      />
      <motion.span style={{ x: innerX, y: innerY }} className="relative inline-flex items-center gap-2">
        {children}
      </motion.span>
    </motion.button>
  );
}
