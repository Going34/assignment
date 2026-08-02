import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { signToken, type AuthUser } from "../middleware/auth.js";
import * as userModel from "../models/users.js";
import { AppError, asyncHandler } from "../lib/http.js";
import { loginSchema } from "../validation/schemas.js";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await userModel.findByEmail(email);
  const isMatch = await bcrypt.compare(password, user?.password_hash || '');
  if (!user || !isMatch) {
    throw new AppError("Invalid email or password", 401);
  }
  const authUser: AuthUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  res.json({ token: signToken(authUser), user: authUser });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await userModel.findPublicById(req.user!.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  res.json({ user });
});
