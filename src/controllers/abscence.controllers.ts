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
    },
    salaryAdjustment: async (req:Request,res:Response)=>{
        try {
            const {id} = req.params
            //retrieving absenceHour of the employee
            const absence = await prisma.absence.findFirst({
                select:{
                    absenceHour : true,
                    empAbsence : true
                },
                where:{
                    empAbsenceID : id
                }
            })
            if(!absence)
                return res.status(HttpCode.OK).json({msg:"no salary adjustment"})
            //retrieving  his previos salary and absenceHOurs
             const empSalary = absence.empAbsence.salary
             const absenceHours = absence.absenceHour
            //adjusting a new salary
            const newSalary = empSalary/absenceHours

            //updating now employee's salary
            const updateEmployee = await prisma.employee.update({
                where:{
                    employeeID: id
                },
                data:{
                    salary:newSalary
                }
            })
            if(!updateEmployee)
                res.status(HttpCode.INTERNAL_SERVER_ERROR).json({msg:"you are not register here"})
            res.status(HttpCode.OK).json({msg:"You had a salary adjustment"})
        } catch (error) {
            sendError(res,error)
        }
    }
}