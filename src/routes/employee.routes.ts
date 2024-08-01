import { Router } from "express";
import { employeeControllers } from "../controllers/employee.controllers";
import { employeeValidator } from "../middleware/employee.middleware";

export const routeEmployee = Router()

// Routes API-REST creation
routeEmployee.post("/",employeeValidator,employeeControllers.createEmployee)