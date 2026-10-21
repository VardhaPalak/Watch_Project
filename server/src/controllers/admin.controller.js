import Product from "../models/Product.js";
import Setting from "../models/Setting.js";
import { slugify } from "../utils/reference.js";

export async function listAllProducts(req, res) {
  const { q, category, page = 1, limit = 25 } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (q) {
    const safe = String(q).replace(/[.*+^${}()|[\]\\]/g, "\\$&");
    filter.name = new RegExp(safe, "i");
  }
  const currentPage = Math.max(1, Number.parseInt(page, 10) || 1);
  const perPage = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 25));
  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .lean(),
    Product.countDocuments(filter),
  ]);
  res.json({ items, total, page: currentPage, limit: perPage, pages: Math.max(1, Math.ceil(total / perPage)) });
}

export async function createProduct(req, res) {
  const body = { ...req.body };
  if (body.name && !body.slug) body.slug = slugify(body.name);
  if (body.price !== undefined) body.price = Number(body.price);
  if (body.compareAtPrice !== undefined) body.compareAtPrice = Number(body.compareAtPrice);
  const product = await Product.create(body);
  res.status(201).json({ product });
}

export async function updateProduct(req, res) {
  const body = { ...req.body };
  if (body.name && !body.slug) body.slug = slugify(body.name);
  if (body.price !== undefined) body.price = Number(body.price);
  if (body.compareAtPrice !== undefined) body.compareAtPrice = Number(body.compareAtPrice);
  const product = await Product.findByIdAndUpdate(req.params.id, body, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!product) return res.status(404).json({ message: "Product not found" });
  return res.json({ product });
}

export async function deleteProduct(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  return res.json({ message: "Product removed" });
}

export async function getSettings(req, res) {
  let settings = await Setting.findOne({ key: "store" });
  if (!settings) {
    settings = await Setting.create({ key: "store" });
  }
  res.json({ settings });
}

export async function updateSettings(req, res) {
  const update = { ...req.body };
  delete update.key;
  delete update._id;
  delete update.createdAt;
  delete update.updatedAt;
  const settings = await Setting.findOneAndUpdate(
    { key: "store" },
    { $set: update, key: "store" },
    { returnDocument: "after", upsert: true, runValidators: true },
  );
  res.json({ settings });
}
