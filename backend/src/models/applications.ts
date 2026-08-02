import { pool } from "../db.js";

export interface ApplicationRow {
  id: number;
  event_id: number;
  user_id: number;
  status: "applied" | "cancelled";
  cancel_reason: string | null;
  cancelled_at: string | null;
  created_at: string;
}

export interface MyApplicationRow extends ApplicationRow {
  event_name: string;
  event_date: string;
  event_location: string;
}


export async function eventExists(id: number): Promise<boolean> {
  const { rowCount } = await pool.query("SELECT 1 FROM events WHERE id = $1", [id]);
  return Boolean(rowCount);
}


export async function applyToEvent(
  eventId: number,
  userId: number,
): Promise<ApplicationRow> {
  const { rows } = await pool.query(
    `INSERT INTO applications (event_id, user_id)
     VALUES ($1, $2)
     ON CONFLICT (event_id, user_id)
     DO UPDATE SET status = 'applied', cancel_reason = NULL, cancelled_at = NULL
     RETURNING id, event_id, user_id, status, cancel_reason, cancelled_at, created_at`,
    [eventId, userId],
  );
  return rows[0];
}


export async function cancelApplication(
  id: number,
  reason: string,
): Promise<ApplicationRow | undefined> {
  const { rows } = await pool.query(
    `UPDATE applications
     SET status = 'cancelled', cancel_reason = $2, cancelled_at = now()
     WHERE id = $1 AND status <> 'cancelled'
     RETURNING id, event_id, user_id, status, cancel_reason, cancelled_at`,
    [id, reason],
  );
  return rows[0];
}


export async function listMyApplications(userId: number): Promise<MyApplicationRow[]> {
  const { rows } = await pool.query(
    `SELECT a.id, a.status, a.cancel_reason, a.cancelled_at, a.created_at,
            e.id AS event_id, e.name AS event_name, e.date AS event_date,
            e.location AS event_location
     FROM applications a
     JOIN events e ON e.id = a.event_id
     WHERE a.user_id = $1
     ORDER BY a.created_at DESC`,
    [userId],
  );
  return rows;
}
