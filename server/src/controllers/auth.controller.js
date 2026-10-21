import User from "../models/User.js";
import { signToken } from "../middleware/auth.js";

export async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(422).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email: String(email).toLowerCase() }).select("+password");
  if (!user || !user.active) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await user.verifyPassword(password);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  user.lastLoginAt = new Date();
  await user.save();

  return res.json({ token: signToken(user), user: user.toPublic() });
}

export async function me(req, res) {
  return res.json({ user: req.user.toPublic() });
}

export async function listUsers(req, res) {
  const users = await User.find().sort({ role: 1, name: 1 }).lean();
  res.json({ items: users.map((user) => ({ ...user, password: undefined })) });
}

export async function createUser(req, res) {
  const { name, email, password, role } = req.body || {};
  if (!name || !email || !password) {
    return res.status(422).json({ message: "Name, email and password are required" });
  }
  const user = new User({ name, email: String(email).toLowerCase(), role: role === "admin" ? "admin" : "staff" });
  await user.setPassword(password);
  await user.save();
  return res.status(201).json({ user: user.toPublic() });
}

export async function updateUser(req, res) {
  const { name, role, active, password } = req.body || {};
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "Team member not found" });

  if (name) user.name = name;
  if (role) user.role = role === "admin" ? "admin" : "staff";
  if (typeof active === "boolean") user.active = active;
  if (password) await user.setPassword(password);
  await user.save();
  return res.json({ user: user.toPublic() });
}
