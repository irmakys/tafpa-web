"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/** Logodaki çift altıgen + T motifi (modal başlığı vb. küçük ikon gereken yerler için). */
export function TafpaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="4 9 51 46" className={cn("h-8 w-8", className)} aria-hidden>
      <defs>
        <linearGradient id="tafpa-hex" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#605cf2" />
        </linearGradient>
      </defs>
      <polygon points="5,22 12,10 26,10 33,22 26,34 12,34" fill="url(#tafpa-hex)" />
      <polygon points="22,40 30,26 46,26 54,40 46,54 30,54" fill="#080808" stroke="#605cf2" strokeWidth="2" />
      <path d="M28 32h20v5h-7.5v15h-5V37H28z" fill="#ffffff" />
    </svg>
  );
}

/**
 * Ana logo: /public/logo.png — koyu zemin varyantı (750×241, şeffaf).
 * Açık zemin gereken yerler için orijinal renkli sürüm: /public/logo-light.png.
 * Dosya yüklenemezse çift altıgen işaret + yazıya düşer.
 */
export function TafpaLogo({ className, priority = true }: { className?: string; priority?: boolean }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className={cn("inline-flex items-center gap-2", className)}>
        <TafpaMark />
        <span className="text-lg font-semibold tracking-[0.2em] text-white">TAFPA</span>
      </span>
    );
  }

  return (
    <Image
      src="/logo.png"
      alt="Tafpa Technology"
      width={750}
      height={241}
      priority={priority}
      onError={() => setFailed(true)}
      className={cn("h-9 w-auto select-none object-contain sm:h-11", className)}
    />
  );
}
