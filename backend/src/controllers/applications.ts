import type { Request, Response } from "express";
import * as appModel from "../models/applications.js";
import { AppError, asyncHandler } from "../lib/http.js";
import { cancelReasonSchema } from "../validation/schemas.js";

export const applyToEvent = asyncHandler(async (req: Request, res: Response) => {
  const eventId = Number(req.params.id);
  if (!eventId) throw new AppError("Invalid event ID", 400);

  if (!(await appModel.eventExists(eventId))) {
    throw new AppError("Event not found", 404);
  }
  const application = await appModel.applyToEvent(eventId, req.user!.id);
  res.status(201).json({ application });
});

export const cancelApplication = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id) throw new AppError("Invalid application ID", 400);

  const { reason } = cancelReasonSchema.parse(req.body);
  const application = await appModel.cancelApplication(id, reason);
  if (!application) {
    throw new AppError("Application not found or already cancelled", 404);
  }
  res.json({ application });
});

export const myApplications = asyncHandler(async (req: Request, res: Response) => {
  const applications = await appModel.listMyApplications(req.user!.id);
  res.json({ applications });
});
