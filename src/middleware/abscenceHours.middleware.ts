import { NextFunction, Request, Response } from "express";
import prisma from "../core/config/prisma";
import { HttpCode } from "../core/constants";
import sendError from "../core/constants/errors";
import { differenceInHours } from 'date-fns';

export const absenceMiddleware = {
    fillAbsences: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params
            const { employeeID } = req.body //actually need the employeeID to register his absence if he is not directly present
            const date = new Date(Date.now())

            const employee = await prisma.employee.findUnique({
                where: {
                    employeeID
                }
            })
            if (!employee)
                return res.status(HttpCode.NOT_FOUND).json({ msg: "You did not actually exists" })
            const attendance = await prisma.presence.findUnique({
                select: {
                    presenceID: true,
                    startingHour: true,
                    endingHour: true,
                    empPresence: true //need this to actually create an absence from actuall employeeID
                },
                where: {
                    presenceID: id //if this match means he/she is first an employee
                }
            })
            //if the employee is not totally in the present model
            if (!attendance) {
                //then then we create its absence
                await prisma.absence.create({
                    data: {
                        date,
                        absenceHour: 2,
                        empAbsenceID: employee.employeeID //used the employeeID actually if it exists
                    }
                })
                console.log("tu es ici")
                next()
            }
            console.log("Tu viens ici ?")
            // An employee is present but we need to look ist startingHour and endingHour
            if (attendance) {
                if (!attendance.startingHour || !attendance.endingHour) {
                    //then that employee is not actually present
                    await prisma.presence.delete({
                        where: {
                            presenceID: attendance.presenceID
                        }
                    })

                    //then we create the corresponding absence of that employee
                    const absenceHour = differenceInHours(attendance.endingHour as Date, attendance.startingHour as Date) //as to tell TS ensuresness that this are not null
                    await prisma.absence.create({
                        data: {
                            date,
                            absenceHour,
                            empAbsenceID: attendance.empPresence.employeeID, //taking from attendance since he is actually present
                        }
                    })
                } else next()
            }
            next()
        } catch (error) {
            sendError(res, error)
        }
    }
}