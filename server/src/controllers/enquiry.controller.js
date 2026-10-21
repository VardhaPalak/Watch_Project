import Enquiry, { ENQUIRY_STATUSES, ENQUIRY_TYPES, CONTACT_METHODS } from "../models/Enquiry.js";
import { createReference } from "../utils/reference.js";
import { sendEnquiryNotifications } from "../services/email.service.js";

const DUPLICATE_WINDOW_MS = 2 * 60 * 1000;

export async function createEnquiry(req, res) {
  const payload = req.body || {};

  if (payload.website) {
    return res.status(202).json({ message: "Enquiry received", reference: "TC-RECEIVED" });
  }

  const duplicate = await Enquiry.findOne({
    email: String(payload.email || "").toLowerCase(),
    message: payload.message,
    createdAt: { $gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) },
  }).lean();

  if (duplicate) {
    return res.status(409).json({
      message: "This enquiry has already been received. Our team will contact you shortly.",
      reference: duplicate.reference,
      duplicate: true,
    });
  }

  const enquiry = await Enquiry.create({
    reference: createReference("TC"),
    name: payload.name,
    email: String(payload.email).toLowerCase(),
    phone: payload.phone,
    countryCode: payload.countryCode || "+91",
    enquiryType: payload.enquiryType,
    productName: payload.productName || "",
    budget: payload.budget || "",
    quantity: Number(payload.quantity) > 0 ? Number(payload.quantity) : 1,
    preferredContact: payload.preferredContact || "Email",
    message: payload.message,
    attachment: payload.attachment || {},
    status: "New",
    consent: Boolean(payload.consent),
    source: payload.source || "website",
    ip: req.ip || "",
    userAgent: req.get("user-agent") || "",
    submittedAt: new Date(),
    statusHistory: [{ status: "New", by: "Website", at: new Date() }],
  });

  sendEnquiryNotifications(enquiry).catch((error) =>
    console.error("[mail] notification error:", error.message),
  );

  return res.status(201).json({
    message:
      "Thank you for contacting TIMECRAFT! Your enquiry has been received. Our team will get back to you shortly.",
    reference: enquiry.reference,
    enquiry: {
      reference: enquiry.reference,
      submittedAt: enquiry.submittedAt,
      status: enquiry.status,
    },
  });
}

export function buildEnquiryFilter(query = {}) {
  const { status, type, from, to, assigned, q } = query;
  const filter = {};
  if (status && ENQUIRY_STATUSES.includes(status)) filter.status = status;
  if (type && ENQUIRY_TYPES.includes(type)) filter.enquiryType = type;
  if (assigned === "unassigned") filter.assignedTo = null;
  if (assigned && assigned !== "unassigned") filter.assignedTo = assigned;
  if (from || to) {
    filter.submittedAt = {};
    if (from) filter.submittedAt.$gte = new Date(from);
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      filter.submittedAt.$lte = end;
    }
  }
  if (q) {
    const safe = String(q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { name: new RegExp(safe, "i") },
      { email: new RegExp(safe, "i") },
      { phone: new RegExp(safe, "i") },
      { reference: new RegExp(safe, "i") },
      { productName: new RegExp(safe, "i") },
    ];
  }
  return filter;
}

export async function listEnquiries(req, res) {
  const { page = 1, limit = 20 } = req.query;
  const filter = buildEnquiryFilter(req.query);

  const currentPage = Math.max(1, Number.parseInt(page, 10) || 1);
  const perPage = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 20));

  const [items, total] = await Promise.all([
    Enquiry.find(filter)
      .sort({ submittedAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .populate("assignedTo", "name email role")
      .lean(),
    Enquiry.countDocuments(filter),
  ]);

  res.json({
    items,
    page: currentPage,
    limit: perPage,
    total,
    pages: Math.max(1, Math.ceil(total / perPage)),
  });
}

export async function getEnquiry(req, res) {
  const enquiry = await Enquiry.findById(req.params.id)
    .populate("assignedTo", "name email role")
    .lean();
  if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
  return res.json({ enquiry });
}

export async function updateEnquiryStatus(req, res) {
  const { status, note } = req.body || {};
  if (!ENQUIRY_STATUSES.includes(status)) {
    return res.status(422).json({ message: "Unknown status value" });
  }

  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });

  enquiry.status = status;
  enquiry.statusHistory.push({ status, by: req.user?.name || "System", at: new Date() });
  if (status === "Contacted" || status === "Closed") enquiry.lastContactedAt = new Date();
  if (note && String(note).trim()) {
    enquiry.notes.push({
      author: req.user?.name || "System",
      authorId: req.user?._id || null,
      note: String(note).trim(),
      createdAt: new Date(),
    });
  }

  await enquiry.save();
  return res.json({ enquiry });
}

export async function addEnquiryNote(req, res) {
  const { note } = req.body || {};
  if (!note || !String(note).trim()) {
    return res.status(422).json({ message: "Note text is required" });
  }
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });

  enquiry.notes.push({
    author: req.user?.name || "System",
    authorId: req.user?._id || null,
    note: String(note).trim(),
    createdAt: new Date(),
  });
  await enquiry.save();
  return res.status(201).json({ enquiry });
}

export async function assignEnquiry(req, res) {
  const { assignedTo } = req.body || {};
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });

  enquiry.assignedTo = assignedTo || null;
  enquiry.statusHistory.push({
    status: enquiry.status,
    by: req.user?.name || "System",
    at: new Date(),
  });
  await enquiry.save();
  const populated = await enquiry.populate("assignedTo", "name email role");
  return res.json({ enquiry: populated });
}

export async function deleteEnquiry(req, res) {
  const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
  if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
  return res.json({ message: "Enquiry deleted" });
}

export async function enquiryStats(req, res) {
  const [byStatus, byType, total, pendingFollowUps, recent, monthly] = await Promise.all([
    Enquiry.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Enquiry.aggregate([{ $group: { _id: "$enquiryType", count: { $sum: 1 } } }]),
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ status: { $in: ["New", "In Progress"] } }),
    Enquiry.find({}).sort({ submittedAt: -1 }).limit(5).select("reference name status submittedAt").lean(),
    Enquiry.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$submittedAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 6 },
    ]),
  ]);

  res.json({
    total,
    pendingFollowUps,
    byStatus: byStatus.map((row) => ({ status: row._id, count: row.count })),
    byType: byType.map((row) => ({ type: row._id, count: row.count })),
    recent,
    monthly: monthly.reverse(),
  });
}

export { ENQUIRY_STATUSES, ENQUIRY_TYPES, CONTACT_METHODS };
