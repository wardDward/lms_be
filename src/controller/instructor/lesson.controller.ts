import expressAsyncHandler from "express-async-handler";
import { PrismaClient } from "../../../generated/prisma";
import { Request, Response } from "express";


const prisma = new PrismaClient({
    omit: {
        lesson: {
            id: true
        }
    }
})


export const showLessons = expressAsyncHandler(async (req: Request, res: Response) => {
    const search = req.query.search as string

    const lesson = await prisma.lesson.findMany({
        where: search ? {
            title: {
                contains: search
            }
        } : undefined
    })

    res.json(lesson)
})