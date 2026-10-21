import { Router } from "express";
import {
  listEnquiries,
  getEnquiry,
  updateEnquiryStatus,
  addEnquiryNote,
  assignEnquiry,
  deleteEnquiry,
  enquiryStats,
} from "../controllers/enquiry.controller.js";
import {
  listAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSettings,
  updateSettings,
} from "../controllers/admin.controller.js";
import { authenticate, requireAdmin, requireStaff } from "../middleware/auth.js";
import { toCsv } from "../utils/csv.js";
import Enquiry from "../models/Enquiry.js";
import { buildEnquiryFilter } from "../controllers/enquiry.controller.js";
import { downloadAttachment } from "../controllers/attachment.controller.js";

const router = Router();

router.use(authenticate);

router.get("/enquiries", requireStaff, listEnquiries);
router.get("/enquiries/stats", requireStaff, enquiryStats);
router.get("/enquiries/export", requireStaff, async (req, res) => {
  const headers = [
    { label: "Reference", key: "reference" },
    { label: "Submitted At", value: (row) => new Date(row.submittedAt).toISOString() },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Country Code", key: "countryCode" },
    { label: "Enquiry Type", key: "enquiryType" },
    { label: "Product", key: "productName" },
    { label: "Budget", key: "budget" },
    { label: "Quantity", key: "quantity" },
    { label: "Preferred Contact", key: "preferredContact" },
    { label: "Status", key: "status" },
    {
      label: "Assigned To",
      value: (row) => (row.assignedTo ? row.assignedTo.name || row.assignedTo.email : "Unassigned"),
    },
    { label: "Message", key: "message" },
    { label: "Notes", value: (row) => (row.notes || []).map((note) => `${note.author}: ${note.note}`).join(" | ") },
  ];

  const filter = buildEnquiryFilter(req.query);
  const rows = await Enquiry.find(filter)
    .sort({ submittedAt: -1 })
    .populate("assignedTo", "name email role")
    .lean();

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="timecraft-enquiries-${Date.now()}.csv"`);
  return res.send(toCsv(headers, rows));
});

router.get("/enquiries/:id", requireStaff, getEnquiry);
router.get("/enquiries/:id/attachment", requireStaff, downloadAttachment);
router.patch("/enquiries/:id/status", requireStaff, updateEnquiryStatus);
router.post("/enquiries/:id/notes", requireStaff, addEnquiryNote);
router.patch("/enquiries/:id/assign", requireStaff, assignEnquiry);
router.delete("/enquiries/:id", requireAdmin, deleteEnquiry);

router.get("/products", requireStaff, listAllProducts);
router.post("/products", requireAdmin, createProduct);
router.patch("/products/:id", requireAdmin, updateProduct);
router.delete("/products/:id", requireAdmin, deleteProduct);

router.get("/settings", requireAdmin, getSettings);
router.patch("/settings", requireAdmin, updateSettings);

export default router;
