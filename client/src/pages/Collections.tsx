import { useCallback } from "react";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import SectionHeading from "../components/ui/SectionHeading";
import Reveal from "../components/ui/Reveal";
import WatchArtwork from "../components/ui/WatchArtwork";
import type { ProductArt } from "../types";

interface CollectionPanel {
  name: string;
  index: string;
  tagline: string;
  description: string;
  highlights: string[];
  art: ProductArt;
}

const COLLECTIONS: CollectionPanel[] = [
  {
    name: "Signature",
    index: "01",
    tagline: "The house at its most recognisable",
    description:
      "A balanced case, a sunburst dial and a restraint that never dates. Signature is the collection we recommend to a first serious collector and the one we keep coming back to ourselves.",
    highlights: ["Sunburst dials", "Polished & brushed cases", "Quick-release straps"],
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
    index: "02",
    tagline: "Mid-century proportions, modern reliability",
    description:
      "Drawn from 1940s and 1950s desk clocks and wristwatches: domed crystals, small crowns, warm champagne dials and a thinner profile that sits easily under a cuff.",
    highlights: ["Domed crystals", "Champagne & cream dials", "Slim dress proportions"],
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
    index: "03",
    tagline: "Built for salt, pressure and distance",
    description:
      "Rotating bezels, high-contrast lume and screw-down crowns. Marine pieces are the most robust on the shelf and the ones that look best after a decade of wear.",
    highlights: ["Unidirectional bezel", "Screw-down crown", "High-contrast lume"],
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
    index: "04",
    tagline: "Warm metals for long evenings",
    description:
      "Rose and yellow gold cases paired with textured sunburst dials and hand-finished bracelets. Solstice is the collection we reach for when a gift or an evening calls for something warmer.",
    highlights: ["Rose & yellow gold", "Integrated bracelets", "Textured dials"],
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
    index: "05",
    tagline: "Skeletonised, unconventional, deliberate",
    description:
      "Open-worked dials, blackened cases and integrated straps that run straight into the lugs. Avant is the most technically ambitious work we release, and the most polarizing by design.",
    highlights: ["Open-worked dials", "Blackened cases", "Integrated straps"],
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

export default function Collections() {
  const scrollTo = useCallback((name: string) => {
    const target = document.getElementById(`collection-${name.toLowerCase()}`);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="bg-jet-black">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(184,148,88,0.12),transparent_70%)]" />
        <div className="container-luxe relative flex flex-col items-center gap-6 py-20 text-center md:py-28">
          <span className="eyebrow">Five Directions</span>
          <h1 className="font-display text-4xl leading-tight tracking-wide text-white sm:text-5xl lg:text-6xl">
            The <span className="text-gold">collections</span>
          </h1>
          <div className="gold-rule w-full max-w-[120px]" />
          <p className="max-w-2xl text-sm leading-relaxed text-ash sm:text-base">
            Each TIMECRAFT collection is a complete design language — a case, a dial, a strap and a
            set of proportions that belong together. Pick a direction and we will show you the
            references inside it.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {COLLECTIONS.map((collection) => (
              <button
                key={collection.name}
                type="button"
                onClick={() => scrollTo(collection.name)}
                className="border border-white/15 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-ash transition hover:border-gold hover:text-gold"
              >
                {collection.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Panels */}
      {COLLECTIONS.map((collection, index) => {
        const flipped = index % 2 === 1;
        return (
          <section
            key={collection.name}
            id={`collection-${collection.name.toLowerCase()}`}
            className={`scroll-mt-24 border-b border-white/10 ${
              index % 2 === 0 ? "bg-jet-black" : "bg-charcoal"
            }`}
          >
            <div className="container-luxe grid items-center gap-10 py-16 md:py-24 lg:grid-cols-2 lg:gap-16">
              <Reveal
                delay={80}
                className={`flex justify-center ${flipped ? "lg:order-2" : "lg:order-1"}`}
              >
                <div className="relative w-full max-w-md overflow-hidden border border-white/10 bg-[#0d0d0d] shadow-luxe">
                  <WatchArtwork
                    art={collection.art}
                    label={`${collection.name} collection timepiece`}
                    className="h-full w-full"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,transparent_35%,rgba(0,0,0,0.55)_100%)]" />
                </div>
              </Reveal>

              <Reveal
                delay={140}
                className={`flex flex-col gap-5 ${flipped ? "lg:order-1" : "lg:order-2"}`}
              >
                <span className="font-display text-5xl leading-none text-white/10">
                  {collection.index}
                </span>
                <div className="flex flex-col gap-3">
                  <h2 className="font-display text-4xl leading-tight text-white sm:text-5xl">
                    {collection.name}
                  </h2>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-gold">
                    {collection.tagline}
                  </p>
                </div>
                <div className="gold-rule w-full max-w-[140px]" />
                <p className="max-w-xl text-sm leading-relaxed text-ash sm:text-base">
                  {collection.description}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {collection.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="border border-white/12 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-ash"
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    to={`/shop?collection=${collection.name}`}
                    icon={<Icon name="arrowRight" size={15} />}
                  >
                    Shop {collection.name}
                  </Button>
                  <Button to="/enquiry" variant="outline">
                    Ask About {collection.name}
                  </Button>
                </div>
              </Reveal>
            </div>
          </section>
        );
      })}

      {/* Closing */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-0 h-[420px] w-[420px] rounded-full bg-gold/5 blur-3xl" />
        <div className="container-luxe relative flex flex-col items-center gap-6 py-20 text-center">
          <SectionHeading
            align="center"
            eyebrow="Unsure"
            title="Let a curator narrow it down"
            subtitle="Five collections is a good place to start and a lot to browse. Tell us how you wear a watch and we will point you at two references instead of twenty."
          />
          <div className="flex flex-wrap justify-center gap-3">
            <Button to="/enquiry" icon={<Icon name="mail" size={15} />}>
              Make an Enquiry
            </Button>
            <Button to="/shop" variant="outline">
              Browse Everything
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
