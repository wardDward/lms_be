import { PrismaClient } from "../../../generated/prisma";


const prisma = new PrismaClient()

export const createLesson = async(lessons: any[], courseId: string) => {
    const lessonInputs = lessons?.map((lesson: any) => {
        return prisma.lesson.create({
            data: {
                lesson_number: lesson.lesson_number,
                chapter: lesson.chapter,
                title: lesson.title,
                content: lesson.content,
                attachments: lesson.attachments?.length ? lesson.attachments : null,
                course: {
                    connect: { id: courseId }
                }
            }
        })
    })
    
    return await prisma.$transaction(lessonInputs)
}