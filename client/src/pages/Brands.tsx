import { Link } from "react-router-dom";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import SectionHeading from "../components/ui/SectionHeading";
import Reveal from "../components/ui/Reveal";
import WatchArtwork from "../components/ui/WatchArtwork";
import { BRAND_DISCLAIMER, TRUSTED_BRANDS } from "../config/site";
import type { ProductArt } from "../types";

interface HouseCollection {
  name: string;
  tagline: string;
  description: string;
  art: ProductArt;
}

const HOUSE_COLLECTIONS: HouseCollection[] = [
  {
    name: "Signature",
    tagline: "The house at its most recognisable",
    description:
      "Clean lines, sunburst dials and a case profile that dresses up or down. This is the collection most collectors begin with.",
    art: {
      case: "gold",
      dial: "#101418",
      strap: "#221a12",
      strapStyle: "leather",
      dialStyle: "sunburst",
      accent: "#B89458",
      background: "#0c0c0c",
    },
  },
  {
    name: "Heritage",
    tagline: "Mid-century proportions, modern reliability",
    description:
      "Smaller cases, domed crystals and dials that recall a 1950s desk clock — serviced, regulated and ready for daily wear.",
    art: {
      case: "rose",
      dial: "#f3ece4",
      strap: "#efe6db",
      strapStyle: "leather",
      dialStyle: "matte",
      accent: "#C9A87C",
      background: "#12100e",
    },
  },
  {
    name: "Marine",
    tagline: "Built for salt, pressure and distance",
    description:
      "High-contrast dials, rotating bezels and screw-down cases. Designed for divers and at home on the deck of anything.",
    art: {
      case: "steel",
      dial: "#0b1c2b",
      strap: "#101418",
      strapStyle: "bracelet",
      dialStyle: "diver",
      accent: "#5FC7E8",
      background: "#050d14",
    },
  },
  {
    name: "Solstice",
    tagline: "Warm metals for long evenings",
    description:
      "Rose and yellow gold cases with textured sunburst dials and hand-finished bracelets. Made for evening wear and gifting.",
    art: {
      case: "rose",
      dial: "#f6efe4",
      strap: "#efe1cd",
      strapStyle: "leather",
      dialStyle: "sunburst",
      accent: "#E3C079",
      background: "#100e0b",
    },
  },
  {
    name: "Avant",
    tagline: "Skeletonised, unconventional, deliberate",
    description:
      "Open-worked dials, blackened cases and integrated straps. The most technically ambitious expression of the house.",
    art: {
      case: "black",
      dial: "#151008",
      strap: "#22190f",
      strapStyle: "rubber",
      dialStyle: "skeleton",
      accent: "#E9C888",
      background: "#0a0906",
    },
  },
];

export default function Brands() {
  return (
    <div className="bg-jet-black">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-gold/5 blur-3xl" />
        <div className="container-luxe relative flex flex-col items-center gap-6 py-20 text-center md:py-24">
          <span className="eyebrow">Our Brands</span>
          <h1 className="font-display text-4xl leading-tight tracking-wide text-white sm:text-5xl lg:text-6xl">
            The houses we <span className="text-gold">carry</span>
          </h1>
          <div className="gold-rule w-full max-w-[120px]" />
          <p className="max-w-2xl text-sm leading-relaxed text-ash sm:text-base">
            TIMECRAFT is an independent retailer. We select, document and service timepieces from
            established maisons, and we design our own in-house collections alongside them.
          </p>
        </div>
      </section>

      {/* Wordmarks */}
      <section className="border-b border-white/10 bg-charcoal">
        <div className="container-luxe py-16 md:py-20">
          <SectionHeading
            align="left"
            eyebrow="Independent Retailer"
            title="Brands listed in our catalogue"
            subtitle="The names below appear for reference so you know what you are looking at. Scroll or tap to see them in context."
          />

          <ul className="mt-10 grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-3 lg:grid-cols-4">
            {TRUSTED_BRANDS.map((brand, index) => (
              <Reveal key={brand} delay={index * 60} as="li">
                <div className="flex h-28 items-center justify-center bg-charcoal px-4 transition hover:bg-charcoal-2">
                  <span className="font-display text-xl uppercase tracking-[0.3em] text-ash/70 transition hover:text-gold sm:text-2xl">
                    {brand}
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>

          <div className="mt-8 flex items-start gap-3 border border-white/10 bg-jet-black px-5 py-4">
            <Icon name="note" size={16} className="mt-0.5 shrink-0 text-gold" />
            <p className="text-xs leading-relaxed text-ash">{BRAND_DISCLAIMER}</p>
          </div>
        </div>
      </section>

      {/* House collections */}
      <section className="container-luxe py-16 md:py-24">
        <div className="flex flex-col gap-10">
          <SectionHeading
            align="left"
            eyebrow="In-House"
            title="TIMECRAFT collections"
            subtitle="Five design directions we develop and own outright, each one assembled and serviced by our partner ateliers."
            action={
              <Button to="/collections" variant="outline" icon={<Icon name="arrowRight" size={15} />}>
                All collections
              </Button>
            }
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {HOUSE_COLLECTIONS.map((collection, index) => (
              <Reveal key={collection.name} delay={index * 80} className="h-full">
                <Link
                  to={`/shop?collection=${collection.name}`}
                  className="group flex h-full flex-col overflow-hidden border border-white/10 bg-charcoal transition hover:border-gold/50"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[#0d0d0d]">
                    <WatchArtwork
                      art={collection.art}
                      label={`${collection.name} collection timepiece`}
                      className="h-full w-full transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-display text-2xl text-white">{collection.name}</h3>
                      <Icon
                        name="arrowRight"
                        size={16}
                        className="shrink-0 text-gold transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-gold">
                      {collection.tagline}
                    </p>
                    <p className="text-sm leading-relaxed text-ash">{collection.description}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 bg-charcoal">
        <div className="container-luxe flex flex-col items-center gap-6 py-16 text-center">
          <span className="eyebrow">Not Sure Where To Start</span>
          <h2 className="font-display text-3xl text-white sm:text-4xl">
            Tell us the occasion and the budget
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-ash">
            Our advisors will shortlist two or three references from the catalogue and explain the
            differences between them.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button to="/enquiry" icon={<Icon name="mail" size={15} />}>
              Make an Enquiry
            </Button>
            <Button to="/contact" variant="outline">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
