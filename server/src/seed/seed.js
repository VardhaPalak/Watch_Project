import mongoose from "mongoose";
import { connectDatabase } from "../config/db.js";
import env from "../config/env.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Setting from "../models/Setting.js";
import { seedProducts } from "./products.js";

async function run() {
  await connectDatabase();

  for (const data of seedProducts) {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    await Product.findOneAndUpdate(
      { sku: data.sku },
      { $set: { ...data, slug } },
      { upsert: true, returnDocument: "after" },
    );
  }
  console.log(`[seed] products ready: ${await Product.countDocuments()}`);

  const adminEmail = env.adminEmail.toLowerCase();
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const admin = new User({ name: "TIMECRAFT Admin", email: adminEmail, role: "admin" });
    await admin.setPassword(env.adminPassword);
    await admin.save();
    console.log(`[seed] admin created: ${adminEmail} (change the password in production)`);
  } else {
    console.log(`[seed] admin already present: ${adminEmail}`);
  }

  const settings = await Setting.findOne({ key: "store" });
  if (!settings) {
    await Setting.create({
      key: "store",
      currency: { code: "INR", symbol: "₹", locale: "en-IN", position: "before" },
      business: {
        name: "TIMECRAFT",
        whatsapp: env.businessWhatsapp,
        phone: env.businessPhone,
        email: env.businessEmail,
        address: "Crafted in India, delivered worldwide",
        hours: "Mon - Sat, 10:00 - 20:00 IST",
      },
      socials: [
        { platform: "Instagram", url: "https://instagram.com" },
        { platform: "Facebook", url: "https://facebook.com" },
        { platform: "Pinterest", url: "https://pinterest.com" },
        { platform: "YouTube", url: "https://youtube.com" },
      ],
      paymentMethods: ["Visa", "Mastercard", "Rupay", "UPI", "PayPal", "Net Banking"],
    });
    console.log("[seed] store settings created");
  }

  await mongoose.disconnect();
  console.log("[seed] done");
}

run().catch((error) => {
  console.error("[seed] failed:", error);
  process.exit(1);
});
