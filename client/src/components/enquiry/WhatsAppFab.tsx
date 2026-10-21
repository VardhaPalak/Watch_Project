import { WHATSAPP_DEFAULT_MESSAGE } from "../../config/site";
import Icon from "../ui/Icon";
import { useCurrency } from "../../context/CurrencyContext";
import { useToast } from "../../context/ToastContext";

function buildLink(number: string, message: string) {
  const digits = String(number || "").replace(/\D/g, "");
  if (!digits) return "";
  const withCountry = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(message)}`;
}

export default function WhatsAppFab() {
  const { settings } = useCurrency();
  const { push } = useToast();

  const number =
    settings?.business?.whatsapp ||
    (import.meta.env.VITE_BUSINESS_WHATSAPP as string | undefined) ||
    "";
  const link = buildLink(number, WHATSAPP_DEFAULT_MESSAGE);

  return (
    <button
      type="button"
      aria-label="Chat with TIMECRAFT on WhatsApp"
      title="Chat with TIMECRAFT on WhatsApp"
      onClick={() => {
        if (!link) {
          push(
            "WhatsApp is not configured yet. Add the business number in Admin → Settings.",
            "info",
          );
          return;
        }
        window.open(link, "_blank", "noopener,noreferrer");
      }}
      className="group fixed bottom-5 right-5 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.75)] transition-transform duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-jet-black"
    >
      <Icon name="whatsapp" size={26} className="transition-transform duration-300 group-hover:scale-110" />
      <span className="pointer-events-none absolute right-16 whitespace-nowrap border border-white/10 bg-charcoal px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-warm-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        WhatsApp us
      </span>
    </button>
  );
}
