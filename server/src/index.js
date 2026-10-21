import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import path from "node:path";
import fs from "node:fs";
import env from "./config/env.js";
import { connectDatabase } from "./config/db.js";
import publicRoutes from "./routes/public.routes.js";
import authRoutes, { adminUserRoutes } from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { notFound, errorHandler } from "./middleware/error.js";
import { apiLimiter } from "./middleware/rateLimit.js";

const app = express();

app.set("trust proxy", 1);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(compression());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.clientOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use("/api", apiLimiter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "timecraft-api", env: env.nodeEnv });
});

app.use("/api", publicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin", adminRoutes);

// Serve the built client (and SPA fallback) when a production bundle exists.
const clientDist = path.resolve(process.cwd(), "../client/dist");
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) return next();
    return res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.use(notFound);
app.use(errorHandler);

const server = app.listen(env.port, () => {
  console.log(`[api] TIMECRAFT server listening on port ${env.port} (${env.nodeEnv})`);
});

async function start() {
  try {
    await connectDatabase();
  } catch (error) {
    console.error("[db] connection failed:", error.message);
    console.error("[db] set MONGO_URI in server/.env before starting the API");
  }
}

start();

process.on("unhandledRejection", (reason) => {
  console.error("[api] unhandled rejection:", reason);
});

export default app;
