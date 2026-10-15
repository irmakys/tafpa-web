"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, Check, Code2, Globe, Loader2, Smartphone, X, type LucideIcon } from "lucide-react";
import { useLenis } from "./SmoothScroll";
import { MagneticButton } from "./MagneticButton";
import { TafpaMark } from "./TafpaLogo";
import { cn } from "@/lib/utils";

export const CONTACT_EMAIL = "info@tafpa.company";

export type ProjectType = "web" | "mobile" | "custom";

export const PROJECT_TYPES: { id: ProjectType; label: string; icon: LucideIcon }[] = [
  { id: "web", label: "Web Platformu", icon: Globe },
  { id: "mobile", label: "Mobil Uygulama", icon: Smartphone },
  { id: "custom", label: "Özel Yazılım", icon: Code2 },
];

const BUDGETS = [
  "< 50.000 ₺",
  "50.000 – 100.000 ₺",
  "100.000 – 250.000 ₺",
  "250.000 ₺+ / Özel kapsam",
  "Henüz belirsiz",
];

type Ctx = { open: (preset?: ProjectType) => void };
const ProjectContext = createContext<Ctx>({ open: () => {} });
export const useProjectModal = () => useContext(ProjectContext);

type Status = "idle" | "sending" | "done" | "error";

export function ProjectModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [type, setType] = useState<ProjectType>("web");
  const [budget, setBudget] = useState("");
  const firstField = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const lenis = useLenis();

  const open = useCallback((preset?: ProjectType) => {
    setStatus("idle");
    setErrorMsg("");
    setType(preset ?? "web");
    setBudget("");
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
      const id = window.setTimeout(() => firstField.current?.focus(), 350);
      return () => window.clearTimeout(id);
    }
    lenis?.start();
  }, [isOpen, lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const fd = new FormData(e.currentTarget);
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(fd.get("name") ?? ""),
          email: String(fd.get("email") ?? ""),
          projectType: type,
          budget,
          message: String(fd.get("message") ?? ""),
          website: String(fd.get("website") ?? ""), // honeypot
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Talebiniz şu anda iletilemedi. Lütfen tekrar deneyin.");

      // Başarı: formu temizle, onay ekranına geç
      formRef.current?.reset();
      setBudget("");
      setType("web");
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu.");
      setStatus("error");
    }
  };

  return (
    <ProjectContext.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-end justify-center p-3 sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={close} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="lead-title"
              data-lenis-prevent
              initial={{ y: 60, scale: 0.96, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 40, scale: 0.97, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 26 }}
              className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[28px] border border-white/[0.08] bg-ink-900/95 p-6 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:p-10"
            >
              <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <button
                onClick={close}
                aria-label="Kapat"
                className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/[0.08] text-titanium-400 transition hover:rotate-90 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <AnimatePresence mode="wait" initial={false}>
                {status === "done" ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center gap-5 py-10 text-center"
                    role="status"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
                      className="grid h-14 w-14 place-items-center rounded-full bg-white text-ink-950"
                    >
                      <Check className="h-6 w-6" strokeWidth={2.5} />
                    </motion.span>
                    <h3 className="text-2xl font-light tracking-tight text-white">Teşekkürler.</h3>
                    <p className="max-w-sm text-base font-light leading-relaxed text-titanium-200">
                      Talebiniz alındı, en kısa sürede dönüş yapacağız.
                    </p>
                    <div className="mt-2 flex items-center gap-6">
                      <button
                        onClick={() => setStatus("idle")}
                        className="text-xs uppercase tracking-[0.2em] text-titanium-500 transition hover:text-white"
                      >
                        Yeni talep
                      </button>
                      <span className="h-3 w-px bg-white/10" />
                      <button onClick={close} className="text-xs uppercase tracking-[0.2em] text-titanium-500 transition hover:text-white">
                        Kapat
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    ref={formRef}
                    onSubmit={onSubmit}
                    exit={{ opacity: 0, y: -12 }}
                    aria-busy={status === "sending"}
                    className="space-y-6"
                  >
                    {/* Honeypot: insanlar görmez, botlar doldurur */}
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden
                      className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0"
                    />
                    <div className="space-y-3 pr-10">
                      <TafpaMark className="h-9 w-9" />
                      <h3 id="lead-title" className="text-3xl font-light tracking-tight text-white">
                        Projenizi konuşalım.
                      </h3>
                      <p className="text-sm text-titanium-400">Birkaç bilgi yeterli; size kısa sürede dönüş yapalım.</p>
                    </div>

                    <fieldset disabled={status === "sending"} className="space-y-6 transition-opacity disabled:opacity-60">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field inputRef={firstField} label="İsim" name="name" placeholder="Adınız Soyadınız" autoComplete="name" required />
                      <Field label="E-posta" name="email" type="email" placeholder="ornek@sirket.com" autoComplete="email" required />
                    </div>

                    <fieldset>
                      <legend className="mb-2 text-xs font-medium text-titanium-400">Proje türü</legend>
                      <div className="grid grid-cols-3 gap-2" role="radiogroup">
                        {PROJECT_TYPES.map((t) => {
                          const on = type === t.id;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              role="radio"
                              aria-checked={on}
                              onClick={() => setType(t.id)}
                              className={cn(
                                "relative flex flex-col items-center gap-2 rounded-2xl border px-2 py-4 text-center transition-colors",
                                on ? "border-white/50 bg-white/[0.06] text-white" : "border-white/[0.08] text-titanium-400 hover:border-white/20 hover:text-white"
                              )}
                            >
                              <t.icon className="h-5 w-5" strokeWidth={1.5} />
                              <span className="text-xs sm:text-sm">{t.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>

                    <fieldset>
                      <legend className="mb-2 text-xs font-medium text-titanium-400">Bütçe aralığı</legend>
                      <div className="flex flex-wrap gap-2">
                        {BUDGETS.map((b) => (
                          <button
                            key={b}
                            type="button"
                            aria-pressed={budget === b}
                            onClick={() => setBudget(budget === b ? "" : b)}
                            className={cn(
                              "relative rounded-full px-4 py-2 text-sm transition-colors",
                              budget === b ? "text-ink-950" : "border border-white/[0.08] text-titanium-400 hover:text-white"
                            )}
                          >
                            {budget === b && (
                              <motion.span
                                layoutId="budget-pill"
                                className="absolute inset-0 rounded-full bg-white"
                                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                              />
                            )}
                            <span className="relative">{b}</span>
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-titanium-400">Mesaj</span>
                      <textarea
                        name="message"
                        rows={4}
                        placeholder="Projenizden, hedeflerinizden ve zaman planınızdan kısaca bahsedin."
                        className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-titanium-600 focus:border-white/40 focus:shadow-[0_0_0_4px_rgba(255,255,255,0.06)]"
                      />
                    </label>
                    </fieldset>

                    <AnimatePresence>
                      {status === "error" && errorMsg && (
                        <motion.p
                          role="alert"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-start gap-2.5 rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm text-titanium-200"
                        >
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
                          <span>
                            {errorMsg}{" "}
                            <a href={`mailto:${CONTACT_EMAIL}`} className="text-white underline underline-offset-4">
                              E-postayla yazın
                            </a>
                          </span>
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
                      <a href={`mailto:${CONTACT_EMAIL}`} className="text-xs text-titanium-500 transition hover:text-white">
                        {CONTACT_EMAIL}
                      </a>
                      <MagneticButton type="submit" strength={0.15} className="w-full sm:w-auto" disabled={status === "sending"}>
                        <AnimatePresence mode="wait" initial={false}>
                          {status === "sending" ? (
                            <motion.span
                              key="sending"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              className="inline-flex items-center gap-2"
                            >
                              <Loader2 className="h-4 w-4 animate-spin" /> Gönderiliyor
                            </motion.span>
                          ) : (
                            <motion.span
                              key="idle"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              className="inline-flex items-center gap-2"
                            >
                              Talebi gönder <ArrowRight className="h-4 w-4" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </MagneticButton>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ProjectContext.Provider>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  autoComplete,
  inputRef,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-titanium-400">{label}</span>
      <input
        ref={inputRef}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-titanium-600 focus:border-white/40 focus:bg-white/[0.05] focus:shadow-[0_0_0_4px_rgba(255,255,255,0.06)]"
      />
    </label>
  );
}
