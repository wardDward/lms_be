import { PrismaClient } from "../../generated/prisma";


const prisma = new PrismaClient()


export const createLeasons = async (lessons: any[], courseId: string) => {
    const lists = lessons.map(lesson => (
        {
            ...lesson,
            course_id: courseId
        })) 
        
    const createdLesson = await prisma.lesson.createMany({
        data: lists,
    })

    return createdLesson
}