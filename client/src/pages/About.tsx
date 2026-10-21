import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import SectionHeading from "../components/ui/SectionHeading";
import Reveal from "../components/ui/Reveal";
import WatchArtwork from "../components/ui/WatchArtwork";
import { BRAND, SERVICE_BENEFITS } from "../config/site";
import type { ProductArt } from "../types";

const ATELIER_ART: ProductArt = {
  case: "gold",
  dial: "#101418",
  strap: "#221a12",
  strapStyle: "leather",
  dialStyle: "sunburst",
  accent: "#B89458",
  background: "#0c0c0c",
};

const ANCHORS = [
  { id: "craftsmanship", label: "Craftsmanship" },
  { id: "sustainability", label: "Sustainability" },
  { id: "careers", label: "Careers" },
];

const ATELIER_STATS = [
  { value: "02", unit: "Years", label: "Warranty", detail: "International coverage on every timepiece" },
  { value: "30", unit: "Days", label: "Returns", detail: "A straightforward return window" },
  { value: "24/7", unit: "", label: "Support", detail: "Enquiry-led assistance for collectors" },
  { value: "100", unit: "%", label: "Authentic", detail: "Genuine pieces with documented provenance" },
];

const CRAFT_POINTS = [
  "Cases finished by hand, with every polished bevel inspected under magnification.",
  "Dials assembled in-house so indices, hands and lume sit flush against the plate.",
  "Movements regulated in six positions before a watch is cleared for delivery.",
  "Straps cut and stitched to match the case profile, then fitted with quick-release spring bars.",
];

const SUSTAIN_POINTS = [
  "Service before replacement — movements are cleaned, regulated and returned to the wrist.",
  "Replaceable parts — straps, batteries, crystal and bezels are stocked rather than discarded.",
  "Right-sized packaging — recycled board, paper tape and no single-use plastic inserts.",
  "Longer ownership — care guidance is published so a TIMECRAFT piece stays in rotation for decades.",
];

const ROLES = [
  { title: "Retail Experience Associate", location: "Mumbai · Full time", type: "Client advisory" },
  { title: "Technical Support Specialist", location: "Remote (IST hours) · Full time", type: "After-sales" },
  { title: "Editorial Photographer", location: "Mumbai · Contract", type: "Content studio" },
];

function useAnchorScroll() {
  const location = useLocation();

  useEffect(() => {
    const fromRoute = location.hash.replace(/^#/, "");
    const fromWindow = window.location.hash.replace(/^#/, "").split("#").pop() || "";
    const id = fromRoute || fromWindow;
    if (!id || id === "/") return;

    const target = document.getElementById(id);
    if (!target) return;

    const timer = window.setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 90);

    return () => window.clearTimeout(timer);
  }, [location.hash]);
}

export default function About() {
  useAnchorScroll();

  return (
    <div className="bg-jet-black">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-gold/5 blur-3xl" />
        <div className="container-luxe relative grid items-center gap-12 py-20 md:py-28 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div className="flex flex-col gap-6">
              <span className="eyebrow">Our Story</span>
              <h1 className="font-display text-4xl leading-[1.08] tracking-wide text-white sm:text-5xl lg:text-6xl">
                A house built around the <span className="text-gold">honest second</span>
              </h1>
              <div className="gold-rule w-full max-w-[120px]" />
              <p className="max-w-xl text-sm leading-relaxed text-ash sm:text-base">
                {BRAND.description} We are an independent retailer: we choose, document and
                service every watch we sell, and we tell you exactly what you are buying.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button to="/collections" icon={<Icon name="crown" size={15} />}>
                  Explore Collections
                </Button>
                <Button to="/enquiry" variant="outline">
                  Start an Enquiry
                </Button>
              </div>
              <nav aria-label="On this page" className="flex flex-wrap gap-x-6 gap-y-2 pt-4">
                {ANCHORS.map((anchor) => (
                  <Link
                    key={anchor.id}
                    to={`/about#${anchor.id}`}
                    className="text-[11px] uppercase tracking-[0.2em] text-ash transition hover:text-gold"
                  >
                    {anchor.label}
                  </Link>
                ))}
              </nav>
            </div>
          </Reveal>

          <Reveal delay={140} className="flex justify-center">
            <div className="w-full max-w-sm border border-white/10 bg-charcoal p-3 shadow-luxe">
              <WatchArtwork art={ATELIER_ART} label="TIMECRAFT atelier timepiece" className="w-full" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Atelier stats */}
      <section className="border-b border-white/10 bg-charcoal">
        <div className="container-luxe grid gap-px py-0 sm:grid-cols-2 lg:grid-cols-4">
          {ATELIER_STATS.map((stat, index) => (
            <Reveal
              key={stat.label}
              delay={index * 90}
              className="border-b border-white/10 py-8 sm:border-b-0 sm:px-6 sm:first:pl-0 lg:py-10"
            >
              <div className="flex items-baseline gap-1">
                <span className="font-display text-4xl text-gold sm:text-5xl">{stat.value}</span>
                {stat.unit ? <span className="text-sm uppercase tracking-[0.2em] text-ash">{stat.unit}</span> : null}
              </div>
              <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-white">{stat.label}</p>
              <p className="mt-2 text-xs leading-relaxed text-ash">{stat.detail}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Craftsmanship */}
      <section id="craftsmanship" className="scroll-mt-24 bg-off-white">
        <div className="container-luxe grid items-center gap-12 py-20 md:py-28 lg:grid-cols-2">
          <Reveal>
            <div className="flex flex-col gap-6">
              <SectionHeading
                align="left"
                tone="light"
                eyebrow="Craftsmanship"
                title={
                  <span className="text-ink text-neutral-900">The discipline of assembly</span>
                }
                subtitle="A watch earns its value in the details most people never see. Ours are documented, checked and explained before delivery."
              />
              <ul className="flex flex-col gap-3">
                {CRAFT_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-neutral-700">
                    <Icon name="check" size={15} className="mt-0.5 shrink-0 text-gold-dark" />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button to="/shop" variant="dark" icon={<Icon name="arrowRight" size={15} />}>
                  Browse the Catalogue
                </Button>
                <Button to="/contact" variant="outline">
                  Ask a Question
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="flex justify-center">
            <div className="w-full max-w-md border border-black/10 bg-white p-3 shadow-luxe">
              <WatchArtwork
                art={{ ...ATELIER_ART, dialStyle: "skeleton", background: "#0a0906", accent: "#E9C888" }}
                label="Hand-finished TIMECRAFT movement"
                className="w-full"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Sustainability */}
      <section id="sustainability" className="scroll-mt-24 border-y border-white/10 bg-jet-black">
        <div className="container-luxe grid items-center gap-12 py-20 md:py-28 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="order-2 flex justify-center lg:order-1">
            <div className="w-full max-w-md border border-white/10 bg-charcoal p-3">
              <WatchArtwork
                art={{ ...ATELIER_ART, case: "steel", strapStyle: "bracelet", strap: "#8f9499" }}
                label="Longevity-first service philosophy"
                className="w-full"
              />
            </div>
          </Reveal>

          <Reveal delay={120} className="order-1 lg:order-2">
            <div className="flex flex-col gap-6">
              <SectionHeading
                align="left"
                eyebrow="Sustainability"
                title="Longevity is the greenest feature"
                subtitle="We would rather service a watch than replace it, and we would rather explain how to keep it running than sell you something new every season."
              />
              <ul className="grid gap-3 sm:grid-cols-2">
                {SUSTAIN_POINTS.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 border border-white/10 bg-charcoal/60 p-4 text-sm leading-relaxed text-ash"
                  >
                    <Icon name="sparkle" size={15} className="mt-0.5 shrink-0 text-gold" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Careers */}
      <section id="careers" className="scroll-mt-24 bg-off-white">
        <div className="container-luxe flex flex-col gap-10 py-20 md:py-28">
          <SectionHeading
            align="left"
            tone="light"
            eyebrow="Careers"
            title={<span className="text-ink text-neutral-900">Work with the house</span>}
            subtitle="We hire slowly and for people who care about the details of the customer experience. Open roles are listed below — speculative applications are welcome."
            action={
              <Button to="/enquiry" variant="dark" icon={<Icon name="mail" size={15} />}>
                Send an Application
              </Button>
            }
          />

          <div className="grid gap-4 md:grid-cols-3">
            {ROLES.map((role, index) => (
              <Reveal key={role.title} delay={index * 90}>
                <article className="flex h-full flex-col gap-3 border border-black/10 bg-white p-6 transition hover:border-gold/60">
                  <span className="text-[10px] uppercase tracking-[0.24em] text-gold-dark">{role.type}</span>
                  <h3 className="font-display text-xl text-ink text-neutral-900">{role.title}</h3>
                  <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">{role.location}</p>
                  <p className="mt-auto pt-4 text-xs leading-relaxed text-neutral-600">
                    Send a short note with your portfolio and availability. Every application is read
                    by the TIMECRAFT team.
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Service band */}
      <section className="border-t border-white/10 bg-charcoal">
        <div className="container-luxe grid gap-6 py-14 sm:grid-cols-2 lg:grid-cols-5">
          {SERVICE_BENEFITS.map((benefit, index) => (
            <Reveal key={benefit.title} delay={index * 70} className="flex items-start gap-3">
              <Icon name={benefit.icon} size={20} className="shrink-0 text-gold" />
              <div>
                <p className="text-sm text-white">{benefit.title}</p>
                <p className="mt-1 text-xs text-ash">{benefit.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-white/10 bg-jet-black">
        <div className="pointer-events-none absolute -right-24 top-0 h-[380px] w-[380px] rounded-full bg-gold/5 blur-3xl" />
        <div className="container-luxe relative flex flex-col items-center gap-6 py-20 text-center">
          <span className="eyebrow">Next Step</span>
          <h2 className="font-display text-3xl leading-tight text-white sm:text-4xl">
            Tell us what you are looking for
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-ash">
            Share your budget, the occasion and the references you admire. We will come back with
            a considered shortlist — not a catalogue dump.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button to="/enquiry" icon={<Icon name="mail" size={15} />}>
              Make an Enquiry
            </Button>
            <Button to="/contact" variant="outline">
              Contact the Atelier
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
