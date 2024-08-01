import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { HttpCode } from "../core/constants";
import { validationResult } from "express-validator";
import chalk from "chalk";
import sendError from "../core/constants/errors";
import bcrypt from 'bcrypt'
import tokenOps from "../core/config/jwt.function";

const prisma = new PrismaClient()

export const employeeControllers = {
    createEmployee: async (req: Request, res: Response) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(HttpCode.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });

        try {
            const { name, email, password, poste, salary } = req.body
            const passHash = await bcrypt.hash(password, 10) //hashing password

            const employee = await prisma.employee.create({
                data: {
                    name,
                    email,
                    password: passHash,
                    poste,
                    salary
                }
            })
            if (!employee)
                return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "Could not create EMployee" })
            return res.status(HttpCode.OK).json({ msg: `${employee.name} successfully created` })

        } catch (error) {
            sendError(res, error)
        }
    },
    loginUser: async (req: Request, res: Response) => {
        try {

            const { email, password } = req.body

            const employee = await prisma.employee.findUnique({
                where: {
                    email
                },
            })
            if (!employee)
                return res.status(HttpCode.NOT_FOUND).json({ msg: "employee not found" })
            const testPass = await bcrypt.compare(password, employee.password)
            if (!testPass)
                return res.status(HttpCode.NOT_FOUND).json({ msg: "wrong password entered" })
            // jwt token generation
            const accessToken = tokenOps.generateAccessToken(employee)
            const refreshToken = tokenOps.generateRefreshToken(employee)
            employee.password = " "
            res.cookie(`${employee.name}-cookie`, refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 1000
            }) //refresh token stored in cookie
            console.log(accessToken)
            res.json({ msg: "User successfully logged in" }).status(HttpCode.OK)
        } catch (error) {
            sendError(res, error)
        }
    },
}