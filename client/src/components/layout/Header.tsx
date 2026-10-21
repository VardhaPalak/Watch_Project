import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Icon from "../ui/Icon";
import WatchArtwork from "../ui/WatchArtwork";
import Button from "../ui/Button";
import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../context/CurrencyContext";
import { api } from "../../lib/api";
import type { Product } from "../../types";

const SHOP_LINKS = [
  { label: "All Watches", to: "/shop" },
  { label: "Men's Watches", to: "/shop?category=men" },
  { label: "Women's Watches", to: "/shop?category=women" },
  { label: "Sports Watches", to: "/shop?category=sports" },
  { label: "Smart Watches", to: "/shop?category=smart" },
  { label: "Limited Edition", to: "/shop?category=limited" },
];

const COLLECTION_LINKS = [
  { label: "Signature", to: "/shop?collection=Signature" },
  { label: "Heritage", to: "/shop?collection=Heritage" },
  { label: "Marine", to: "/shop?collection=Marine" },
  { label: "Solstice", to: "/shop?collection=Solstice" },
  { label: "Avant", to: "/shop?collection=Avant" },
];

const PRIMARY_LINKS = [
  { label: "Home", to: "/" },
  { label: "Brands", to: "/brands" },
  { label: "About Us", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { count, openCart } = useCart();
  const { format } = useCurrency();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (searchOpen) {
      const timer = window.setTimeout(() => searchInputRef.current?.focus(), 120);
      return () => window.clearTimeout(timer);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen || query.trim().length < 2) {
      setResults([]);
      return;
    }
    let active = true;
    setSearching(true);
    const timer = window.setTimeout(() => {
      api
        .get<{ items: Product[] }>(`/products?q=${encodeURIComponent(query.trim())}&limit=6`)
        .then((data) => {
          if (active) setResults(data.items || []);
        })
        .catch(() => {
          if (active) setResults([]);
        })
        .finally(() => {
          if (active) setSearching(false);
        });
    }, 280);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query, searchOpen]);

  const searchResults = useMemo(() => results.slice(0, 6), [results]);

  const closeMobile = () => setMobileOpen(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
      isActive ? "text-gold" : "text-warm-white/80 hover:text-gold"
    }`;

  return (
    <>
      <header
        className={`sticky top-0 z-[70] border-b transition-all duration-300 ${
          scrolled
            ? "border-white/10 bg-jet-black/95 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.9)] backdrop-blur-md"
            : "border-white/5 bg-jet-black"
        }`}
      >
        <div className="container-luxe">
          <div className="flex h-[72px] items-center justify-between gap-4 lg:h-[86px]">
            {/* Logo */}
            <Link to="/" className="flex shrink-0 items-center gap-3" onClick={closeMobile}>
              <span className="flex h-10 w-10 items-center justify-center border border-gold/40 bg-charcoal">
                <Icon name="crown" size={19} className="text-gold" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-lg tracking-[0.3em] text-white sm:text-xl">TIMECRAFT</span>
                <span className="mt-1 hidden text-[9px] uppercase tracking-[0.28em] text-gold/80 sm:block">
                  Excellence in Every Second
                </span>
              </span>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden items-center gap-7 lg:flex">
              <NavLink to="/" end className={navLinkClass}>
                Home
              </NavLink>

              <div
                className="relative"
                onMouseEnter={() => setOpenMenu("shop")}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                    openMenu === "shop" ? "text-gold" : "text-warm-white/80 hover:text-gold"
                  }`}
                  onClick={() => setOpenMenu(openMenu === "shop" ? null : "shop")}
                  aria-expanded={openMenu === "shop"}
                >
                  Shop
                  <Icon
                    name="chevronDown"
                    size={13}
                    className={`transition-transform duration-300 ${openMenu === "shop" ? "rotate-180" : ""}`}
                  />
                </button>
                {openMenu === "shop" ? (
                  <div className="absolute left-1/2 top-full w-60 -translate-x-1/2 border border-white/10 bg-charcoal/98 p-2 shadow-luxe backdrop-blur">
                    {SHOP_LINKS.map((link) => (
                      <Link
                        key={link.label}
                        to={link.to}
                        onClick={() => setOpenMenu(null)}
                        className="block px-4 py-2.5 text-[11px] uppercase tracking-[0.16em] text-ash transition hover:bg-gold/10 hover:text-gold"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>

              <div
                className="relative"
                onMouseEnter={() => setOpenMenu("collections")}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                    openMenu === "collections" ? "text-gold" : "text-warm-white/80 hover:text-gold"
                  }`}
                  onClick={() => setOpenMenu(openMenu === "collections" ? null : "collections")}
                  aria-expanded={openMenu === "collections"}
                >
                  Collections
                  <Icon
                    name="chevronDown"
                    size={13}
                    className={`transition-transform duration-300 ${
                      openMenu === "collections" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openMenu === "collections" ? (
                  <div className="absolute left-1/2 top-full w-56 -translate-x-1/2 border border-white/10 bg-charcoal/98 p-2 shadow-luxe backdrop-blur">
                    {COLLECTION_LINKS.map((link) => (
                      <Link
                        key={link.label}
                        to={link.to}
                        onClick={() => setOpenMenu(null)}
                        className="block px-4 py-2.5 text-[11px] uppercase tracking-[0.16em] text-ash transition hover:bg-gold/10 hover:text-gold"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>

              {PRIMARY_LINKS.slice(1).map((link) => (
                <NavLink key={link.label} to={link.to} className={navLinkClass}>
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search products"
                className="flex h-10 w-10 items-center justify-center text-warm-white/80 transition hover:text-gold"
              >
                <Icon name="search" size={18} />
              </button>

              <Link
                to="/account"
                aria-label="My account"
                className="hidden h-10 w-10 items-center justify-center text-warm-white/80 transition hover:text-gold sm:flex"
              >
                <Icon name="user" size={18} />
              </Link>

              <button
                type="button"
                onClick={openCart}
                aria-label={`Shopping cart with ${count} items`}
                className="relative flex h-10 w-10 items-center justify-center text-warm-white/80 transition hover:text-gold"
              >
                <Icon name="cart" size={19} />
                {count > 0 ? (
                  <span className="absolute right-0.5 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-medium text-jet-black">
                    {count}
                  </span>
                ) : null}
              </button>

              <Button to="/enquiry" size="sm" className="ml-1 hidden px-5 md:inline-flex">
                Enquire Now
              </Button>

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="flex h-10 w-10 items-center justify-center text-warm-white/80 transition hover:text-gold lg:hidden"
              >
                <Icon name="menu" size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-[95] lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeMobile} />
          <div className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col overflow-y-auto border-l border-white/10 bg-charcoal">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <span className="font-display text-lg tracking-[0.3em] text-white">TIMECRAFT</span>
              <button
                type="button"
                onClick={closeMobile}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center text-warm-white/70 transition hover:text-gold"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-1 px-5 py-5">
              <Link to="/" onClick={closeMobile} className="py-3 text-sm uppercase tracking-[0.18em] text-warm-white/85">
                Home
              </Link>

              <details className="group border-b border-white/5">
                <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-sm uppercase tracking-[0.18em] text-warm-white/85">
                  Shop
                  <Icon name="chevronDown" size={15} className="transition group-open:rotate-180" />
                </summary>
                <div className="flex flex-col gap-1 pb-3 pl-3">
                  {SHOP_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      onClick={closeMobile}
                      className="py-2 text-[13px] text-ash transition hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </details>

              <details className="group border-b border-white/5">
                <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-sm uppercase tracking-[0.18em] text-warm-white/85">
                  Collections
                  <Icon name="chevronDown" size={15} className="transition group-open:rotate-180" />
                </summary>
                <div className="flex flex-col gap-1 pb-3 pl-3">
                  {COLLECTION_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      onClick={closeMobile}
                      className="py-2 text-[13px] text-ash transition hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </details>

              {PRIMARY_LINKS.slice(1).map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={closeMobile}
                  className="border-b border-white/5 py-3 text-sm uppercase tracking-[0.18em] text-warm-white/85"
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-5 flex flex-col gap-3">
                <Button to="/enquiry" onClick={closeMobile} className="w-full">
                  Enquire Now
                </Button>
                <div className="flex items-center gap-4">
                  <Link
                    to="/account"
                    onClick={closeMobile}
                    aria-label="My account"
                    className="flex h-11 w-11 items-center justify-center border border-white/12 text-warm-white/80"
                  >
                    <Icon name="user" size={18} />
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={closeMobile}
                    aria-label="Wishlist"
                    className="flex h-11 w-11 items-center justify-center border border-white/12 text-warm-white/80"
                  >
                    <Icon name="heart" size={18} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      closeMobile();
                      openCart();
                    }}
                    aria-label="Open cart"
                    className="relative flex h-11 w-11 items-center justify-center border border-white/12 text-warm-white/80"
                  >
                    <Icon name="cart" size={18} />
                    {count > 0 ? (
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] text-jet-black">
                        {count}
                      </span>
                    ) : null}
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      ) : null}

      {/* Search overlay */}
      {searchOpen ? (
        <div className="fixed inset-0 z-[95]">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
          <div className="relative mx-auto mt-24 w-[min(94vw,720px)] border border-white/10 bg-charcoal p-6 shadow-luxe sm:p-8">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Icon name="search" size={18} className="text-gold" />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && query.trim()) {
                    setSearchOpen(false);
                    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
                  }
                }}
                placeholder="Search for a timepiece, collection or reference…"
                className="w-full bg-transparent text-sm text-warm-white outline-none placeholder:text-white/30"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="text-warm-white/60 transition hover:text-gold"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="mt-5 max-h-[55vh] overflow-y-auto">
              {searching ? (
                <p className="py-6 text-center text-xs uppercase tracking-[0.2em] text-ash">Searching…</p>
              ) : query.trim().length < 2 ? (
                <div className="flex flex-col gap-3 py-4">
                  <span className="text-[10px] uppercase tracking-[0.24em] text-gold">Popular searches</span>
                  {["Classic Chronograph", "Ocean Master", "Limited Edition", "Heritage"].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="flex items-center gap-3 py-1.5 text-left text-sm text-ash transition hover:text-gold"
                    >
                      <Icon name="arrowRight" size={13} />
                      {term}
                    </button>
                  ))}
                </div>
              ) : searchResults.length ? (
                <ul className="flex flex-col divide-y divide-white/5">
                  {searchResults.map((product) => (
                    <li key={product._id}>
                      <Link
                        to={`/shop/${product.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-4 py-3 transition hover:bg-white/[0.03]"
                      >
                        <span className="h-14 w-14 shrink-0 overflow-hidden bg-[#0d0d0d]">
                          <WatchArtwork art={product.art} label={product.name} className="h-full w-full" />
                        </span>
                        <span className="flex-1">
                          <span className="block font-display text-base text-white">{product.name}</span>
                          <span className="block text-[10px] uppercase tracking-[0.18em] text-gold">
                            {product.collection}
                          </span>
                        </span>
                        <span className="text-sm text-gold">{format(product.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-8 text-center text-sm text-ash">
                  No timepieces matched “{query}”. Try a collection or model name.
                </p>
              )}
            </div>

            {query.trim().length >= 2 ? (
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
                }}
                className="mt-5 flex w-full items-center justify-center gap-2 border border-gold/40 py-3 text-[11px] uppercase tracking-[0.2em] text-gold transition hover:bg-gold hover:text-jet-black"
              >
                View all results
                <Icon name="arrowRight" size={13} />
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
