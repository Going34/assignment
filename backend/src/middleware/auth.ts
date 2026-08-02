import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

export const JWT_SECRET = process.env.JWT_SECRET ?? "secret";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

declare global {
  
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function signToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
}

export function authRequired(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthUser;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export async function adminRequired(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  authRequired(req, res, async () => {
    try {
      const { rows } = await pool.query(
        "SELECT role FROM users WHERE id = $1",
        [req.user!.id],
      );
      if (!rows[0] || rows[0].role !== "admin") {
        res.status(403).json({ error: "Admin access required" });
        return;
      }
      next();
    } catch (err) {
      console.error("adminRequired error", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
