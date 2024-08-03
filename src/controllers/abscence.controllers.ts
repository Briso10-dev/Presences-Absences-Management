import { Request, Response } from "express";
import prisma from "../core/config/prisma";
import { HttpCode } from "../core/constants";
import sendError from "../core/constants/errors";

export const absenceControllers = {
    getAbscences : async (req:Request,res:Response)=>{
        try {
            const {empAbsenceID} = req.body //from body to maintain consistency with middleware

            const absenceHours = await prisma.absence.groupBy({
                where:{
                    empAbsenceID //actually using employeeID in absence model
                },
              by: ['empAbsenceID'],
              _count:{
                absenceHour:true
              }  
            })
            console.log(absenceHours)
            if(!absenceHours)
                return res.status(HttpCode.NOT_FOUND).json({msg:"You are not in the absence list"})
            return res.status(HttpCode.OK).json(absenceHours) 
        } catch (error) {
            sendError(res,error)
        }
    }
}