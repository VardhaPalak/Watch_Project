import env from "../config/env.js";

const DEFAULT_MESSAGE =
  "Hello TIMECRAFT, I would like to enquire about your luxury watches.";

export function normalizeWhatsappNumber(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("91") && digits.length === 12 ? digits : `91${digits}`;
}

export function buildWhatsappLink(rawNumber, message = DEFAULT_MESSAGE) {
  const number = normalizeWhatsappNumber(rawNumber);
  if (!number) return "";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function defaultWhatsappMessage(productName) {
  if (productName) {
    return `Hello TIMECRAFT, I would like to enquire about the "${productName}" timepiece.`;
  }
  return DEFAULT_MESSAGE;
}

export function resolveWhatsappNumber(settings) {
  return settings?.business?.whatsapp || env.businessWhatsapp || "";
}
