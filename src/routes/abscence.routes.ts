import { Router } from "express";
import { absenceControllers } from "../controllers/abscence.controllers";
import { absenceMiddleware } from "../middleware/abscenceHours.middleware";

export const absenceRouter = Router()

// // Routes API-REST creations
absenceRouter.get("/:id",absenceMiddleware.fillAbsences,absenceControllers.getAbscences)