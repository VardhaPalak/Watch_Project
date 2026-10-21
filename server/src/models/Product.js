import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    case: { type: String, default: "gold" },
    dial: { type: String, default: "#151515" },
    strap: { type: String, default: "#1b1b1b" },
    accent: { type: String, default: "#B89458" },
    background: { type: String, default: "#0d0d0d" },
  },
  { _id: false },
);

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, trim: true, default: "" },
    alt: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const specSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, required: true },
    value: { type: String, trim: true, required: true },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true, maxlength: 120 },
    slug: { type: String, trim: true, unique: true, index: true },
    brand: { type: String, trim: true, default: "TIMECRAFT" },
    category: {
      type: String,
      enum: ["men", "women", "sports", "smart", "limited"],
      required: true,
      index: true,
    },
    collection: { type: String, trim: true, default: "Signature", index: true },
    shortDescription: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0, default: 0 },
    currency: { type: String, trim: true, default: "INR" },
    sku: { type: String, trim: true, unique: true, index: true },
    stock: { type: Number, default: 25, min: 0 },
    images: { type: [imageSchema], default: [] },
    art: { type: variantSchema, default: () => ({}) },
    specs: { type: [specSchema], default: [] },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
    },
    badges: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    features: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false, index: true },
    isLimitedEdition: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }, suppressReservedKeysWarning: true },
);

productSchema.virtual("discountPercent").get(function discountPercent() {
  if (!this.compareAtPrice || this.compareAtPrice <= this.price) return 0;
  return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
});

productSchema.virtual("inStock").get(function inStock() {
  return this.stock > 0;
});

productSchema.pre("validate", function ensureSlug(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

productSchema.index({ name: "text", brand: "text", description: "text" });

export const Product = mongoose.model("Product", productSchema);
export default Product;
