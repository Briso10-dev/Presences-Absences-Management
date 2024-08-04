import { Router } from "express";
import controllersNotif from "../controllers/notification.controllers";

const routerNotif = Router()

routerNotif.post("/",controllersNotif.presence_absenceNotif)

export default routerNotif