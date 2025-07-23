import expressAsyncHandler from "express-async-handler";
import { Prisma, PrismaClient } from "../../../generated/prisma";
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

export const deleteLesson = expressAsyncHandler(async (req: Request, res: Response) => {
    const { uuid } = req.params
    try {
        await prisma.lesson.delete({
            where: { uuid }
        })
        res.status(200).json({ message: 'Lesson deleted succesfully' })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                res.status(404).json({ error: "Lesson Not Found" })
            }
        }
        throw error
    }
})

export const updateLesson = expressAsyncHandler(async (req: Request, res: Response) => {
    const { uuid } = req.params
    const data = req.body
    try {
        // missing inclusion of updating of attachments
        await prisma.lesson.update({
            where: { uuid },
            data: { ...data },
            select: {
                lesson_number: true,
                title: true,
                content: true,
            }
        })
        res.status(200).json({ message: 'Lesson updated succesfully' })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                res.status(404).json({ error: "Lesson Not Found" })
            }
        }
        throw error
    }
})