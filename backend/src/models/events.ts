import { pool } from "../db.js";

export interface EventRow {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
  created_at: string;
  participant_count: number;
}

export interface NewEventInput {
  name: string;
  description: string;
  date: string;
  location: string;
}

export type EventPatch = {
  name?: string | undefined;
  description?: string | undefined;
  date?: string | undefined;
  location?: string | undefined;
}

export interface ParticipantRow {
  application_id: number;
  status: "applied" | "cancelled";
  cancel_reason: string | null;
  cancelled_at: string | null;
  applied_at: string;
  user_id: number;
  name: string;
  email: string;
}

export interface EventFilters {
  sort?: "asc" | "desc";
}

export async function listEvents(filters: EventFilters = {}): Promise<EventRow[]> {
  const order = filters.sort === "desc" ? "DESC" : "ASC";
  const { rows } = await pool.query(
    `SELECT e.id, e.name, e.description, e.date, e.location, e.created_at, COUNT(a.id) FILTER (WHERE a.status = 'applied')::int AS participant_count
     FROM events e
     LEFT JOIN applications a ON a.event_id = e.id
     GROUP BY e.id
     ORDER BY e.date ${order}`,
  );
  return rows;
}

export async function getEventById(id: number): Promise<EventRow | undefined> {
  const { rows } = await pool.query(`SELECT e.id, e.name, e.description, e.date, e.location, e.created_at, COUNT(a.id) FILTER (WHERE a.status = 'applied')::int AS participant_count
     FROM events e
     LEFT JOIN applications a ON a.event_id = e.id WHERE e.id = $1 GROUP BY e.id`, [id]);
  return rows[0];
}

export async function createEvent(input: NewEventInput): Promise<EventRow> {
  const { rows } = await pool.query(
    `INSERT INTO events (name, description, date, location)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, description, date, location, created_at`,
    [input.name, input.description, input.date, input.location],
  );
  return { ...rows[0], participant_count: 0 };
}

export async function updateEvent(id: number, patch: EventPatch): Promise<EventRow | undefined> {
  const { rowCount } = await pool.query(
    `UPDATE events
     SET name = COALESCE($1, name),
         description = COALESCE($2, description),
         date = COALESCE($3, date),
         location = COALESCE($4, location)
     WHERE id = $5`,
    [patch.name ?? null, patch.description ?? null, patch.date ?? null, patch.location ?? null, id],
  );
  if (!rowCount) return undefined;
  return getEventById(id);
}

export async function deleteEvent(id: number): Promise<boolean> {
  const { rowCount } = await pool.query("DELETE FROM events WHERE id = $1", [id]);
  return Boolean(rowCount);
}

export async function listParticipants(eventId: number): Promise<ParticipantRow[]> {
  const { rows } = await pool.query<ParticipantRow>(
    `SELECT a.id AS application_id, a.status, a.cancel_reason, a.cancelled_at, a.created_at AS applied_at,
            u.id AS user_id, u.name, u.email
     FROM applications a
     JOIN users u ON u.id = a.user_id
     WHERE a.event_id = $1
     ORDER BY a.created_at DESC`,
    [eventId],
  );
  return rows;
}
