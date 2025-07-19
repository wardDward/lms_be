import expressAsyncHandler from "express-async-handler";
import { PrismaClient } from "../../../generated/prisma";
import { Request, Response } from 'express'

const prisma = new PrismaClient()


export const updateLesson = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const data = req.body
    const lesson = await prisma.lesson.findUnique({ where: { id } })

    if (!lesson) {
        res.status(404).json({ message: "Lesson not found" })
    }

    const updatedLesson = await prisma.lesson.update({
        where: { id },
        data: {
            lesson_number: data.lesson_number,
            chapter: data.chapter ?? null,
            title: data.title,
            content: data.content,
            
        }
    })


    res.status(200).json(updatedLesson)

})