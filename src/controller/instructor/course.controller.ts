import { Request, Response } from "express";
import { PrismaClient } from "../../../generated/prisma";
import expressAsyncHandler from "express-async-handler";


const prisma = new PrismaClient()
export const getCourses = expressAsyncHandler(async (req: Request, res: Response) => {
    const search = req.query.search as string | undefined;

    const courses = await prisma.course.findMany({
        
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

    res.json(course)
})

export const updateCourse = expressAsyncHandler(async (req: Request, res: Response) => {
    // pass
})

export const deleteCourse = expressAsyncHandler(async (req: Request, res: Response) => {
    const { uuid } = req.params;

    const existCourse = await prisma.course.findFirst({
        where: {
            uuid: uuid
        }
    });

    if (!existCourse) {
        res.status(404).json({ error: "Course Not Found" });
        return
    }

    const deletedCourse = await prisma.course.delete({
        where: {
            id: existCourse.id
        }
    });

    res.status(200).json({ message: "Course Deleted", deletedCourse });
});

