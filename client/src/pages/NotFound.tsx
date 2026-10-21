import Icon from "../components/ui/Icon";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Reveal from "../components/ui/Reveal";
import WatchArtwork from "../components/ui/WatchArtwork";
import type { ProductArt } from "../types";

const LOST_ART: ProductArt = {
  case: "gold",
  dial: "#101418",
  strap: "#221a12",
  strapStyle: "leather",
  dialStyle: "sunburst",
  accent: "#B89458",
  background: "#0c0c0c",
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-jet-black">
      <div className="pointer-events-none absolute -left-32 top-1/4 h-[460px] w-[460px] rounded-full bg-gold/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-gold/5 blur-3xl" />

      <div className="container-luxe relative grid items-center gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <div className="flex flex-col items-start gap-6">
            <span className="eyebrow">Page Not Found</span>
            <span className="font-display text-7xl leading-none text-gold sm:text-8xl lg:text-9xl">
              404
            </span>
            <h1 className="font-display text-3xl leading-tight text-white sm:text-4xl">
              This page has stopped ticking
            </h1>
            <div className="gold-rule w-full max-w-[120px]" />
            <p className="max-w-lg text-sm leading-relaxed text-ash">
              The page you were looking for has moved or never existed. The catalogue is still
              where you left it — start again from the shop or head back to the beginning.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button to="/" icon={<Icon name="arrowLeft" size={15} />}>
                Back to Home
              </Button>
              <Button to="/shop" variant="outline">
                Browse the Catalogue
              </Button>
            </div>
            <p className="text-xs tracking-wide text-ash/70">
              Looking for something specific?{" "}
              <Link
                to="/contact"
                className="text-gold underline underline-offset-4 transition hover:text-gold-light"
              >
                Contact the team
              </Link>
            </p>
          </div>
        </Reveal>

        <Reveal delay={140} className="flex justify-center">
          <div className="w-full max-w-sm border border-white/10 bg-charcoal p-3 shadow-luxe">
            <WatchArtwork art={LOST_ART} label="TIMECRAFT timepiece" className="w-full" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
