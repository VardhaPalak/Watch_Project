import { useRef, type ReactNode } from "react";
import Icon from "./Icon";

interface Props {
  children: ReactNode;
  ariaLabel?: string;
  className?: string;
  itemClassName?: string;
  showArrows?: boolean;
}

export default function Carousel({
  children,
  ariaLabel,
  className = "",
  itemClassName = "",
  showArrows = true,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (direction: number) => {
    const node = scrollerRef.current;
    if (!node) return;
    const amount = Math.max(node.clientWidth * 0.8, 240);
    node.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <div className={`relative ${className}`}>
      {showArrows ? (
        <>
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Previous items"
            className="absolute -left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/15 bg-jet-black/90 text-warm-white transition hover:border-gold hover:text-gold md:flex"
          >
            <Icon name="chevronLeft" size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Next items"
            className="absolute -right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/15 bg-jet-black/90 text-warm-white transition hover:border-gold hover:text-gold md:flex"
          >
            <Icon name="chevronRight" size={18} />
          </button>
        </>
      ) : null}

      <div
        ref={scrollerRef}
        aria-label={ariaLabel}
        className={`hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 md:gap-6 ${itemClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
