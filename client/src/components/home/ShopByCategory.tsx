import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import WatchArtwork from "../ui/WatchArtwork";
import Carousel from "../ui/Carousel";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import { CATEGORIES } from "../../config/site";

export default function ShopByCategory() {
  return (
    <section className="relative overflow-hidden bg-charcoal py-16 md:py-24">
      <div className="pointer-events-none absolute -right-32 top-10 h-[380px] w-[380px] rounded-full bg-gold/5 blur-3xl" />

      <div className="container-luxe relative">
        <Reveal>
          <SectionHeading
            eyebrow="Curated for every wrist"
            title="Shop by Category"
            subtitle="Five distinct families, one standard of finishing. Select a category to explore its timepieces."
          />
        </Reveal>

        <div className="mt-12">
          {/* Desktop: five columns */}
          <div className="hidden grid-cols-5 gap-5 lg:grid">
            {CATEGORIES.map((category, index) => (
              <Reveal key={category.key} delay={index * 80}>
                <Link
                  to={`/shop?category=${category.key}`}
                  className="group relative block overflow-hidden border border-white/10 bg-jet-black transition-all duration-500 hover:border-gold/50"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <WatchArtwork
                      art={category.art}
                      label={category.name}
                      className="h-full w-full transition-transform duration-[900ms] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent opacity-90" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <h3 className="font-display text-xl leading-tight text-white">{category.name}</h3>
                      <p className="mt-1 text-[11px] leading-relaxed text-white/45">{category.tagline}</p>
                      <span className="mt-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gold">
                        Explore Now
                        <Icon name="arrowRight" size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Mobile / tablet: swipeable carousel */}
          <Carousel className="lg:hidden" ariaLabel="Shop by category">
            {CATEGORIES.map((category) => (
              <Link
                key={category.key}
                to={`/shop?category=${category.key}`}
                className="group relative block w-[68vw] shrink-0 snap-start overflow-hidden border border-white/10 bg-jet-black sm:w-[42vw]"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <WatchArtwork
                    art={category.art}
                    label={category.name}
                    className="h-full w-full transition-transform duration-[900ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent opacity-90" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-display text-xl leading-tight text-white">{category.name}</h3>
                    <p className="mt-1 text-[11px] text-white/45">{category.tagline}</p>
                    <span className="mt-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gold">
                      Explore Now
                      <Icon name="arrowRight" size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
