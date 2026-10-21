import { Router } from "express";
import {
  listProducts,
  getProduct,
  getCategories,
  getStorefrontSettings,
} from "../controllers/product.controller.js";
import { createEnquiry } from "../controllers/enquiry.controller.js";
import { enquiryLimiter } from "../middleware/rateLimit.js";
import { handleValidation } from "../middleware/validate.js";
import { enquiryUpload } from "../middleware/upload.js";
import {
  body,
  check,
  validationResult,
} from "express-validator";

const router = Router();

const enquiryRules = [
  body("name").trim().isLength({ min: 2, max: 120 }).withMessage("Please enter your full name."),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail({ gmail_remove_dots: false }),
  body("phone")
    .trim()
    .matches(/^[+]?[0-9\s\-()]{6,20}$/)
    .withMessage("Please enter a valid phone number including the country code."),
  body("countryCode")
    .optional({ values: "falsy" })
    .trim()
    .matches(/^\+?[0-9]{1,4}$/)
    .withMessage("Please enter a valid country code."),
  body("enquiryType")
    .trim()
    .isIn([
      "Product Enquiry",
      "Price Enquiry",
      "Bulk Order",
      "Corporate Gifting",
      "Partnership",
      "Other",
    ])
    .withMessage("Please choose an enquiry type."),
  body("productName").optional({ values: "falsy" }).trim().isLength({ max: 160 }),
  body("budget").optional({ values: "falsy" }).trim().isLength({ max: 80 }),
  body("quantity").optional({ values: "falsy" }).isInt({ min: 1, max: 100000 }),
  body("preferredContact")
    .optional({ values: "falsy" })
    .isIn(["Phone", "WhatsApp", "Email"])
    .withMessage("Please choose a contact method."),
  body("message")
    .trim()
    .isLength({ min: 10, max: 4000 })
    .withMessage("Please tell us a little more (at least 10 characters)."),
  body("consent")
    .custom((value) => value === true || value === "true" || value === "on")
    .withMessage("Please accept the privacy policy to continue."),
];

router.get("/products", listProducts);
router.get("/products/:identifier", getProduct);
router.get("/categories", getCategories);
router.get("/settings", getStorefrontSettings);

router.post(
  "/enquiries",
  enquiryLimiter,
  enquiryUpload,
  enquiryRules,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const payload = { message: "Please correct the highlighted fields.", errors: {} };
      for (const error of errors.array()) {
        if (!payload.errors[error.path]) payload.errors[error.path] = error.msg;
      }
      return res.status(422).json(payload);
    }
    if (req.file) {
      req.body.attachment = {
        url: `/uploads/${req.file.filename}`,
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      };
    }
    return next();
  },
  createEnquiry,
);

export default router;
