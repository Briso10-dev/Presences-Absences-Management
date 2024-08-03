import { Request, Response } from "express";
import prisma from "../core/config/prisma";
import { HttpCode } from "../core/constants";
import sendError from "../core/constants/errors";
import { validationResult } from "express-validator";

export const abscenceControllers = {
    getAbscences : async (req:Request,res:Response)=>{
        try {
            
        } catch (error) {
            sendError(res,error)
        }
    }
}