import { useEffect, useState } from "react";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import Reveal from "../components/ui/Reveal";
import ProductCard from "../components/product/ProductCard";
import { api } from "../lib/api";
import { useWishlist } from "../context/WishlistContext";
import type { Paginated, Product } from "../types";

export default function Wishlist() {
  const { ids, count, clear } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const queryKey = ids.join(",");

  useEffect(() => {
    if (!ids.length) {
      setProducts([]);
      setLoading(false);
      setError("");
      return;
    }

    let active = true;
    setLoading(true);
    setError("");

    api
      .get<Paginated<Product>>(`/products?ids=${encodeURIComponent(ids.join(","))}&limit=60`)
      .then((data) => {
        if (active) setProducts(data?.items || []);
      })
      .catch(() => {
        if (active) {
          setProducts([]);
          setError("We could not load your saved pieces just now. Please try again in a moment.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [queryKey]);

  const isEmpty = count === 0;

  return (
    <div className="bg-off-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 bg-jet-black">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full bg-gold/5 blur-3xl" />
        <div className="container-luxe relative flex flex-col items-center gap-5 py-20 text-center md:py-24">
          <span className="eyebrow">Saved Pieces</span>
          <h1 className="font-display text-4xl leading-tight tracking-wide text-white sm:text-5xl">
            Your <span className="text-gold">wishlist</span>
          </h1>
          <div className="gold-rule w-full max-w-[120px]" />
          <p className="max-w-2xl text-sm leading-relaxed text-ash">
            {isEmpty
              ? "Nothing saved yet. Tap the heart on any timepiece and it will wait for you here."
              : `${count} ${count === 1 ? "piece" : "pieces"} saved. Wishlist items are kept in this browser so you can compare them before you decide.`}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container-luxe py-14 md:py-20">
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-20">
            <span className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            <p className="text-sm text-neutral-600">Loading your saved pieces…</p>
          </div>
        ) : isEmpty ? (
          <Reveal className="flex flex-col items-center gap-6 py-16 text-center">
            <span className="flex h-20 w-20 items-center justify-center border border-black/10 bg-white text-gold-dark">
              <Icon name="heart" size={30} />
            </span>
            <h2 className="font-display text-3xl text-ink text-neutral-900">Your wishlist is empty</h2>
            <p className="max-w-md text-sm leading-relaxed text-neutral-600">
              Browse the catalogue and save the references you would like to compare. Saved pieces
              stay in this browser until you clear them.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button to="/shop" icon={<Icon name="arrowRight" size={15} />}>
                Browse the Catalogue
              </Button>
              <Button to="/collections" variant="outline">
                Explore Collections
              </Button>
            </div>
          </Reveal>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-5">
              <p className="text-sm text-neutral-600">
                {count} saved {count === 1 ? "piece" : "pieces"} · {products.length} currently
                available
              </p>
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-neutral-500 transition hover:text-gold-dark"
              >
                <Icon name="trash" size={14} />
                Clear wishlist
              </button>
            </div>

            {error ? (
              <div
                role="alert"
                className="flex items-start gap-3 border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-700"
              >
                <Icon name="close" size={16} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            ) : null}

            {products.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product, index) => (
                  <Reveal key={product._id} delay={index * 60} className="h-full">
                    <ProductCard product={product} tone="light" className="h-full" />
                  </Reveal>
                ))}
              </div>
            ) : (
              <Reveal className="flex flex-col items-center gap-5 border border-black/10 bg-white py-16 text-center">
                <span className="flex h-16 w-16 items-center justify-center border border-black/10 text-gold-dark">
                  <Icon name="search" size={26} />
                </span>
                <h2 className="font-display text-2xl text-ink text-neutral-900">Nothing to show yet</h2>
                <p className="max-w-md text-sm leading-relaxed text-neutral-600">
                  The pieces you saved are not currently available in the catalogue. They may have
                  been retired or renamed — browse the full range to find a close alternative.
                </p>
                <Button to="/shop" icon={<Icon name="arrowRight" size={15} />}>
                  Browse the Catalogue
                </Button>
              </Reveal>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
