import { Response, Request, NextFunction } from "express";
import { z } from 'zod'




const lessonSchema = z.object({
    title: z.string().min(1, 'Lesson title is required'),
    lesson_number: z.number().min(1, 'lesson number is required'),
    content: z.string().min(1, 'content is required'),
})

const courseSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().transform((val) => val === "" ? null : val).nullable(),
    thumbnail: z.string().transform((val) => val === "" ? null : val).nullable(),
    price: z.preprocess(
        (val) => typeof val === "string" ? parseFloat(val) : val,
        z.number().min(0, 'Price must be a positive number').default(0)
    ),
    is_published: z.boolean().default(false),
    lessons: z.array(lessonSchema),
})


export const validateCourse = (req: Request, res: Response, next: NextFunction) => {
    const result = courseSchema.safeParse(req.body)

    if (!result.success) {
        res.status(422).json({
            errors: result.error.flatten().fieldErrors
        })
        return
    }

    req.body = result.data
    next()
}