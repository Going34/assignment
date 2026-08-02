import { pool } from "../db.js";

export interface UserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: "admin" | "user";
  created_at: string;
}

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  created_at: string;
}


export async function findByEmail(email: string): Promise<UserRow | undefined> {
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return rows[0];
}


export async function findPublicById(id: number): Promise<PublicUser | undefined> {
  const { rows } = await pool.query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
    [id],
  );
  return rows[0];
}
