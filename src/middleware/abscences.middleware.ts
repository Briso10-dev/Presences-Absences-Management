import { NextFunction, Request, Response } from "express";
import prisma from "../core/config/prisma";
import { HttpCode } from "../core/constants";
import sendError from "../core/constants/errors";
import { differenceInHours } from 'date-fns';
import sendMail from "../core/config/send.mail";
import EmailTemplate from "../core/template";

export const absenceMiddleware = {
    calculateAbsHours: async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { emplyeeID, date } = req.body

            const absence = await prisma.absence.findFirst({
                select: {
                    absenceID: true,
                    date: true,
                },
                where: {
                    empAbsenceID: emplyeeID,
                    date
                }
            })
            if (!absence)
                return res.status(HttpCode.NOT_FOUND).json({ msg: "No user absence on that date" })
            // Extracting hours from the date attribute: here the absenceHour is function of the complete Date absent
            const dates = new Date(absence.date) 
            const absenceHour: number = dates.getHours()

            const updateAbsence = await prisma.absence.update({
                select: {
                    date: true,
                    absenceHour: true
                },
                where: {
                    absenceID: absence.absenceID

                },
                data: {
                    absenceHour
                }
            })
            if (!updateAbsence) res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "could not update user" })
            next()
        } catch (error) {
            sendError(res, error)
        }
    },
    adjustSalary:async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { employeeID } = req.body;
            const date = new Date();
            let newSalary;
    
            const employee = await prisma.employee.findFirst({ 
                where: { 
                    employeeID 
                } 
            });
            if (!employee) {
                return next(new Error("Employee not found")); //returning an error response based middleware 
            }
    
            const attendance = await prisma.presence.findFirst({
                where: { 
                    empPresenceID: employeeID 
                }
            });
            if (!attendance) {
                // Employee is absent
                const absence = await prisma.absence.create({
                    data: {
                        date,
                        absenceHour: 2,
                        empAbsenceID: employee.employeeID,
                    }
                });
    
                newSalary = employee.salary / absence.absenceHour;
                 // Employee is partially absent
            } else if (!attendance.startingHour || !attendance.endingHour) {
                await prisma.presence.delete({ 
                    where: { 
                        presenceID: attendance.presenceID 
                    } });
    
                const absenceHour = differenceInHours(attendance.endingHour || date, attendance.startingHour || date);
                const absence = await prisma.absence.create({
                    data: {
                        date,
                        absenceHour,
                        empAbsenceID: employee.employeeID,
                    }
                });
    
                newSalary = employee.salary / absence.absenceHour;
            } else {
                // Employee is present,so salary still remains fixed
                newSalary = employee.salary;
            }
    
            // Update employee's salary
            await prisma.employee.update({
                where: { 
                    employeeID 
                },
                data: { 
                    salary: newSalary 
                }
            });
            const message = attendance ? "You are present" : "You are absent";
            //email sending of salary adjustment
            await sendMail(employee.email, "Employee Management", await EmailTemplate.employeeSalary(employee.name, message));
    
            next();
        } catch (error) {
            next(error);
        }
    }
}