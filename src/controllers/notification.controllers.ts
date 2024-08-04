import { Request, Response } from "express";
import prisma from "../core/config/prisma";
import { HttpCode } from "../core/constants";
import sendError from "../core/constants/errors";
import sendMail from "../core/config/send.mail";
import EmailTemplate from "../core/template";

const controllersNotif = {
    employeeNotif : async (req:Request,res:Response)=>{
        try {
            const {employeeID} = req.body

            //concerning attendances
            const [attendance,absence] = await Promise.all([
                prisma.presence.findFirst({
                    where:{
                        empPresenceID : employeeID
                    }
                }),
                prisma.absence.findFirst({
                    where:{
                        empAbsenceID : employeeID
                    }
                }),
            ])
            if(!attendance)
                
        } catch (error) {
            sendError(res,error)
        }
    }
}

export default controllersNotif