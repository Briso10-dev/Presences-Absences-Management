import { Request, Response } from "express";
import prisma from "../core/config/prisma";
import { HttpCode } from "../core/constants";
import sendError from "../core/constants/errors";

export const absenceControllers = {
    getAbscences : async (req:Request,res:Response)=>{
        try {
            const {id} = req.params //from body to maintain consistency with middleware
            const absenceHours = await prisma.absence.findFirst({
                select:{
                    absenceID : true,
                    date : true,
                    absenceHour:true
                },
                where:{
                    empAbsenceID : id //actually using employeeID in absence model
                },  
            })
            if(!absenceHours)
                return res.status(HttpCode.NOT_FOUND).json({msg:"You are not in the absence list"})
            return res.status(HttpCode.OK).json(absenceHours) 
        } catch (error) {
            sendError(res,error)
        }
    },
    getSalaryAdjustment :async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const {email} = req.body

            const employee = await prisma.employee.findUnique({
                select: {
                    name: true,
                    post: true,
                    salary: true
                },
                where: { 
                    employeeID : id,
                    email
                }
            });
    
            if (!employee) {
                return res.status(HttpCode.NOT_FOUND).json({ msg: "No employee found or wrong email entered" });
            }
    
            res.status(HttpCode.OK).json({
                msg: "Salary adjustment applied",
                employee: {
                    ...employee, //props to retake employee property
                }
            });
        } catch (error) {
            sendError(res, error);
        }
    }
}