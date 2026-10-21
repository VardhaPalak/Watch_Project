import "dotenv/config";

const bool = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
};

const int = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: int(process.env.PORT, 5000),
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/timecraft",
  clientOrigins: (process.env.CLIENT_ORIGIN || "http://localhost:5173,http://localhost:4173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  jwtSecret: process.env.JWT_SECRET || "timecraft-dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  adminEmail: process.env.ADMIN_EMAIL || "admin@timecraft.com",
  adminPassword: process.env.ADMIN_PASSWORD || "Timecraft@123",
  uploadsDir: process.env.UPLOADS_DIR || "uploads",
  mail: {
    host: process.env.SMTP_HOST || "",
    port: int(process.env.SMTP_PORT, 587),
    secure: bool(process.env.SMTP_SECURE, false),
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.MAIL_FROM || "TIMECRAFT <no-reply@timecraft.com>",
    teamEmail: process.env.ENQUIRY_TEAM_EMAIL || process.env.ADMIN_EMAIL || "admin@timecraft.com",
  },
  businessWhatsapp: process.env.BUSINESS_WHATSAPP || "",
  businessPhone: process.env.BUSINESS_PHONE || "",
  businessEmail: process.env.BUSINESS_EMAIL || "care@timecraft.com",
  brandName: process.env.BRAND_NAME || "TIMECRAFT",
};

if (env.nodeEnv === "production" && env.jwtSecret === "timecraft-dev-secret-change-me") {
  throw new Error("JWT_SECRET must be set in production");
}

export default env;
