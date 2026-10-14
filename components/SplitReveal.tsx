"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  inView?: boolean;
};

const EASE = [0.22, 1, 0.36, 1] as const;

const word: Variants = {
  hidden: { y: "105%" },
  show: { y: "0%", transition: { duration: 1.1, ease: EASE } },
};

/** Taşması gizlenmiş satırlardan kelime kelime alttan yükselen (masked) metin. */
export function SplitReveal({ text, className, wordClassName, delay = 0, stagger = 0.07, inView = false }: Props) {
  const words = text.split(" ");
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const trigger = inView
    ? { initial: "hidden" as const, whileInView: "show" as const, viewport: { once: true, margin: "-12% 0px" } }
    : { initial: "hidden" as const, animate: "show" as const };

  return (
    <motion.span aria-label={text} role="text" className={cn("inline", className)} variants={container} {...trigger}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="-mt-[0.18em] inline-block overflow-hidden pb-[0.08em] pt-[0.18em] align-bottom">
          <motion.span variants={word} className={cn("inline-block will-change-transform", wordClassName)}>
            {w}
          </motion.span>
          {i < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  );
}
