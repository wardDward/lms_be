import expressAsyncHandler from "express-async-handler";
import { PrismaClient } from "../../../generated/prisma";
import { Request, Response } from "express";

const prisma = new PrismaClient()


export const getCourses = expressAsyncHandler(async (req: Request, res: Response) => {
    const courses = await prisma.course.findMany({
        where: {
            deleted_at: null
        },

    })

    res.status(200).json({ courses })
})

export const createCourse = expressAsyncHandler(async (req: Request, res: Response) => {
    const data = req.body

    const course = await prisma.course.create({
        data: {
            ...data,
            deleted_at: null,
            user: {
                connect: { id: req.user.id }
            }
        }
    })
    res.json(course)
})
export const deleteCourse = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const course = await prisma.course.delete({ where: { id } });
    res.json(course);
});