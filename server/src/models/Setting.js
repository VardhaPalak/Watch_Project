import mongoose from "mongoose";

const socialSchema = new mongoose.Schema(
  {
    platform: { type: String, trim: true, required: true },
    url: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, trim: true, unique: true, default: "store", index: true },
    currency: {
      code: { type: String, trim: true, default: "INR" },
      symbol: { type: String, trim: true, default: "₹" },
      locale: { type: String, trim: true, default: "en-IN" },
      position: { type: String, enum: ["before", "after"], default: "before" },
    },
    business: {
      name: { type: String, trim: true, default: "TIMECRAFT" },
      whatsapp: { type: String, trim: true, default: "" },
      phone: { type: String, trim: true, default: "" },
      email: { type: String, trim: true, default: "care@timecraft.com" },
      address: { type: String, trim: true, default: "" },
      hours: { type: String, trim: true, default: "Mon - Sat, 10:00 - 20:00 IST" },
    },
    socials: { type: [socialSchema], default: [] },
    paymentMethods: { type: [String], default: ["Visa", "Mastercard", "Rupay", "UPI", "PayPal"] },
    policies: {
      privacy: { type: String, default: "/legal/privacy" },
      terms: { type: String, default: "/legal/terms" },
      shipping: { type: String, default: "/legal/shipping" },
      returns: { type: String, default: "/legal/returns" },
    },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const Setting = mongoose.model("Setting", settingSchema);
export default Setting;
