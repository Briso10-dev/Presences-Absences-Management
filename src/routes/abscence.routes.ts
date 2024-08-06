import { Router } from "express";
import { absenceControllers } from "../controllers/abscence.controllers";
import { absenceMiddleware } from "../middleware/abscences.middleware";

export const absenceRouter = Router()

// // Routes API-REST creations
absenceRouter.get("/attendance/absences",absenceMiddleware.calculateAbsHours,absenceControllers.getAbscences)
absenceRouter.get("/salary/",absenceMiddleware.adjustSalary,absenceControllers.getSalaryAdjustment)