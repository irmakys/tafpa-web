"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { TafpaLogo } from "./TafpaLogo";
import { useLenis } from "./SmoothScroll";
import { useProjectModal } from "./ProjectModal";

const links = [
  { href: "#manifesto", label: "Manifesto" },
  { href: "#kabiliyetler", label: "Kabiliyetler" },
  { href: "#erisim", label: "Erişim" },
];

export function Navbar() {
  const lenis = useLenis();
  const { open } = useProjectModal();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(v > prev && v > 400);
    setScrolled(v > 24);
  });

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (lenis) lenis.scrollTo(href, { offset: -40, duration: 1.6 });
    else document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: hidden ? -110 : 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 26, delay: hidden ? 0 : 0.2 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-full px-3 py-2 pl-5 transition-all duration-500 ${
          scrolled ? "glass" : "border border-transparent"
        }`}
      >
        <a href="#top" onClick={go("#top")} aria-label="Tafpa ana sayfa">
          <TafpaLogo />
        </a>
        <ul className="hidden items-center gap-1 md:flex" onPointerLeave={() => setActive(null)}>
          {links.map((l) => (
            <li key={l.href} className="relative">
              <a
                href={l.href}
                onClick={go(l.href)}
                onPointerEnter={() => setActive(l.href)}
                className="relative z-10 block px-4 py-2 text-[13px] text-titanium-400 transition-colors hover:text-white"
              >
                {l.label}
              </a>
              {active === l.href && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-white/[0.06]"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </li>
          ))}
        </ul>
        <button
          onClick={() => open()}
          className="group inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-titanium-200"
        >
          <span className="hidden sm:inline">Görüşme talep edin</span>
          <span className="sm:hidden">Görüşme</span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </button>
      </nav>
    </motion.header>
  );
}
