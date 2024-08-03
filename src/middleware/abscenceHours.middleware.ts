import { Request, Response } from "express";
import prisma from "../core/config/prisma";
import { HttpCode } from "../core/constants";
import sendError from "../core/constants/errors";
import { differenceInHours } from 'date-fns';

export const abscenceMiddleware = {
    fillAbscences : async (req:Request,res:Response)=>{
        try {
            const {presenceID} = req.params            
            const date = new Date(Date.now())

            const attendance = await prisma.presence.findUnique({
                where:{
                    presenceID
                }
            })
            if(!attendance)
                return res.status(HttpCode.NOT_FOUND).json({msg:"You simply not present"})
              // starting hour and ending hour must be there to be present
              if(!attendance.startingHour || !attendance.endingHour){
                await prisma.presence.delete({
                    where:{
                        presenceID : attendance.presenceID
                    }
                })

                // then marking the same employee absent with 1 attendanceHour
                const absenceHour = differenceInHours(attendance.endingHour,attendance.startingHour)
                await prisma.absence.create({
                    data:{
                        date,
                        absenceHour,
                        empAbsenceID: attendance.presenceID
                    }
                })
            }
        } catch (error) {
            sendError(res,error)
        }
    }
}