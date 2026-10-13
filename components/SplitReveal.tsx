"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  className?: string;
  wordClassName?: string;
  mode?: "words" | "chars";
  delay?: number;
  stagger?: number;
  inView?: boolean;
};

const item: Variants = {
  hidden: { y: "110%", rotate: 6, opacity: 0, filter: "blur(8px)" },
  show: {
    y: "0%",
    rotate: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 120, damping: 18, mass: 0.8 },
  },
};

/** Maskeli satırlardan kelime kelime / harf harf kayarak giren metin. */
export function SplitReveal({
  text,
  className,
  wordClassName,
  mode = "words",
  delay = 0,
  stagger = 0.06,
  inView = false,
}: Props) {
  const words = text.split(" ");
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const trigger = inView
    ? { initial: "hidden" as const, whileInView: "show" as const, viewport: { once: true, margin: "-10% 0px" } }
    : { initial: "hidden" as const, animate: "show" as const };

  return (
    <motion.span aria-label={text} role="text" className={cn("inline", className)} variants={container} {...trigger}>
      {words.map((word, wi) => (
        <span key={wi} aria-hidden className="inline-block overflow-hidden pb-[0.14em] align-bottom">
          {mode === "words" ? (
            <motion.span variants={item} className={cn("inline-block will-change-transform", wordClassName)}>
              {word}
            </motion.span>
          ) : (
            word.split("").map((ch, ci) => (
              <motion.span key={ci} variants={item} className={cn("inline-block will-change-transform", wordClassName)}>
                {ch}
              </motion.span>
            ))
          )}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  );
}
