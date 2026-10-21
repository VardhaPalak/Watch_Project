import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import ProductCard from "../components/product/ProductCard";
import QuickViewModal from "../components/product/QuickViewModal";
import { fetchProducts } from "../lib/catalog";
import { useCurrency } from "../context/CurrencyContext";
import type { Product } from "../types";

const CATEGORY_OPTIONS = [
  { value: "", label: "All Watches" },
  { value: "men", label: "Men's Watches" },
  { value: "women", label: "Women's Watches" },
  { value: "sports", label: "Sports Watches" },
  { value: "smart", label: "Smart Watches" },
  { value: "limited", label: "Limited Edition" },
];

const COLLECTION_OPTIONS = ["", "Signature", "Heritage", "Marine", "Solstice", "Avant"];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "popular", label: "Most Reviewed" },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const { currency } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = params.get("category") || "";
  const collection = params.get("collection") || "";
  const query = params.get("q") || "";
  const sort = params.get("sort") || "newest";
  const minPrice = params.get("minPrice") || "";
  const maxPrice = params.get("maxPrice") || "";
  const featured = params.get("featured") === "true";

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next, { replace: true });
    setPage(1);
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchProducts({
      category: category || undefined,
      collection: collection || undefined,
      q: query || undefined,
      sort,
      featured,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      page,
      limit: 12,
    })
      .then((result) => {
        if (!active) return;
        setProducts(result.items);
        setTotal(result.total);
        setPages(result.pages);
        setOffline(result.offline);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [category, collection, query, sort, featured, minPrice, maxPrice, page]);

  const heading = useMemo(() => {
    if (query) return `Results for “${query}”`;
    if (category) return CATEGORY_OPTIONS.find((option) => option.value === category)?.label || "Watches";
    if (collection) return `${collection} Collection`;
    return "All Watches";
  }, [query, category, collection]);

  const hasFilters = Boolean(category || collection || query || minPrice || maxPrice || featured);

  const filterPanel = (
    <div className="flex flex-col gap-7">
      <div>
        <h3 className="mb-3 text-[10px] uppercase tracking-[0.24em] text-gold">Category</h3>
        <ul className="flex flex-col gap-2">
          {CATEGORY_OPTIONS.map((option) => (
            <li key={option.value || "all"}>
              <button
                type="button"
                onClick={() => updateParam("category", option.value)}
                className={`text-left text-[13px] transition ${
                  category === option.value ? "text-gold" : "text-ash hover:text-warm-white"
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-[10px] uppercase tracking-[0.24em] text-gold">Collection</h3>
        <select
          value={collection}
          onChange={(event) => updateParam("collection", event.target.value)}
          className="field"
          aria-label="Filter by collection"
        >
          {COLLECTION_OPTIONS.map((option) => (
            <option key={option || "all"} value={option}>
              {option || "All Collections"}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="mb-3 text-[10px] uppercase tracking-[0.24em] text-gold">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={minPrice}
            onChange={(event) => updateParam("minPrice", event.target.value)}
            placeholder="Min"
            aria-label="Minimum price"
            className="field"
          />
          <span className="text-white/30">—</span>
          <input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(event) => updateParam("maxPrice", event.target.value)}
            placeholder="Max"
            aria-label="Maximum price"
            className="field"
          />
        </div>
        <p className="mt-2 text-[11px] text-white/30">All prices are shown in {currency.code}.</p>
      </div>

      {hasFilters ? (
        <button
          type="button"
          onClick={() => setParams(new URLSearchParams(), { replace: true })}
          className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ash transition hover:text-gold"
        >
          <Icon name="close" size={13} />
          Clear all filters
        </button>
      ) : null}
    </div>
  );

  return (
    <section className="bg-jet-black pb-20 pt-12 md:pt-16">
      <div className="container-luxe">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/35">
          <span>Home</span>
          <Icon name="chevronRight" size={11} />
          <span className="text-gold">{heading}</span>
        </nav>

        <div className="mt-6 flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow">The Collection</span>
            <h1 className="mt-3 font-display text-3xl text-white sm:text-4xl">{heading}</h1>
            <p className="mt-2 text-sm text-ash">
              {loading ? "Curating…" : `${total} timepiece${total === 1 ? "" : "s"} available`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-2 border border-white/15 px-4 py-2.5 text-[11px] uppercase tracking-[0.16em] text-warm-white transition hover:border-gold hover:text-gold lg:hidden"
            >
              <Icon name="filter" size={14} />
              Filters
            </button>

            <label className="flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-ash">
              Sort
              <select
                value={sort}
                onChange={(event) => updateParam("sort", event.target.value)}
                className="field w-[170px] py-2.5 text-[11px] uppercase tracking-[0.12em]"
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 border border-white/10 bg-charcoal/50 p-6">{filterPanel}</div>
          </aside>

          <div>
            {offline ? (
              <div className="mb-6 flex items-start gap-3 border border-gold/30 bg-gold/5 px-4 py-3 text-[11px] leading-relaxed text-gold/90">
                <Icon name="sparkle" size={14} className="mt-0.5 shrink-0" />
                <span>
                  Showing the bundled demo catalogue — the live API is not reachable. Start the API and run the seed
                  script to serve products from MongoDB.
                </span>
              </div>
            ) : null}

            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-[430px] animate-pulse border border-white/10 bg-charcoal" />
                ))}
              </div>
            ) : products.length ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} tone="dark" onQuickView={setQuickView} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-5 border border-white/10 bg-charcoal/40 px-6 py-20 text-center">
                <Icon name="search" size={32} className="text-gold/50" />
                <p className="text-sm text-ash">No timepieces matched your filters.</p>
                <Button variant="outline" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
                  Reset Filters
                </Button>
              </div>
            )}

            {pages > 1 ? (
              <div className="mt-12 flex items-center justify-center gap-2">
                {Array.from({ length: pages }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setPage(index + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`h-10 w-10 border text-xs transition ${
                      page === index + 1
                        ? "border-gold bg-gold text-jet-black"
                        : "border-white/15 text-ash hover:border-gold hover:text-gold"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {filtersOpen ? (
        <div className="fixed inset-0 z-[85] lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto border-t border-white/10 bg-charcoal p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl tracking-[0.2em] text-white">Filters</h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="text-warm-white/70 transition hover:text-gold"
              >
                <Icon name="close" size={20} />
              </button>
            </div>
            {filterPanel}
            <Button className="mt-7 w-full" onClick={() => setFiltersOpen(false)}>
              Show {total} Result{total === 1 ? "" : "s"}
            </Button>
          </div>
        </div>
      ) : null}

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
