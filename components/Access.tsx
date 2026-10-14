"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SplitReveal } from "./SplitReveal";
import { MagneticButton } from "./MagneticButton";
import { CONTACT_EMAIL as EMAIL, useProjectModal } from "./ProjectModal";
import { TafpaLogo } from "./TafpaLogo";

export function Access() {
  const { open } = useProjectModal();

  return (
    <section id="erisim" className="relative mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-between px-5 pb-10 pt-[14vh] sm:px-10">
      <div>
        <p className="eyebrow">
          <span className="h-px w-8 bg-titanium-500" /> Erişim
        </p>

        <h2 className="mt-12 font-light leading-[0.92] tracking-hyper text-white" style={{ fontSize: "clamp(3rem, 8.4vw, 9.5rem)" }}>
          <SplitReveal text="Bir sonraki başyapıt," inView />
          <br />
          <SplitReveal text="sizinki olabilir." inView delay={0.2} wordClassName="text-gradient animate-shimmer-bg" />
        </h2>

        <div className="mt-16 grid gap-12 border-t border-white/[0.08] pt-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-lg text-lg font-light leading-relaxed text-titanium-300"
          >
            Fikrinizi dinleyelim. Kapsamı, süreyi ve yolu netleştiren ilk görüşme ücretsizdir; gizlilik sözleşmesi talep edebilirsiniz.
          </motion.p>
          <MagneticButton onClick={() => open()} cursorLabel="Davet" className="px-10 py-5 text-base" strength={0.4}>
            Görüşme talep edin
            <ArrowUpRight className="h-5 w-5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </MagneticButton>
        </div>

        <a
          href={`mailto:${EMAIL}`}
          data-cursor-label="Yaz"
          className="group relative mt-20 inline-block font-light tracking-tightest text-titanium-400 transition-colors duration-700 hover:text-white"
          style={{ fontSize: "clamp(1.6rem, 4.4vw, 4.2rem)" }}
        >
          {EMAIL}
          <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
        </a>
      </div>

      <footer className="mt-[18vh] flex flex-col gap-6 border-t border-white/[0.08] pt-8 text-xs text-titanium-500 sm:flex-row sm:items-center sm:justify-between">
        <TafpaLogo priority={false} className="h-9 opacity-90 sm:h-9" />
        <a href={`mailto:${EMAIL}`} className="transition-colors hover:text-white">
          İletişim: <span className="text-titanium-300">{EMAIL}</span>
        </a>
        <span lang="en">tafpa.company © {new Date().getFullYear()}. All rights reserved.</span>
      </footer>
    </section>
  );
}
