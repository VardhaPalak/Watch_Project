import { Router } from "express";
import { login, me, listUsers, createUser, updateUser } from "../controllers/auth.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.post("/login", authLimiter, login);
router.get("/me", authenticate, me);

export const adminUserRoutes = Router();
adminUserRoutes.get("/", authenticate, requireAdmin, listUsers);
adminUserRoutes.post("/", authenticate, requireAdmin, createUser);
adminUserRoutes.patch("/:id", authenticate, requireAdmin, updateUser);

export default router;
