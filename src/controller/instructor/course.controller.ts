import expressAsyncHandler from "express-async-handler";
import { PrismaClient } from "../../../generated/prisma";
import { Request, Response } from "express";
import { normalizeMongoDoc } from "../../utils/normalizeMongoDoc";

const prisma = new PrismaClient()


export const getCourses = expressAsyncHandler(async (req: Request, res: Response) => {

    const search = String(req.query.search || "").trim();

    if (search) {
        const result = await prisma.course.aggregateRaw({
            pipeline: [
                {
                    $search: {
                        index: "default",
                        autocomplete: {
                            query: search,
                            path: "title",
                            fuzzy: {
                                maxEdits: 2,
                                prefixLength: 0,
                                maxExpansions: 50
                            }
                        }
                    }
                },
                {
                    $match: {
                        deleted_at: null
                    }
                }
            ]
        });

        const courses = normalizeMongoDoc(result)
        res.json(courses);
    }

    const courses = await prisma.course.findMany({
        where: {
            deleted_at: null
        }
    })

    res.status(200).json(courses)
})

export const createCourse = expressAsyncHandler(async (req: Request, res: Response) => {
    const data = req.body

    const course = await prisma.course.create({
        data: {
            title: data.title,
            description: data.description ?? null,
            thumbnail: data.thumbnail ?? null,
            price: data.price ?? null,
            is_published: data.is_published,
            deleted_at: null,
            user: {
                connect: { id: req.user.id }
            },

        },
    })

    const lesseonCreateInput = data.lessons?.map((lesson: any) => {
        return prisma.lesson.create({
            data: {
                lesson_number: lesson.lesson_number,
                chapter: lesson.chapter,
                title: lesson.title,
                content: lesson.content,
                attachments: lesson.attachments?.length ? lesson.attachments : null,
                course: {
                    connect: { id: course.id }
                }
            }
        });
    })

    const lessons = await prisma.$transaction(lesseonCreateInput)

    res.json({
        course,
        lessons
    })
})

export const deleteCourse = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const course = await prisma.course.delete({ where: { id } });
    res.json(course);
});

