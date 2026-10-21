import jwt from "jsonwebtoken";
import env from "../config/env.js";
import User from "../models/User.js";

export function signToken(user) {
  return jwt.sign(
    { sub: String(user._id), role: user.role, email: user.email },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  );
}

export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub);
    if (!user || !user.active) {
      return res.status(401).json({ message: "Account is no longer active" });
    }
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have access to this resource" });
    }
    return next();
  };
}

export const requireAdmin = requireRole("admin");
export const requireStaff = requireRole("admin", "staff");
