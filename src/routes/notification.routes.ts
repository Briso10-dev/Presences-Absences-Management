import { Router } from "express";
import controllersNotif from "../controllers/notification.controllers";

const routerNotif = Router()

routerNotif.post("/",controllersNotif.employeeNotif)

export default routerNotif