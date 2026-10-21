import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import Button from "../ui/Button";
import WatchArtwork from "../ui/WatchArtwork";
import Reveal from "../ui/Reveal";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-jet-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_38%,rgba(184,148,88,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-gold/5 blur-3xl" />

      <div className="container-luxe relative grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:py-24">
        <Reveal className="order-2 lg:order-1">
          <span className="eyebrow">Precision. Passion. Performance.</span>

          <h1 className="mt-5 font-display text-[42px] leading-[1.08] tracking-tight text-white sm:text-[54px] lg:text-[68px]">
            Timeless Luxury. Crafted for <span className="text-gold">You.</span>
          </h1>

          <div className="gold-rule mt-6 w-24" />

          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ash">
            Discover premium timepieces designed for those who value elegance and precision.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button to="/shop" size="lg" icon={<Icon name="arrowRight" size={15} />}>
              Shop Now
            </Button>
            <Button to="/shop" variant="outlineLight" size="lg">
              Explore Collections
            </Button>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-7">
            {[
              { label: "Timepieces", value: "120+" },
              { label: "Warranty", value: "2 Years" },
              { label: "Clients", value: "18K" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-2xl text-gold">{stat.value}</dt>
                <dd className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/40">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={140} className="order-1 lg:order-2">
          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl" />

            <div className="relative">
              <WatchArtwork
                art={{
                  case: "gold",
                  dial: "#0b0b0c",
                  strap: "#1d1a15",
                  strapStyle: "leather",
                  dialStyle: "sunburst",
                  accent: "#D8BB84",
                  background: "#0a0a0a",
                }}
                label="TIMECRAFT hero timepiece"
                className="animate-kenburns w-full drop-shadow-[0_40px_80px_rgba(0,0,0,0.75)]"
              />

              <div className="absolute bottom-4 left-1/2 w-[86%] -translate-x-1/2 border border-gold/35 bg-black/70 px-4 py-3 text-center backdrop-blur-md sm:bottom-8">
                <p className="text-[9px] uppercase tracking-[0.28em] text-gold">Authentic Timepieces</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-warm-white/80">
                  100% Genuine Products
                </p>
              </div>
            </div>

            <div className="absolute -left-2 top-10 hidden border border-white/10 bg-charcoal/80 px-4 py-3 backdrop-blur sm:block">
              <p className="text-[9px] uppercase tracking-[0.24em] text-white/40">Movement</p>
              <p className="mt-1 font-display text-lg text-white">Swiss Grade</p>
            </div>

            <div className="absolute -right-2 bottom-24 hidden border border-white/10 bg-charcoal/80 px-4 py-3 backdrop-blur sm:block">
              <p className="text-[9px] uppercase tracking-[0.24em] text-white/40">Case</p>
              <p className="mt-1 font-display text-lg text-gold">40mm</p>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="border-t border-white/10 bg-black/40">
        <div className="container-luxe flex flex-wrap items-center justify-between gap-4 py-4 text-[10px] uppercase tracking-[0.24em] text-white/35">
          <Link to="/shop?category=limited" className="transition hover:text-gold">
            Limited Editions
          </Link>
          <span className="hidden sm:inline">Swiss-engineered movements</span>
          <Link to="/shop?collection=Heritage" className="transition hover:text-gold">
            Heritage Collection
          </Link>
          <span className="hidden sm:inline">Free worldwide shipping</span>
          <Link to="/enquiry" className="transition hover:text-gold">
            Bulk &amp; corporate gifting
          </Link>
        </div>
      </div>
    </section>
  );
}
