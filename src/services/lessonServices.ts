import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const createLessons = async (lessons: any[], course_id: number) => {
    const lessonWithAttachments: any[] = [];

    await Promise.all(
        lessons.map(async (les) => {
            return await prisma.$transaction(async (tx) => {
                const lesson = await tx.lesson.create({
                    data: {
                        title: les.title,
                        content: les.content,
                        lesson_number: les.lesson_number,
                        course: { connect: { id: course_id } }
                    }
                });

                let attachments: any[] = [];

                if (les.attachments && les.attachments.length > 0) {
                    await tx.mediaAttachments.createMany({
                        data: les.attachments.map((att: any) => ({
                            order: att.order,
                            path: att.path,
                            name: att.name,
                            lesson_id: lesson.id
                        }))
                    });

                    attachments = les.attachments;
                }

                lessonWithAttachments.push({ lesson, attachments });
            });
        })
    );

    return lessonWithAttachments;
};
