import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import Rating from "../components/ui/Rating";
import WatchArtwork from "../components/ui/WatchArtwork";
import ProductCard from "../components/product/ProductCard";
import Reveal from "../components/ui/Reveal";
import { fetchProduct } from "../lib/catalog";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import { useToast } from "../context/ToastContext";
import { useWishlist } from "../context/WishlistContext";
import type { Product } from "../types";

export default function ProductDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { format } = useCurrency();
  const { push } = useToast();
  const { has, toggle } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setQuantity(1);
    setActiveImage(0);
    fetchProduct(id)
      .then((result) => {
        if (!active) return;
        setProduct(result.product);
        setRelated(result.related);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="container-luxe grid gap-10 py-16 lg:grid-cols-2">
        <div className="h-[520px] animate-pulse bg-charcoal" />
        <div className="flex flex-col gap-4">
          <div className="h-6 w-1/3 animate-pulse bg-charcoal" />
          <div className="h-10 w-3/4 animate-pulse bg-charcoal" />
          <div className="h-24 animate-pulse bg-charcoal" />
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="container-luxe flex flex-col items-center gap-5 py-24 text-center">
        <h1 className="font-display text-3xl text-white">Timepiece not found</h1>
        <p className="text-sm text-ash">This piece may have been retired from the collection.</p>
        <Button to="/shop">Browse the Collection</Button>
      </section>
    );
  }

  const gallery = product.images?.length ? product.images.map((image) => image.url) : [];
  const wished = has(product._id);

  return (
    <section className="bg-jet-black pb-20 pt-10">
      <div className="container-luxe">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/35">
          <Link to="/" className="transition hover:text-gold">
            Home
          </Link>
          <Icon name="chevronRight" size={11} />
          <Link to="/shop" className="transition hover:text-gold">
            Shop
          </Link>
          <Icon name="chevronRight" size={11} />
          <Link to={`/shop?category=${product.category}`} className="transition hover:text-gold">
            {product.category}
          </Link>
          <Icon name="chevronRight" size={11} />
          <span className="text-gold">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square overflow-hidden border border-white/10 bg-[#0b0b0b]">
              {gallery[activeImage] ? (
                <img src={gallery[activeImage]} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <WatchArtwork art={product.art} label={product.name} className="h-full w-full" />
              )}

              {product.compareAtPrice > product.price ? (
                <span className="absolute left-4 top-4 bg-gold px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-jet-black">
                  Save {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                </span>
              ) : null}
            </div>

            <div className="flex gap-3">
              {(gallery.length ? gallery : [null]).map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`View image ${index + 1}`}
                  className={`h-20 w-20 overflow-hidden border transition ${
                    index === activeImage ? "border-gold" : "border-white/12 hover:border-gold/60"
                  }`}
                >
                  {image ? (
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <WatchArtwork art={product.art} label="" className="h-full w-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <span className="eyebrow">{product.collection}</span>
            <h1 className="mt-3 font-display text-3xl leading-tight text-white sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-5">
              <Rating value={product.rating?.average || 0} count={product.rating?.count} />
              <span className="text-[11px] uppercase tracking-[0.18em] text-white/35">SKU: {product.sku}</span>
              <span
                className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] ${
                  product.stock > 0 ? "text-emerald-400/90" : "text-red-400/90"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {product.stock > 0 ? `In stock (${product.stock})` : "Out of stock"}
              </span>
            </div>

            <div className="mt-7 flex items-baseline gap-4">
              <span className="font-display text-4xl text-gold">{format(product.price)}</span>
              {product.compareAtPrice > product.price ? (
                <span className="text-lg text-white/35 line-through">{format(product.compareAtPrice)}</span>
              ) : null}
            </div>

            <p className="mt-6 text-[14px] leading-relaxed text-ash">{product.description || product.shortDescription}</p>

            <ul className="mt-6 flex flex-col gap-2.5">
              {product.features?.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-[13px] text-ash">
                  <Icon name="check" size={14} className="mt-0.5 shrink-0 text-gold" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-7">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-[11px] uppercase tracking-[0.2em] text-ash">Quantity</span>
                <div className="flex items-center border border-white/15">
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    aria-label="Decrease quantity"
                    className="px-3.5 py-2.5 text-warm-white transition hover:text-gold"
                  >
                    <Icon name="minus" size={13} />
                  </button>
                  <span className="min-w-12 text-center text-sm text-white">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => Math.min(product.stock || 99, value + 1))}
                    aria-label="Increase quantity"
                    className="px-3.5 py-2.5 text-warm-white transition hover:text-gold"
                  >
                    <Icon name="plus" size={13} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => toggle(product._id)}
                  className={`flex h-11 w-11 items-center justify-center border transition ${
                    wished ? "border-gold bg-gold/15 text-gold" : "border-white/15 text-ash hover:border-gold hover:text-gold"
                  }`}
                  aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Icon name="heartFill" size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  className="flex-1"
                  disabled={product.stock <= 0}
                  icon={<Icon name="cart" size={15} />}
                  onClick={() => {
                    addItem(product, quantity);
                    push(`${product.name} added to your cart.`);
                  }}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  icon={<Icon name="mail" size={15} />}
                  onClick={() => navigate(`/enquiry?product=${encodeURIComponent(product.name)}`)}
                >
                  Enquire About This Watch
                </Button>
              </div>

              <ul className="grid gap-2 pt-2 text-[11px] text-white/40 sm:grid-cols-2">
                <li className="flex items-center gap-2">
                  <Icon name="truck" size={13} className="text-gold" />
                  Free worldwide shipping
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="shield" size={13} className="text-gold" />
                  2 year international warranty
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="refresh" size={13} className="text-gold" />
                  30 day returns
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="lock" size={13} className="text-gold" />
                  Secure enquiry handling
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specs?.length ? (
          <Reveal className="mt-16 border-t border-white/10 pt-10">
            <h2 className="font-display text-2xl text-white">Specifications</h2>
            <div className="gold-rule mt-3 w-20" />
            <dl className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.specs.map((spec) => (
                <div key={spec.label} className="flex items-baseline justify-between gap-4 border-b border-white/5 pb-3">
                  <dt className="text-[11px] uppercase tracking-[0.16em] text-white/40">{spec.label}</dt>
                  <dd className="text-right text-[13px] text-warm-white">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ) : null}

        {/* Related */}
        {related.length ? (
          <div className="mt-16">
            <div className="flex items-end justify-between">
              <div>
                <span className="eyebrow">You may also like</span>
                <h2 className="mt-3 font-display text-2xl text-white">Related Timepieces</h2>
              </div>
              <Link
                to="/shop"
                className="text-[11px] uppercase tracking-[0.18em] text-gold transition hover:text-gold-light"
              >
                View All
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item._id} product={item} tone="dark" />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
