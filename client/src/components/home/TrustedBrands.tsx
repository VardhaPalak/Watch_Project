import Reveal from "../ui/Reveal";
import { BRAND_DISCLAIMER, TRUSTED_BRANDS } from "../../config/site";

export default function TrustedBrands() {
  return (
    <section className="border-y border-white/10 bg-black py-14 md:py-20">
      <div className="container-luxe">
        <Reveal>
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="eyebrow">Trusted by the world's leading maisons</span>
            <h2 className="font-display text-2xl tracking-wide text-white sm:text-3xl">
              Trusted by World&rsquo;s Leading Brands
            </h2>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-7">
            {TRUSTED_BRANDS.map((brand) => (
              <li key={brand}>
                <span className="cursor-default font-display text-xl tracking-[0.22em] text-white/45 transition-colors duration-300 hover:text-white/80 sm:text-2xl">
                  {brand.toUpperCase()}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={200}>
          <p className="mx-auto mt-10 max-w-3xl text-center text-[11px] leading-relaxed text-white/30">
            {BRAND_DISCLAIMER}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
