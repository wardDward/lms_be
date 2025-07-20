import { PrismaClient } from "../../generated/prisma";


const prisma = new PrismaClient()
export const createLeasons = async (lessons: any[], courseId: string) => {
    const createdLessons = [];

    for (const les of lessons) {
        const lesson = await prisma.lesson.create({
            data: {
                lesson_number: les.lesson_number,
                title: les.title,
                content: les.content,
                course: {
                    connect: { id: courseId }
                }
            },
        });

        let attachments = [];
        if (les.attachments && les.attachments.length > 0) {
            attachments = await Promise.all(les.attachments.map((att: any) => {
                return prisma.mediaAttachments.create({
                    data: {
                        order: att.order,
                        path: att.path,
                        name: att.name,
                        lesson: {
                            connect: { id: lesson.id }
                        }
                    }
                });
            }));
        }

        createdLessons.push({
            ...lesson,
            attachments,
        });
    }

    return createdLessons;
};
