import { Request, Response } from "express";
import { PrismaClient } from "../../../generated/prisma";
import expressAsyncHandler from "express-async-handler";
import { Prisma } from "../../../generated/prisma";
import { createLessons } from "../../services/lessonServices";

const prisma = new PrismaClient()
export const getCourses = expressAsyncHandler(async (req: Request, res: Response) => {
    const search = req.query.search as string | undefined;

    const courses = await prisma.course.findMany({
        omit: {
            id: true
        },
        where: search ? {
            title: {
                contains: search,
            },
        }
            : undefined,
    });

    res.json(courses);
});

export const createCourse = expressAsyncHandler(async (req: Request, res: Response) => {
    const data = req.body

    const course = await prisma.course.create({
        data: {
            title: data.title,
            thumbnail: data.thumbnail ?? null,
            description: data.description ?? null,
            price: data.price ?? 0,
            is_published: data.is_published,
            user: { connect: { id: req.user.id } }
        }
    })

    const lessons = data.lessons.length > 0 ? await createLessons(data.lessons, course.id) : [];


    res.json({
        course,
        lessons
    })
})

export const updateCourse = expressAsyncHandler(async (req: Request, res: Response) => {
    const { uuid } = req.params
    const data = req.body

    try {
        const updatedCourse = await prisma.course.update({
            where: {
                uuid: uuid
            },
            data: {
                ...data
            }
        })
        res.status(200).json({
            message: "Course Update",
            updatedCourse
        })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                res.status(404).json({ error: 'No Course Found' })
            }
        }
        throw error
    }


})

export const deleteCourse = expressAsyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { uuid } = req.params;

    try {
        const deletedCourse = await prisma.course.delete({
            where: { uuid }
        });

        res.status(200).json({ message: "Course Deleted", deletedCourse });

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                res.status(404).json({ error: "No Course Found" })
            }
        }
        throw error
    }
});
