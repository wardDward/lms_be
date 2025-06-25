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


export const login = expressAsyncHandler(async (req: Request, res: Response) => {
   
    const data = req.body

    const userExist = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    })

    if (!userExist) {
        throw new Error('email cannot be found')
    }

    res.json(userExist)
})