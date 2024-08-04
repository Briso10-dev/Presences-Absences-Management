import { Request, Response } from "express";
import prisma from "../core/config/prisma";
import { HttpCode } from "../core/constants";
import sendError from "../core/constants/errors";

const generateReport = {
   attendanceReport : async (req:Request,res:Response)=>{
        try {
            const {presenceID,period} = req.body
            //finding an employee's presence if yes forcefully that employee exists
            const attendance = await prisma.presence.findFirst({
                select:{
                    presenceID:true,
                    date:true,
                },
                where:{
                    presenceID
                }
            })
            if (!attendance)
                return res.status(HttpCode.NOT_FOUND).json({ msg: "You actually were not present" })
            const report = await prisma.report.create({
                data: {
                    content: "YO",
                    period
                }
            })
            if (!report)
                return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "no report generated" })
               //updating presence's model
               await prisma.presence.update({
                where:{
                    presenceID
                },
                data:{
                    repPresenceID : report.reportID
                }
            })
            return res.status(HttpCode.OK).json({ msg: "Report generated" })
        } catch (error) {
            sendError(res,error)
        }
   },   
   absenceReport : async (req:Request,res:Response)=>{
    try {
        const {absenceID,period} = req.body
        //finding an employee's presence if yes forcefully that employee exists
        const absence = await prisma.absence.findFirst({
            select:{
                absenceID:true,
                date:true,
            },
            where:{
                absenceID
            }
        })
        if (!absence)
            return res.status(HttpCode.NOT_FOUND).json({ msg: "You actually were not present" })
        const report = await prisma.report.create({
            data: {
                content: "This is me again",
                period
            }
        })
        if (!report)
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "no report generated" })
           //updating presence's model
           await prisma.absence.update({
            where:{
                absenceID
            },
            data:{
                repAbsenceID : report.reportID
            }
        })
        return res.status(HttpCode.OK).json({ msg: "Report generated" })
    } catch (error) {
        sendError(res,error)
    }
},   
}

export default generateReport