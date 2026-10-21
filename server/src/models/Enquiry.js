import mongoose from "mongoose";

export const ENQUIRY_STATUSES = ["New", "In Progress", "Contacted", "Closed"];
export const ENQUIRY_TYPES = [
  "Product Enquiry",
  "Price Enquiry",
  "Bulk Order",
  "Corporate Gifting",
  "Partnership",
  "Other",
];
export const CONTACT_METHODS = ["Phone", "WhatsApp", "Email"];

const noteSchema = new mongoose.Schema(
  {
    author: { type: String, trim: true, default: "System" },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    note: { type: String, trim: true, required: true, maxlength: 4000 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const statusEventSchema = new mongoose.Schema(
  {
    status: { type: String, enum: ENQUIRY_STATUSES, required: true },
    by: { type: String, trim: true, default: "System" },
    at: { type: Date, default: Date.now },
  },
  { _id: false },
);

const enquirySchema = new mongoose.Schema(
  {
    reference: { type: String, trim: true, unique: true, index: true, required: true },
    name: { type: String, trim: true, required: true, maxlength: 120 },
    email: { type: String, trim: true, lowercase: true, required: true, maxlength: 160 },
    phone: { type: String, trim: true, required: true, maxlength: 32 },
    countryCode: { type: String, trim: true, default: "+91", maxlength: 8 },
    enquiryType: { type: String, enum: ENQUIRY_TYPES, required: true },
    productName: { type: String, trim: true, default: "", maxlength: 160 },
    budget: { type: String, trim: true, default: "", maxlength: 80 },
    quantity: { type: Number, default: 1, min: 1 },
    preferredContact: { type: String, enum: CONTACT_METHODS, default: "Email" },
    message: { type: String, trim: true, required: true, maxlength: 4000 },
    attachment: {
      url: { type: String, trim: true, default: "" },
      filename: { type: String, trim: true, default: "" },
      mimetype: { type: String, trim: true, default: "" },
      size: { type: Number, default: 0 },
    },
    status: { type: String, enum: ENQUIRY_STATUSES, default: "New", index: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    notes: { type: [noteSchema], default: [] },
    statusHistory: { type: [statusEventSchema], default: [] },
    source: { type: String, trim: true, default: "website" },
    consent: { type: Boolean, default: false },
    ip: { type: String, trim: true, default: "" },
    userAgent: { type: String, trim: true, default: "" },
    submittedAt: { type: Date, default: Date.now, index: true },
    lastContactedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

enquirySchema.index({ status: 1, submittedAt: -1 });
enquirySchema.index({ name: "text", email: "text", phone: "text", reference: "text" });

export const Enquiry = mongoose.model("Enquiry", enquirySchema);
export default Enquiry;
