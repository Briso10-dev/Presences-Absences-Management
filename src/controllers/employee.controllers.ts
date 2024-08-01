import { Request,Response } from "express";
import { PrismaClient } from "@prisma/client";
import { HttpCode } from "../core/constants";
import { validationResult } from "express-validator";
import sendError from "../core/constants/errors";
import bcrypt from 'bcrypt'


const prisma = new PrismaClient()

export const employeeControllers = {
    createEmployee : async (req:Request,res:Response)=>{
         // Check for validation errors
         const errors = validationResult(req);
         if (!errors.isEmpty())
             return res.status(HttpCode.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
            
        try {
            const {name,email,password,poste,salary} = req.body
            const passHash = await bcrypt.hash(password,10) //hashing password

            const employee = await prisma.employee.create({
                data:{
                    name,
                    email,
                    password : passHash,
                    poste,
                    salary   
                }
            })
            if(!employee)
                return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({msg:"COuld not create EMployee"})
            return res.status(HttpCode.OK).json({msg:`${employee.name} successfully created`})

        } catch (error) {
            sendError(res,error)
        }
    }
}