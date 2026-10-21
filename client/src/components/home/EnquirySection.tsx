import { useState } from "react";
import Icon from "../ui/Icon";
import WatchArtwork from "../ui/WatchArtwork";
import Reveal from "../ui/Reveal";
import EnquiryForm from "../enquiry/EnquiryForm";
import { useCurrency } from "../../context/CurrencyContext";

export default function EnquirySection() {
  const [reference, setReference] = useState("");
  const { settings } = useCurrency();
  const business = settings?.business;

  return (
    <section id="enquiry" className="relative overflow-hidden bg-jet-black py-16 md:py-24">
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[480px] w-[480px] rounded-full bg-gold/5 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="container-luxe relative">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">Dedicated client services</span>
            <h2 className="mt-4 font-display text-[30px] leading-tight text-white sm:text-4xl lg:text-[46px]">
              Let&rsquo;s Find Your Perfect Timepiece
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-ash">
              Looking for a specific watch, bulk orders, corporate gifts, or a personalized recommendation? Our
              team is here to help.
            </p>
            <div className="gold-rule mx-auto mt-6 w-[120px]" />
          </div>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <Reveal className="flex flex-col gap-7">
            <div className="relative mx-auto w-full max-w-[380px]">
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl" />
              <WatchArtwork
                art={{
                  case: "gold",
                  dial: "#0c0c0d",
                  strap: "#201913",
                  strapStyle: "leather",
                  dialStyle: "sunburst",
                  accent: "#D8BB84",
                  background: "#0a0a0a",
                }}
                label="TIMECRAFT consultation timepiece"
                className="relative w-full"
              />
            </div>

            <div className="flex flex-col gap-3">
              {business?.phone ? (
                <a
                  href={`tel:${business.phone}`}
                  className="flex items-center gap-3 text-sm text-ash transition hover:text-gold"
                >
                  <Icon name="phone" size={15} className="text-gold" />
                  {business.phone}
                </a>
              ) : null}
              {business?.email ? (
                <a
                  href={`mailto:${business.email}`}
                  className="flex items-center gap-3 text-sm text-ash transition hover:text-gold"
                >
                  <Icon name="mail" size={15} className="text-gold" />
                  {business.email}
                </a>
              ) : null}
              <span className="flex items-center gap-3 text-sm text-ash">
                <Icon name="clock" size={15} className="text-gold" />
                {business?.hours || "Mon - Sat, 10:00 - 20:00 IST"}
              </span>
            </div>

            <ul className="flex flex-col gap-3 border-t border-white/10 pt-6">
              {[
                "A named advisor responds within one business day",
                "Guidance on collections, sizing and styling",
                "Volume pricing for bulk and corporate orders",
                "Secure handling of your details — never published",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[13px] leading-relaxed text-ash">
                  <Icon name="check" size={14} className="mt-0.5 shrink-0 text-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <div className="border border-white/10 bg-charcoal/70 p-6 backdrop-blur-sm sm:p-8">
              {reference ? (
                <div className="flex flex-col items-center gap-4 py-10 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/50 text-gold">
                    <Icon name="check" size={24} />
                  </span>
                  <h3 className="font-display text-2xl text-white">Enquiry Received</h3>
                  <p className="max-w-md text-sm leading-relaxed text-ash">
                    Thank you for contacting TIMECRAFT! Your enquiry has been received. Our team will get back to
                    you shortly.
                  </p>
                  <span className="border border-gold/40 px-5 py-2 text-[11px] uppercase tracking-[0.25em] text-gold">
                    Ref: {reference}
                  </span>
                </div>
              ) : (
                <EnquiryForm onSuccess={setReference} />
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
