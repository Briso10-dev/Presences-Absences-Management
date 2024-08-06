import { Request, Response } from "express";
import prisma from "../core/config/prisma";
import { HttpCode } from "../core/constants";
import { validationResult } from "express-validator";
import sendError from "../core/constants/errors";
import bcrypt from 'bcrypt'
import tokenOps from "../core/config/jwt.function";



export const employeeControllers = {
    createEmployee: async (req: Request, res: Response) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(HttpCode.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });

        try {
            const { name, email, password, post, salary } = req.body
            const passHash = await bcrypt.hash(password, 10) //hashing password

            const employee = await prisma.employee.create({
                data: {
                    name,
                    email,
                    password: passHash,
                    post,
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
    loginEmployee: async (req: Request, res: Response) => {
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
    logoutEmployee: async (req: Request, res: Response) => {
        try {

            const { email } = req.body
            //confirming first by email if user exists 
            const employee = await prisma.employee.findFirst({
                where: {
                    email
                }
            })
            if (!employee)
                return res.status(HttpCode.NOT_FOUND).json({ msg: "employee not found" })

            // obtaiining user's token
            let accessToken = req.headers.authorization
            console.log(accessToken)
            const refreshToken = req.cookies['Haruna-cookie']

            // verifying if token exists
            if (!accessToken || !refreshToken)
                return res.status(HttpCode.UNAUTHORIZED).json({ message: "Unauthorized: No token available or expired" });

            const decodedUser = tokenOps.verifyAccessToken(accessToken);
            if (!decodedUser)
                return res.status(HttpCode.UNPROCESSABLE_ENTITY).json({ msg: "Invalid or expired token" })
            accessToken = ""
            res.clearCookie('Harunaa-cookie')
            return res.status(HttpCode.OK).json({ msg: "User succesffully logout" })
        } catch (error) {
            sendError(res, error)
        }
    },
    // get user profile
    getEmployee: async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const empProfile = await prisma.employee.findUnique({
                where: {
                    employeeID: id
                }
            })
            if (!empProfile)
                return res.status(HttpCode.NOT_FOUND).json({ msg: "User info's failed retrieval" })
            return res.status(HttpCode.OK).json(empProfile)

        } catch (error) {
            sendError(res, error)
        }
    },
    updateEmployee: async (req: Request, res: Response) => {
        try {
            const { id } = req.params //obtaining a user's id
            const { name, email, password,post,salary } = req.body //obtaining modified users's info

            const passHash = await bcrypt.hash(password, 10)

            const updateUser = await prisma.employee.update({
                where: {
                    employeeID: id
                },
                data: {
                    name,
                    email,
                    password: passHash,
                    post,
                    salary
                }
            })
            if (!updateUser)
                return res.status(HttpCode.BAD_REQUEST).json({ msg: "enterd correct infos" })
            res.status(HttpCode.OK).json(updateUser)
        } catch (error) {
            sendError(res, error)
        }
    },
     // deletion of a user's profile
     deleteEmployee: async (req: Request, res: Response) => {
        try {
            const { id } = req.params

            const deleteUser = await prisma.employee.delete({
                where: {
                    employeeID: id
                },
            })
            if (!deleteUser)
                return res.status(HttpCode.NOT_FOUND).json({ msg: "could not delete user" })
            return res.status(HttpCode.OK).json({msg:"employee successfully deleted"})
        } catch (error) {
            sendError(res, error)
        }
    },
}