import { Router } from "express";
import { employeeControllers } from "../controllers/employee.controllers";

export const routeEmployee = Router()

// Routes API-REST creation
routeEmployee.post("/",employeeControllers.createEmployee)