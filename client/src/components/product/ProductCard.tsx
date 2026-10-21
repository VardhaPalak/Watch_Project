import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import Rating from "../ui/Rating";
import WatchArtwork from "../ui/WatchArtwork";
import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../context/CurrencyContext";
import { useToast } from "../../context/ToastContext";
import { useWishlist } from "../../context/WishlistContext";
import type { Product } from "../../types";

interface Props {
  product: Product;
  tone?: "light" | "dark";
  onQuickView?: (product: Product) => void;
  className?: string;
}

export default function ProductCard({ product, tone = "light", onQuickView, className = "" }: Props) {
  const { addItem } = useCart();
  const { format } = useCurrency();
  const { push } = useToast();
  const { has, toggle } = useWishlist();

  const isDark = tone === "dark";
  const wished = has(product._id);

  const handleAdd = () => {
    addItem(product, 1);
    push(`${product.name} added to your cart.`);
  };

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden border transition-all duration-500 hover:-translate-y-1 hover:shadow-luxe ${
        isDark
          ? "border-white/10 bg-charcoal hover:border-gold/45"
          : "border-black/5 bg-white hover:border-gold/50"
      } ${className}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#0d0d0d]">
        {product.images?.[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
        ) : (
          <WatchArtwork
            art={product.art}
            label={product.name}
            className="h-full w-full transition-transform duration-700 group-hover:scale-[1.06]"
          />
        )}

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex flex-col gap-1">
            {product.badges?.map((badge) => (
              <span
                key={badge}
                className="bg-gold px-2 py-1 text-[9px] font-medium uppercase tracking-[0.18em] text-jet-black"
              >
                {badge}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => toggle(product._id)}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            className={`flex h-9 w-9 items-center justify-center border backdrop-blur transition ${
              wished
                ? "border-gold bg-gold/20 text-gold"
                : "border-white/20 bg-black/40 text-white hover:border-gold hover:text-gold"
            }`}
          >
            <Icon name="heartFill" size={15} className={wished ? "" : "opacity-0 group-hover:opacity-100"} />
          </button>
        </div>

        {onQuickView ? (
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-center gap-2 border border-white/25 bg-black/70 py-2.5 text-[10px] uppercase tracking-[0.2em] text-white opacity-0 backdrop-blur transition-all duration-300 hover:border-gold hover:text-gold group-hover:translate-y-0 group-hover:opacity-100"
          >
            <Icon name="eye" size={14} />
            Quick View
          </button>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <span
          className={`text-[10px] uppercase tracking-[0.22em] ${isDark ? "text-gold" : "text-gold-dark"}`}
        >
          {product.collection}
        </span>

        <h3
          className={`font-display text-lg leading-snug sm:text-xl ${isDark ? "text-white" : "text-ink"}`}
        >
          <Link to={`/shop/${product.slug}`} className="transition hover:text-gold">
            {product.name}
          </Link>
        </h3>

        <Rating
          value={product.rating?.average || 0}
          count={product.rating?.count}
          tone={isDark ? "gold" : "dark"}
        />

        <div className="mt-1 flex items-baseline gap-2">
          <span className={`text-base font-medium ${isDark ? "text-white" : "text-ink"}`}>
            {format(product.price)}
          </span>
          {product.compareAtPrice > product.price ? (
            <span
              className={`text-xs line-through ${isDark ? "text-ash/70" : "text-neutral-400"}`}
            >
              {format(product.compareAtPrice)}
            </span>
          ) : null}
        </div>

        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={handleAdd}
            disabled={product.stock <= 0}
            className="flex w-full items-center justify-center gap-2 border border-ink/15 bg-ink px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-gold hover:bg-gold hover:text-jet-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Icon name="cart" size={14} />
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </article>
  );
}
