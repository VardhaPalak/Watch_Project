import { useState } from "react";
import Icon from "../ui/Icon";
import Rating from "../ui/Rating";
import Reveal from "../ui/Reveal";
import { TESTIMONIALS, TESTIMONIAL_DISCLAIMER } from "../../config/site";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const total = TESTIMONIALS.length;

  const move = (direction: number) => {
    setIndex((current) => (current + direction + total) % total);
  };

  const visible = [0, 1, 2].map((offset) => TESTIMONIALS[(index + offset) % total]);

  return (
    <section className="bg-off-white py-16 text-ink md:py-24">
      <div className="container-luxe">
        <Reveal>
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="eyebrow text-gold-dark">Word from our clients</span>
            <h2 className="font-display text-3xl tracking-wide text-ink sm:text-4xl">What Our Customers Say</h2>
            <div className="gold-rule mt-1 w-[120px]" />
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {visible.map((testimonial, position) => (
            <Reveal key={`${testimonial.name}-${position}`} delay={position * 90}>
              <figure className="relative flex h-full flex-col border border-black/5 bg-white px-7 py-8 transition-shadow duration-500 hover:shadow-luxe">
                <span className="absolute right-6 top-4 font-display text-6xl leading-none text-gold/35">“</span>
                <Rating value={testimonial.rating} tone="dark" showCount={false} />
                <blockquote className="mt-5 flex-1 text-[13px] leading-relaxed text-neutral-600">
                  {testimonial.quote}
                </blockquote>
                <figcaption className="mt-6 border-t border-black/5 pt-4">
                  <span className="block font-display text-lg text-ink">{testimonial.name}</span>
                  <span className="mt-0.5 block text-[11px] uppercase tracking-[0.18em] text-neutral-400">
                    {testimonial.location}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <div className="mt-9 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous testimonial"
            className="flex h-11 w-11 items-center justify-center border border-black/10 text-ink transition hover:border-gold hover:text-gold-dark"
          >
            <Icon name="chevronLeft" size={16} />
          </button>

          <div className="flex items-center gap-2" role="tablist" aria-label="Testimonials">
            {TESTIMONIALS.map((testimonial, dotIndex) => (
              <button
                key={testimonial.name}
                type="button"
                role="tab"
                aria-selected={dotIndex === index}
                aria-label={`Show testimonial ${dotIndex + 1}`}
                onClick={() => setIndex(dotIndex)}
                className={`h-1.5 w-6 transition-all duration-300 ${
                  dotIndex === index ? "bg-gold" : "bg-black/15 hover:bg-gold/50"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next testimonial"
            className="flex h-11 w-11 items-center justify-center border border-black/10 text-ink transition hover:border-gold hover:text-gold-dark"
          >
            <Icon name="chevronRight" size={16} />
          </button>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-[11px] leading-relaxed text-neutral-400">
          {TESTIMONIAL_DISCLAIMER}
        </p>
      </div>
    </section>
  );
}
