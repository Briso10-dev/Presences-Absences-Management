import { Router } from "express";
import { presenceControllers } from "../controllers/presence.controllers";
import { presenceStartValidator } from "../middleware/employee.middleware";
import { presenceEndValidator } from "../middleware/employee.middleware";

export const presenceRouter = Router()

// // Routes API-REST creations
presenceRouter.post("/check-in/:id",presenceStartValidator,presenceControllers.startAttendance)
presenceRouter.post("/check-out/:id",presenceEndValidator,presenceControllers.endAttendance)
presenceRouter.get("/",presenceControllers.getAttendance)