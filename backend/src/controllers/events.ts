import type { Request, Response } from "express";
import * as eventModel from "../models/events.js";
import { AppError, asyncHandler } from "../lib/http.js";
import { eventInputSchema, eventUpdateSchema } from "../validation/schemas.js";

function toIsoDate(date: string): string {
  return new Date(date).toISOString();
}

export const listEvents = asyncHandler(async (req: Request, res: Response) => {
  const sort = req.query.sort === "desc" ? "desc" : "asc";
  const events = await eventModel.listEvents({ sort });
  res.json({ events });
});

export const getEvent = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id) throw new AppError("Invalid event ID", 400);

  const event = await eventModel.getEventById(id);
  if (!event) throw new AppError("Event not found", 404);
  res.json({ event });
});

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const data = eventInputSchema.parse(req.body);
  const event = await eventModel.createEvent({
    name: data.name,
    description: data.description ?? "",
    date: toIsoDate(data.date),
    location: data.location ?? "",
  });
  res.status(201).json({ event });
});

export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id) throw new AppError("Invalid event ID", 400);

  const data = eventUpdateSchema.parse(req.body);

  const patch: eventModel.EventPatch = {};
  if (data.name !== undefined) patch.name = data.name;
  if (data.description !== undefined) patch.description = data.description;
  if (data.date !== undefined) patch.date = toIsoDate(data.date);
  if (data.location !== undefined) patch.location = data.location;

  const event = await eventModel.updateEvent(id, patch);
  if (!event) throw new AppError("Event not found", 404);
  res.json({ event });
});

export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id) throw new AppError("Invalid event ID", 400);

  const deleted = await eventModel.deleteEvent(id);
  if (!deleted) throw new AppError("Event not found", 404);
  res.json({ ok: true });
});

export const listParticipants = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id) throw new AppError("Invalid event ID", 400);

  const participants = await eventModel.listParticipants(id);
  res.json({ participants });
});
