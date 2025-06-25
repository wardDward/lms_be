import expressAsyncHandler from "express-async-handler";
import { PrismaClient } from "../../../generated/prisma";
import { Request, Response } from "express";

const prisma = new PrismaClient()


export const register = expressAsyncHandler(async (req: Request, res: Response) => {
    const data = req.body
    const user = await prisma.user.create({
        data: data
    })

    res.json(user)
})
