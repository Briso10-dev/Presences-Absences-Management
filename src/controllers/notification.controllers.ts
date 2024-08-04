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
            //first retrieving first employee to be able to use its name for email(not present)
            const employee = await prisma.employee.findFirst({
                select:{
                    name:true,
                    email: true
                },
                where:{
                    employeeID
                }
            })
            if(!employee)
                return res.status(HttpCode.NOT_FOUND).json({msg:"you are not found here"})
            //concerning presence/absences notifications
            const [attendance,absence] = await Promise.all([
                prisma.presence.findFirst({
                    select:{
                        presenceID:true,
                        date:true,
                    },
                    where:{
                        empPresenceID : employeeID
                    }
                }),
                prisma.absence.findFirst({
                    select:{
                        absenceID:true,
                        date: true
                    },
                    where:{
                        empAbsenceID : employeeID
                    }
                }),
            ])
            if(attendance && !absence){
                const attendance_msg = "You are present young man"
                sendMail(employee.email,"Exercice2-Employee Management",await EmailTemplate.employeePresence(employee.name,attendance_msg))
                return res.status(HttpCode.OK).json({msg:`${employee.name} is present`})
            }else if(absence && !attendance){
                const absence_msg = "you are absent young man" 
                sendMail(employee.email,"Exercice2-Employee Management",await EmailTemplate.employeeAbsence(employee.name,absence_msg))
                return res.status(HttpCode.OK).json({msg:`${employee.name} is absent`})   
            }else if(!attendance && !absence){
                return res.status(HttpCode.NOT_FOUND).json({msg:`${employee.name} go and mark your presence or you will be absent`})
            }

        } catch (error) {
            sendError(res,error)
        }
    }
}

export default controllersNotif