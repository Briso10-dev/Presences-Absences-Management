import { Request, Response } from "express";
import prisma from "../core/config/prisma";
import { HttpCode } from "../core/constants";
import sendError from "../core/constants/errors";
import { validationResult } from "express-validator";

export const presenceControllers = {
    //mark user presence
    startAttendance: async (req: Request, res: Response) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res.status(HttpCode.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });

            //presence mark with his userID
            const { startingHour } = req.body
            const { id } = req.params
            const date = new Date(Date.now())

            // veryfing first if employeeID exists
            const employee = await prisma.employee.findUnique({
                where: {
                    employeeID: id
                }
            })
            if (!employee)
                return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "userID not found" })
            // Theen starts marking its presence
            const presence = await prisma.presence.create({
                data: {
                    date,
                    startingHour,
                    empPresenceID: employee.employeeID,                     //no ending hour yet
                }
            })
            if (!presence)
                return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: `The ${startingHour} or${employee.employeeID} entered is not correct` })
            return res.status(HttpCode.OK).json(presence)
        } catch (error) {
            sendError(res, error)
        }
    },
    endAttendance: async (req: Request, res: Response) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res.status(HttpCode.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });

            const { id } = req.params
            const { endingHour } = req.body

            // marking endinHour by just updating the presence model
            const attendance = await prisma.presence.update({
                where: {
                    presenceID: id
                },
                data: {
                    endingHour
                }
            }) //verifying actually if the employee came
            if (!attendance )
                return res.status(HttpCode.NOT_FOUND).json({ msg: "You did not even border to come" })
            return res.status(HttpCode.OK).json(attendance)
        }catch (error) {
            sendError(res, error)
        }
    },
    getAttendance: async (req: Request, res: Response) => {
        try {
            const attendances = await prisma.presence.findMany({
                select: {
                    empPresenceID: true,
                    startingHour: true,
                    endingHour: true
                }
            })
            if (!attendances)
                return res.status(HttpCode.NOT_FOUND).json({ msg: "no records presence of employees" })
            return res.status(HttpCode.OK).json(attendances)
        } catch (error) {
            sendError(res, error)
        }
    }
}   