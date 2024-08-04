import { Router } from "express";
import generateReport from "../controllers/report.controllers";

const routerReport = Router()

routerReport.get("/attendance",generateReport.attendanceReport)
routerReport.get("/absence",generateReport.absenceReport)

export default routerReport