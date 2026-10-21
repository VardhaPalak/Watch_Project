import { api } from "./api";
import { FALLBACK_PRODUCTS } from "../data/fallbackProducts";
import type { Paginated, Product } from "../types";

export interface ProductQuery {
  category?: string;
  collection?: string;
  brand?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  featured?: boolean;
  ids?: string[];
  page?: number;
  limit?: number;
}

export interface ProductResult extends Paginated<Product> {
  offline: boolean;
}

function applyFallback(query: ProductQuery): ProductResult {
  let items = [...FALLBACK_PRODUCTS];

  if (query.category) items = items.filter((item) => item.category === query.category);
  if (query.collection) items = items.filter((item) => item.collection === query.collection);
  if (query.brand) items = items.filter((item) => item.brand === query.brand);
  if (query.featured) items = items.filter((item) => item.isFeatured);
  if (query.ids?.length) items = items.filter((item) => query.ids?.includes(item._id));
  if (query.q) {
    const term = query.q.toLowerCase();
    items = items.filter((item) =>
      [item.name, item.brand, item.description, item.collection].some((value) =>
        value.toLowerCase().includes(term),
      ),
    );
  }
  if (typeof query.minPrice === "number") items = items.filter((item) => item.price >= query.minPrice!);
  if (typeof query.maxPrice === "number") items = items.filter((item) => item.price <= query.maxPrice!);

  switch (query.sort) {
    case "price-asc":
      items.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      items.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      items.sort((a, b) => b.rating.average - a.rating.average);
      break;
    case "popular":
      items.sort((a, b) => b.rating.count - a.rating.count);
      break;
    default:
      break;
  }

  const total = items.length;
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(60, Math.max(1, query.limit || 12));
  const start = (page - 1) * limit;

  return {
    items: items.slice(start, start + limit),
    page,
    limit,
    total,
    pages: Math.max(1, Math.ceil(total / limit)),
    offline: true,
  };
}

/**
 * Fetches the catalogue from the API. When the API is unreachable it falls back
 * to the bundled demo catalogue so the storefront always renders.
 */
export async function fetchProducts(query: ProductQuery = {}): Promise<ProductResult> {
  const params = new URLSearchParams();
  if (query.category) params.set("category", query.category);
  if (query.collection) params.set("collection", query.collection);
  if (query.brand) params.set("brand", query.brand);
  if (query.q) params.set("q", query.q);
  if (typeof query.minPrice === "number") params.set("minPrice", String(query.minPrice));
  if (typeof query.maxPrice === "number") params.set("maxPrice", String(query.maxPrice));
  if (query.sort) params.set("sort", query.sort);
  if (query.featured) params.set("featured", "true");
  if (query.ids?.length) params.set("ids", query.ids.join(","));
  params.set("page", String(query.page || 1));
  params.set("limit", String(query.limit || 12));

  try {
    const data = await api.get<Paginated<Product>>(`/products?${params.toString()}`);
    return { ...data, offline: false };
  } catch {
    return applyFallback(query);
  }
}

export async function fetchProduct(
  identifier: string,
): Promise<{ product: Product; related: Product[]; offline: boolean }> {
  try {
    const data = await api.get<{ product: Product; related: Product[] }>(`/products/${identifier}`);
    return { ...data, offline: false };
  } catch {
    const product =
      FALLBACK_PRODUCTS.find((item) => item.slug === identifier) ||
      FALLBACK_PRODUCTS.find((item) => item._id === identifier) ||
      FALLBACK_PRODUCTS[0];
    const related = FALLBACK_PRODUCTS.filter(
      (item) => item.category === product.category && item._id !== product._id,
    ).slice(0, 4);
    return { product, related, offline: true };
  }
}
