import { cn } from "@/lib/utils";

export function TafpaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-7 w-7", className)} aria-hidden>
      <defs>
        <linearGradient id="tafpa-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c4b5fd" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="9" fill="url(#tafpa-g)" />
      <path d="M8 11h16" stroke="#09090b" strokeWidth="3" strokeLinecap="round" />
      <path d="M16 11v12" stroke="#09090b" strokeWidth="3" strokeLinecap="round" />
      <circle cx="22.5" cy="21.5" r="2.2" fill="#09090b" />
    </svg>
  );
}

export function TafpaLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <TafpaMark />
      <span className="text-lg font-semibold tracking-tight text-white">tafpa</span>
    </span>
  );
}
