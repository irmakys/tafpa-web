import { NextResponse } from "next/server";
import nodemailer, { type Transporter } from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROJECT_TYPES: Record<string, string> = {
  web: "Web Platformu",
  mobile: "Mobil Uygulama",
  custom: "Özel Yazılım",
};

const LIMITS = { name: 120, email: 200, budget: 60, message: 5000 };
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

/* ---------- Basit hız sınırı (IP başına 10 dk'da 5 talep) ----------
   Sunucu örneği başına bellek içi çalışır; serverless'ta en iyi çaba korumasıdır. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

/* ---------- SMTP ---------- */
let transporter: Transporter | null = null;

function getTransporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP_USER / SMTP_PASS tanımlı değil (.env.local veya hosting ortam değişkenleri).");
  }
  transporter ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

/* ---------- Yardımcılar ---------- */
const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

type Lead = { name: string; email: string; projectType: string; budget: string; message: string };

function validate(body: Record<string, unknown>): { lead?: Lead; error?: string } {
  const name = oneLine(str(body.name));
  const email = oneLine(str(body.email)).toLowerCase();
  const typeKey = str(body.projectType);
  const budget = oneLine(str(body.budget));
  const message = str(body.message);

  if (name.length < 2 || name.length > LIMITS.name) return { error: "Lütfen geçerli bir isim girin." };
  if (email.length > LIMITS.email || !EMAIL_RE.test(email)) return { error: "Lütfen geçerli bir e-posta adresi girin." };
  const projectType = PROJECT_TYPES[typeKey] ?? Object.values(PROJECT_TYPES).find((l) => l === typeKey);
  if (!projectType) return { error: "Lütfen bir proje türü seçin." };
  if (budget.length > LIMITS.budget) return { error: "Bütçe alanı çok uzun." };
  if (message.length > LIMITS.message) return { error: `Mesaj en fazla ${LIMITS.message} karakter olabilir.` };

  return { lead: { name, email, projectType, budget, message } };
}

function renderHtml(l: Lead) {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid #ececec;width:150px;color:#8e8e93;font-size:12px;letter-spacing:.08em;text-transform:uppercase;vertical-align:top;">${label}</td>
      <td style="padding:14px 0;border-bottom:1px solid #ececec;color:#0b0b0c;font-size:15px;">${value}</td>
    </tr>`;
  const date = new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul", dateStyle: "long", timeStyle: "short" });

  return `<!doctype html>
<html lang="tr"><body style="margin:0;padding:0;background:#f4f4f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e4e4e7;border-radius:16px;">
        <tr><td style="background:#050505;border-radius:16px 16px 0 0;padding:28px 36px;">
          <div style="color:#ffffff;font-size:13px;letter-spacing:.32em;font-weight:600;">TAFPA</div>
          <div style="color:#8e8e93;font-size:11px;letter-spacing:.2em;margin-top:6px;">YENİ PROJE TALEBİ</div>
        </td></tr>
        <tr><td style="padding:32px 36px 8px;">
          <div style="font-size:26px;font-weight:300;letter-spacing:-.02em;color:#0b0b0c;">${escapeHtml(l.name)}</div>
          <div style="font-size:14px;color:#6b6b70;margin-top:6px;">${escapeHtml(l.projectType)} · ${date}</div>
        </td></tr>
        <tr><td style="padding:8px 36px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${row("İsim", escapeHtml(l.name))}
            ${row("E-posta", `<a href="mailto:${escapeHtml(l.email)}" style="color:#4f46e5;text-decoration:none;">${escapeHtml(l.email)}</a>`)}
            ${row("Proje türü", escapeHtml(l.projectType))}
            ${row("Bütçe", escapeHtml(l.budget || "Belirtilmedi"))}
          </table>
        </td></tr>
        <tr><td style="padding:24px 36px 8px;">
          <div style="color:#8e8e93;font-size:12px;letter-spacing:.08em;text-transform:uppercase;margin-bottom:10px;">Mesaj</div>
          <div style="color:#0b0b0c;font-size:15px;line-height:1.65;white-space:pre-wrap;background:#fafafa;border:1px solid #ececec;border-radius:12px;padding:18px 20px;">${escapeHtml(l.message || "—")}</div>
        </td></tr>
        <tr><td style="padding:24px 36px 32px;">
          <a href="mailto:${escapeHtml(l.email)}" style="display:inline-block;background:#050505;color:#ffffff;text-decoration:none;font-size:14px;padding:12px 22px;border-radius:999px;">Yanıtla →</a>
        </td></tr>
        <tr><td style="border-top:1px solid #ececec;padding:18px 36px;color:#a1a1aa;font-size:11px;">
          Bu e-posta tafpa.company iletişim formundan otomatik gönderildi. “Yanıtla” doğrudan müşteriye gider.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function renderText(l: Lead) {
  return [
    "Yeni proje talebi — tafpa.company",
    "",
    `İsim: ${l.name}`,
    `E-posta: ${l.email}`,
    `Proje türü: ${l.projectType}`,
    `Bütçe: ${l.budget || "Belirtilmedi"}`,
    "",
    "Mesaj:",
    l.message || "—",
  ].join("\n");
}

/* ---------- POST /api/contact ---------- */
export async function POST(req: Request) {
  try {
    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "local";
    if (rateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "Çok fazla talep gönderildi. Lütfen birkaç dakika sonra tekrar deneyin." },
        { status: 429 }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ ok: false, error: "Geçersiz istek gövdesi." }, { status: 400 });
    }

    // Honeypot: gerçek kullanıcı bu gizli alanı görmez; dolu ise bot kabul edip sessizce "başarılı" dön
    if (str(body.website)) return NextResponse.json({ ok: true });

    const { lead, error } = validate(body);
    if (!lead) return NextResponse.json({ ok: false, error }, { status: 422 });

    const receiver = process.env.CONTACT_RECEIVER || process.env.SMTP_USER;

    await getTransporter().sendMail({
      from: { name: "Tafpa Web Sitesi", address: process.env.SMTP_USER! },
      to: receiver,
      replyTo: { name: lead.name, address: lead.email },
      subject: `Yeni Proje Talebi — ${lead.name} · ${lead.projectType}`,
      text: renderText(lead),
      html: renderHtml(lead),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/contact] Gönderim hatası:", err);
    return NextResponse.json(
      { ok: false, error: "Talebiniz şu anda iletilemedi. Lütfen daha sonra tekrar deneyin ya da info@tafpa.company adresine yazın." },
      { status: 500 }
    );
  }
}
