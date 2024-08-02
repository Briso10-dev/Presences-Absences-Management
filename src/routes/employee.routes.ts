import { Router } from "express";
import { employeeControllers } from "../controllers/employee.controllers";
import { employeeValidator } from "../middleware/employee.middleware";

export const routeEmployee = Router()

// Routes API-REST creations
// employee inscription
routeEmployee.post("/",employeeValidator,employeeControllers.createEmployee)
// employee connexion
routeEmployee.post("/login",employeeControllers.loginEmployee)
// employee disconnexion
routeEmployee.post("/logout",employeeControllers.logoutEmployee)
// get employee profile
routeEmployee.get("/profile/:id",employeeControllers.getEmployee)
// update employee profile
routeEmployee.put("/profile/:id",employeeControllers.updateEmployee)
// delete employee account
routeEmployee.delete("/profile/:id",employeeControllers.deleteEmployee)