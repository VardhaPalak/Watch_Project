import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import WatchArtwork from "../ui/WatchArtwork";
import Reveal from "../ui/Reveal";
import { PROMO_BANNERS } from "../../config/site";

export default function PromoBanners() {
  return (
    <section className="bg-jet-black py-16 md:py-24">
      <div className="container-luxe flex flex-col gap-6">
        {PROMO_BANNERS.map((banner, index) => (
          <Reveal key={banner.title} delay={index * 90}>
            <Link
              to={banner.href}
              className="group relative grid overflow-hidden border border-white/10 bg-charcoal transition-all duration-500 hover:border-gold/45 md:grid-cols-[1.35fr_1fr]"
            >
              <div className="relative z-10 flex flex-col justify-center gap-4 p-8 md:p-12">
                <span className="eyebrow">{banner.kicker}</span>
                <h3 className="max-w-xl font-display text-[26px] leading-tight text-white sm:text-3xl lg:text-[38px]">
                  {banner.title}
                </h3>
                <span className="mt-2 inline-flex w-fit items-center gap-2 border border-gold/60 px-6 py-3 text-[10px] uppercase tracking-[0.22em] text-gold transition-all duration-300 group-hover:bg-gold group-hover:text-jet-black">
                  {banner.cta}
                  <Icon name="arrowRight" size={13} />
                </span>
              </div>

              <div className="relative min-h-[220px] overflow-hidden bg-[#0a0a0a] md:min-h-[260px]">
                <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/40 to-transparent md:from-charcoal" />
                <WatchArtwork
                  art={banner.art}
                  label={banner.kicker}
                  className="h-full w-full scale-105 transition-transform duration-[900ms] group-hover:scale-110"
                />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
