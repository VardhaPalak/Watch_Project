import Enquiry from "../models/Enquiry.js";
import { uploadRoot } from "../middleware/upload.js";
import path from "node:path";
import fs from "node:fs";

export async function downloadAttachment(req, res) {
  const enquiry = await Enquiry.findById(req.params.id).lean();
  if (!enquiry || !enquiry.attachment?.url) {
    return res.status(404).json({ message: "No attachment found for this enquiry" });
  }

  const filename = path.basename(enquiry.attachment.url);
  const filePath = path.join(uploadRoot, filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Attachment file is no longer available" });
  }

  res.setHeader(
    "Content-Type",
    enquiry.attachment.mimetype || "application/octet-stream",
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${enquiry.attachment.filename || filename}"`,
  );
  return res.sendFile(filePath);
}
