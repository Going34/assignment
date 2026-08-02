import axios from "axios";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

export interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
  created_at: string;
  participant_count?: number;
}

export interface MyApplication {
  id: number;
  status: "applied" | "cancelled";
  cancel_reason: string | null;
  cancelled_at: string | null;
  created_at: string;
  event_id: number;
  event_name: string;
  event_date: string;
  event_location: string;
}

export interface Participant {
  application_id: number;
  status: "applied" | "cancelled";
  cancel_reason: string | null;
  cancelled_at: string | null;
  applied_at: string;
  user_id: number;
  name: string;
  email: string;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("vy_token");
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem("vy_token", token);
  else window.localStorage.removeItem("vy_token");
}

async function request<T>(path: string, options: any = {}): Promise<T> {
  const token = getToken();
  
  try {
    const res = await axios(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return res.data;
  } catch (err: any) {
    const res = err.response;
    if (!res) throw err;

    const data = res.data;
    if (res.status === 401 && !path.startsWith("/api/auth/login")) {
      setToken(null);
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login")
      ) {
        window.location.href = "/login";
      }
    }
    throw new ApiError(data?.error ?? `Request failed (${res.status})`, res.status);
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", data: body }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", data: body }),
  del: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
