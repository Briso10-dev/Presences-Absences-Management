import { Router } from "express";
import { presenceControllers } from "../controllers/presence.controllers";

export const presenceRouter = Router()

// // Routes API-REST creations
presenceRouter.post("/check-in/:id",presenceControllers.startPresence)