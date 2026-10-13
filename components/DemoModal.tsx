"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2, X } from "lucide-react";
import { useLenis } from "./SmoothScroll";
import { MagneticButton } from "./MagneticButton";
import { TafpaMark } from "./TafpaLogo";

type Ctx = { open: () => void };
const DemoContext = createContext<Ctx>({ open: () => {} });
export const useDemo = () => useContext(DemoContext);

type Status = "idle" | "sending" | "done";

export function DemoModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const lenis = useLenis();

  const open = useCallback(() => {
    setStatus("idle");
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (isOpen) lenis?.stop();
    else lenis?.start();
  }, [isOpen, lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Demo: gerçek bir API'ye bağlanana kadar başarılı gönderimi simüle eder
    window.setTimeout(() => setStatus("done"), 1400);
  };

  return (
    <DemoContext.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-end justify-center p-3 sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-ink-950/70 backdrop-blur-md"
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="demo-title"
              data-lenis-prevent
              initial={{ y: 60, scale: 0.94, opacity: 0, rotateX: 12 }}
              animate={{ y: 0, scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ y: 40, scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 210, damping: 24 }}
              className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[28px] border border-white/10 bg-ink-900/90 p-6 shadow-[0_40px_120px_-20px_rgba(139,92,246,0.45)] backdrop-blur-2xl sm:p-10"
            >
              <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[140%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(139,92,246,0.35),transparent)]" />
              <button
                onClick={close}
                aria-label="Kapat"
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/10 text-zinc-400 transition hover:rotate-90 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <AnimatePresence mode="wait">
                {status !== "done" ? (
                  <motion.form
                    key="form"
                    onSubmit={onSubmit}
                    exit={{ opacity: 0, y: -12 }}
                    className="relative space-y-5"
                  >
                    <div className="space-y-3">
                      <TafpaMark className="h-9 w-9" />
                      <h3 id="demo-title" className="text-3xl font-semibold tracking-tight text-white">
                        Kliniğinize özel <span className="font-serif font-normal italic text-violet-300">canlı demo</span>
                      </h3>
                      <p className="text-sm leading-relaxed text-zinc-400">
                        30 dakikada, kendi logonuz ve renklerinizle hazırlanmış uygulamayı birlikte gezelim.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Ad Soyad" name="name" placeholder="Dr. Elif Yılmaz" required />
                      <Field label="Klinik Adı" name="clinic" placeholder="Konuşma Atölyesi" required />
                      <Field label="E-posta" name="email" type="email" placeholder="elif@klinik.com" required />
                      <Field label="Telefon" name="phone" type="tel" placeholder="05xx xxx xx xx" />
                    </div>

                    <fieldset>
                      <legend className="mb-2 text-xs font-medium text-zinc-400">Terapist sayısı</legend>
                      <div className="grid grid-cols-4 gap-2">
                        {["1–3", "4–10", "11–25", "25+"].map((v, i) => (
                          <label key={v} className="cursor-pointer">
                            <input type="radio" name="size" value={v} defaultChecked={i === 1} className="peer sr-only" />
                            <span className="block rounded-xl border border-white/10 py-2.5 text-center text-sm text-zinc-400 transition peer-checked:border-violet-400/60 peer-checked:bg-violet-500/10 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-violet-400">
                              {v}
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <MagneticButton type="submit" className="w-full" strength={0.12} disabled={status === "sending"}>
                      {status === "sending" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Gönderiliyor
                        </>
                      ) : (
                        <>
                          Demo talep et <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </MagneticButton>
                    <p className="text-center text-[11px] text-zinc-500">
                      Bilgileriniz KVKK kapsamında yalnızca demo planlaması için kullanılır.
                    </p>
                  </motion.form>
                ) : (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    className="relative flex flex-col items-center gap-4 py-10 text-center"
                  >
                    <motion.span
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
                      className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-violet-400 to-cyan-300 text-ink-950"
                    >
                      <Check className="h-7 w-7" strokeWidth={3} />
                    </motion.span>
                    <h3 className="text-2xl font-semibold tracking-tight text-white">Talebiniz alındı</h3>
                    <p className="max-w-sm text-sm text-zinc-400">
                      Ekibimiz 24 saat içinde, kliniğinizin markasıyla hazırlanmış demo bağlantısıyla size dönecek.
                    </p>
                    <button onClick={close} className="mt-2 text-sm text-violet-300 underline-offset-4 hover:underline">
                      Kapat
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DemoContext.Provider>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="group block">
      <span className="mb-1.5 block text-xs font-medium text-zinc-400">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-violet-400/60 focus:bg-white/[0.05] focus:shadow-[0_0_0_4px_rgba(139,92,246,0.15)]"
      />
    </label>
  );
}
