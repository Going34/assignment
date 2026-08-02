import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Pool } from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function resolveSchemaPath(): string {
  const candidates = [
    path.resolve(process.cwd(), "db", "schema.sql"),
    path.join(__dirname, "..", "db", "schema.sql"),
    path.join(__dirname, "..", "..", "db", "schema.sql"),
  ];
  const found = candidates.find((c) => existsSync(c));
  if (!found) throw new Error(`schema.sql not found (tried: ${candidates.join(", ")})`);
  return found;
}

export interface DbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export const DB_CONFIG: DbConfig = {
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASSWORD ?? "admin",
  database: process.env.DB_NAME ?? "event_manager",
};

export const pool = new Pool(DB_CONFIG);

export async function ensureDatabase(): Promise<void> {
  const adminPool = new Pool({ ...DB_CONFIG, database: "postgres" });
  try {
    const { rowCount } = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [DB_CONFIG.database],
    );
    if (!rowCount) {
      await adminPool.query(`CREATE DATABASE "${DB_CONFIG.database}"`);
    }
  } finally {
    await adminPool.end();
  }
}

export async function initDb(): Promise<void> {
  const schema = readFileSync(resolveSchemaPath(), "utf8");
  await pool.query(schema);
}
