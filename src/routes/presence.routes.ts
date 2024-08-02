import { Router } from "express";
import { presenceControllers } from "../controllers/presence.controllers";
import { presenceValidator } from "../middleware/employee.middleware";


export const presenceRouter = Router()

// // Routes API-REST creations
presenceRouter.post("/check-in/:id",presenceValidator,presenceControllers.startPresence)
presenceRouter.post("/check-out/:id",presenceControllers.endPresence)