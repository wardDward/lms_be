import expressAsyncHandler from "express-async-handler";
import { PrismaClient } from "../../../generated/prisma";
import { Request, Response } from "express";

const prisma = new PrismaClient()


export const createCourse = expressAsyncHandler(async(req: Request, res: Response) => {
    const data = req.body

    //create posts
    const course = await prisma.course.create({
        data: {
            ...data,
            user: {
                connect:{id: "68655a53a175ce922ee14f97"}
            }
        }
    })


    res.json(course)
})