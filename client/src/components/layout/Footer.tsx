import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import WatchArtwork from "../ui/WatchArtwork";
import { BRAND, FOOTER_COLUMNS, POLICY_LINKS, PAYMENT_METHODS, WHATSAPP_DEFAULT_MESSAGE } from "../../config/site";
import { useCurrency } from "../../context/CurrencyContext";

function whatsappLink(number: string, message: string) {
  const digits = String(number || "").replace(/\D/g, "");
  if (!digits) return "#";
  const withCountry = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(message)}`;
}

export default function Footer() {
  const { settings } = useCurrency();
  const business = settings?.business;
  const socials = settings?.socials?.length ? settings.socials : [];
  const payments = settings?.paymentMethods?.length ? settings.paymentMethods : PAYMENT_METHODS;

  const socialIcon = (platform: string) => {
    const key = platform.toLowerCase();
    if (key.includes("instagram")) return "instagram" as const;
    if (key.includes("facebook")) return "facebook" as const;
    if (key.includes("youtube")) return "youtube" as const;
    if (key.includes("pinterest")) return "pinterest" as const;
    if (key.includes("whatsapp")) return "whatsapp" as const;
    return "sparkle" as const;
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black">
      <div className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-gold/5 blur-3xl" />

      <div className="container-luxe relative py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_2.4fr]">
          {/* Brand block */}
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-5">
              <div className="hidden w-28 shrink-0 overflow-hidden border border-white/10 bg-charcoal sm:block">
                <WatchArtwork
                  art={{
                    case: "gold",
                    dial: "#101418",
                    strap: "#221a12",
                    strapStyle: "leather",
                    dialStyle: "sunburst",
                    accent: "#B89458",
                    background: "#0c0c0c",
                  }}
                  label="TIMECRAFT timepiece"
                  className="h-full w-full"
                />
              </div>
              <div>
                <Link to="/" className="flex items-center gap-2">
                  <Icon name="crown" size={20} className="text-gold" />
                  <span className="font-display text-2xl tracking-[0.25em] text-white">TIMECRAFT</span>
                </Link>
                <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-gold/80">{BRAND.tagline}</p>
                <p className="mt-5 max-w-sm text-sm leading-relaxed text-ash">{BRAND.description}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm text-ash">
              {business?.email ? (
                <a href={`mailto:${business.email}`} className="flex items-center gap-3 transition hover:text-gold">
                  <Icon name="mail" size={15} className="text-gold" />
                  {business.email}
                </a>
              ) : null}
              {business?.phone ? (
                <a href={`tel:${business.phone}`} className="flex items-center gap-3 transition hover:text-gold">
                  <Icon name="phone" size={15} className="text-gold" />
                  {business.phone}
                </a>
              ) : null}
              {business?.whatsapp ? (
                <a
                  href={whatsappLink(business.whatsapp, WHATSAPP_DEFAULT_MESSAGE)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 transition hover:text-gold"
                >
                  <Icon name="whatsapp" size={15} className="text-gold" />
                  WhatsApp us
                </a>
              ) : null}
              <span className="flex items-center gap-3">
                <Icon name="pin" size={15} className="text-gold" />
                {business?.address || "Crafted in India, delivered worldwide"}
              </span>
              <span className="flex items-center gap-3">
                <Icon name="clock" size={15} className="text-gold" />
                {business?.hours || "Mon - Sat, 10:00 - 20:00 IST"}
              </span>
            </div>

            {socials.length ? (
              <div className="flex items-center gap-3">
                {socials.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.platform}
                    className="flex h-10 w-10 items-center justify-center border border-white/12 text-ash transition hover:border-gold hover:text-gold"
                  >
                    <Icon name={socialIcon(social.platform)} size={16} />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title} className="flex flex-col gap-4">
                <h3 className="text-[11px] uppercase tracking-[0.28em] text-gold">{column.title}</h3>
                <ul className="flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-ash transition hover:text-gold"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {POLICY_LINKS.map((policy) => (
                <li key={policy.to}>
                  <Link to={policy.to} className="text-[11px] uppercase tracking-[0.16em] text-ash transition hover:text-gold">
                    {policy.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/enquiry"
                  className="text-[11px] uppercase tracking-[0.16em] text-gold transition hover:text-gold-light"
                >
                  Enquire Now
                </Link>
              </li>
            </ul>

            <div className="flex flex-wrap items-center gap-2.5">
              {payments.map((method) => (
                <span
                  key={method}
                  className="border border-white/12 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-ash"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 text-[11px] tracking-wide text-white/35 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} TIMECRAFT. Excellence in Every Second.</p>
            <p>All rights reserved. Demo storefront build.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
