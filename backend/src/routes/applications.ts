import { Router } from "express";
import * as applications from "../controllers/applications.js";
import { adminRequired, authRequired } from "../middleware/auth.js";

const router = Router();

router.use(authRequired);

router.post("/events/:id/apply", applications.applyToEvent);
router.post("/applications/:id/cancel", adminRequired, applications.cancelApplication);
router.get("/me/applications", applications.myApplications);

export default router;
