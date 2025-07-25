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

// NOTE: handling file later
export const updateLesson = expressAsyncHandler(async (req: Request, res: Response) => {
    const { uuid } = req.params
    const { attachments, ...lesssonInput } = req.body
    try {
        const lesson = await prisma.lesson.update({
            where: { uuid },
            data: {
                lesson_number: lesssonInput.lesson_number,
                title: lesssonInput.title,
                content: lesssonInput.content,
             },
            select: {
                id: true,
                lesson_number: true,
                title: true,
                content: true,
            }
        })

        // check first if attachments belongs to lessons
        
        // if attachment will be updated
        if (attachments && Array.isArray(attachments)) {
            for (const attachemnt of attachments) {
                if (attachemnt.uuid) {
                    // update existings
                    await prisma.mediaAttachments.update({
                        where: { uuid: attachemnt.uuid },
                        data: {
                            order: attachemnt.order,
                            path: attachemnt.path,
                            name: attachemnt.name
                        }
                    })
                } else {
                    // create 
                    await prisma.mediaAttachments.create({
                        data: {
                            order: attachemnt.order,
                            path: attachemnt.path,
                            name: attachemnt.name,
                            lesson: {connect: {id: lesson.id}}
                        }
                    })
                }
            }
        }


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