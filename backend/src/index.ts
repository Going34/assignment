import "dotenv/config";
import cors from "cors";
import express from "express";
import { ensureDatabase, initDb } from "./db.js";
import { errorHandler } from "./lib/http.js";
import applicationRoutes from "./routes/applications.js";
import authRoutes from "./routes/auth.js";
import helmet from "helmet";
import eventRoutes from "./routes/events.js";

const PORT = Number(process.env.PORT ?? 4000);

async function main() {
  await ensureDatabase();
  await initDb();

  if (process.argv.includes("--setup-only")) {
    console.log("Setup complete — exiting.");
    const { pool } = await import("./db.js");
    await pool.end();
    return;
  }

  const app = express();
  app.use(
    cors({
      origin: (process.env.CORS_ORIGIN ?? "http://localhost:3000,http://localhost:3001")
        .split(",")
        .map((o) => o.trim()),
    }),
  );
  app.use(helmet())
  app.use(express.json());


  app.use("/api/auth", authRoutes);
  app.use("/api", eventRoutes);
  app.use("/api", applicationRoutes);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
