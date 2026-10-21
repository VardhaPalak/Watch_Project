import { useEffect, useMemo, useState } from "react";
import Icon from "../../components/ui/Icon";
import Button from "../../components/ui/Button";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { useCurrency } from "../../context/CurrencyContext";
import type { Product } from "../../types";

const CATEGORIES = [
  { value: "men", label: "Men's Watches" },
  { value: "women", label: "Women's Watches" },
  { value: "sports", label: "Sports Watches" },
  { value: "smart", label: "Smart Watches" },
  { value: "limited", label: "Limited Edition" },
];

interface Draft {
  name: string;
  brand: string;
  category: string;
  collection: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  shortDescription: string;
  description: string;
  isFeatured: boolean;
  isActive: boolean;
}

const EMPTY_DRAFT: Draft = {
  name: "",
  brand: "TIMECRAFT",
  category: "men",
  collection: "Signature",
  price: "",
  compareAtPrice: "",
  stock: "10",
  shortDescription: "",
  description: "",
  isFeatured: false,
  isActive: true,
};

export default function AdminProducts() {
  const { push } = useToast();
  const { isAdmin } = useAuth();
  const { format } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);

  const load = async (targetPage = page, query = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(targetPage), limit: "20" });
      if (query.trim()) params.set("q", query.trim());
      const data = await api.get<{ items: Product[]; total: number; pages: number }>(
        `/admin/products?${params.toString()}`,
        { auth: true },
      );
      setProducts(data.items || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {
      push("Could not load products.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEdit = (product: Product) => {
    setCreating(false);
    setEditing(product);
    setDraft({
      name: product.name || "",
      brand: product.brand || "TIMECRAFT",
      category: product.category || "men",
      collection: product.collection || "Signature",
      price: String(product.price ?? ""),
      compareAtPrice: String(product.compareAtPrice ?? ""),
      stock: String(product.stock ?? 0),
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      isFeatured: Boolean(product.isFeatured),
      isActive: product.isActive !== false,
    });
  };

  const openCreate = () => {
    setEditing(null);
    setCreating(true);
    setDraft(EMPTY_DRAFT);
  };

  const closeModal = () => {
    setEditing(null);
    setCreating(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      const body = {
        name: draft.name.trim(),
        brand: draft.brand.trim() || "TIMECRAFT",
        category: draft.category,
        collection: draft.collection.trim(),
        price: Number(draft.price) || 0,
        compareAtPrice: Number(draft.compareAtPrice) || 0,
        stock: Number(draft.stock) || 0,
        shortDescription: draft.shortDescription.trim(),
        description: draft.description.trim(),
        isFeatured: draft.isFeatured,
        isActive: draft.isActive,
      };

      if (editing) {
        await api.patch(`/admin/products/${editing._id}`, body, { auth: true });
        push(`${draft.name} updated.`);
      } else {
        await api.post("/admin/products", body, { auth: true });
        push(`${draft.name} created.`);
      }
      closeModal();
      load();
    } catch (error) {
      push(error instanceof Error ? error.message : "Could not save the product.", "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (product: Product) => {
    try {
      await api.delete(`/admin/products/${product._id}`, { auth: true });
      push(`${product.name} removed.`);
      setConfirmDelete(null);
      load();
    } catch (error) {
      push(error instanceof Error ? error.message : "Could not remove the product.", "error");
    }
  };

  const categoryLabel = useMemo(
    () => (value: string) => CATEGORIES.find((item) => item.value === value)?.label || value,
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-white">Products</h1>
          <p className="mt-1 text-sm text-ash">{total} products in the catalogue</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setPage(1);
              load(1, search);
            }}
            className="flex items-center gap-2"
          >
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              className="field w-full sm:w-56"
            />
            <button
              type="submit"
              className="flex h-[42px] w-[42px] items-center justify-center border border-white/15 text-warm-white transition hover:border-gold hover:text-gold"
              aria-label="Search"
            >
              <Icon name="search" size={16} />
            </button>
          </form>
          {isAdmin ? (
            <Button onClick={openCreate} icon={<Icon name="plus" size={14} />}>
              New Product
            </Button>
          ) : null}
        </div>
      </div>

      <div className="overflow-hidden border border-white/10 bg-charcoal/40">
        {loading ? (
          <div className="space-y-2 p-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-12 animate-pulse bg-white/5" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="p-10 text-center text-sm text-ash">No products found.</p>
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden w-full border-collapse text-left text-sm lg:table">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.18em] text-ash">
                  <th className="px-4 py-3 font-normal">Product</th>
                  <th className="px-4 py-3 font-normal">Category</th>
                  <th className="px-4 py-3 font-normal">Price</th>
                  <th className="px-4 py-3 font-normal">Stock</th>
                  <th className="px-4 py-3 font-normal">Flags</th>
                  <th className="px-4 py-3 text-right font-normal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#0d0d0d] text-gold/70">
                          <Icon name="clock" size={16} />
                        </span>
                        <span>
                          <span className="block text-warm-white">{product.name}</span>
                          <span className="block text-[11px] text-ash">{product.sku}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ash">{categoryLabel(product.category)}</td>
                    <td className="px-4 py-3 text-warm-white">{format(product.price)}</td>
                    <td className="px-4 py-3 text-ash">{product.stock}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {product.isFeatured ? (
                          <span className="border border-gold/40 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-gold">
                            Featured
                          </span>
                        ) : null}
                        {product.isActive ? (
                          <span className="border border-emerald-400/30 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-emerald-300/80">
                            Active
                          </span>
                        ) : (
                          <span className="border border-white/15 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-ash">
                            Hidden
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => openEdit(product)}
                          className="text-[11px] uppercase tracking-[0.16em] text-gold transition hover:text-gold-light"
                        >
                          Edit
                        </button>
                        {isAdmin ? (
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(product)}
                            className="text-[11px] uppercase tracking-[0.16em] text-white/40 transition hover:text-red-300"
                          >
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <ul className="divide-y divide-white/5 lg:hidden">
              {products.map((product) => (
                <li key={product._id} className="flex flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-warm-white">{product.name}</p>
                      <p className="text-[11px] text-ash">
                        {categoryLabel(product.category)} · {product.sku}
                      </p>
                    </div>
                    <span className="text-sm text-gold">{format(product.price)}</span>
                  </div>
                  <p className="text-[11px] text-ash">
                    Stock {product.stock} · {product.isFeatured ? "Featured" : "Standard"} ·{" "}
                    {product.isActive ? "Active" : "Hidden"}
                  </p>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => openEdit(product)}
                      className="text-[11px] uppercase tracking-[0.16em] text-gold"
                    >
                      Edit
                    </button>
                    {isAdmin ? (
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(product)}
                        className="text-[11px] uppercase tracking-[0.16em] text-white/40"
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {pages > 1 ? (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: pages }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setPage(index + 1);
                load(index + 1, search);
              }}
              className={`h-9 w-9 border text-xs transition ${
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

      {editing || creating ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-white/10 bg-charcoal p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-2xl text-white">
                {creating ? "New Product" : `Edit ${editing?.name}`}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="text-warm-white/60 transition hover:text-gold"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.18em] text-ash">
                Name
                <input
                  className="field"
                  value={draft.name}
                  onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                />
              </label>
              <label className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.18em] text-ash">
                Brand
                <input
                  className="field"
                  value={draft.brand}
                  onChange={(event) => setDraft({ ...draft, brand: event.target.value })}
                />
              </label>
              <label className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.18em] text-ash">
                Category
                <select
                  className="field"
                  value={draft.category}
                  onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                >
                  {CATEGORIES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.18em] text-ash">
                Collection
                <input
                  className="field"
                  value={draft.collection}
                  onChange={(event) => setDraft({ ...draft, collection: event.target.value })}
                />
              </label>
              <label className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.18em] text-ash">
                Price
                <input
                  type="number"
                  className="field"
                  value={draft.price}
                  onChange={(event) => setDraft({ ...draft, price: event.target.value })}
                />
              </label>
              <label className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.18em] text-ash">
                Compare at price
                <input
                  type="number"
                  className="field"
                  value={draft.compareAtPrice}
                  onChange={(event) => setDraft({ ...draft, compareAtPrice: event.target.value })}
                />
              </label>
              <label className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.18em] text-ash">
                Stock
                <input
                  type="number"
                  className="field"
                  value={draft.stock}
                  onChange={(event) => setDraft({ ...draft, stock: event.target.value })}
                />
              </label>
              <div className="flex flex-col gap-3 pt-6">
                <label className="flex items-center gap-2 text-[11px] text-ash">
                  <input
                    type="checkbox"
                    checked={draft.isFeatured}
                    onChange={(event) => setDraft({ ...draft, isFeatured: event.target.checked })}
                    className="h-4 w-4 accent-[#B89458]"
                  />
                  Featured on the storefront
                </label>
                <label className="flex items-center gap-2 text-[11px] text-ash">
                  <input
                    type="checkbox"
                    checked={draft.isActive}
                    onChange={(event) => setDraft({ ...draft, isActive: event.target.checked })}
                    className="h-4 w-4 accent-[#B89458]"
                  />
                  Visible in the catalogue
                </label>
              </div>
              <label className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.18em] text-ash sm:col-span-2">
                Short description
                <input
                  className="field"
                  value={draft.shortDescription}
                  onChange={(event) => setDraft({ ...draft, shortDescription: event.target.value })}
                />
              </label>
              <label className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.18em] text-ash sm:col-span-2">
                Description
                <textarea
                  rows={4}
                  className="field resize-y"
                  value={draft.description}
                  onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                />
              </label>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={save} loading={saving}>
                {creating ? "Create Product" : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {confirmDelete ? (
        <div className="fixed inset-0 z-[85] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative z-10 w-full max-w-md border border-white/10 bg-charcoal p-6">
            <h3 className="font-display text-xl text-white">Remove product?</h3>
            <p className="mt-3 text-sm text-ash">
              “{confirmDelete.name}” will be permanently removed from the catalogue. This cannot be undone.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button onClick={() => remove(confirmDelete)}>Delete Product</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
