import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const eventInputSchema = z.object({
  name: z.string().trim().min(1, "Event name is required"),
  description: z.string().trim().optional().default(""),
  date: z.string().min(1, "Date is required"),
  location: z.string().trim().optional().default(""),
});

export const eventUpdateSchema = eventInputSchema.partial();

export const cancelReasonSchema = z.object({
  reason: z.string().trim().min(1, "Reason is required"),
});

export type EventInput = z.infer<typeof eventInputSchema>;
export type EventUpdate = z.infer<typeof eventUpdateSchema>;
