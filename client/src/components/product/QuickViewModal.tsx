import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import Rating from "../ui/Rating";
import WatchArtwork from "../ui/WatchArtwork";
import Button from "../ui/Button";
import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../context/CurrencyContext";
import { useToast } from "../../context/ToastContext";
import type { Product } from "../../types";

interface Props {
  product: Product | null;
  onClose: () => void;
  onEnquire?: (product: Product) => void;
}

export default function QuickViewModal({ product, onClose, onEnquire }: Props) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { format } = useCurrency();
  const { push } = useToast();

  useEffect(() => {
    setQuantity(1);
  }, [product?._id]);

  useEffect(() => {
    if (!product) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} quick view`}
        className="relative z-10 grid max-h-[90vh] w-full max-w-4xl overflow-y-auto border border-white/10 bg-charcoal shadow-luxe md:grid-cols-2"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center border border-white/15 bg-black/60 text-white transition hover:border-gold hover:text-gold"
        >
          <Icon name="close" size={16} />
        </button>

        <div className="relative aspect-square bg-[#0d0d0d]">
          {product.images?.[0]?.url ? (
            <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <WatchArtwork art={product.art} label={product.name} className="h-full w-full" />
          )}
        </div>

        <div className="flex flex-col gap-4 p-6 sm:p-8">
          <span className="eyebrow">{product.collection}</span>
          <h3 className="font-display text-3xl leading-tight text-white">{product.name}</h3>
          <Rating value={product.rating?.average || 0} count={product.rating?.count} />
          <div className="flex items-baseline gap-3">
            <span className="text-2xl text-gold">{format(product.price)}</span>
            {product.compareAtPrice > product.price ? (
              <span className="text-sm text-ash/70 line-through">{format(product.compareAtPrice)}</span>
            ) : null}
          </div>
          <p className="text-sm leading-relaxed text-ash">{product.shortDescription}</p>

          <ul className="grid gap-2 text-xs text-ash">
            {product.features?.slice(0, 4).map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Icon name="check" size={13} className="text-gold" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <span className="text-[11px] uppercase tracking-[0.2em] text-ash">Quantity</span>
            <div className="flex items-center border border-white/15">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="px-3 py-2 text-white transition hover:text-gold"
                aria-label="Decrease quantity"
              >
                <Icon name="minus" size={13} />
              </button>
              <span className="min-w-10 text-center text-sm text-white">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.min(product.stock || 99, value + 1))}
                className="px-3 py-2 text-white transition hover:text-gold"
                aria-label="Increase quantity"
              >
                <Icon name="plus" size={13} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              onClick={() => {
                addItem(product, quantity);
                push(`${product.name} added to your cart.`);
                onClose();
              }}
              icon={<Icon name="cart" size={15} />}
              className="w-full"
            >
              Add to Cart
            </Button>
            <div className="flex gap-3">
              <Link
                to={`/shop/${product.slug}`}
                onClick={onClose}
                className="flex-1 border border-white/20 px-4 py-3 text-center text-[11px] uppercase tracking-[0.2em] text-white transition hover:border-gold hover:text-gold"
              >
                View Details
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  onClose();
                  onEnquire?.(product);
                }}
                className="flex-1"
              >
                Enquire
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
