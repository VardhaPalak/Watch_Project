import { useState } from "react";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import SectionHeading from "../components/ui/SectionHeading";
import Reveal from "../components/ui/Reveal";
import WatchArtwork from "../components/ui/WatchArtwork";
import { formatDate } from "../lib/format";
import type { ProductArt } from "../types";

interface JournalPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  art: ProductArt;
}

const POSTS: JournalPost[] = [
  {
    id: "reading-the-dial",
    title: "Reading a dial before you read the price",
    category: "Buyer's Guide",
    excerpt:
      "A sunburst dial, a matte dial and a dial with a date window look nothing alike on the wrist. Here is how to read the small design decisions that tell you where a timepiece sits in the range.",
    date: "2026-09-18",
    readTime: "6 min read",
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
    id: "steel-versus-gold",
    title: "Steel, gold or rose: choosing the case metal",
    category: "Craft",
    excerpt:
      "Metal choice changes how a watch reads against skin, shirts and evening wear. We break down the case backs, weight differences and the situations where each finish earns its place.",
    date: "2026-08-27",
    readTime: "5 min read",
    art: {
      case: "steel",
      dial: "#0f1418",
      strap: "#8f9499",
      strapStyle: "bracelet",
      dialStyle: "sunburst",
      accent: "#C9CBD0",
      background: "#0a0a0a",
    },
  },
  {
    id: "leather-strap-care",
    title: "Living with leather: a care routine that lasts",
    category: "Care",
    excerpt:
      "A good strap ages well if you treat it properly. Rotation, moisture control and a monthly feed are enough to keep leather in condition for years instead of months.",
    date: "2026-08-04",
    readTime: "4 min read",
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
    id: "inside-the-atelier",
    title: "Inside the atelier: from movement to wrist",
    category: "Atelier",
    excerpt:
      "A step-by-step walk through how a timepiece moves from an incoming inspection to a sealed presentation box, and the checks that happen along the way.",
    date: "2026-07-11",
    readTime: "7 min read",
    art: {
      case: "gold",
      dial: "#151008",
      strap: "#22190f",
      strapStyle: "leather",
      dialStyle: "skeleton",
      accent: "#E9C888",
      background: "#0a0906",
    },
  },
  {
    id: "dress-watches",
    title: "The quiet case for dress watches",
    category: "Style",
    excerpt:
      "Slimmer cases, restrained indices and a strap that disappears under a cuff. Why a smaller watch often wears more formal than a larger one with more specification.",
    date: "2026-06-22",
    readTime: "5 min read",
    art: {
      case: "gold",
      dial: "#f6efe4",
      strap: "#efe1cd",
      strapStyle: "leather",
      dialStyle: "matte",
      accent: "#E3C079",
      background: "#100e0b",
    },
  },
  {
    id: "water-resistance",
    title: "Water resistance, swimming and the care guide",
    category: "Care",
    excerpt:
      "A rating of 50m is not the same as 50m of actual swimming. We explain what the numbers mean, what voids a warranty, and how to dry a watch properly.",
    date: "2026-05-30",
    readTime: "6 min read",
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
];

const CATEGORIES = ["All", "Buyer's Guide", "Craft", "Care", "Atelier", "Style"];

export default function Blog() {
  const [active, setActive] = useState("All");

  const visible = active === "All" ? POSTS : POSTS.filter((post) => post.category === active);
  const [featured, ...rest] = visible;

  return (
    <div className="bg-jet-black">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -right-32 -top-24 h-[480px] w-[480px] rounded-full bg-gold/5 blur-3xl" />
        <div className="container-luxe relative flex flex-col items-center gap-6 py-20 text-center md:py-24">
          <span className="eyebrow">The Journal</span>
          <h1 className="font-display text-4xl leading-tight tracking-wide text-white sm:text-5xl lg:text-6xl">
            Notes on <span className="text-gold">time</span>, craft and collecting
          </h1>
          <div className="gold-rule w-full max-w-[120px]" />
          <p className="max-w-2xl text-sm leading-relaxed text-ash sm:text-base">
            Buying guides, care notes and atelier stories written by the TIMECRAFT team. Every
            piece of advice here is written to be useful whether or not you buy from us.
          </p>
          <p className="max-w-2xl border border-gold/25 bg-gold/5 px-4 py-3 text-[11px] leading-relaxed tracking-wide text-gold-light">
            Sample editorial content. These articles are demonstration copy prepared for this
            storefront build and are not published journalism.
          </p>
        </div>
      </section>

      {/* Featured post */}
      {featured ? (
        <section className="border-b border-white/10 bg-charcoal">
          <div className="container-luxe py-16 md:py-20">
            <Reveal>
              <article className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                <div className="overflow-hidden border border-white/10 bg-[#0d0d0d]">
                  <WatchArtwork
                    art={featured.art}
                    label={featured.title}
                    className="h-full w-full"
                  />
                </div>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-gold px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.2em] text-jet-black">
                      Featured
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.24em] text-gold">
                      {featured.category}
                    </span>
                  </div>
                  <h2 className="font-display text-3xl leading-tight text-white sm:text-4xl">
                    {featured.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-ash">{featured.excerpt}</p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.16em] text-ash">
                    <span className="inline-flex items-center gap-2">
                      <Icon name="clock" size={13} className="text-gold" />
                      {featured.readTime}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Icon name="note" size={13} className="text-gold" />
                      {formatDate(featured.date)}
                    </span>
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-ash/70">
                    Sample article — full text available in the editorial demo build.
                  </p>
                </div>
              </article>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Grid */}
      <section className="container-luxe py-16 md:py-20">
        <div className="flex flex-col gap-8">
          <SectionHeading
            align="left"
            eyebrow="All Entries"
            title="Latest from the journal"
            subtitle="Browse the archive by topic, or scroll through everything we have published."
          />

          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter journal entries by category">
            {CATEGORIES.map((category) => {
              const isActive = category === active;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(category)}
                  className={`border px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition ${
                    isActive
                      ? "border-gold bg-gold text-jet-black"
                      : "border-white/15 text-ash hover:border-gold/60 hover:text-gold"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {rest.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, index) => (
                <Reveal key={post.id} delay={index * 80} className="h-full">
                  <article className="group flex h-full flex-col overflow-hidden border border-white/10 bg-charcoal transition hover:border-gold/45">
                    <div className="aspect-[16/10] overflow-hidden bg-[#0d0d0d]">
                      <WatchArtwork
                        art={post.art}
                        label={post.title}
                        className="h-full w-full transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-3 p-5">
                      <span className="text-[10px] uppercase tracking-[0.22em] text-gold">
                        {post.category}
                      </span>
                      <h3 className="font-display text-xl leading-snug text-white">{post.title}</h3>
                      <p className="text-sm leading-relaxed text-ash">{post.excerpt}</p>
                      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-1 pt-3 text-[11px] uppercase tracking-[0.14em] text-ash/80">
                        <span className="inline-flex items-center gap-2">
                          <Icon name="clock" size={12} className="text-gold" />
                          {post.readTime}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <Icon name="note" size={12} className="text-gold" />
                          {formatDate(post.date)}
                        </span>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          ) : visible.length ? null : (
            <div className="border border-white/10 bg-charcoal px-6 py-16 text-center">
              <p className="font-display text-2xl text-white">Nothing filed under {active} yet</p>
              <p className="mx-auto mt-3 max-w-md text-sm text-ash">
                Try another topic, or read the featured entry above.
              </p>
              <Button variant="outline" className="mt-6" onClick={() => setActive("All")}>
                Show all entries
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter placeholder — honest about state */}
      <section className="border-t border-white/10 bg-charcoal">
        <div className="container-luxe flex flex-col items-center gap-5 py-16 text-center">
          <span className="eyebrow">Stay Informed</span>
          <h2 className="font-display text-3xl text-white">The Journal, by email</h2>
          <p className="max-w-xl text-sm leading-relaxed text-ash">
            Newsletter sign-up is not connected to a mailing list in this deployment. Use the
            enquiry form and we will add you to the list manually.
          </p>
          <Button to="/contact" icon={<Icon name="mail" size={15} />}>
            Contact Us Instead
          </Button>
        </div>
      </section>
    </div>
  );
}
