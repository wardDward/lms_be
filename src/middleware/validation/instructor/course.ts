import { Response, Request, NextFunction } from "express";
import { z } from 'zod'


const createCourseSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().transform((val) => val === "" ? null : val).nullable(),
    thumbnail: z.string().transform((val) => val === ""? null : val).nullable(),
})


export const validateCourse = (req: Request, res: Response, next: NextFunction) => {
    const result = createCourseSchema.safeParse(req.body)

    if (!result.success) {
        res.status(422).json({
            errors: result.error.flatten().fieldErrors
        })
        return
    }

    req.body = result.data
    next()
}