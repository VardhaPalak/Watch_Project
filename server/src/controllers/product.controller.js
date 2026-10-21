import Product from "../models/Product.js";
import Setting from "../models/Setting.js";

const SORTS = {
  newest: { createdAt: -1 },
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
  rating: { "rating.average": -1 },
  popular: { "rating.count": -1 },
};

export async function listProducts(req, res) {
  const {
    category,
    collection,
    brand,
    q,
    minPrice,
    maxPrice,
    sort = "newest",
    featured,
    ids,
    page = 1,
    limit = 12,
  } = req.query;

  const filter = { isActive: true };
  if (category) filter.category = category;
  if (collection) filter.collection = collection;
  if (brand) filter.brand = brand;
  if (featured === "true") filter.isFeatured = true;
  if (ids) {
    const idList = String(ids)
      .split(",")
      .map((id) => id.trim())
      .filter((id) => /^[a-f\d]{24}$/i.test(id));
    if (idList.length) filter._id = { $in: idList };
    else return res.json({ items: [], page: 1, limit: Number(limit) || 12, total: 0, pages: 1 });
  }
  if (q) {
    const safe = String(q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { name: new RegExp(safe, "i") },
      { brand: new RegExp(safe, "i") },
      { description: new RegExp(safe, "i") },
      { collection: new RegExp(safe, "i") },
    ];
  }
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const currentPage = Math.max(1, Number.parseInt(page, 10) || 1);
  const perPage = Math.min(60, Math.max(1, Number.parseInt(limit, 10) || 12));

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort(SORTS[sort] || SORTS.newest)
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .lean({ virtuals: false }),
    Product.countDocuments(filter),
  ]);

  const enriched = items.map((item) => ({
    ...item,
    discountPercent:
      item.compareAtPrice && item.compareAtPrice > item.price
        ? Math.round(((item.compareAtPrice - item.price) / item.compareAtPrice) * 100)
        : 0,
    inStock: item.stock > 0,
  }));

  res.json({
    items: enriched,
    page: currentPage,
    limit: perPage,
    total,
    pages: Math.max(1, Math.ceil(total / perPage)),
  });
}

export async function getProduct(req, res) {
  const { identifier } = req.params;
  const product = await Product.findOne({
    isActive: true,
    $or: [{ slug: identifier }, { _id: identifier.match(/^[a-f\d]{24}$/i) ? identifier : null }],
  }).lean({ virtuals: false });

  if (!product) {
    return res.status(404).json({ message: "That timepiece could not be found." });
  }

  const related = await Product.find({
    isActive: true,
    category: product.category,
    _id: { $ne: product._id },
  })
    .limit(4)
    .lean({ virtuals: false });

  return res.json({ product, related });
}

export async function getCategories(req, res) {
  const categories = await Product.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    { $project: { _id: 0, category: "$_id", count: 1, minPrice: 1, maxPrice: 1 } },
  ]);

  const collections = await Product.distinct("collection", { isActive: true });
  const brands = await Product.distinct("brand", { isActive: true });

  res.json({ categories, collections: collections.filter(Boolean), brands: brands.filter(Boolean) });
}

export async function getStorefrontSettings(req, res) {
  const settings = (await Setting.findOne({ key: "store" }).lean()) || {};
  res.json({
    currency: settings.currency || { code: "INR", symbol: "₹", locale: "en-IN", position: "before" },
    business: settings.business || {},
    socials: settings.socials || [],
    paymentMethods: settings.paymentMethods || [],
    policies: settings.policies || {},
  });
}
