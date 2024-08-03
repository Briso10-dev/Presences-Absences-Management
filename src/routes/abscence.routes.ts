import { Router } from "express";
import { abscenceControllers } from "../controllers/presence.controllers";
import { presenceStartValidator } from "../middleware/employee.middleware";
import { presenceEndValidator } from "../middleware/employee.middleware";

export const abscenceRouter = Router()

// // Routes API-REST creations
abscenceRouter.get("/",)