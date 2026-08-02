import { Router } from "express";
import * as events from "../controllers/events.js";
import { adminRequired, authRequired } from "../middleware/auth.js";

const router = Router();

router.use(authRequired);

router.get("/events", events.listEvents);
router.get("/events/:id", events.getEvent);
router.post("/events", adminRequired, events.createEvent);
router.put("/events/:id", adminRequired, events.updateEvent);
router.delete("/events/:id", adminRequired, events.deleteEvent);
router.get("/events/:id/participants", adminRequired, events.listParticipants);

export default router;
