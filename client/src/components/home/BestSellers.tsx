import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import ProductCard from "../product/ProductCard";
import QuickViewModal from "../product/QuickViewModal";
import { fetchProducts } from "../../lib/catalog";
import type { Product } from "../../types";

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickView, setQuickView] = useState<Product | null>(null);

  useEffect(() => {
    let active = true;
    fetchProducts({ featured: true, limit: 6 })
      .then((result) => {
        if (active) setProducts(result.items);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="bg-off-white py-16 text-ink md:py-24">
      <div className="container-luxe">
        <Reveal>
          <SectionHeading
            eyebrow="The pieces our clients return to"
            title="Best Sellers"
            subtitle="Six timepieces that define the house this season — chosen for their finishing, movement and lasting appeal."
            tone="light"
            action={
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 border-b border-gold/60 pb-1 text-[11px] uppercase tracking-[0.2em] text-ink transition hover:text-gold-dark"
              >
                View All Products
                <Icon name="arrowRight" size={13} className="transition-transform group-hover:translate-x-1" />
              </Link>
            }
          />
        </Reveal>

        {loading ? (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[420px] animate-pulse border border-black/5 bg-white"
                aria-hidden="true"
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <Reveal key={product._id} delay={index * 60}>
                <ProductCard product={product} tone="light" onQuickView={setQuickView} />
              </Reveal>
            ))}
          </div>
        )}
      </div>

      <QuickViewModal
        product={quickView}
        onClose={() => setQuickView(null)}
        onEnquire={(product) => {
          window.location.href = `/enquiry?product=${encodeURIComponent(product.name)}`;
        }}
      />
    </section>
  );
}
