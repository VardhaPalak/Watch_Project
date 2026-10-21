import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import multer from "multer";
import env from "../config/env.js";

const uploadRoot = path.resolve(process.cwd(), env.uploadsDir);
fs.mkdirSync(uploadRoot, { recursive: true });

const allowedMime = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase().slice(0, 10);
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`);
  },
});

export const enquiryUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!allowedMime.has(file.mimetype)) {
      cb(new Error("Only JPG, PNG, WEBP, GIF or PDF attachments are allowed."));
      return;
    }
    cb(null, true);
  },
}).single("attachment");

export { uploadRoot };
