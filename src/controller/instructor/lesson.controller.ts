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
        // check first if lesson belongs to user
        await prisma.lesson.delete({
            where: { uuid },
            
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
    const { attachments, ...lessonInput } = req.body

    try {   
        
        const lesson = await prisma.lesson.findUnique({
            where: { uuid },
            select: { id: true },
        })

        if (!lesson) {
            res.status(404).json({ message: 'Lesson not found' })
            return
        }

        await prisma.$transaction(async (tx) => {
            // Update lesson
            await tx.lesson.update({
                where: { uuid },
                data: {
                    lesson_number: lessonInput.lesson_number,
                    title: lessonInput.title,
                    content: lessonInput.content,
                },
            })

            if (attachments && Array.isArray(attachments)) {
                for (const attachment of attachments) {
                    if (attachment.uuid) {
                        const existing = await tx.mediaAttachments.findFirst({
                            where: {
                                uuid: attachment.uuid,
                                lesson_id: lesson.id,
                            },
                        })

                        console.log('Checking attachment:', {
                            uuid: attachment.uuid,
                            lessonId: lesson.id,
                            found: !!existing,
                        })

                        if (existing) {
                            await tx.mediaAttachments.update({
                                where: { uuid: attachment.uuid },
                                data: {
                                    order: attachment.order,
                                    path: attachment.path,
                                    name: attachment.name,
                                },
                            })
                        } else {
                            throw new Error(`Attachment ${attachment.uuid} does not belong to lesson ${lesson.id}`)
                        }
                    } else {
                        // Create new attachment
                        await tx.mediaAttachments.create({
                            data: {
                                order: attachment.order,
                                path: attachment.path,
                                name: attachment.name,
                                lesson: { connect: { id: lesson.id } },
                            },
                        })
                    }
                }
            }
        })


        res.status(200).json({ message: 'Lesson and attachments updated successfully' })

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            res.status(404).json({ error: 'Lesson not found' })
        }

        if (error instanceof Error && error.message.includes('does not belong')) {
            res.status(403).json({ error: error.message })
        }

        throw error
    }
})
