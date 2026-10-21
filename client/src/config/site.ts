import type { ProductArt } from "../types";
import type { IconName } from "../components/ui/Icon";

export const BRAND = {
  name: "TIMECRAFT",
  tagline: "Excellence in Every Second",
  description:
    "TIMECRAFT crafts and curates premium mechanical and smart timepieces for collectors who value precision, restraint and enduring design.",
};

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hello TIMECRAFT, I would like to enquire about your luxury watches.";

export const ANNOUNCEMENTS: Array<{ icon: IconName; title: string; detail: string }> = [
  { icon: "truck", title: "Free Shipping", detail: "Worldwide" },
  { icon: "shield", title: "2 Years Warranty", detail: "International" },
  { icon: "refresh", title: "Easy Returns", detail: "30 Days" },
  { icon: "headset", title: "Customer Support", detail: "24/7" },
];

export const SERVICE_BENEFITS: Array<{ icon: IconName; title: string; detail: string }> = [
  { icon: "truck", title: "Free Shipping", detail: "Worldwide Orders" },
  { icon: "shield", title: "2 Years Warranty", detail: "International Coverage" },
  { icon: "refresh", title: "Easy Returns", detail: "30 Days Return Policy" },
  { icon: "sparkle", title: "100% Authentic", detail: "Genuine Products" },
  { icon: "headset", title: "24/7 Support", detail: "We're Here to Help" },
];

export interface CategoryConfig {
  key: string;
  name: string;
  tagline: string;
  art: ProductArt;
}

const art = (
  overrides: Partial<ProductArt>,
): ProductArt => ({
  case: "gold",
  dial: "#101418",
  strap: "#221a12",
  strapStyle: "leather",
  dialStyle: "sunburst",
  accent: "#B89458",
  background: "#0c0c0c",
  ...overrides,
});

export const CATEGORIES: CategoryConfig[] = [
  {
    key: "men",
    name: "Men's Watches",
    tagline: "Bold silhouettes, quiet confidence",
    art: art({ dial: "#101418", strap: "#221a12", strapStyle: "leather" }),
  },
  {
    key: "women",
    name: "Women's Watches",
    tagline: "Refined elegance in every detail",
    art: art({ case: "rose", dial: "#f3ece4", strap: "#efe6db", dialStyle: "matte" }),
  },
  {
    key: "sports",
    name: "Sports Watches",
    tagline: "Engineered for motion",
    art: art({ case: "steel", dial: "#0b1c2b", strap: "#101418", strapStyle: "bracelet", dialStyle: "diver" }),
  },
  {
    key: "smart",
    name: "Smart Watches",
    tagline: "Intelligence, discreetly worn",
    art: art({ case: "black", dial: "#0c1013", strap: "#1a1a1a", strapStyle: "rubber", dialStyle: "digital", accent: "#7FD1C1" }),
  },
  {
    key: "limited",
    name: "Limited Edition",
    tagline: "Numbered pieces for collectors",
    art: art({ dial: "#151008", strap: "#22190f", dialStyle: "skeleton", accent: "#E9C888", background: "#0a0906" }),
  },
];

export interface PromoBanner {
  kicker: string;
  title: string;
  cta: string;
  href: string;
  art: ProductArt;
}

export const PROMO_BANNERS: PromoBanner[] = [
  {
    kicker: "LIMITED TIME OFFER",
    title: "UP TO 30% OFF ON SELECTED ITEMS",
    cta: "SHOP NOW",
    href: "/shop?featured=true",
    art: art({ case: "gold", dial: "#080808", strap: "#B89458", strapStyle: "bracelet", accent: "#E3C079" }),
  },
  {
    kicker: "EXCLUSIVE COLLECTION",
    title: "NEW ARRIVALS JUST FOR YOU",
    cta: "DISCOVER NOW",
    href: "/shop?sort=newest",
    art: art({ case: "steel", dial: "#0f1418", strap: "#8f9499", strapStyle: "bracelet", dialStyle: "sunburst" }),
  },
  {
    kicker: "PERFECT GIFT",
    title: "TIMELESS GIFTS FOR EVERY MOMENT",
    cta: "SHOP GIFTS",
    href: "/shop?collection=Solstice",
    art: art({ case: "rose", dial: "#f6efe4", strap: "#efe1cd", strapStyle: "leather", dialStyle: "matte" }),
  },
];

export const TRUSTED_BRANDS = [
  "Rolex",
  "Omega",
  "TAG Heuer",
  "Tissot",
  "Citizen",
  "Seiko",
  "Fossil",
];

export const BRAND_DISCLAIMER =
  "Brand names are listed for reference only. TIMECRAFT is an independent retailer and is not affiliated with, endorsed by or authorised by the manufacturers shown.";

export const TESTIMONIALS = [
  {
    quote:
      "The Classic Chronograph arrived in a hand-finished box with a personal note from the atelier. It feels like owning a piece of history.",
    name: "Arjun Mehta",
    location: "Mumbai, India",
    rating: 5,
  },
  {
    quote:
      "I compared three heritage divers before choosing TIMECRAFT. The guidance, the packaging and the two year warranty sold me completely.",
    name: "Sofia Fernandes",
    location: "Dubai, UAE",
    rating: 5,
  },
  {
    quote:
      "Ordered a bulk set of corporate gifts and the team handled sizing, engraving and delivery without a single delay.",
    name: "Daniel Okafor",
    location: "London, UK",
    rating: 5,
  },
];

export const TESTIMONIAL_DISCLAIMER =
  "Sample testimonials shown for demonstration purposes and pending replacement with verified customer reviews.";

export const FOOTER_COLUMNS: Array<{ title: string; links: Array<{ label: string; to: string }> }> = [
  {
    title: "Shop",
    links: [
      { label: "All Watches", to: "/shop" },
      { label: "Men's Watches", to: "/shop?category=men" },
      { label: "Women's Watches", to: "/shop?category=women" },
      { label: "Sports Watches", to: "/shop?category=sports" },
      { label: "Smart Watches", to: "/shop?category=smart" },
      { label: "Limited Edition", to: "/shop?category=limited" },
    ],
  },
  {
    title: "Collections",
    links: [
      { label: "Signature", to: "/shop?collection=Signature" },
      { label: "Heritage", to: "/shop?collection=Heritage" },
      { label: "Marine", to: "/shop?collection=Marine" },
      { label: "Solstice", to: "/shop?collection=Solstice" },
      { label: "Avant", to: "/shop?collection=Avant" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { label: "Contact Us", to: "/contact" },
      { label: "Enquire Now", to: "/enquiry" },
      { label: "Shipping Policy", to: "/legal/shipping" },
      { label: "Returns & Refunds", to: "/legal/returns" },
      { label: "Track Order", to: "/contact" },
      { label: "Care Guide", to: "/contact" },
    ],
  },
  {
    title: "About Us",
    links: [
      { label: "Our Story", to: "/about" },
      { label: "Craftsmanship", to: "/about#craftsmanship" },
      { label: "Sustainability", to: "/about#sustainability" },
      { label: "Our Brands", to: "/brands" },
      { label: "Journal", to: "/blog" },
      { label: "Careers", to: "/about#careers" },
    ],
  },
];

export const POLICY_LINKS = [
  { label: "Privacy Policy", to: "/legal/privacy" },
  { label: "Terms & Conditions", to: "/legal/terms" },
  { label: "Shipping Policy", to: "/legal/shipping" },
  { label: "Returns & Refunds", to: "/legal/returns" },
];

export const PAYMENT_METHODS = ["Visa", "Mastercard", "Rupay", "UPI", "PayPal", "Net Banking"];
