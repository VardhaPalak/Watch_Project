import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Icon from "../components/ui/Icon";
import Reveal from "../components/ui/Reveal";
import EnquiryForm from "../components/enquiry/EnquiryForm";
import { useCurrency } from "../context/CurrencyContext";

export default function Enquiry() {
  const [params] = useSearchParams();
  const location = useLocation();
  const { settings } = useCurrency();
  const [productName, setProductName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const queryProduct = params.get("product") || "";
    const state = location.state as { productName?: string; message?: string } | null;
    setProductName(queryProduct || state?.productName || "");
    setMessage(state?.message || "");
  }, [params, location.state]);

  const business = settings?.business;

  return (
    <section className="bg-jet-black pb-20 pt-12 md:pt-16">
      <div className="container-luxe">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/35">
          <span>Home</span>
          <Icon name="chevronRight" size={11} />
          <span className="text-gold">Enquiry</span>
        </nav>

        <Reveal className="mt-6 max-w-3xl">
          <span className="eyebrow">Enquiry Desk</span>
          <h1 className="mt-4 font-display text-[32px] leading-tight text-white sm:text-5xl">
            Let&rsquo;s Find Your Perfect Timepiece
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-ash">
            Looking for a specific watch, bulk orders, corporate gifts, or a personalized recommendation? Our team
            is here to help. Every enquiry is assigned a reference and answered within one business day.
          </p>
          <div className="gold-rule mt-6 w-24" />
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:gap-14">
          <Reveal>
            <div className="border border-white/10 bg-charcoal/50 p-6 sm:p-8">
              <EnquiryForm defaultProductName={productName} defaultMessage={message} />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <aside className="flex flex-col gap-7">
              <div className="border border-white/10 bg-charcoal/40 p-6">
                <h2 className="font-display text-lg text-white">Reach the atelier</h2>
                <div className="gold-rule mt-3 w-14" />
                <ul className="mt-5 flex flex-col gap-4 text-sm text-ash">
                  {business?.email ? (
                    <li className="flex items-center gap-3">
                      <Icon name="mail" size={15} className="text-gold" />
                      <a href={`mailto:${business.email}`} className="transition hover:text-gold">
                        {business.email}
                      </a>
                    </li>
                  ) : null}
                  {business?.phone ? (
                    <li className="flex items-center gap-3">
                      <Icon name="phone" size={15} className="text-gold" />
                      <a href={`tel:${business.phone}`} className="transition hover:text-gold">
                        {business.phone}
                      </a>
                    </li>
                  ) : null}
                  <li className="flex items-center gap-3">
                    <Icon name="clock" size={15} className="text-gold" />
                    {business?.hours || "Mon - Sat, 10:00 - 20:00 IST"}
                  </li>
                </ul>
              </div>

              <div className="border border-white/10 bg-charcoal/40 p-6">
                <h2 className="font-display text-lg text-white">How it works</h2>
                <ol className="mt-5 flex flex-col gap-4 text-[13px] leading-relaxed text-ash">
                  {[
                    "Submit the form — you receive an instant reference number.",
                    "A named advisor reviews your requirement within one business day.",
                    "We share availability, pricing and lead times for your piece.",
                    "Confirm by enquiry, invoice or appointment.",
                  ].map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-gold/40 text-[11px] text-gold">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <p className="text-[11px] leading-relaxed text-white/35">
                Your details are stored securely, used only to answer your enquiry, and are never published or shared
                with third parties.
              </p>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
