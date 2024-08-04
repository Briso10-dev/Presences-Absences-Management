import { NextFunction, Request, Response } from "express";
import prisma from "../core/config/prisma";
import { HttpCode } from "../core/constants";
import sendError from "../core/constants/errors";

const ifAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params

        const admin = await prisma.administration.findUnique({
            select: {
                adminName: true
            },
            where: {
                adminID: id
            }
        })
        if (!admin)
            return res.status(HttpCode.NOT_FOUND).json({ msg: "you are not an admin" })
        else
            next()
    } catch (error) {
        sendError(res, error)
    }
}

export default ifAdmin