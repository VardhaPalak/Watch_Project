export interface ProductArt {
  case: "gold" | "steel" | "black" | "rose";
  dial: string;
  strap: string;
  strapStyle: "leather" | "bracelet" | "rubber" | "chain";
  dialStyle: "sunburst" | "matte" | "skeleton" | "diver" | "digital";
  accent: string;
  background: string;
}

export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  category: ProductCategory;
  collection: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice: number;
  currency: string;
  sku: string;
  stock: number;
  images: ProductImage[];
  art: ProductArt;
  specs: ProductSpec[];
  rating: { average: number; count: number };
  badges: string[];
  tags: string[];
  features: string[];
  isFeatured: boolean;
  isLimitedEdition: boolean;
  isActive: boolean;
  discountPercent?: number;
  inStock?: boolean;
  createdAt?: string;
}

export type ProductCategory = "men" | "women" | "sports" | "smart" | "limited";

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  art: ProductArt;
  image?: string;
}

export type EnquiryStatus = "New" | "In Progress" | "Contacted" | "Closed";

export type EnquiryType =
  | "Product Enquiry"
  | "Price Enquiry"
  | "Bulk Order"
  | "Corporate Gifting"
  | "Partnership"
  | "Other";

export type ContactMethod = "Phone" | "WhatsApp" | "Email";

export interface EnquiryPayload {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  enquiryType: EnquiryType;
  productName: string;
  budget: string;
  quantity: number;
  preferredContact: ContactMethod;
  message: string;
  consent: boolean;
  website?: string;
  attachment?: File | null;
}

export interface EnquiryRecord {
  _id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  enquiryType: EnquiryType;
  productName: string;
  budget: string;
  quantity: number;
  preferredContact: ContactMethod;
  message: string;
  status: EnquiryStatus;
  consent: boolean;
  submittedAt: string;
  notes?: Array<{ _id: string; author: string; note: string; createdAt: string }>;
  statusHistory?: Array<{ status: EnquiryStatus; by: string; at: string }>;
  assignedTo?: { _id: string; name: string; email: string; role: string } | null;
  attachment?: { url: string; filename: string; mimetype: string; size: number };
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  locale: string;
  position: "before" | "after";
}

export interface StoreSettings {
  currency: CurrencyConfig;
  business: {
    name: string;
    whatsapp: string;
    phone: string;
    email: string;
    address: string;
    hours: string;
  };
  socials: Array<{ platform: string; url: string }>;
  paymentMethods: string[];
  policies: { privacy: string; terms: string; shipping: string; returns: string };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
  active: boolean;
  lastLoginAt?: string | null;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}
